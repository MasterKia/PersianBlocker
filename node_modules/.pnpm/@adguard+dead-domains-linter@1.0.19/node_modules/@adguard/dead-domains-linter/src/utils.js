const tldts = require('tldts');

/**
 * Helper function that takes an array and returns a new one without any
 * duplicate items.
 *
 * @param {Array<string>} arr - THe array to check for duplicates.
 * @returns {Array<string>} Returns a new array without duplicates.
 */
function unique(arr) {
    return [...new Set([].concat(...arr))];
}

// A list of TLD that we ignore and don't check for existence for technical
// reasons.
const ALLOW_TLD = new Set([
    'onion', // Tor
    'lib', 'coin', 'bazar', 'emc', // EmerCoin
    'bit', // Namecoin
    'sats', 'ord', 'gm', // SATS domains
]);

/**
 * Checks if the given domain is valid for our dead domains check.
 *
 * @param {string} domain - The domain name to check.
 * @returns {boolean} Returns true if the domain is valid, false otherwise.
 */
function validDomain(domain) {
    const result = tldts.parse(domain);

    if (!result?.domain) {
        return false;
    }

    if (result.isIp) {
        // IP addresses cannot be verified too so just ignore them too.
        return false;
    }

    if (ALLOW_TLD.has(result.publicSuffix)) {
        // Do not check TLDs that are in use, but we cannot check them for
        // existence.
        return false;
    }

    if (result.domainWithoutSuffix === '') {
        // Ignore top-level domains to avoid false positives on things like:
        // https://github.com/AdguardTeam/DeadDomainsLinter/issues/6
        return false;
    }

    return true;
}

module.exports = {
    unique,
    validDomain,
};
