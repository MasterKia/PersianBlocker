import { RuleCategory } from '@adguard/agtree';

import { type LinterRule } from '../common';
import { SEVERITY } from '../severity';

/**
 * Rule that checks if a network rule contains multiple same modifiers
 */
export const DuplicatedModifiers: LinterRule = {
    meta: {
        severity: SEVERITY.error,
    },
    events: {
        onRule: (context): void => {
            // Get actually iterated adblock rule
            const ast = context.getActualAdblockRuleAst();

            // Check if the rule is a basic network rule
            if (ast.category === RuleCategory.Network && ast.type === 'NetworkRule') {
                // Store which modifiers are already present
                const occurred = new Set<string>();

                // This check is only relevant if there are at least two modifiers
                if (!ast.modifiers || ast.modifiers.children.length < 2) {
                    return;
                }

                for (const modifier of ast.modifiers.children) {
                    const name = modifier.modifier.value;
                    const nameToLowerCase = name.toLowerCase();

                    if (!occurred.has(nameToLowerCase)) {
                        occurred.add(nameToLowerCase);
                    } else {
                        // Report if a modifier is occurring more than once
                        context.report({
                            message: `The modifier "${name}" is used multiple times, but it should be used only once`,
                            node: modifier,
                        });
                    }
                }
            }
        },
    },
};
