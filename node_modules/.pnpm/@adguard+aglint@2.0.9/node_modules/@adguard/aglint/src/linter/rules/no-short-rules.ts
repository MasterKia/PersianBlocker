import { RuleCategory } from '@adguard/agtree';
import { type Struct, number, object } from 'superstruct';

import { type LinterRuleStorage, type LinterRule } from '../common';
import { SEVERITY } from '../severity';

type RuleConfig = {
    minLength: number;
};

const DEFAULT_MIN_RULE_LENGTH = 4;

/**
 * Rule that checks if a rule is too short
 */
export const NoShortRules: LinterRule<LinterRuleStorage<unknown>, RuleConfig> = {
    meta: {
        severity: SEVERITY.error,
        config: {
            default: {
                minLength: DEFAULT_MIN_RULE_LENGTH,
            },
            schema: object({
                minLength: number(),
            }) as Struct,
        },
    },
    events: {
        onRule: (context): void => {
            const minRuleLength = context.config.minLength ?? DEFAULT_MIN_RULE_LENGTH;

            const ruleText = context.getActualAdblockRuleRaw();
            const ruleTextTrimmed = ruleText.trim();
            const ruleNode = context.getActualAdblockRuleAst();

            if (
                // Ignore comment rules
                (ruleNode.category === RuleCategory.Cosmetic || ruleNode.category === RuleCategory.Network)
                && ruleTextTrimmed.length < minRuleLength
            ) {
                context.report({
                    message: `Too short rule: '${ruleText}'`,
                    node: ruleNode,
                });
            }
        },
    },
};
