/**
 * @file AGLint core
 */

import { assert } from 'superstruct';
import cloneDeep from 'clone-deep';
import {
    type AnyRule,
    AdblockSyntax,
    CommentRuleType,
    type FilterList,
    FilterListParser,
    RuleCategory,
} from '@adguard/agtree';

import {
    defaultLinterConfig,
    mergeConfigs,
    linterRulesSchema,
    mergeConfigsReverse,
} from './config';
import { defaultLinterRules } from './rules';
import { ConfigCommentType } from './inline-config';
import {
    SEVERITY,
    getSeverity,
    type AnySeverity,
    isSeverity,
} from './severity';
import {
    type AnyLinterRule,
    type GenericRuleContext,
    type LinterConfig,
    type LinterPosition,
    type LinterProblemReport,
    type LinterRuleConfig,
    type LinterRuleConfigObject,
    type LinterRuleEvents,
    type LinterRuleStorage,
} from './common';
import { validateLinterConfig } from './config-validator';
import { defaultConfigPresets } from './config-presets';

/**
 * Represents a linter result that is returned by the `lint` method
 */
export interface LinterResult {
    /**
     * Array of problems detected by the linter
     */
    problems: LinterProblem[];

    /**
     * Count of warnings (just for convenience, can be calculated from problems array)
     */
    warningCount: number;

    /**
     * Count of errors (just for convenience, can be calculated from problems array)
     */
    errorCount: number;

    /**
     * Count of fatal errors (just for convenience, can be calculated from problems array)
     */
    fatalErrorCount: number;

    /**
     * The fixed filter list content. This is only available if the `fix` option is set to `true`.
     */
    fixed?: string;
}

/**
 * Represents a problem given by the linter
 */
export interface LinterProblem {
    /**
     * Name of the linter rule that generated this problem
     */
    rule?: string;

    /**
     * The severity of this problem (it practically inherits the rule severity)
     */
    severity: AnySeverity;

    /**
     * Text description of the problem
     */
    message: string;

    /**
     * The location of the problem
     */
    position: LinterPosition;

    /**
     * Suggested fix for the problem (if available)
     */
    fix?: AnyRule | AnyRule[];
}

/**
 * Represents a linter rule data object. Basically used internally by the linter,
 * so no need to export this.
 */
export interface LinterRuleData {
    /**
     * The linter rule itself. It's meta provides the rule severity and default config,
     * which can be overridden by the user here.
     */
    rule: AnyLinterRule;

    /**
     * Storage for storing data between events. This storage is only visible
     * to the rule.
     */
    storage: LinterRuleStorage;

    /**
     * Custom config for the rule (it overrides the default config if provided)
     */
    configOverride?: unknown;

    /**
     * Custom severity for the rule (it overrides the default severity if provided)
     */
    severityOverride?: AnySeverity;
}

/**
 * Core linter logic
 */
export class Linter {
    /**
     * A map of rule names to `LinterRule` objects
     */
    private readonly rules: Map<string, LinterRuleData> = new Map();

    /**
     * The linter configuration
     */
    private config: LinterConfig = defaultLinterConfig;

    /**
     * Config presets
     */
    private configPresets: Map<string, LinterConfig> = new Map();

    /**
     * Creates a new linter instance.
     *
     * @param defaultRules Add default linter rules and config presets to the linter
     * (by default it adds them)
     * @param config Linter config to use (by default it uses the default config)
     */
    constructor(defaultRules = true, config: LinterConfig = defaultLinterConfig) {
        if (defaultRules) {
            this.addDefaultRules();
            this.addDefaultConfigPresets();
        }

        this.setConfig(config);
    }

    /**
     * Adds all default rules to the linter.
     */
    public addDefaultRules(): void {
        for (const [name, rule] of defaultLinterRules) {
            this.addRule(name, rule);
        }
    }

    /**
     * Adds all default config presets to the linter.
     */
    public addDefaultConfigPresets(): void {
        for (const [name, config] of defaultConfigPresets) {
            this.addConfigPreset(name, config);
        }
    }

    /**
     * Sets the config for a given rule. It just overrides the default config.
     *
     * @param ruleName The name of the rule to set the config for
     * @param ruleConfig The config to set
     * @throws If the rule doesn't exist
     * @throws If the rule severity / config is invalid
     * @throws If the rule doesn't support config
     */
    public setRuleConfig(ruleName: string, ruleConfig: LinterRuleConfig): void {
        const entry = this.rules.get(ruleName);

        if (!entry) {
            throw new Error(`Rule "${ruleName}" doesn't exist`);
        }

        const severity = Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;

        let config: undefined | unknown;

        if (Array.isArray(ruleConfig) && ruleConfig.length > 1) {
            const rest = ruleConfig.slice(1);
            config = rest.length === 1 ? rest[0] : rest;
        }

        if (!isSeverity(severity)) {
            throw new Error(`Invalid severity "${severity}" for rule "${ruleName}"`);
        }

        entry.severityOverride = getSeverity(severity);

        if (config !== undefined) {
            if (!entry.rule.meta.config) {
                throw new Error(`Rule "${ruleName}" doesn't support config`);
            }

            try {
                assert(config, entry.rule.meta.config.schema);
            } catch (err: unknown) {
                throw new Error(`Invalid config for rule "${ruleName}": ${(err as Error).message}`);
            }
            entry.configOverride = config;
        }

        this.rules.set(ruleName, entry);
    }

    /**
     * This method applies the configuration "rules" part to the linter.
     *
     * @param rulesConfig Rules config object
     */
    public applyRulesConfig(rulesConfig: LinterRuleConfigObject) {
        for (const [ruleName, ruleConfig] of Object.entries(rulesConfig)) {
            this.setRuleConfig(ruleName, ruleConfig);
        }
    }

    /**
     * Gets the linter configuration.
     *
     * @returns The linter configuration
     */
    public getConfig(): LinterConfig {
        return cloneDeep(this.config);
    }

    /**
     * Adds a new config preset to the linter.
     *
     * @param name Config preset name, e.g. "aglint:recommended"
     * @param config Related config object
     * @throws If the config preset already exists
     */
    public addConfigPreset(name: string, config: LinterConfig): void {
        // Don't allow to override existing config presets
        if (this.configPresets.has(name)) {
            throw new Error(`Config preset "${name}" already exists`);
        }

        // Validate the config
        validateLinterConfig(config);

        this.configPresets.set(name, config);
    }

    /**
     * Applies the config presets to the config object (extends the config
     * with the given presets if they exist).
     *
     * @param config Config object
     * @returns Extended config object
     * @throws If the config preset doesn't exist
     * @throws If the config is invalid
     */
    public applyConfigExtensions(config: LinterConfig): LinterConfig {
        // Validate the provided config before applying the config presets
        validateLinterConfig(config);

        // Clone the provided config object to avoid any side effects
        let clonedConfig = cloneDeep(config);

        // If the provided config has "extends" property,
        // presets should be merged in the same order they are specified in the "extends" array
        let mergedPresets: Partial<LinterConfig> = {};

        if (clonedConfig.extends) {
            for (const presetName of clonedConfig.extends) {
                const preset = this.configPresets.get(presetName);

                // Preset should exist
                if (!preset) {
                    throw new Error(`Config preset "${presetName}" doesn't exist`);
                }

                // TODO: Allow "extends" in config presets (recursively)?
                // ! If the config preset extends itself, we'll get an infinite loop

                // Merge the current preset with the previously merged presets
                mergedPresets = mergeConfigsReverse(mergedPresets, preset);
            }

            // Remove "extends" property from the cloned config, because we don't need it anymore
            delete clonedConfig.extends;
        }

        // Override presets with the provided config
        clonedConfig = mergeConfigsReverse(mergedPresets, clonedConfig);

        // Validate the prepared config
        validateLinterConfig(clonedConfig);

        return clonedConfig;
    }

    /**
     * Sets the linter configuration. If `reset` is set to `true`, all rule
     * configurations are reset to their default values (removing overrides).
     *
     * @param config Core linter configuration
     * @param reset Whether to reset all rule configs
     * @throws If any of the config presets doesn't exist
     * @throws If the rule config is invalid in any way
     */
    public setConfig(config: LinterConfig, reset = true): void {
        // Merge the given config with the default config, but before that
        // don't forget apply the config presets
        const newConfig = mergeConfigs(
            defaultLinterConfig,
            this.applyConfigExtensions(config),
        );

        // Set the new config
        this.config = newConfig;

        // Reset all rule configs
        if (reset) {
            for (const entry of this.rules.values()) {
                entry.configOverride = undefined;
                // By default, severity is set to 0 (which means "off")
                entry.severityOverride = 0;
            }
        }

        if (newConfig.rules) {
            this.applyRulesConfig(newConfig.rules);
        }
    }

    /**
     * Adds a new rule to the linter.
     *
     * @param name The name of the rule
     * @param rule The rule itself
     * @throws If the rule name is already taken
     */
    public addRule(name: string, rule: AnyLinterRule): void {
        this.addRuleEx(name, {
            rule,

            // Initialize storage as empty object
            storage: {},
        });
    }

    /**
     * Adds a new rule to the linter, but you can specify the rule data.
     *
     * @param name The name of the rule
     * @param data The rule data, see `LinterRuleData` interface for more details
     * @throws If the rule name is already taken
     * @throws If the rule severity is invalid
     * @throws If the rule config is invalid
     */
    public addRuleEx(name: string, data: LinterRuleData): void {
        if (this.rules.has(name)) {
            throw new Error(`Rule with name "${name}" already exists`);
        }

        const clone = cloneDeep(data);

        if (clone.severityOverride) {
            // Validate severity
            if (!isSeverity(clone.severityOverride)) {
                throw new Error(`Invalid severity "${clone.severityOverride}" for rule "${name}"`);
            }

            // Convert to number
            clone.severityOverride = getSeverity(clone.severityOverride);
        }

        if (clone.configOverride) {
            if (!clone.rule.meta.config) {
                throw new Error(`Rule "${name}" doesn't support config`);
            } else {
                try {
                    assert(clone.configOverride, clone.rule.meta.config.schema);
                } catch (err: unknown) {
                    throw new Error(`Invalid config for rule "${name}": ${(err as Error).message}`);
                }
            }
        }

        // Add rule to the repository
        this.rules.set(name, clone);
    }

    /**
     * Resets default config for the rule with the specified name.
     *
     * @param name The name of the rule
     * @throws If the rule doesn't exist
     * @throws If the rule doesn't support config
     */
    public resetRuleConfig(name: string): void {
        // Find the rule
        const entry = this.rules.get(name);

        // Check if the rule exists
        if (!entry) {
            throw new Error(`Rule with name "${name}" doesn't exist`);
        }

        if (!entry.rule.meta.config) {
            throw new Error(`Rule "${name}" doesn't support config`);
        }

        // Set the config to undefined, so the default config will be used next time
        entry.severityOverride = undefined;
        entry.configOverride = undefined;
    }

    /**
     * Gets the current config for the rule with the specified name.
     *
     * @param name The name of the rule
     * @returns The currently active config for the rule. If no override is set,
     * the default config is returned.
     * @throws If the rule doesn't exist
     * @throws If the rule doesn't support config
     */
    public getRuleConfig(name: string): LinterRuleConfig {
        // Find the rule
        const entry = this.rules.get(name);

        // Check if the rule exists
        if (!entry) {
            throw new Error(`Rule with name "${name}" doesn't exist`);
        }

        if (!entry.rule.meta.config) {
            throw new Error(`Rule "${name}" doesn't support config`);
        }

        return [
            isSeverity(entry.severityOverride) ? entry.severityOverride : entry.rule.meta.severity,
            entry.configOverride || entry.rule.meta.config.default,
        ];
    }

    /**
     * Returns the `LinterRule` object with the specified name.
     *
     * @param name - The name of the rule
     * @returns The `LinterRule` object, or `undefined` if no such rule exists
     */
    public getRule(name: string): AnyLinterRule | undefined {
        return cloneDeep(this.rules.get(name)?.rule);
    }

    /**
     * Returns the map of all rules in the repository.
     *
     * @returns The map of rule names to `LinterRule` objects
     */
    public getRules(): Map<string, LinterRuleData> {
        return cloneDeep(this.rules);
    }

    /**
     * Returns whether a rule with the specified name exists in the repository.
     *
     * @param name - The name of the rule
     * @returns `true` if the rule exists, `false` otherwise
     */
    public hasRule(name: string): boolean {
        return this.rules.has(name);
    }

    /**
     * Removes a rule from the repository.
     *
     * @param name - The name of the rule
     */
    public removeRule(name: string): void {
        if (!this.rules.has(name)) {
            throw new Error(`Rule with name "${name}" does not exist`);
        }

        this.rules.delete(name);
    }

    /**
     * Disables a rule by name.
     *
     * @param name - The name of the rule
     * @throws If the rule does not exist
     */
    public disableRule(name: string): void {
        const entry = this.rules.get(name);

        // Check if the rule exists
        if (!entry) {
            throw new Error(`Rule with name "${name}" does not exist`);
        }

        entry.severityOverride = SEVERITY.off;

        this.rules.set(name, entry);
    }

    /**
     * Enables a rule
     *
     * @param name - The name of the rule
     * @throws If the rule does not exist
     */
    public enableRule(name: string): void {
        const entry = this.rules.get(name);

        // Check if the rule exists
        if (!entry) {
            throw new Error(`Rule with name "${name}" does not exist`);
        }

        entry.severityOverride = undefined;

        this.rules.set(name, entry);
    }

    /**
     * Returns whether a rule is disabled.
     *
     * @param name - The name of the rule
     * @returns `true` if the rule is disabled, `false` otherwise
     */
    public isRuleDisabled(name: string): boolean {
        const entry = this.rules.get(name);

        if (!entry) {
            return false;
        }

        const severity = isSeverity(entry.severityOverride) ? entry.severityOverride : entry.rule.meta.severity;

        // Don't forget to convert severity to number (it can be a string,
        // if it was set by the user, and it's can be confusing)
        return getSeverity(severity) === SEVERITY.off;
    }

    /**
     * Lints the list of rules (typically this is the content of a filter list).
     *
     * @param content - Filter list content
     * @param fix - Include fixes in the result. Please note that if more than one fix
     * is available for a single problem, then the line will be skipped.
     * @returns Linter result
     */
    public lint(content: string, fix = false): LinterResult {
        // Prepare linting result
        const result: LinterResult = {
            problems: [],
            warningCount: 0,
            errorCount: 0,
            fatalErrorCount: 0,
        };

        let isDisabled = false;

        // A set of linter rule names that are disabled on the next line
        const nextLineDisabled = new Set<string>();
        let isDisabledForNextLine = false;

        // A set of linter rule names that are enabled on the next line
        const nextLineEnabled = new Set<string>();
        let isEnabledForNextLine = false;

        // Store the actual line number here for the context object
        let actualLine = 0;

        // Store the actual rule here for the context object
        let actualAdblockRuleAst: AnyRule;
        let actualAdblockRuleRaw: string;

        /**
         * Invokes an event for all rules. This function is only used internally
         * by the actual linting, so we define it here.
         *
         * The context is dependent on the actual linting environment, so we create
         * a new context object for each event within this function.
         *
         * @param event - The event to invoke (e.g. `onRule`)
         */
        const invokeEvent = (event: keyof LinterRuleEvents): void => {
            for (const [name, data] of this.rules) {
                // If the rule is disabled, skip it
                if (
                    (this.isRuleDisabled(name) // rule is disabled at config level
                        || nextLineDisabled.has(name)) // or rule is disabled for the next line
                    && !nextLineEnabled.has(name) // and rule is not enabled for the next line
                ) {
                    continue;
                }

                // Validate rule configuration (if it exists)
                if (data.rule.meta.config) {
                    assert(data.configOverride || data.rule.meta.config.default, data.rule.meta.config.schema);
                }

                const genericContext: GenericRuleContext = Object.freeze({
                    // Deep copy of the linter configuration
                    getLinterConfig: () => {
                        return { ...this.config };
                    },

                    // Currently linted filter list content
                    getFilterListContent: () => content,

                    fixingEnabled: () => fix,

                    // Storage reference
                    storage: data.storage,

                    // Rule configuration
                    config: data.configOverride || data.rule.meta.config?.default,

                    // Reporter function
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    report: (problem: LinterProblemReport) => {
                        let severity = getSeverity(data.rule.meta.severity);

                        if (!nextLineEnabled.has(name)) {
                            // rely on the result of network rules modifiers validation;
                            // see src/linter/rules/invalid-modifiers.ts
                            if (isSeverity(problem.customSeverity)) {
                                severity = getSeverity(problem.customSeverity);
                            } else if (isSeverity(data.severityOverride)) {
                                severity = getSeverity(data.severityOverride);
                            }
                        }

                        // Default problem location: whole line
                        let position: LinterPosition = {
                            startLine: actualLine,
                            startColumn: 0,
                            endLine: actualLine,
                            endColumn: actualAdblockRuleRaw.length,
                        };

                        if (problem.position) {
                            position = problem.position;
                        } else if (problem.node && problem.node.loc !== undefined) {
                            position = {
                                startLine: problem.node.loc.start.line,
                                startColumn: problem.node.loc.start.column - 1,
                                endLine: problem.node.loc.end.line,
                                endColumn: problem.node.loc.end.column - 1,
                            };
                        }

                        result.problems.push({
                            rule: name,
                            severity,
                            message: problem.message,
                            position,
                            fix: problem.fix,
                        });

                        // Update problem counts
                        switch (severity) {
                            case SEVERITY.warn:
                                result.warningCount += 1;
                                break;
                            case SEVERITY.error:
                                result.errorCount += 1;
                                break;
                            case SEVERITY.fatal:
                                result.fatalErrorCount += 1;
                                break;
                            default:
                                break;
                        }
                    },
                });

                // Call the proper event handler
                if (event !== 'onRule') {
                    const handler = data.rule.events[event];

                    if (handler) {
                        handler(genericContext);
                    }
                } else {
                    const handler = data.rule.events.onRule;

                    if (handler) {
                        handler(
                            Object.freeze({
                                ...genericContext,
                                // eslint-disable-next-line @typescript-eslint/no-loop-func
                                getActualLine: () => actualLine,

                                // Currently iterated adblock rule
                                // eslint-disable-next-line @typescript-eslint/no-loop-func
                                getActualAdblockRuleAst: () => actualAdblockRuleAst,

                                // Currently iterated adblock rule
                                // eslint-disable-next-line @typescript-eslint/no-loop-func
                                getActualAdblockRuleRaw: () => actualAdblockRuleRaw,
                            }),
                        );
                    }
                }
            }
        };

        // Invoke onStartFilterList event before parsing the filter list
        invokeEvent('onStartFilterList');

        // Parse the filter list
        const filterList = FilterListParser.parse(content);

        // Iterate over all filter list adblock rules
        filterList.children.forEach((ast, index) => {
            // Update actual line number for the context object
            actualLine = index + 1;

            // Process the line
            const code = ((): number => {
                // Invalid rules
                if (ast.category === RuleCategory.Invalid) {
                    // If the linter is actually disabled, skip the error reporting
                    if ((isDisabled || isDisabledForNextLine) && !isEnabledForNextLine) {
                        return 0;
                    }

                    // If an error occurs during parsing, it means that the rule is invalid,
                    // that is, it could not be parsed for some reason. This is a fatal error,
                    // since the linter rules can only accept AST.

                    // AdblockSyntaxError is a special error type that is thrown by the parser
                    // when it encounters a syntax error. In this case, we can get the position
                    // of the error from the error object.
                    // Otherwise, we assume that the error occurred at the beginning of the line
                    // and we report the error for the entire line (from the beginning to the end).

                    /* eslint-disable @typescript-eslint/no-non-null-assertion */
                    const position: LinterPosition = {
                        startLine: ast.error.loc!.start!.line,
                        startColumn: ast.error.loc!.start!.column - 1,
                        endLine: ast.error.loc!.end!.line,
                        endColumn: ast.error.loc!.end!.column - 1,
                    };
                    /* eslint-enable @typescript-eslint/no-non-null-assertion */

                    // Store the error in the result object
                    result.problems.push({
                        severity: SEVERITY.fatal,
                        message: `AGLint parsing error: ${ast.error.message}`,
                        position,
                    });

                    // Don't forget to increase the fatal error count when parsing fails
                    result.fatalErrorCount += 1;
                } else {
                    // Handle inline config comments
                    if (ast.category === RuleCategory.Comment && ast.type === CommentRuleType.ConfigCommentRule) {
                        // If inline config is not allowed in the linter configuration,
                        // simply skip the comment processing
                        if (!this.config.allowInlineConfig) {
                            return 0;
                        }

                        // Process the inline config comment
                        switch (ast.command.value) {
                            case ConfigCommentType.Main: {
                                if (ast.params && ast.params.type === 'Value') {
                                    assert(ast.params.value, linterRulesSchema);

                                    this.config = mergeConfigs(this.config, {
                                        rules: ast.params.value,
                                    });

                                    this.applyRulesConfig(ast.params.value);
                                }

                                break;
                            }

                            case ConfigCommentType.Disable: {
                                if (ast.params && ast.params.type === 'ParameterList') {
                                    for (const param of ast.params.children) {
                                        this.disableRule(param.value);
                                    }

                                    break;
                                }

                                isDisabled = true;
                                break;
                            }

                            case ConfigCommentType.Enable: {
                                if (ast.params && ast.params.type === 'ParameterList') {
                                    for (const param of ast.params.children) {
                                        this.enableRule(param.value);
                                    }

                                    break;
                                }

                                isDisabled = false;
                                break;
                            }

                            case ConfigCommentType.DisableNextLine: {
                                // Disable specific rules for the next line
                                if (ast.params && ast.params.type === 'ParameterList') {
                                    for (const param of ast.params.children) {
                                        nextLineDisabled.add(param.value);
                                    }
                                } else {
                                    // Disable all rules for the next line
                                    isDisabledForNextLine = true;
                                }

                                break;
                            }

                            case ConfigCommentType.EnableNextLine: {
                                // Enable specific rules for the next line
                                if (ast.params && ast.params.type === 'ParameterList') {
                                    for (const param of ast.params.children) {
                                        nextLineEnabled.add(param.value);
                                    }
                                } else {
                                    // Disable all rules for the next line
                                    isEnabledForNextLine = true;
                                }

                                break;
                            }

                            default:
                                break;
                        }

                        // The config comment has been processed, there is nothing more to do with the line
                        // But we need to return 1, because we processed an inline config comment
                        return 1;
                    }
                    // If the linter is actually disabled, skip the rule processing.
                    // It is important to do this check here, because we need to
                    // process the inline config comments even if the linter is disabled
                    // (in this way we could detect the `enable` command, for example).
                    if ((isDisabled || isDisabledForNextLine) && !isEnabledForNextLine) {
                        return 0;
                    }

                    // Deep copy of the line data
                    actualAdblockRuleAst = { ...ast };
                    // It is safe to use the `!` operator here, because we know that the `raws` property exists,
                    // since we configured the parser to return the raw data as well.
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    actualAdblockRuleRaw = ast.raws!.text!;

                    // Invoke onRule event for all rules (process actual adblock rule)
                    invokeEvent('onRule');

                    // Check if filter list has Agent type comment
                    // and if so, it will override the syntax property set in the config
                    if (ast.category === RuleCategory.Comment && ast.type === CommentRuleType.AgentCommentRule) {
                        const agents: AdblockSyntax[] = [];
                        ast.children.forEach((child) => {
                            if (child.type === 'Agent') {
                                agents.push(child.syntax);
                            }
                        });
                        this.config.syntax = agents.length > 0
                            ? agents
                            : [AdblockSyntax.Common];
                    }
                }

                return 0;
            })();

            // Clear next line stuff if the line was processed with code 0
            if (code === 0) {
                nextLineDisabled.clear();
                nextLineEnabled.clear();
                isDisabledForNextLine = false;
                isEnabledForNextLine = false;
            }
        });

        // Invoke onEndFilterList event after parsing the filter list
        invokeEvent('onEndFilterList');

        // Build fixed content if fixing is enabled
        if (fix) {
            const fixedFilterList: FilterList = {
                type: 'FilterList',
                children: [],
            };

            // Iterate over all rules in the original filter list
            for (let i = 0; i < filterList.children.length; i += 1) {
                const rule = filterList.children[i];

                // Find the fix for the current rule
                const fixed: AnyRule[] = [];

                // Currently only 1 fix is allowed per rule
                let matches = 0;

                for (const problem of result.problems) {
                    if (problem.fix && problem.position.startLine === i + 1 && i + 1 === problem.position.endLine) {
                        const fixes: AnyRule[] = Array.isArray(problem.fix) ? problem.fix : [problem.fix];

                        // We prefer to use raw generated content if available, so
                        // we can avoid generating wrong (old) content again, if
                        // the rule was changed in the meantime
                        fixed.push(...(fixes.map((e) => {
                            if (e.raws && e.raws.text) {
                                delete e.raws.text;
                            }
                            return e;
                        })));

                        matches += 1;
                    }
                }

                // Push the fixed version of the rule to the fixed filter list if
                // matches is 1 (only 1 fix is allowed per rule), otherwise push
                // the original rule
                if (matches === 1) {
                    fixedFilterList.children.push(...fixed);
                } else {
                    fixedFilterList.children.push(rule);
                }
            }

            result.fixed = FilterListParser.generate(fixedFilterList, true);
        }

        // Return linting result
        return result;
    }
}
