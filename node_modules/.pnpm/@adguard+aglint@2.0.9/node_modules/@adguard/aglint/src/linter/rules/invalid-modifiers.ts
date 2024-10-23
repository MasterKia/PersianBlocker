import { RuleCategory, modifierValidator } from '@adguard/agtree';

import { SEVERITY } from '../severity';
import type { LinterRule, SpecificRuleContext } from '../common';

/**
 * Rule that checks modifiers validity for basic (network) rules
 */
export const InvalidModifiers: LinterRule = {
    meta: {
        severity: SEVERITY.error,
    },
    events: {
        onRule: (context: SpecificRuleContext): void => {
            // Get actually iterated adblock rule
            const ast = context.getActualAdblockRuleAst();

            if (ast.category === RuleCategory.Network) {
                // get lint of syntaxes to validate modifiers for
                const validateSyntax = context.getLinterConfig().syntax;

                // validate modifiers for every syntax and collect problems if any
                validateSyntax.forEach((agent) => {
                    if (!ast.modifiers) {
                        return;
                    }

                    ast.modifiers.children.forEach((modifier) => {
                        const validationResult = modifierValidator.validate(agent, modifier, ast.exception);
                        if (validationResult.valid
                            && !validationResult.warn) {
                            return;
                        }

                        // default invalid modifier message
                        let message = `Invalid modifier: '${modifier.value}'`;

                        // needed for deprecated modifiers which are valid but not recommended
                        // so should be just _warned_ about
                        let customSeverity;

                        if (validationResult.warn) {
                            message = validationResult.warn;
                            customSeverity = SEVERITY.warn;
                        }
                        if (validationResult.error) {
                            message = validationResult.error;
                        }

                        context.report({
                            message,
                            node: modifier,
                            customSeverity,
                        });
                    });
                });
            }
        },
    },
};
