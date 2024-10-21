import { readFile, readdir, stat } from 'fs/promises';
import path, { type ParsedPath } from 'path';
import ignore, { type Ignore } from 'ignore';

import {
    CONFIG_FILE_NAMES,
    IGNORE_FILE_NAME,
    PROBLEMATIC_PATHS,
    SUPPORTED_EXTENSIONS,
} from './constants';

/**
 * Ignore instance for the default ignores
 */
const defaultIgnores = ignore().add(PROBLEMATIC_PATHS);

/**
 * Represents the result of a scan
 */
export interface ScannedDirectory {
    /**
     * Data about the current directory
     */
    dir: ParsedPath;

    /**
     * Only one config file is allowed in a directory, it may be null if no config file is found in
     * the directory
     */
    configFile: ParsedPath | null;

    /**
     * Lintable files in the directory (if any)
     */
    lintableFiles: ParsedPath[];

    /**
     * Subdirectories in the directory (if any)
     */
    subdirectories: ScannedDirectory[];
}

/**
 * Searches for lintable files in a directory recursively. Practically it means files with the
 * supported extensions. It will also search for config files.
 *
 * It will ignore files and directories that are ignored by the ignore file at any level.
 * `.aglintignore` works exactly like `.gitignore`.
 *
 * @param dir Directory to search in
 * @param ignores File ignores
 * @param useIgnoreFiles Use ignore files or not (default: true)
 * @returns The result of the scan (`ScannedDirectory` object)
 * @throws If multiple config files are found in the given directory
 */
export async function scan(dir: string, ignores: Ignore[] = [], useIgnoreFiles = true): Promise<ScannedDirectory> {
    // Initialize an empty result
    const result: ScannedDirectory = {
        dir: path.parse(path.join(dir)),
        configFile: null,
        lintableFiles: [],
        subdirectories: [],
    };

    // Get all files in the directory
    const items = await readdir(dir);

    // First of all, let's parse the ignore file in the current directory if ignore files are
    // enabled and the ignore file exists
    if (useIgnoreFiles && items.includes(IGNORE_FILE_NAME)) {
        const content = await readFile(path.join(dir, IGNORE_FILE_NAME), 'utf8');
        ignores.push(ignore().add(content));
    }

    // Loop through all items in the directory
    for (const item of items) {
        // If the current item is ignored by the default ignores, skip it
        if (defaultIgnores.ignores(item)) {
            continue;
        }

        // If the current item is ignored by the ignore files, skip it (if ignore files are enabled)
        if (useIgnoreFiles && ignores.some((i) => i.ignores(item))) {
            continue;
        }

        // Get the full path of the current item within the directory structure,
        // then get the stats of the item
        const itemPath = path.join(dir, item);
        const stats = await stat(itemPath);

        if (stats.isFile()) {
            // Parse path
            const parsedPath = path.parse(itemPath);

            // If the file is a config file
            if (CONFIG_FILE_NAMES.has(item)) {
                // If a config file is already found, throw an error
                if (result.configFile !== null) {
                    throw new Error(
                        `Multiple config files found in the same directory: "${path.join(
                            result.configFile.dir,
                            result.configFile.base,
                        )}" and "${itemPath}"`,
                    );
                }

                // Otherwise, set the config file for the current directory
                result.configFile = parsedPath;
            } else if (SUPPORTED_EXTENSIONS.has(parsedPath.ext)) {
                // We only want to lint files with the supported extensions
                result.lintableFiles.push(parsedPath);
            }
        } else if (stats.isDirectory()) {
            // If the current item is a directory, recursively scan it, then
            // merge the subdirectory result into the current result
            result.subdirectories.push(await scan(itemPath, ignores, useIgnoreFiles));
        }
    }

    return result;
}
