import { CommentRuleType, RuleCategory } from '@adguard/agtree';

import { type LinterRule } from '../common';
import { SEVERITY } from '../severity';

/**
 * Rule that checks if hints are duplicated within the same comment rule.
 */
export const DuplicatedHints: LinterRule = {
    meta: {
        severity: SEVERITY.warn,
    },
    events: {
        onRule: (context): void => {
            // Get actually iterated adblock rule
            const ast = context.getActualAdblockRuleAst();

            if (ast.category === RuleCategory.Comment && ast.type === CommentRuleType.HintCommentRule) {
                // Only makes sense to check this, if there are at least two hints within the comment
                if (ast.children.length < 2) {
                    return;
                }

                // Store which hints are already present
                const occurred = new Set<string>();

                // Iterate over all hints within the comment rule
                for (const hint of ast.children) {
                    const name = hint.name.value;
                    const nameToLowerCase = name.toLowerCase();

                    if (!occurred.has(nameToLowerCase)) {
                        occurred.add(nameToLowerCase);
                    } else {
                        // Report if a hint is occurring more than once
                        context.report({
                            message: `The hint "${name}" is occurring more than once within the same comment rule`,
                            node: hint,
                        });
                    }
                }
            }
        },
    },
};
