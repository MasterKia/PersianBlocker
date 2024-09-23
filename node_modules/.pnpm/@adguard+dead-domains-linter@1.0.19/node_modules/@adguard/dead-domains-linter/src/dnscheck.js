const dns = require('dns');
const { promisify } = require('util');

const resolver = new dns.Resolver();

// Note, that we don't use AdGuard DNS servers here in order to not add checked
// domains to the next domains snapshot.
//
// TODO(ameshkov): Consider making the DNS server configurable.
resolver.setServers([
    '8.8.8.8',
]);

const resolveAsync = promisify(resolver.resolve).bind(resolver);

/**
 * Checks if the domain has an A record.
 *
 * @param {string} domain - Domain name to check with a DNS query.
 * @returns {Promise<boolean>} Returns true if the domain has an A record.
 */
async function domainExists(domain) {
    try {
        const addresses = await resolveAsync(domain, 'A');

        return addresses.length > 0;
    } catch {
        return false;
    }
}

/**
 * Checks if the domain name exists with one or more DNS queries.
 *
 * @param {string} domain - Domain name to check.
 * @returns {Promise<boolean>} Returns true if the domain is considered alive.
 */
async function checkDomain(domain) {
    let exists = await domainExists(domain);

    if (exists) {
        return true;
    }

    if (domain.startsWith('www.')) {
        // If this is a www. domain name, there's no need to doublecheck it.
        return false;
    }

    // Double-check a www. version of a domain name. We do this because there
    // are some cases when it's necessary:
    // https://github.com/AdguardTeam/DeadDomainsLinter/issues/16
    exists = domainExists(`www.${domain}`);

    return exists;
}

module.exports = {
    checkDomain,
    domainExists,
};
