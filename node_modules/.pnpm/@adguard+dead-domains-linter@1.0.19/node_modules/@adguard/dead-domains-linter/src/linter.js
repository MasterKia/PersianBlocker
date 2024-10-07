const agtree = require('@adguard/agtree');
const urlfilter = require('./urlfilter');
const dnscheck = require('./dnscheck');
const utils = require('./utils');

/**
 * A list of network rule modifiers that are to be scanned for dead domains.
 */
const DOMAIN_MODIFIERS = ['domain', 'denyallow', 'from', 'to'];

/**
 * Regular expression that matches the domain in a network rule pattern.
 */
const PATTERN_DOMAIN_REGEX = (() => {
    const startStrings = [
        '||', '//', '://', 'http://', 'https://', '|http://', '|https://',
        'ws://', 'wss://', '|ws://', '|wss://',
    ];

    const startRegex = startStrings.map((str) => {
        return str.replace(/\//g, '\\/').replace(/\|/g, '\\|');
    }).join('|');

    return new RegExp(`^(@@)?(${startRegex})([a-z0-9-.]+)(\\^|\\/)`, 'i');
})();

/**
 * Attempts to extract the domain from the network rule pattern. If the pattern
 * does not contain a domain, returns null.
 *
 * @param {agtree.NetworkRule} ast - The rule AST.
 * @returns {string | null} The domain extracted from the AST.
 */
function extractDomainFromPattern(ast) {
    if (!ast.pattern) {
        return null;
    }

    // Ignore regular expressions as we cannot be sure if it's for a hostname
    // or not.
    //
    // TODO(ameshkov): Handle the most common cases like (negative lookahead +
    // a list of domains).
    if (ast.pattern.value.startsWith('/') && ast.pattern.value.endsWith('/')) {
        return null;
    }

    const match = ast.pattern.value.match(PATTERN_DOMAIN_REGEX);
    if (match && utils.validDomain(match[3])) {
        const domain = match[3];

        return domain;
    }

    return null;
}

/**
 * Represents a domain that is used in the rule. It can be a negated domain.
 *
 * @typedef {object} RuleDomain
 *
 * @property {string} domain - The domain name.
 * @property {boolean} negated - True if the domain is negated.
 */

/**
 * Extracts an array of domains from the network rule modifier.
 *
 * @param {agtree.Modifier} modifier - The modifier that contains the domains.
 * @returns {Array<RuleDomain>} The list of domains extracted from the modifier.
 */
function extractModifierDomains(modifier) {
    if (!modifier.value.value) {
        return [];
    }

    const domainList = agtree.DomainListParser.parse(modifier.value.value, agtree.PIPE_MODIFIER_SEPARATOR);
    return domainList.children.map((domain) => {
        return {
            domain: domain.value,
            negated: domain.exception,
        };
    });
}

/**
 * Extracts domains from a network rule AST.
 *
 * @param {agtree.NetworkRule} ast - The AST of a network rule to extract
 * domains from.
 * @returns {Array<string>} The list of all domains that are used by this rule.
 */
function extractNetworkRuleDomains(ast) {
    const domains = [];

    const patternDomain = extractDomainFromPattern(ast);
    if (patternDomain) {
        domains.push(patternDomain);
    }

    if (!ast.modifiers) {
        // No modifiers in the rule, return right away.
        return domains;
    }

    for (let i = 0; i < ast.modifiers.children.length; i += 1) {
        const modifier = ast.modifiers.children[i];

        if (DOMAIN_MODIFIERS.includes(modifier.modifier.value)) {
            const modifierDomains = extractModifierDomains(modifier)
                .map((domain) => domain.domain);

            domains.push(...modifierDomains);
        }
    }

    return utils.unique(domains).filter(utils.validDomain);
}

/**
 * Extracts domains from a cosmetic rule AST.
 *
 * @param {agtree.CosmeticRule} ast - The AST of a cosmetic rule to extract
 * domains from.
 * @returns {Array<string>} The list of all domains that are used by this rule.
 */
function extractCosmeticRuleDomains(ast) {
    // TODO(ameshkov): Extract and analyze cosmetic rules modifiers too.

    if (!ast.domains || ast.domains.length === 0) {
        return [];
    }

    const domains = ast.domains.children
        .map((domain) => domain.value)
        .filter(utils.validDomain);

    return utils.unique(domains);
}

/**
 * This function goes through the rule AST and extracts domains from it.
 *
 * @param {agtree.AnyRule} ast - The AST of the rule to extract domains from.
 * @returns {Array<string>} The list of all domains that are used by this rule.
 */
function extractRuleDomains(ast) {
    switch (ast.category) {
        case 'Network':
            return extractNetworkRuleDomains(ast);
        case 'Cosmetic':
            return extractCosmeticRuleDomains(ast);
        default:
            return [];
    }
}

/**
 * Modifies the cosmetic rule AST and removes the rule elements that contain the
 * dead domains.
 *
 * @param {agtree.CosmeticRule} ast - The network rule AST to modify and remove
 * dead domains.
 * @param {Array<string>} deadDomains - A list of dead domains.
 *
 * @returns {agtree.AnyRule|null} Returns AST of the rule text with suggested
 * modification. Returns null if the rule must be removed.
 */
function modifyCosmeticRule(ast, deadDomains) {
    if (!ast.domains || ast.domains.children.length === 0) {
        // Do nothing if there are no domains in the rule. In theory, it
        // shouldn't happen, but check it just in case.
        return ast;
    }

    const newAst = structuredClone(ast);

    const hasPermittedDomains = newAst.domains.children.some((domain) => !domain.exception);

    // Go through ast.domains and remove those that contain dead domains.
    // Iterate in the reverse order to keep the indices correct.
    for (let i = newAst.domains.children.length - 1; i >= 0; i -= 1) {
        const domain = newAst.domains.children[i];

        if (deadDomains.includes(domain.value)) {
            newAst.domains.children.splice(i, 1);
        }
    }

    const hasPermittedDomainsAfterFilter = newAst.domains.children.some((domain) => !domain.exception);
    if (hasPermittedDomains && !hasPermittedDomainsAfterFilter) {
        // Suggest removing the whole rule if it had permitted domains before,
        // but does not have it anymore.
        //
        // Example:
        // example.org##banner -> ##banner
        //
        // The rule must be removed in this case as otherwise its
        // scope will change to global.
        return null;
    }

    if (newAst.domains.children.length === 0 && newAst.exception) {
        // Suggest removing the whole rule if this is an exception rule.
        //
        // Example:
        // example.org#@#banner -> #@#banner
        return null;
    }

    // Update raws because it can be used to serialize the filter list back when
    // applying changes.
    newAst.raws.text = agtree.RuleParser.generate(newAst);

    return newAst;
}

/**
 * Modifies the network rule AST and removes the rule elements that contain the
 * dead domains.
 *
 * @param {agtree.NetworkRule} ast - The network rule AST to modify and remove
 * dead domains.
 * @param {Array<string>} deadDomains - A list of dead domains.
 *
 * @returns {agtree.AnyRule|null} Returns AST of the rule text with suggested
 * modification. Returns null if the rule must be removed.
 */
function modifyNetworkRule(ast, deadDomains) {
    const patternDomain = extractDomainFromPattern(ast);
    if (deadDomains.includes(patternDomain)) {
        // Suggest completely removing the rule if it contains a dead domain in
        // the pattern.
        return null;
    }

    if (!ast.modifiers) {
        // No modifiers in the rule, nothing to do.
        return ast;
    }

    // Clone the AST and apply all modifications to the cloned version.
    const newAst = structuredClone(ast);

    const modifierIdxToRemove = [];

    // Go through the network rule modifiers and remove the dead domains from
    // them. Depending on the result, remove the whole modifier or even suggest
    // removing the whole rule.
    for (let i = 0; i < newAst.modifiers.children.length; i += 1) {
        const modifier = newAst.modifiers.children[i];

        if (DOMAIN_MODIFIERS.includes(modifier.modifier.value)) {
            const modifierDomains = extractModifierDomains(modifier);

            // Check if modifierDomains had at least one non-negated domain.
            const hasPermittedDomains = modifierDomains.some((domain) => !domain.negated);

            // Remove the dead domains from the modifier.
            const filteredDomains = modifierDomains.filter(
                (domain) => !deadDomains.includes(domain.domain),
            );

            // Check if filteredDomains now has at least one non-negated domain.
            const hasPermittedDomainsAfterFilter = filteredDomains.some((domain) => !domain.negated);

            if (hasPermittedDomains && !hasPermittedDomainsAfterFilter) {
                // Suggest completely removing the rule if there are no
                // permitted domains left now.
                //
                // Example:
                // ||example.org^$domain=example.org -> ||example.org^
                //
                // The rule must be removed in this case as otherwise its
                // scope will change to global.
                return null;
            }

            if (filteredDomains.length === 0) {
                modifierIdxToRemove.push(i);
            }

            // TODO(ameshkov): Refactor extractModifierDomains so that we could
            // use DomainListParser.generate here.
            modifier.value.value = filteredDomains.map(
                (domain) => {
                    return domain.negated ? `${agtree.NEGATION_MARKER}${domain.domain}` : domain.domain;
                },
            ).join(agtree.PIPE_MODIFIER_SEPARATOR);
        }
    }

    // If there were any modifiers that should be removed, remove them.
    if (modifierIdxToRemove.length > 0) {
        // Remove the modifiers in reverse order to keep the indices correct.
        for (let i = modifierIdxToRemove.length - 1; i >= 0; i -= 1) {
            newAst.modifiers.children.splice(modifierIdxToRemove[i], 1);
        }
    }

    if (newAst.modifiers.children.length === 0) {
        // No modifiers left in the rule, make the whole node undefined.
        newAst.modifiers = undefined;
    }

    newAst.raws.text = agtree.RuleParser.generate(newAst);

    return newAst;
}

/**
 * Modifies the rule AST and removes the rule elements that contain the dead
 * domains.
 *
 * @param {agtree.AnyRule} ast - The rule AST to modify and remove dead domains.
 * @param {Array<string>} deadDomains - A list of dead domains.
 *
 * @returns {agtree.AnyRule|null} Returns AST of the rule text with suggested
 * modification. Returns null if the rule must be removed.
 * @throws {Error} Throws an error if the rule AST if for unexpected category.
 */
function modifyRule(ast, deadDomains) {
    switch (ast.category) {
        case 'Network':
            return modifyNetworkRule(ast, deadDomains);
        case 'Cosmetic':
            return modifyCosmeticRule(ast, deadDomains);
        default:
            throw new Error(`Unsupported rule category: ${ast.category}`);
    }
}

// Cache for the results of the domains check. The key is the domain name, the
// value is true for alive domains, false for dead.
const domainsCheckCache = {};

/**
 * Goes through the list of domains that needs to be checked and uses the
 * urlfilter web service to check which of them are dead.
 *
 * @param {Array<string>} domains - Parts of the rule with domains.
 * @param {LintOptions} options - Configuration for the linting process.
 * @returns {Promise<Array<string>>} A list of dead domains.
 */
async function findDeadDomains(domains, options) {
    const deadDomains = [];
    const domainsToCheck = [];

    // If we have a pre-defined list of domains, skip all other checks and just
    // go through it.
    if (options.deadDomains && options.deadDomains.length > 0) {
        domains.forEach((domain) => {
            if (options.deadDomains.includes(domain)) {
                deadDomains.push(domain);
            }
        });

        return utils.unique(deadDomains);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const domain of utils.unique(domains)) {
        if (Object.prototype.hasOwnProperty.call(domainsCheckCache, domain)) {
            if (domainsCheckCache[domain] === false) {
                deadDomains.push(domain);
            }
        } else {
            domainsToCheck.push(domain);
        }
    }

    const checkResult = await urlfilter.findDeadDomains(domainsToCheck);

    if (options.useDNS) {
        // eslint-disable-next-line no-restricted-syntax
        for (const domain of checkResult) {
            // eslint-disable-next-line no-await-in-loop
            const dnsRecordExists = await dnscheck.checkDomain(domain);

            if (!dnsRecordExists) {
                deadDomains.push(domain);
            }
        }
    } else {
        deadDomains.push(...checkResult);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const domain of domainsToCheck) {
        if (deadDomains.includes(domain)) {
            domainsCheckCache[domain] = false;
        } else {
            domainsCheckCache[domain] = true;
        }
    }

    return deadDomains;
}

/**
 * Configures the linting process.
 *
 * @typedef {object} LintOptions
 *
 * @property {boolean} useDNS - If true, use a DNS query to doublecheck domains
 * returned by the urlfilter web service.
 * @property {Array<string>} deadDomains - Pre-defined list of dead domains. If
 * it is specified, skip all other checks.
 */

/**
 * Result of the dead domains check. Contains the list of dead domains found
 * in the rule and the suggested rule text after removing dead domains.
 *
 * @typedef {object} LinterResult
 *
 * @property {agtree.AnyRule|null} suggestedRule - AST of the suggested rule
 * after removing dead domains. If the whole rule should be removed, this field
 * is null.
 * @property {Array<string>} deadDomains - A list of dead domains in the rule.
 */

/**
 * This function parses the input rule, extracts all domain names that can be
 * found there and checks if they are alive using the urlfilter web service.
 *
 * @param {string} ast - AST of the rule that we're going to check.
 * @param {LintOptions} options - Configuration for the linting process.
 * @returns {Promise<LinterResult|null>} Result of the rule linting.
 */
async function lintRule(ast, options) {
    const domains = extractRuleDomains(ast);
    if (!domains || domains.length === 0) {
        return null;
    }

    const deadDomains = await findDeadDomains(domains, options);

    if (!deadDomains || deadDomains.length === 0) {
        return null;
    }

    const suggestedRule = modifyRule(ast, deadDomains);

    return {
        suggestedRule,
        deadDomains,
    };
}

module.exports = { lintRule };
