/* eslint-disable no-await-in-loop */
const fs = require('fs');
const consola = require('consola');
// eslint-disable-next-line import/no-unresolved
const consolaUtils = require('consola/utils');
const agtree = require('@adguard/agtree');
const linter = require('./linter');

// Filter list lines are processing in parallel in chunks of this size. For
// now we chose 10 as the test run shows it to provide good enough results
// without overloading the web service.
//
// TODO(ameshkov): Consider making it configurable.
const PARALLEL_CHUNK_SIZE = 10;

/**
 * Represents options for the linter.
 *
 * @typedef {object} FileLintOptions
 *
 * @property {boolean} show - If true, the linter will only show suggested
 * changes, but will not confirm them.
 * @property {boolean} auto - If true, the linter will automatically count all
 * suggested changes as confirm.
 * @property {boolean} useDNS - If true, the linter doublecheck results received
 * from the urlfilter web service with a DNS query.
 * @property {boolean} commentOut - If true, the linter will suggest commenting
 * a rule out instead of removing it.
 * @property {Array<string>} deadDomains - Pre-defined list of dead domains. If
 * it is specified, skip all other checks.
 */

/**
 * Helper function that checks the "automatic" flag first before asking user.
 *
 * @param {string} message - Question to ask the user in the prompt.
 * @param {FileLintOptions} options - Configuration for this linter run.
 * @returns {Promise<boolean>} True if the user confirmed the action, false
 * otherwise.
 */
async function confirm(message, options) {
    if (options.show) {
        consola.info(`${message}: declined automatically`);

        return false;
    }

    if (options.auto) {
        consola.info(`${message}: confirmed automatically`);

        return true;
    }

    const answer = await consola.prompt(message, {
        type: 'confirm',
    });

    return answer;
}

/**
 * Represents result of processing a rule AST.
 *
 * @typedef {object} AstResult
 *
 * @property {string} line - Text of the rule that's was processed.
 * @property {number} lineNumber - Number of that line.
 * @property {import('./linter').LinterResult} linterResult - Result of linting
 * that line.
 */

/**
 * Process the rule AST from the specified file and returns the linting result
 * or null if nothing needs to be changed.
 *
 * @param {string} file - Path to the file that's being processed.
 * @param {agtree.AnyRule} ast - AST of the rule that's being processed.
 * @param {FileLintOptions} options - Configuration for this linter run.
 * @returns {Promise<AstResult|null>} Returns null if nothing needs to be changed or
 * AstResult if the linter found any issues.
 */
async function processRuleAst(file, ast, options) {
    const line = ast.raws.text;
    const lineNumber = ast.loc.start.line;

    try {
        consola.verbose(`Processing ${file}:${lineNumber}: ${line}`);

        const linterResult = await linter.lintRule(ast, {
            useDNS: options.useDNS,
            deadDomains: options.deadDomains,
        });

        // If the result is empty, the line can be simply skipped.
        if (!linterResult) {
            return null;
        }

        if (linterResult.suggestedRule === null && options.commentOut) {
            const suggestedRuleText = `! commented out by dead-domains-linter: ${line}`;
            linterResult.suggestedRule = agtree.RuleParser.parse(suggestedRuleText);
        }

        return {
            line,
            lineNumber,
            linterResult,
        };
    } catch (ex) {
        consola.warn(`Failed to process line ${lineNumber} due to ${ex}, skipping it`);

        return null;
    }
}

/**
 * Process the filter list AST and returns a list of changes that are confirmed
 * by the user.
 *
 * @param {string} file - Path to the file that's being processed.
 * @param {agtree.FilterList} listAst - AST of the filter list to process.
 * @param {FileLintOptions} options - Configuration for this linter run.
 *
 * @returns {Promise<Array<AstResult>>} Returns the list of changes that are confirmed.
 */
async function processListAst(file, listAst, options) {
    consola.start(`Analyzing ${listAst.children.length} rules`);

    let processing = 0;
    let analyzedRules = 0;
    let issuesCount = 0;

    const processingResults = await Promise.all(listAst.children.map((ast) => {
        return (async () => {
            // Using a simple semaphore-like construction to limit the number of
            // parallel processing tasks.
            while (processing >= PARALLEL_CHUNK_SIZE) {
                // Waiting for 10ms until the next check. 10ms is an arbitrarily
                // chosen value, there's no big difference between 100-10-1.

                await new Promise((resolve) => { setTimeout(resolve, 10); });
            }

            processing += 1;
            try {
                const result = await processRuleAst(file, ast, options);
                if (result !== null) {
                    issuesCount += 1;
                }

                return result;
            } finally {
                analyzedRules += 1;
                processing -= 1;

                if (analyzedRules % 100 === 0) {
                    consola.info(`Analyzed ${analyzedRules} rules, found ${issuesCount} issues`);
                }
            }
        })();
    }));

    const results = processingResults.filter((res) => res !== null);

    consola.success(`Found ${results.length} issues`);

    // Sort the results by line number in ascending order.
    results.sort((a, b) => a.lineNumber - b.lineNumber);

    // Now ask the user whether the changes are allowed.
    const allowedResults = [];
    for (let i = 0; i < results.length; i += 1) {
        const result = results[i];
        const { suggestedRule, deadDomains } = result.linterResult;
        const suggestedRuleText = suggestedRule === null ? '' : suggestedRule.raws.text;

        consola.info(`Found dead domains in a rule: ${deadDomains.join(', ')}`);
        consola.info(consolaUtils.colorize('red', `- ${result.lineNumber}: ${result.line}`));
        consola.info(consolaUtils.colorize('green', `+ ${result.lineNumber}: ${suggestedRuleText}`));

        const confirmed = await confirm('Apply suggested fix?', options);
        if (confirmed) {
            allowedResults.push(result);
        }
    }

    return allowedResults;
}

/**
 * Result of linting the file.
 *
 * @typedef {object} FileResult
 *
 * @property {agtree.FilterList} listAst - AST of the filter list.
 * @property {Array<AstResult>} results - List of changes to apply to the filter
 * list.
 */

/**
 * Lints the specified file and returns the resulting list of changes and
 * the original file AST.
 *
 * @param {string} file - Path to the file that the program should process.
 * @param {FileLintOptions} options - Configuration for this linter run.
 * @returns {Promise<FileResult|null>} Object with the file linting result or
 * null if there is nothing to change.
 */
async function lintFile(file, options) {
    const content = fs.readFileSync(file, 'utf8');

    // Parsing the whole filter list.
    const listAst = agtree.FilterListParser.parse(content);

    if (!listAst.children || listAst.children.length === 0) {
        consola.info(`No rules found in ${file}`);

        return null;
    }

    const results = await processListAst(file, listAst, options);

    if (results.length === 0) {
        consola.info(`No changes to ${file}`);

        return null;
    }

    return {
        listAst,
        results,
    };
}

/**
 * Asks for the user permission to change the file.
 *
 * @param {string} file - Path to the file being analyzed.
 * @param {FileResult} fileResult - Result of linting the file.
 * @param {FileLintOptions} options - Configuration for this linter run.
 * @returns {Promise<boolean>} True if the user confirmed the changes.
 */
async function confirmFileChanges(file, fileResult, options) {
    const { results } = fileResult;

    // Count the number of lines that are to be removed.
    const cntRemove = results.reduce((cnt, res) => {
        return res.linterResult.suggestedRule === null ? cnt + 1 : cnt;
    }, 0);
    const cntModify = results.reduce((cnt, res) => {
        return res.linterResult.suggestedRule !== null ? cnt + 1 : cnt;
    }, 0);

    const summaryMsg = `${consolaUtils.colorize('bold', `Summary for ${file}:`)}\n`
        + `${cntRemove} line${cntRemove.length > 1 || cntRemove.length === 0 ? 's' : ''} will be removed.\n`
        + `${cntModify} line${cntModify.length > 1 || cntModify.length === 0 ? 's' : ''} will be modified.`;

    consola.box(summaryMsg);

    const confirmed = await confirm('Apply modifications to the file?', options);

    return confirmed;
}

/**
 * Applies confirmed changes to the file.
 *
 * @param {string} file - Path to the file.
 * @param {FileResult} fileResult - Result of linting the file.
 * @param {FileLintOptions} options - Configuration for this linter run.
 */
async function applyFileChanges(file, fileResult, options) {
    const confirmed = await confirmFileChanges(file, fileResult, options);

    if (!confirmed) {
        consola.info(`Skipping file ${file}`);

        return;
    }

    consola.info(`Applying modifications to ${file}`);

    const { listAst, results } = fileResult;

    // Sort result by lineNumber descending so that we could use it for the
    // original array modification.
    results.sort((a, b) => b.lineNumber - a.lineNumber);

    // Go through the results array in and either remove or modify the
    // lines.
    for (let i = 0; i < results.length; i += 1) {
        const result = results[i];
        const lineIdx = result.lineNumber - 1;

        if (result.linterResult.suggestedRule === null) {
            listAst.children.splice(lineIdx, 1);
        } else {
            listAst.children[lineIdx] = result.linterResult.suggestedRule;
        }
    }

    // Generate a new filter list contents, use raw text when it's
    // available in a rule AST.
    const newContents = agtree.FilterListParser.generate(listAst, true);

    // Update the filter list file.
    fs.writeFileSync(file, newContents);
}

module.exports = {
    lintFile,
    applyFileChanges,
};
