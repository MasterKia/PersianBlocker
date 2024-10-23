import { CommentRuleType, RuleCategory } from '@adguard/agtree';

import { type LinterRule } from '../common';
import { SEVERITY } from '../severity';

const PLATFORM = 'PLATFORM';
const NOT_PLATFORM = 'NOT_PLATFORM';

/**
 * Rule that checks if a platform is used more than once within the same PLATFORM / NOT_PLATFORM hint.
 */
export const DuplicatedHintPlatforms: LinterRule = {
    meta: {
        severity: SEVERITY.warn,
    },
    events: {
        onRule: (context): void => {
            // Get actually iterated adblock rule
            const ast = context.getActualAdblockRuleAst();

            if (ast.category === RuleCategory.Comment && ast.type === CommentRuleType.HintCommentRule) {
                // Iterate over all hints within the comment rule
                for (const hint of ast.children) {
                    const name = hint.name.value;

                    // Only makes sense to check this, if the hint is a PLATFORM or NOT_PLATFORM hint
                    // and there are at least two platforms within the hint
                    if (
                        (name !== PLATFORM && name !== NOT_PLATFORM)
                        || !hint.params || hint.params.children.length < 2
                    ) {
                        continue;
                    }

                    // Store which platforms are already present
                    const occurred = new Set<string>();

                    // Iterate over all platforms within the hint
                    for (const param of hint.params.children) {
                        const platform = param.value;
                        const platformToLowerCase = platform.toLowerCase();

                        if (!occurred.has(platformToLowerCase)) {
                            occurred.add(platformToLowerCase);
                        } else {
                            // Report if a platform is occurring more than once
                            context.report({
                                // eslint-disable-next-line max-len
                                message: `The platform "${platform}" is occurring more than once within the same "${hint.name.value}" hint`,
                                node: param,
                            });
                        }
                    }
                }
            }
        },
    },
};
