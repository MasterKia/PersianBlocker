/**
 * @file AGLint version
 */

import { version as importedVersion } from '../package.json';

// ! Notice:
// Don't export version from package.json directly, because if you run
// `tsc` in the root directory, it will generate `dist/types/src/version.d.ts`
// with wrong relative path to `package.json`. So we need this little "hack"
const version = importedVersion;

export { version };
