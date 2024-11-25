import { StructError, assert } from 'superstruct';

import { linterConfigSchema } from './config';
import { type LinterConfig } from './common';
import { EMPTY } from '../common/constants';

/**
 * Validates the AGLint linter config object using Superstruct.
 *
 * @param config Config object to validate
 * @throws If the config object is not valid according to the config schema.
 */
export function validateLinterConfig(config: unknown): asserts config is LinterConfig {
    try {
        // Validate the parsed config object against the config schema using Superstruct
        assert(config, linterConfigSchema);
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Handle Superstruct errors
            if (error instanceof StructError) {
                // We can customize the error message here to make it more user-friendly
                // https://docs.superstructjs.org/guides/05-handling-errors#customizing-errors
                const { key, value, type } = error;

                let message = EMPTY;

                if (value === undefined) {
                    message = `"${key}" is required, but it was not provided`;
                } else if (type === 'never') {
                    message = `"${key}" is unknown in the config schema, please remove it`;
                } else {
                    message = `Value "${value}" for "${key}" is not a valid "${type}" type`;
                }

                throw new Error(`Invalid linter config: ${message}`);
            }

            throw new Error(`Invalid linter config: ${error.message}`);
        }

        // Pass through any other errors
        throw error;
    }
}
