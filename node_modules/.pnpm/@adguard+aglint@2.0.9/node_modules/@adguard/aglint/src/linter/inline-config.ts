/**
 * Represents currently supported inline config comments by AGLint.
 */
export enum ConfigCommentType {
    /**
     * Main config comment with configuration object.
     */
    Main = 'aglint',

    /**
     * Disables AGLint. It will be enabled again if there is an `aglint-enable` comment.
     */
    Disable = 'aglint-disable',

    /**
     * Enables AGLint. It will be disabled again if there is an `aglint-disable` comment.
     * If AGLint is already enabled, this comment will be ignored.
     */
    Enable = 'aglint-enable',

    /**
     * Disables AGLint for next line. If you specify rule names as params, then only these rules will be disabled.
     *
     * @example
     * The following comment will disable `some-rule` and `another-rule` for the next line:
     * ```adblock
     * ! aglint-disable-next-line some-rule another-rule
     * ```
     *
     * The following comment will disable all rules for the next line:
     * ```adblock
     * ! aglint-disable-next-line
     * ```
     */
    DisableNextLine = 'aglint-disable-next-line',

    /**
     * Enables AGLint for next line. If you specify rule names as params, then only these rules will be enabled.
     *
     * @example
     * The following comment will enable `some-rule` and `another-rule` for the next line:
     * ```adblock
     * ! aglint-enable-next-line some-rule another-rule
     * ```
     *
     * The following comment will enable all rules for the next line:
     * ```adblock
     * ! aglint-enable-next-line
     * ```
     */
    EnableNextLine = 'aglint-enable-next-line',
}
