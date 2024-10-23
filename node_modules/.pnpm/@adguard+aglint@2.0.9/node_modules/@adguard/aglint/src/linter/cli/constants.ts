export const CONFIG_FILE = 'aglint.config';
export const RC_CONFIG_FILE = '.aglintrc';

export const EXT_JSON = '.json';
export const EXT_YAML = '.yaml';
export const EXT_YML = '.yml';

export const JSON_CONFIG_FILE_NAME = `${CONFIG_FILE}${EXT_JSON}`;
export const YAML_CONFIG_FILE_NAME = `${CONFIG_FILE}${EXT_YAML}`;
export const YML_CONFIG_FILE_NAME = `${CONFIG_FILE}${EXT_YML}`;

export const JSON_RC_CONFIG_FILE_NAME = `${RC_CONFIG_FILE}${EXT_JSON}`;
export const YAML_RC_CONFIG_FILE_NAME = `${RC_CONFIG_FILE}${EXT_YAML}`;
export const YML_RC_CONFIG_FILE_NAME = `${RC_CONFIG_FILE}${EXT_YML}`;

/**
 * Possible names of the config file
 */
export const CONFIG_FILE_NAMES = new Set([
    // aglint.config stuff
    JSON_CONFIG_FILE_NAME,
    YAML_CONFIG_FILE_NAME,
    YML_CONFIG_FILE_NAME,

    // .aglintrc stuff
    RC_CONFIG_FILE,
    JSON_RC_CONFIG_FILE_NAME,
    YAML_RC_CONFIG_FILE_NAME,
    YML_RC_CONFIG_FILE_NAME,
]);

/**
 * Name of the ignore file
 */
export const IGNORE_FILE_NAME = '.aglintignore';

/**
 * Supported file extensions for lintable files. Text is the most important one, but we also
 * support other possible extensions, which may occur in some cases.
 */
export const SUPPORTED_EXTENSIONS = new Set([
    '.txt',
    '.adblock',
    '.adguard',
    '.ublock',
]);

/**
 * Problematic paths that should be ignored by default. This is essential to provide a good
 * experience for the user.
 */
export const PROBLEMATIC_PATHS = [
    'node_modules',
    '.git',
    '.hg',
    '.svn',
    '.DS_Store',
    'Thumbs.db',
];
