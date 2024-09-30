import { CommentRuleType, type PreProcessorCommentRule, RuleCategory } from '@adguard/agtree';

import { type LinterRule } from '../common';
import { SEVERITY } from '../severity';
import { ELSE_DIRECTIVE, ENDIF_DIRECTIVE, IF_DIRECTIVE } from '../../common/constants';

/**
 * Concreting the storage type definition (the linter only provides a general
 * form where the value type is unknown)
 */
interface Storage {
    /**
     * Array of all open if directives
     */
    openIfs: PreProcessorCommentRule[];
}

/**
 * Rule that checks if all if directives are closed
 */
export const IfClosed: LinterRule<Storage> = {
    meta: {
        severity: SEVERITY.error,
    },
    events: {
        onStartFilterList: (context): void => {
            // Each rule ONLY sees its own storage. At the beginning of the filter list,
            // we just initialize the storage.
            context.storage.openIfs = [];
        },
        onRule: (context): void => {
            // Get actually iterated adblock rule
            const rule = context.getActualAdblockRuleAst();

            // Check adblock rule category and type
            if (rule.category !== RuleCategory.Comment
                || rule.type !== CommentRuleType.PreProcessorCommentRule) {
                return;
            }

            const directive = rule.name.value;
            switch (directive) {
                case IF_DIRECTIVE:
                    // Collect open "if"
                    context.storage.openIfs.push(rule);
                    break;
                case ELSE_DIRECTIVE:
                    // '!#else' can only be used alone without any parameters
                    if (rule.params) {
                        context.report({
                            message: `Invalid usage of preprocessor directive: "${ELSE_DIRECTIVE}"`,
                            node: rule,
                        });
                    }
                    // Check if there is an open "!#if" before "!#else"
                    if (context.storage.openIfs.length === 0) {
                        context.report({
                            // eslint-disable-next-line max-len
                            message: `Using an "${ELSE_DIRECTIVE}" directive without an opening "${IF_DIRECTIVE}" directive`,
                            node: rule,
                        });
                    }
                    // otherwise do nothing
                    break;
                case ENDIF_DIRECTIVE:
                    // '!#endif' can only be used alone without any parameters
                    if (rule.params) {
                        context.report({
                            message: `Invalid usage of preprocessor directive: "${ENDIF_DIRECTIVE}"`,
                            node: rule,
                        });
                    }
                    if (context.storage.openIfs.length === 0) {
                        context.report({
                            // eslint-disable-next-line max-len
                            message: `Using an "${ENDIF_DIRECTIVE}" directive without an opening "${IF_DIRECTIVE}" directive`,
                            node: rule,
                        });
                    } else {
                        // Mark "if" as closed (simply delete it from collection)
                        context.storage.openIfs.pop();
                    }
                    break;
                default:
                    // unsupported directives should be reported by another rule - 'unknown-preprocessor-directives'
                    // so do nothing
                    break;
            }
        },
        onEndFilterList: (context): void => {
            // If there are any collected "if"s, that means they aren't closed, so a problem must be reported for them
            for (const rule of context.storage.openIfs) {
                context.report({
                    message: `Unclosed "${IF_DIRECTIVE}" directive`,
                    node: rule,
                });
            }
        },
    },
};
