import { type ParsedPath } from 'path';

import { type LinterResult } from '../index';
import { type LinterConfig } from '../common';

/**
 * Represents a reporter skeleton for the linter.
 */
export interface LinterCliReporter {
    /**
     * Called when the whole linting process starts.
     */
    onLintStart?: () => void;

    /**
     * Called when linting a file starts.
     *
     * @param file The file that is being linted
     * @param config The linter configuration
     */
    onFileStart?: (file: ParsedPath, config: LinterConfig) => void;

    /**
     * Called when linting a file ends. It will give you the result of the linting
     * and the configuration that was used (if you want to do something with it).
     *
     * @param file The file that was linted
     * @param result The result of the linting
     * @param config The linter configuration
     */
    onFileEnd?: (file: ParsedPath, result: LinterResult, config: LinterConfig) => void;

    /**
     * Called when the whole linting process ends.
     */
    onLintEnd?: () => void;
}
