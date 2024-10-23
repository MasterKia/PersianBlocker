declare module '@adguard/scriptlets' {

    /**
     * Scriptlets version
     */
    const SCRIPTLETS_VERSION: string;

    /**
     * Scriptlet properties
     */
    interface IConfiguration {
        /**
         * Scriptlet name
         */
        name: string;

        /**
         * Arguments for scriptlet function
         */
        args: string[];

        /**
         * {'extension'|'corelibs'} engine Defines the final form of scriptlet string presentation
         */
        engine: string;

        /**
         * Version
         */
        version: string;

        /**
         * flag to enable printing to console debug information
         */
        verbose: boolean;

        /**
         * Source rule text is used for debugging purposes.
         *
         * @deprecated since it is not used in the code anymore.
         */
        ruleText?: string;

        /**
         * Domain name, used to improve logging
         */
        domainName?: string;
    }

    /**
     * Redirect object
     */
    interface Redirect {
        /**
         * Redirect name
         */
        title: string;

        /**
         * Some comment for redirect resource
         */
        comment: string;

        /**
         * Data which is redirected to
         */
        content: string;

        /**
         * Type of content
         */
        contentType: string;

        /**
         * Filename of the redirect.
         */
        file: string;

        /**
         * If it's new type of redirects, i.e. click2load
         */
        isBlocking?: boolean;

        /**
         * base64 encoded hash for script needed for extension csp, i.e. for click2load
         */
        sha?: string;
    }

    /**
     * Redirects class
     */
    class Redirects {
        constructor(rawYaml: string);
        getRedirect(title: string): Redirect;
        isBlocking(title: string): boolean;
    }

    /**
     * Returns scriptlet code by param
     *
     * @param source
     * @returns js code string
     */
    function invoke(source: IConfiguration): string | null;

    /**
     * Converts any scriptlet rule into AdGuard syntax rule.
     * Comment is returned as is.
     *
     * @param rule Scriptlet rule.
     *
     * @returns Array of AdGuard scriptlet rules: one array item for ADG and UBO or few items for ABP.
     * For the ADG `rule`, validates its syntax and returns an empty array if it is invalid.
     */
    function convertScriptletToAdg(rule: string): string[];

    /**
     * 1. For ADG scriptlet checks whether the scriptlet syntax and name are valid.
     * 2. For UBO and ABP scriptlet first checks their compatibility with ADG
     * by converting them into ADG syntax, and after that checks the name.
     *
     * ADG or UBO rules are "single-scriptlet", but ABP rule may contain more than one snippet
     * so if at least one of them is not valid — whole `ruleText` rule is not valid too.
     *
     * @param ruleText Any scriptlet rule — ADG or UBO or ABP.
     *
     * @returns True if scriptlet name is valid in rule.
     */
    function isValidScriptletRule(ruleText: string): boolean;

    /**
     * Checks whether the `name` is valid scriptlet name.
     * Uses cache for better performance.
     *
     * @param {string} name Scriptlet name.
     * @returns {boolean} True if scriptlet name is valid.
     */
    function isValidScriptletName(name: string): boolean;

    /**
     * Returns scriptlet function by `name`.
     *
     * @param {string} name Scriptlet name
     *
     * @returns {Function} Scriptlet function.
     */
    function getScriptletFunction(name: string): () => void;

    /**
     * Redirects module
     */
    const redirects: {
        /**
         * Object with redirects titles in the keys and RedirectSources
         */
        Redirects: typeof Redirects;

        /**
         * Returns filename with extension for requested alias
         *
         * @param alias alias for redirect filename
         */
        getRedirectFilename(alias: string): string;

        /**
         * Checks if the `rule` is AdGuard redirect rule.
         *
         * @param rule
         */
        isAdgRedirectRule(rule: string): boolean;

        /**
         * Checks if the specified redirect resource is compatible with AdGuard
         *
         * @param redirectName - Redirect resource name to check
         * @returns - true if the redirect resource is compatible with AdGuard
         */
        isRedirectResourceCompatibleWithAdg(redirectName: string): boolean;

        /**
         * Checks if the `rule` is **valid** AdGuard redirect resource rule
         *
         * @param rule
         */
        isValidAdgRedirectRule(rule: string): boolean;

        /**
         * Checks if the Ubo redirect `rule` has AdGuard analog. Needed for Ubo->Adg conversion
         *
         * @param rule
         */
        isUboRedirectCompatibleWithAdg(rule: string): boolean;

        /**
         * Checks if the Abp redirect `rule` has AdGuard analog. Needed for Abp->Adg conversion
         *
         * @param rule
         */
        isAbpRedirectCompatibleWithAdg(rule: string): boolean;

        /**
         * Converts redirect rule to AdGuard one
         *
         * @param rule
         */
        convertRedirectToAdg(rule: string): string;

        /**
         * Converts a redirect name to AdGuard one
         *
         * @param name
         */
        convertRedirectNameToAdg(name: string): string | undefined;
    };
}
