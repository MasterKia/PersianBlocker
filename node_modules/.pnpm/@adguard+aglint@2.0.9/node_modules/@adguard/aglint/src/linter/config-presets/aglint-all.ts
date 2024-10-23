/**
 * @file Configuration preset for AGLint that enables all rules.
 */

import { AdblockSyntax } from '@adguard/agtree';

import { type LinterConfig } from '../common';

const config: LinterConfig = {
    syntax: [AdblockSyntax.Common],
    rules: {
        'duplicated-hint-platforms': 'error',
        'duplicated-hints': 'error',
        'duplicated-modifiers': 'error',
        'if-closed': 'error',
        'inconsistent-hint-platforms': 'error',
        'invalid-domain-list': 'error',
        'single-selector': 'warn',
        'invalid-modifiers': 'error',
        'unknown-hints-and-platforms': 'error',
        'unknown-preprocessor-directives': 'error',
        'no-short-rules': 'error',
    },
};

export default Object.freeze(config);
