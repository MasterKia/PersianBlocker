import {
    type Struct,
    define,
    is,
    union,
} from 'superstruct';

import { severity } from './severity';
import { type LinterRuleConfigArray } from './common';

/**
 * Own Superstruct type definition for the linter rule config array
 *
 * @returns Defined struct
 * @see {@link https://github.com/ianstormtaylor/superstruct/blob/main/src/structs/types.ts}
 */
function configArray(): Struct<LinterRuleConfigArray, null> {
    return define('configArray', (value) => {
        if (Array.isArray(value)) {
            // First element should be severity, the rest can be anything,
            // we don't know anything about them at this point
            if (is(value[0], severity())) {
                return true;
            }
            return `Expected a severity as first element, but received ${typeof value[0]}`;
        }
        return `Expected an array, but received ${typeof value}`;
    });
}

/**
 * Superstruct schema for the linter rule config (used for validation)
 *
 * Possible values:
 * - severity itself (number or string): `severity`
 * - one-element array with severity as the first element: `[severity]`
 * - n-element array with severity as the first element and other options as the rest: `[severity, ...options]`
 */
export const linterRuleConfigSchema = union([severity(), configArray()]);
