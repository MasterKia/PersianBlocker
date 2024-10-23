#! /usr/bin/env node

const fs = require('fs');
const consola = require('consola');
// eslint-disable-next-line import/no-unresolved
const consolaUtils = require('consola/utils');
const glob = require('glob');
const packageJson = require('../package.json');
const utils = require('./utils');
const fileLinter = require('./filelinter');

// eslint-disable-next-line import/order
const { argv } = require('yargs')
    .usage('Usage: $0 [options]')
    .example(
        '$0 -i **/*.txt',
        'scan all .txt files in the current directory and subdirectories in the interactive mode',
    )
    .example(
        '$0 -a -i filter.txt',
        'scan filter.txt and automatically apply suggested fixes',
    )
    .option('input', {
        alias: 'i',
        type: 'string',
        description: 'glob expression that selects files that the tool will scan.',
    })
    .option('dnscheck', {
        type: 'boolean',
        description: 'Double-check dead domains with a DNS query.',
    })
    .option('commentout', {
        type: 'boolean',
        description: 'Comment out rules instead of removing them.',
    })
    .option('export', {
        type: 'string',
        description: 'Export dead domains to the specified file instead of modifying the files.',
    })
    .option('import', {
        type: 'string',
        description: 'Import dead domains from the specified file and skip other checks.',
    })
    .option('auto', {
        alias: 'a',
        type: 'boolean',
        description: 'Automatically apply suggested fixes without asking the user.',
    })
    .option('show', {
        alias: 's',
        type: 'boolean',
        description: 'Show suggestions without applying them.',
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging',
    })
    .default('input', '**/*.txt')
    .default('dnscheck', true)
    .default('commentout', false)
    .default('auto', false)
    .default('show', false)
    .default('verbose', false)
    .version()
    .help('h')
    .alias('h', 'help');

if (argv.verbose) {
    // trace level.
    consola.level = 5;
}

/**
 * Extracts the list of dead domains from raw linting results.
 *
 * @param {import('./filelinter').FileResult} fileResult - Result of linting
 * the file.
 * @returns {Array<string>} Array of dead domains.
 */
function getDeadDomains(fileResult) {
    if (!fileResult || !fileResult.results) {
        return [];
    }

    return fileResult.results.map((result) => {
        return result.linterResult.deadDomains;
    }).reduce((acc, val) => {
        return acc.concat(val);
    }, []);
}

/**
 * Entry point into the CLI program logic.
 */
async function main() {
    consola.info(`Starting ${packageJson.name} v${packageJson.version}`);

    const globExpression = argv.input;
    const files = glob.globSync(globExpression);
    const plural = files.length > 1 || files.length === 0;

    let predefinedDomains;
    if (argv.import) {
        consola.info(`Importing dead domains from ${argv.import}, other checks will be skipped`);

        try {
            predefinedDomains = fs.readFileSync(argv.import).toString()
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter((line) => line !== '');
        } catch (ex) {
            consola.error(`Failed to read from ${argv.import}: ${ex}`);

            process.exit(1);
        }

        consola.info(`Imported ${predefinedDomains.length} dead domains`);
    }

    consola.info(`Found ${files.length} file${plural ? 's' : ''} matching ${globExpression}`);

    // This array is used when export is enabled.
    const deadDomains = [];

    for (let i = 0; i < files.length; i += 1) {
        const file = files[i];

        try {
            consola.info(consolaUtils.colorize('bold', `Processing file ${file}`));

            const linterOptions = {
                show: argv.show,
                auto: argv.auto || !!argv.export,
                useDNS: argv.dnscheck,
                commentOut: argv.commentout,
                deadDomains: predefinedDomains,
            };

            // eslint-disable-next-line no-await-in-loop
            const fileResult = await fileLinter.lintFile(file, linterOptions);

            if (fileResult !== null) {
                if (argv.export) {
                    deadDomains.push(...getDeadDomains(fileResult));
                } else {
                    // eslint-disable-next-line no-await-in-loop
                    await fileLinter.applyFileChanges(file, fileResult, linterOptions);
                }
            }
        } catch (ex) {
            consola.error(`Failed to process ${file} due to ${ex}`);

            process.exit(1);
        }
    }

    if (argv.export) {
        consola.info(`Exporting the list of dead domains to ${argv.export}`);
        const uniqueDomains = utils.unique(deadDomains);
        fs.writeFileSync(argv.export, uniqueDomains.join('\n'));
    }

    consola.success('Finished successfully');
}

main();
