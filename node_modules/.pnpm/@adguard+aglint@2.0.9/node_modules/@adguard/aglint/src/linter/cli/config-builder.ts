import cloneDeep from 'clone-deep';

import { type LinterConfig } from '../common';
import { mergeConfigs } from '../config';
import { configFinder } from './config-finder';
import { parseConfigFile } from './config-reader';
import { NoConfigError } from './errors/no-config-error';

/**
 * Constructs a config object for the given directory by merging all config files
 * from the root config file to the actual directory. It searches all config files
 * in the upper directories until it finds a root config file or the actual directory
 * is the root directory, then it merges the config files from the root directory
 * to the actual directory after each other. This will results the corresponding
 * config object for the given directory. Works same as ESLint.
 *
 * @param dir Base directory
 * @returns Config object
 * @throws If no config file was found
 * @throws If a config file is found, but it is not valid
 * @throws If multiple config files are found in the same directory
 */
export async function buildConfigForDirectory(dir: string): Promise<LinterConfig> {
    const parsedConfigs: LinterConfig[] = [];

    // Finds config files from the actual directory to the root directory.
    // It starts from the actual directory and goes up to the root directory
    // until it finds a root config file or the actual directory is the root directory.
    //
    // In other words, it pushes the config files to the `parsedConfigs` array
    // in this order:
    //   - actual directory
    //   - parent directory
    //   - ...
    //   - root config
    //
    // (Of course, if the actual directory contains a root config file or the
    // actual directory is the root directory, then only 1 config file will be
    // pushed to the array - but the philosophy is the same.)
    await configFinder(dir, async (path) => {
        const parsedConfig = await parseConfigFile(path);
        parsedConfigs.push(parsedConfig);

        // Abort the search if the config file is a root config file
        return parsedConfig.root === true;
    });

    // If no config file was found, throw an error, because we definitely need a config file
    if (parsedConfigs.length === 0) {
        throw new NoConfigError(dir);
    }

    // If there is only one config file, just return it, no need to do anything else
    if (parsedConfigs.length === 1) {
        return parsedConfigs[0];
    }

    // We should merge the config files from the root directory to the actual directory.
    // In other words, we should merge the config files in this order:
    //   - root config
    //   - ...
    //   - parent directory
    //   - actual directory
    //
    // But we pushed the config files to the `parsedConfigs` array in the following order:
    //   - actual directory
    //   - parent directory
    //   - ...
    //   - root config
    //
    // So we have to reverse the array first, then merge the config files in the reversed order.
    const mergedConfig = parsedConfigs.reduceRight((prev, curr) => mergeConfigs(prev, curr));

    // Make sure that the config object is not mutated
    return cloneDeep(mergedConfig);
}
