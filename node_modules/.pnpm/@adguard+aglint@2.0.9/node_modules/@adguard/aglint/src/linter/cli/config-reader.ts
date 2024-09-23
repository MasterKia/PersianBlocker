import { readFile } from 'fs/promises';
import { parse } from 'path';
import yaml from 'js-yaml';

import {
    EXT_JSON,
    EXT_YAML,
    EXT_YML,
    RC_CONFIG_FILE,
} from './constants';
import { type LinterConfig } from '../common';
import { validateLinterConfig } from '../config-validator';

/**
 * Reads and parses supported configuration files.
 *
 * @param filePath - The name of the configuration file to be read and parsed.
 * @returns The parsed config object.
 * @throws If the file not found or the file extension is not supported.
 * @throws If the file contents are not valid JSON or YAML.
 * @throws If the file contents are not valid according to the config schema.
 */
export async function parseConfigFile(filePath: string): Promise<LinterConfig> {
    try {
        // Determine the file extension
        const parsedFilePath = parse(filePath);

        // Read the file contents
        const contents = await readFile(filePath, 'utf8');

        // At this point, we don't know exactly what the file contains, so simply mark
        // it as unknown, later we validate it anyway
        let parsed: unknown;

        if (parsedFilePath.base === RC_CONFIG_FILE) {
            parsed = JSON.parse(contents);
        } else {
            // Parse the file contents based on the extension
            switch (parsedFilePath.ext) {
                case EXT_JSON: {
                    // Built-in JSON parser
                    parsed = JSON.parse(contents);
                    break;
                }

                case EXT_YAML:
                case EXT_YML: {
                    // Well-tested external YAML parser
                    parsed = yaml.load(contents);
                    break;
                }

                // TODO: Implement support for JS/TS config files
                default: {
                    throw new Error(`Unsupported config file extension "${parsedFilePath.ext}"`);
                }
            }
        }

        // Validate the parsed config object against the config schema using Superstruct
        validateLinterConfig(parsed);

        return parsed;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to parse config file "${filePath}": ${error.message}`);
        }

        // Pass through any other errors
        throw error;
    }
}
