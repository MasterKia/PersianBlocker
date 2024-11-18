/**
 * @file AGLint CLI
 * @todo DEV run: node --no-warnings --loader ts-node/esm --experimental-specifier-resolution=node src/cli.ts
 */

import { AdblockSyntax } from '@adguard/agtree';
import { program } from 'commander';
import checkbox from '@inquirer/checkbox';
import select from '@inquirer/select';
import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import yaml from 'js-yaml';

import {
    LinterCli,
    type LinterConfig,
    LinterConsoleReporter,
    version,
} from './index.node';
import { CONFIG_FILE_NAMES, JSON_RC_CONFIG_FILE_NAME, YAML_RC_CONFIG_FILE_NAME } from './linter/cli/constants';
import { NEWLINE } from './common/constants';

/**
 * Represents possible config file formats.
 */
enum ConfigFileFormat {
    Yaml = 'yaml',
    Json = 'json',
}

/**
 * Print error to the console, also handle unknown errors.
 *
 * @param error Error to print
 */
function printError(error: unknown): void {
    const lines = [
        'Oops! Something went wrong! :(',
        '',
        `AGLint: ${version}`,
        '',
    ];

    if (error instanceof Error) {
        const { message, stack } = error;

        lines.push(message || 'No error message provided');
        lines.push('');

        // Very basic stack trace formatting
        lines.push(
            ...(stack || '').split('\n').map((line) => `  ${line}`),
        );
    } else {
        // Convert any unknown error to string
        lines.push(String(error));
    }

    // Print generated lines to the console as error
    // eslint-disable-next-line no-console
    console.error(lines.join('\n'));
}

/**
 * Creates a content of the config file.
 *
 * @param chosenFormat Format chosen by the user.
 * @param chosenSyntaxes Syntaxes chosen by the user.
 *
 * @returns Config file content.
 */
const getConfigFileContent = (chosenFormat: ConfigFileFormat, chosenSyntaxes: AdblockSyntax[]): string => {
    // Prepare config object
    const preparedConfig: LinterConfig = {
        root: true,
        extends: [
            'aglint:recommended',
        ],
        // set Common syntax as default if nothing is chosen
        syntax: chosenSyntaxes.length === 0 ? [AdblockSyntax.Common] : chosenSyntaxes,
    };

    // Serialize config object to a string based on the chosen format
    let serializedConfig: string;

    switch (chosenFormat) {
        case ConfigFileFormat.Yaml:
            // YAML supports comments, so we can add some useful info to the beginning of the file
            serializedConfig = [
                '# AGLint config file',
                '# Documentation: https://github.com/AdguardTeam/AGLint#configuration',
            ].join(NEWLINE);
            serializedConfig += NEWLINE;
            // Serialize config object to YAML. This will add the final newline automatically
            serializedConfig += yaml.dump(preparedConfig);
            break;

        case ConfigFileFormat.Json:
            // Serialize config object to JSON
            serializedConfig = JSON.stringify(preparedConfig, null, 2);
            // Add final newline manually
            serializedConfig += NEWLINE;
            break;

        default:
            throw new Error(`Unsupported config file format "${chosenFormat}"`);
    }

    return serializedConfig;
};

/**
 * Creates a config file in the current directory.
 *
 * TODO: This is a very basic implementation, we should implement a proper config file generator in the future.
 *
 * @param cwd Current working directory.
 */
const createConfig = async (cwd: string): Promise<void> => {
    // Ask user to specify which config file format to use
    const chosenFormat = await select({
        message: 'Select which config file format you want to use.\n',
        choices: [
            { value: ConfigFileFormat.Yaml },
            { value: ConfigFileFormat.Json },
        ],
    });

    // Ask user to specify which syntaxes to use
    const chosenSyntaxes = await checkbox({
        message: 'Select which adblock syntax(es) you want to use.\n"Common" is to be used if none is chosen.\n',
        choices: [
            { value: AdblockSyntax.Abp },
            { value: AdblockSyntax.Adg },
            { value: AdblockSyntax.Ubo },
        ],
    });

    // Generate config file content based on the chosen format and syntaxes
    const configContent = getConfigFileContent(chosenFormat, chosenSyntaxes);

    // Determine the config file name based on the chosen format
    let configFileName: string;

    switch (chosenFormat) {
        case ConfigFileFormat.Yaml:
            configFileName = YAML_RC_CONFIG_FILE_NAME;
            break;

        case ConfigFileFormat.Json:
            configFileName = JSON_RC_CONFIG_FILE_NAME;
            break;

        default:
            throw new Error(`Unsupported config file format "${chosenFormat}"`);
    }

    // Write the config file to the current working directory
    await writeFile(join(cwd, configFileName), configContent);

    // Notify the user that the config file was created successfully
    // eslint-disable-next-line no-console
    console.log(`Config file was created successfully in directory "${cwd}" as "${configFileName}"`);

    // Notify user about root: true option
    // eslint-disable-next-line no-console, max-len
    console.log('Note: "root: true" option was added to the config file. Please make sure that the config file is located in the root directory of your project.');
    // eslint-disable-next-line no-console
    console.log('You can learn more at https://github.com/AdguardTeam/AGLint#why-the-root-option-is-important');
};

(async () => {
    try {
        // Set-up Commander
        program
            // Basic info
            .name('AGLint')
            .description('Adblock filter list linter')
            .version(version, '-v, --version', 'Output the version number')
            .usage('[options] [file paths...]')

            // Customized help option
            .helpOption('-h, --help', 'Display help for command')

            // Options
            .option(
                '-f, --fix',
                'Enable automatic fix, if possible (BE CAREFUL, this overwrites original files with the fixed ones)',
                false,
            )
            .option('-c, --colors', 'Force enabling colors', true)
            .option('--no-colors', 'Force disabling colors')
            .option('--no-ignores', 'Force ignoring .aglintignore files')

            // Parse the arguments
            .parse(process.argv);

        // This specifies in which folder the "npx aglint" / "yarn aglint" command was invoked
        // and use "process.cwd" as fallback. This is the current working directory (cwd).
        const cwd = process.env.INIT_CWD || process.cwd();

        // "aglint init": initialize config file in the current directory (cwd)
        if (program.args[0] === 'init') {
            // TODO: Move config init logic to a separate file:
            // https://github.com/AdguardTeam/AGLint/issues/119

            // Don't allow to initialize config file if another config file already exists
            const cwdItems = await readdir(cwd);

            for (const item of cwdItems) {
                if (CONFIG_FILE_NAMES.has(item)) {
                    // Show which config file is conflicting exactly
                    // eslint-disable-next-line no-console
                    console.error(`Config file already exists in directory "${cwd}" as "${item}"`);
                    process.exit(1);
                }
            }

            await createConfig(cwd);

            // We should exit the process here, because we don't want to run the linter after
            // initializing the config file
            process.exit(0);
        }

        // TODO: Custom reporter support with --reporter option
        const cli = new LinterCli(
            new LinterConsoleReporter(program.opts().colors),
            !!program.opts().fix,
            !!program.opts().ignores,
        );

        await cli.run(cwd, program.args);

        // If there are errors, exit with code 1. This is necessary for CI/CD pipelines,
        // see https://docs.github.com/en/actions/creating-actions/setting-exit-codes-for-actions#about-exit-codes
        if (cli.hasErrors()) {
            process.exit(1);
        }
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'NoConfigError') {
            /* eslint-disable max-len, no-console */
            // Show a detailed error message if the config file was not found
            console.error([
                'AGLint couldn\'t find the config file. To set up a configuration file for this project, please run:',
                '',
                '    If you use NPM:\tnpx aglint init',
                '    If you use Yarn:\tyarn aglint init',
                '',
                'IMPORTANT: The init command creates a root config file, so be sure to run it in the root directory of your project!',
                '',
                'AGLint will try to find the config file in the current directory (cwd), but if the config file is not found',
                'there, it will try to find it in the parent directory, and so on until it reaches your OS root directory.',
            ].join('\n'));
            /* eslint-enable max-len, no-console */

            // Exit with code 1. This is necessary for CI/CD pipelines
            process.exit(1);
        }

        // If any error occurs it means that the linter failed to run
        // Format and print error to the console
        printError(error);

        // Exit with code 2. This is necessary for CI/CD pipelines
        process.exit(2);
    }
})();
