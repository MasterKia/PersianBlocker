import cloneDeep from 'clone-deep';
import { CosmeticRuleType, RuleCategory } from '@adguard/agtree';

import { type LinterProblemReport, type LinterRule } from '../common';
import { SEVERITY } from '../severity';

/**
 * Rule that checks if a cosmetic rule contains multiple selectors
 */
export const SingleSelector: LinterRule = {
    meta: {
        severity: SEVERITY.warn,
    },
    events: {
        onRule: (context): void => {
            // Get actually iterated adblock rule
            const ast = context.getActualAdblockRuleAst();

            // Check if the rule is an element hiding rule
            if (ast.category === RuleCategory.Cosmetic && ast.type === CosmeticRuleType.ElementHidingRule) {
                // Only makes sense to check this, if there are at least two selectors within the rule
                if (ast.body.selectorList.children.length < 2) {
                    return;
                }

                // Prepare the problem report
                const report: LinterProblemReport = {
                    message: 'An element hiding rule should contain only one selector',
                    node: ast.body.selectorList,
                };

                // Suggest a fix for the problem if the user wants to fix the problem automatically
                if (context.fixingEnabled()) {
                    // Collect selectors into different rules (one selector per rule)
                    report.fix = [];

                    // Iterate over all selectors in the current rule
                    for (const selector of ast.body.selectorList.children) {
                        // Create a new rule with the same properties as the current rule.
                        const clone = cloneDeep(ast);

                        // Replace the selector list with a new selector list containing only
                        // the currently iterated selector
                        clone.body.selectorList.children = [selector];

                        // The only difference is that the new rule only contains one selector,
                        // which has the currently iterated selector in its body.
                        report.fix.push(clone);
                    }
                }

                // Report the problem to the linting context
                context.report(report);
            }
        },
    },
};
