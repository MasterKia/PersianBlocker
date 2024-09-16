import { readdir } from 'fs/promises';
import { resolve, join } from 'path';

import { CONFIG_FILE_NAMES } from './constants';
import { parseConfigFile } from './config-reader';
import { type LinterConfig } from '../common';

const UPPER_DIR = '..';

/**
 * Callback for the config finder, called when a potential config file is found.
 * If you want to stop the search, return `true` from the callback, otherwise
 * return `false`.
 *
 * @param path Path to the config file
 * @returns `true` if the search should be stopped, `false` otherwise
 */
export type ConfigFinderCallback = (path: string) => boolean | Promise<boolean>;

/**
 * Result of the config finder
 */
export type ConfigFinderResult = {
    /**
     * Path to the config file
     */
    path: string;

    /**
     * Parsed config object
     */
    config: LinterConfig;
};

/**
 * Discovers every AGLint config files in the current working directory and its parent directories.
 * It only checks file names, not the contents of the files, so it doesn't validate the config files.
 * If you didn't abort the search meanwhile, it will scan until it reaches the root directory.
 *
 * @param cwd Current working directory
 * @param callback Callback function that will be called with the path to the config file
 * if it is found
 * @throws If multiple config files are found in the same directory
 */
export async function configFinder(cwd: string, callback: ConfigFinderCallback): Promise<void> {
    // Start with the current working directory
    let dir = resolve(cwd);

    // Keep searching for a config file until we reach the root directory
    do {
        // Get the list of files in the current directory
        const files = await readdir(dir);

        // Collect all config files in the current directory
        const configFiles = files.filter((file) => CONFIG_FILE_NAMES.has(file));

        if (configFiles.length === 1) {
            // If there is only one config file, call the callback with the path to the config file
            // If the callback returned `true`, stop the search
            if (await callback(join(dir, configFiles[0])) === true) {
                return;
            }
        } else if (configFiles.length > 1) {
            // If there are multiple config files, throw an error
            throw new Error(`Multiple config files found in ${dir}`);
        }

        // If there are no config files, go one directory up and try again
        dir = join(dir, UPPER_DIR);
    }
    while (dir !== resolve(dir, UPPER_DIR));
}

/**
 * Finds the next config file in the current working directory and its parent directories.
 * It just searches for the first config file and returns its path.
 *
 * @param cwd Current working directory
 * @throws If multiple config files are found in the same directory
 * @throws If a config file is found, but it is not valid
 * @returns The path to the config file and the parsed config object or `null` if no config file was found
 */
export async function findNextConfig(cwd: string): Promise<ConfigFinderResult | null> {
    let configPath: string | null = null;
    let config: LinterConfig | null = null;

    // Search for a config file in the current working directory and its parent directories
    // (callback may not be called if no config file is found at all)
    await configFinder(cwd, async (path) => {
        // If the callback is called, it means that a config file was found, so parse it
        // and save the path to the config file
        config = await parseConfigFile(path);
        configPath = path;

        // Stop the search, no need to continue
        return true;
    });

    // If a config file was found, return its path and the parsed config
    if (configPath && config) {
        return {
            path: configPath,
            config,
        };
    }

    // Otherwise, return null
    return null;
}

/**
 * Finds the first root config file in the current working directory and its parent directories.
 * It parses the config files and stops the search when it finds the root config file, which
 * is the first config file that has the "root" property set to `true`.
 *
 * If it doesn't find a root config file, but it finds a config file, it will return the first
 * config file.
 *
 * @param cwd Current working directory
 * @throws If multiple config files are found in the same directory
 * @throws If a config file is found, but it is not valid
 * @returns The path to the config file and the parsed config object or `null` if no config file was found
 */
export async function findNextRootConfig(cwd: string): Promise<ConfigFinderResult | null> {
    let configPath: string | null = null;
    let config: LinterConfig | null = null;

    // Search for a config file in the current working directory and its parent directories
    // (callback may not be called if no config file is found at all)
    await configFinder(cwd, async (path) => {
        // If the callback is called, it means that a config file was found, so parse it
        // and save the path to the config file
        config = await parseConfigFile(path);

        // If the config file has the "root" property set to `true`, stop the search,
        // because we prefer root config files over non-root config files
        if (config.root === true) {
            configPath = path;

            // Stop the search, no need to continue
            return true;
        }

        // Save the path to the first config file, if it wasn't saved yet
        if (!configPath) {
            configPath = path;
        }

        // Otherwise, continue the search
        return false;
    });

    // If a config file was found, return its path and the parsed config
    if (configPath && config) {
        return {
            path: configPath,
            config,
        };
    }

    // Otherwise, return null
    return null;
}
