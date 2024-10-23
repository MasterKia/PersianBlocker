import { DomainUtils, RuleCategory } from '@adguard/agtree';

import { type LinterRule } from '../common';
import { SEVERITY } from '../severity';

/**
 * Rule that checks validity of domains in cosmetic rules
 */
export const InvalidDomainList: LinterRule = {
    meta: {
        severity: SEVERITY.error,
    },
    events: {
        onRule: (context): void => {
            // Get actually iterated adblock rule
            const ast = context.getActualAdblockRuleAst();

            // Check if the rule is a cosmetic rule (any cosmetic rule)
            if (ast.category === RuleCategory.Cosmetic) {
                // Iterate over all domains within the rule
                for (const node of ast.domains.children) {
                    // If the domain is invalid, report it
                    if (!DomainUtils.isValidDomainOrHostname(node.value)) {
                        context.report({
                            message: `Invalid domain "${node.value}"`,
                            node,
                        });
                    }
                }
            }
        },
    },
};
