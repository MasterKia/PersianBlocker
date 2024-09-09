import { type Struct } from 'superstruct';
import { type AdblockSyntax, type AnyRule, type Node } from '@adguard/agtree';

import { type AnySeverity } from './severity';

/**
 * Represents any linter rule
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyLinterRule = LinterRule<any, any>;

/**
 * Type for rule configuration object
 */
export type LinterRuleConfigObject = { [key: string]: LinterRuleConfig };

/**
 * Type definition for the linter rule config, which can be:
 * - severity itself (number or string): `severity`
 * - one-element array with severity as the first element: `[severity]`
 * - n-element array with severity as the first element and other options as the rest: `[severity, ...options]`
 */
export type LinterRuleConfig = AnySeverity | LinterRuleConfigArray;

/**
 * Type definition for the linter rule config array, which can be:
 * - one-element array with severity as the first element: `[severity]`
 * - n-element array with severity as the first element and other options as the rest: `[severity, ...options]`
 */
export type LinterRuleConfigArray = [AnySeverity, ...unknown[]];

/**
 * Represents the metadata of a linter rule configuration
 */
export interface LinterRuleConfigMeta {
    /**
     * Default configuration of the rule
     */
    default: unknown;

    /**
     * Superstruct schema for the rule configuration (used for validation)
     */
    schema: Struct;
}

/**
 * Represents the metadata of a linter rule
 */
export interface LinterRuleMeta {
    /**
     * Linter rule severity. It can be off, warn, error or fatal.
     */
    severity: AnySeverity;

    /**
     * Configuration metadata (if the rule has any configuration)
     */
    config?: LinterRuleConfigMeta;
}

/**
 * Represents what events a linter rule can handle
 */
export interface LinterRuleEvents<StorageType = LinterRuleStorage<unknown>, ConfigType = unknown> {
    /**
     * Called before analyzing a filter list (before any rule is analyzed).
     * You can retrieve the filter list and other necessary information from the context.
     *
     * @param context - Linter context
     */
    onStartFilterList?: (context: GenericRuleContext<StorageType, ConfigType>) => void;

    /**
     * Called after analyzing a filter list (after all rules are analyzed).
     * You can retrieve the filter list and other necessary information from the context.
     *
     * @param context - Linter context
     */
    onEndFilterList?: (context: GenericRuleContext<StorageType, ConfigType>) => void;

    /**
     * Called when analyzing an adblock rule. This event is called for each rule, including comments.
     * You can retrieve the adblock rule and other necessary information from the context.
     *
     * @param context - Linter context
     */
    onRule?: (context: SpecificRuleContext<StorageType, ConfigType>) => void;
}

/**
 * Represents an AGLint rule
 */
export interface LinterRule<StorageType = LinterRuleStorage<unknown>, ConfigType = unknown> {
    /**
     * Basic data of the rule (metadata)
     */
    meta: LinterRuleMeta;

    /**
     * Events belonging to the rule
     */
    events: LinterRuleEvents<StorageType, ConfigType>;
}

/**
 * Represents the core linter configuration
 */
export interface LinterConfig {
    /**
     * Root configuration flag. If it's value is true, the configuration is root configuration.
     */
    root?: boolean;

    /**
     * Whether to allow inline configuration or not
     *
     * @example
     * ```adblock
     * ! aglint-disable-next-line
     * ```
     */
    allowInlineConfig?: boolean;

    /**
     * An array of configuration presets to extend
     */
    extends?: string[];

    // TODO: add ability to specify the syntax for files or directories
    /**
     * Specific adblock syntaxes to use for network rule modifiers validation.
     * Array of strings:
     * - `['Common']` (default)
     * - or any combination of `['AdGuard', 'uBlockOrigin', 'AdblockPlus']`.
     *
     * Can be set in the configuration file
     * or in the filter list as `Agent` type comment.
     *
     */
    syntax: AdblockSyntax[];

    /**
     * A map of rule names to their configuration
     */
    rules?: LinterRuleConfigObject;
}

/**
 * Represents a linter context that is passed to the rules when their events are triggered
 */
export interface GenericRuleContext<StorageType = LinterRuleStorage<unknown>, ConfigType = unknown> {
    /**
     * Returns the clone of the shared linter configuration.
     *
     * @returns The shared linter configuration
     */
    getLinterConfig: () => LinterConfig;

    /**
     * Returns the raw content of the adblock filter list currently processed by the linter.
     *
     * @returns The raw adblock filter list content
     */
    getFilterListContent: () => string;

    /**
     * Returns whether a fix was requested from the linter. This is an optimization
     * for the linter, so it doesn't have to run the fixer if it's not needed.
     *
     * @returns `true` if fix is needed, `false` otherwise
     */
    fixingEnabled: () => boolean;

    /**
     * Storage for storing data between events. This storage is only visible to the rule.
     */
    storage: StorageType;

    /**
     * Additional config for the rule. This is unknown at this point, but the concrete
     * type is defined by the rule.
     */
    config: ConfigType;

    /**
     * Function for reporting problems to the linter.
     *
     * @param problem - The problem to report
     */
    report: (problem: LinterProblemReport) => void;
}

/**
 * Specialized linter context for the rule that is triggered when analyzing an adblock rule
 */
// eslint-disable-next-line max-len
export interface SpecificRuleContext<StorageType = LinterRuleStorage<unknown>, ConfigType = unknown> extends GenericRuleContext<StorageType, ConfigType> {
    /**
     * Returns the AST of the adblock rule currently being iterated by the linter.
     *
     * @returns The actual adblock rule as AST
     */
    getActualAdblockRuleAst: () => AnyRule;

    /**
     * Returns the raw version of the adblock rule currently being iterated by the linter.
     *
     * @returns The actual adblock rule as original string
     */
    getActualAdblockRuleRaw: () => string;

    /**
     * Returns the line number that the linter is currently iterating.
     *
     * @returns The actual line number
     */
    getActualLine: () => number;
}

/**
 * Represents the location of a problem that detected by the linter
 */
export interface LinterPosition {
    /**
     * 1-based line number of the problem
     */
    startLine: number;

    /**
     * 0-based column number of the problem
     */
    startColumn: number;

    /**
     * 1-based line number of the problem
     */
    endLine: number;

    /**
     * 0-based column number of the problem
     */
    endColumn: number;
}

/**
 * Represents a problem report (this must be passed to context.report from the rules)
 */
export interface LinterProblemReport {
    /**
     * Text description of the problem
     */
    message: string;

    /**
     * Node that caused the problem
     */
    node?: Node;

    /**
     * The location of the problem
     */
    position?: LinterPosition;

    /**
     * Suggested fix for the problem
     */
    fix?: AnyRule | AnyRule[];

    /**
     * Severity of the problem, overrides the rule severity set in the meta property.
     * Needed for modifiers validation, e.g. deprecated modifiers which are still supported
     * but will not be supported in the future, so they are not recommended to use.
     */
    customSeverity?: AnySeverity;
}

/**
 * Represents a linter rule storage object that is passed as reference to
 * the rules when their events are triggered.
 *
 * Basically used internally by the linter, so no need to export this.
 */
export interface LinterRuleStorage<T = unknown> {
    // The key is some string, the value is unknown at this point.
    // The concrete value type is defined by the rule.
    [key: string]: T;
}
