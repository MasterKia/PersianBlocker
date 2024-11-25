/**
 * @file AGLint exports for browsers
 *
 * ! DO NOT EXPORT NODE SPECIFIC MODULES HERE (e.g. fs, path, etc.)
 */

// Re-export everything from the common entry point
export * from './index.common';

// Re-export AGTree just for convenience
export * as AGTree from '@adguard/agtree';
