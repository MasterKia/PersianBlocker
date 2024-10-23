/**
 * We throw this error when we can't find a config file for the given directory.
 * It is easy to catch this error and show a nice error message to the user
 * when using the CLI tool.
 */
export class NoConfigError extends Error {
    constructor(dir: string) {
        super(`No config file found for ${dir}`);

        this.name = 'NoConfigError';
    }
}
