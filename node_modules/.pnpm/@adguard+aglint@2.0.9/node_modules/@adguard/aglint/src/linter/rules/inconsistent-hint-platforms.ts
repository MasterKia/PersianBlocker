import equal from 'fast-deep-equal';
import { CommentRuleType, type Parameter, RuleCategory } from '@adguard/agtree';

import { type LinterRule } from '../common';
import { SEVERITY } from '../severity';

const PLATFORM = 'PLATFORM';
const NOT_PLATFORM = 'NOT_PLATFORM';

/**
 * Rule that checks if a platform targeted by a PLATFORM() hint is also excluded by a NOT_PLATFORM()
 * hint at the same time.
 */
export const InconsistentHintPlatforms: LinterRule = {
    meta: {
        severity: SEVERITY.error,
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

                // Platforms targeted by a PLATFORM() hint
                const platforms: Parameter[] = [];

                // Platforms excluded by a NOT_PLATFORM() hint
                const notPlatforms: Parameter[] = [];

                // Iterate over all hints within the hint comment rule
                for (const hint of ast.children) {
                    for (const param of hint.params?.children ?? []) {
                        // Add actual platform (parameter) to the corresponding array
                        if (hint.name.value === PLATFORM) {
                            platforms.push(param);
                        } else if (hint.name.value === NOT_PLATFORM) {
                            notPlatforms.push(param);
                        }
                    }
                }

                // Find platforms that are targeted by a PLATFORM() hint and excluded by a
                // NOT_PLATFORM() hint at the same time, but take duplicates into account
                const commonPlatforms: Parameter[] = [];

                for (const platform of platforms) {
                    for (const notPlatform of notPlatforms) {
                        if (platform.value === notPlatform.value) {
                            // Check if the platform is already in the array (loc property is unique
                            // and definietly exists, since we configured the parser to do so)
                            if (!commonPlatforms.some((e) => equal(e.loc, platform.loc))) {
                                commonPlatforms.push(platform);
                            }

                            if (!commonPlatforms.some((e) => equal(e.loc, notPlatform.loc))) {
                                commonPlatforms.push(notPlatform);
                            }
                        }
                    }
                }

                // Sort platforms by their location (loc.start.offset) to get a consistent order
                // It is safe to use the non-null assertion operator here, because the loc property
                // is always defined for parameters, since we configured the parser to do so
                // eslint-disable-next-line max-len, @typescript-eslint/no-non-null-assertion
                const commonPlatformsOrdered = commonPlatforms.sort((a, b) => a.loc!.start.offset - b.loc!.start.offset);

                // Report all platforms that are targeted by a PLATFORM() hint and excluded by a
                // NOT_PLATFORM() hint at the same time
                for (const platform of commonPlatformsOrdered) {
                    context.report({
                        // eslint-disable-next-line max-len
                        message: `Platform "${platform.value}" is targeted by a PLATFORM() hint and excluded by a NOT_PLATFORM() hint at the same time`,
                        node: platform,
                    });
                }
            }
        },
    },
};
