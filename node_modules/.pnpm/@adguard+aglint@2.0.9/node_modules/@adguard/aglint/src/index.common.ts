/**
 * @file AGLint common exports (used in both Node.js and browsers)
 *
 * ! DO NOT EXPORT NODE SPECIFIC MODULES HERE (e.g. fs, path, etc.)
 */

// Core linter
export {
    type LinterResult,
    type LinterProblem,
    type LinterRuleData,
    Linter,
} from './linter';

export type {
    LinterRuleConfigObject,
    LinterConfig,
    LinterRuleConfigArray,
    LinterRuleConfigMeta,
    LinterRuleMeta,
    LinterRuleEvents,
    LinterRule,
    GenericRuleContext,
    LinterPosition,
    LinterProblemReport,
    LinterRuleStorage,
} from './linter/common';

// Version
export { version } from './version';
