const dns = require('dns');
const https = require('https');
const fetch = require('node-fetch');

/**
 * This function uses urlfilter.adtidy.org to check if domains are alive or not.
 *
 * @param {Array<string>} domains an array of domains to be analyzed.
 */
const URLFILTER_URL = 'https://urlfilter.adtidy.org/v2/checkDomains?filter=none';
const CHUNK_SIZE = 25;

// When using native node fetch it is easy to run into ENOTFOUND errors when
// there are many parallel requests. In order to avoid that, we use node-fetch
// with a custom DNS lookup function that caches resolution result permanently.
// In addition to that, we use a semaphore-like approach to forbid parallel
// DNS queries.
const dnsProcessing = {};
const dnsCache = {};

/**
 * Custom DNS lookup function that caches resolution result permanently.
 *
 * @param {string} hostname - The hostname to resolve.
 * @param {object} options - The options object.
 * @param {boolean} options.all - If true, return all resolved addresses.
 * @param {Function} cb - The callback function.
 */
function dnsLookup(hostname, options, cb) {
    const cached = dnsCache[hostname];
    if (cached) {
        if (options.all) {
            cb(null, cached);
        } else {
            const addr = cached[0];
            cb(null, addr.address, addr.family);
        }

        return;
    }

    if (dnsProcessing[hostname]) {
        // If a query for this hostname is already processing, wait until it's
        // finished.
        setTimeout(() => {
            dnsLookup(hostname, options, cb);
        }, 10);

        return;
    }

    dnsProcessing[hostname] = true;
    dns.lookup(hostname, { all: true, family: 4 }, (err, addresses) => {
        delete dnsProcessing[hostname];

        if (err === null) {
            dnsCache[hostname] = addresses;
        }

        if (options.all) {
            cb(err, addresses);
        } else {
            const addr = addresses[0];
            cb(err, addr.address, addr.family);
        }
    });
}

/**
 * Removes trailing dot from an fully qualified domain name. The reason for
 * that is that urlfilter service does not know how to work with FQDN.
 *
 * @param {string} domain - The domain name to trim.
 * @returns {string} The domain name without trailing dot.
 */
function trimFqdn(domain) {
    return domain.endsWith('.') ? domain.slice(0, -1) : domain;
}

/**
 * This function looks for dead domains among the specified ones. It uses a web
 * service to do that.
 *
 * @param {Array<string>} domains domains to check.
 * @param {number} chunkSize configures the size of chunks for checking large
 * arrays.
 * @returns {Promise<Array<string>>} returns the list of dead domains.
 */
async function findDeadDomains(domains, chunkSize = CHUNK_SIZE) {
    const result = [];

    // Split the domains array into chunks
    const chunks = [];
    for (let i = 0; i < domains.length; i += chunkSize) {
        chunks.push(domains.slice(i, i + chunkSize));
    }

    // Compose and send requests for each chunk
    // eslint-disable-next-line no-restricted-syntax
    for (const chunk of chunks) {
        const queryParams = chunk.map((domain) => `domain=${encodeURIComponent(trimFqdn(domain))}`).join('&');
        const url = `${URLFILTER_URL}&${queryParams}`;

        try {
            // eslint-disable-next-line no-await-in-loop
            const response = await fetch(url, {
                agent: new https.Agent({
                    keepAlive: true,
                    lookup: dnsLookup,
                }),
            });
            // eslint-disable-next-line no-await-in-loop
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Iterate over the domains in the chunk
            // eslint-disable-next-line no-restricted-syntax
            for (const domain of chunk) {
                const domainData = data[trimFqdn(domain)];
                if (domainData && domainData.info.registered_domain_used_last_24_hours === false) {
                    result.push(domain);
                }
            }
        } catch (ex) {
            // Re-throw to add information about the URL.
            throw new Error(`Failed to fetch from ${url}: ${ex}`);
        }
    }

    return result;
}

module.exports = {
    findDeadDomains,
};
