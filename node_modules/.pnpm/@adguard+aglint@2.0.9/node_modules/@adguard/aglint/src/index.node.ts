/**
 * @file AGLint exports for Node.js
 */

// Re-export everything from the common entry point
export * from './index.common';

// Additional exports for Node.js

// Linter CLI
export { LinterCli } from './linter/cli';
export { parseConfigFile } from './linter/cli/config-reader';
export type { LinterCliReporter } from './linter/cli/reporter';
export { LinterConsoleReporter } from './linter/cli/reporters/console';
export { type ScannedDirectory, scan } from './linter/cli/scan';
export { type WalkEvent, walk } from './linter/cli/walk';
export { buildConfigForDirectory } from './linter/cli/config-builder';
export {
    type ConfigFinderCallback,
    type ConfigFinderResult,
    configFinder,
    findNextConfig,
    findNextRootConfig,
} from './linter/cli/config-finder';
export { NoConfigError } from './linter/cli/errors/no-config-error';
