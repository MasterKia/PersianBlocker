/**
 * @file Constant values used by all parts of the library
 */

export const REPO_URL = 'https://github.com/AdguardTeam/AGLint';

// General
export const EMPTY = '';
export const SPACE = ' ';
export const TAB = '\t';

export const COLON = ':';
export const COMMA = ',';
export const DOT = '.';
export const SEMICOLON = ';';

export const AMPERSAND = '&';
export const ASTERISK = '*';
export const AT_SIGN = '@';
export const BACKTICK = '`';
export const CARET = '^';
export const DOLLAR_SIGN = '$';
export const EQUALS = '=';
export const EXCLAMATION_MARK = '!';
export const GREATER_THAN = '>';
export const HASHMARK = '#';
export const LESS_THAN = '<';
export const MINUS = '-';
export const PERCENT = '%';
export const PIPE = '|';
export const PLUS = '+';
export const QUESTION_MARK = '?';
export const SLASH = '/';
export const TILDE = '~';
export const UNDERSCORE = '_';

// Escape characters
export const BACKSLASH = '\\';
export const ESCAPE_CHARACTER = BACKSLASH;

// Newlines
export const CR = '\r';
export const FF = '\f';
export const LF = '\n';
export const CRLF = CR + LF;
export const DOUBLE_NEWLINE = '\n\n';
export const NEWLINE = LF;

// Quotes
export const BACKTICK_QUOTE = '`';
export const DOUBLE_QUOTE = '"';
export const SINGLE_QUOTE = '\'';

// Brackets
export const OPEN_PARENTHESIS = '(';
export const CLOSE_PARENTHESIS = ')';

export const OPEN_SQUARE_BRACKET = '[';
export const CLOSE_SQUARE_BRACKET = ']';

export const OPEN_CURLY_BRACKET = '{';
export const CLOSE_CURLY_BRACKET = '}';

// Operators
export const ASSIGN_OPERATOR = EQUALS;

// Letters
export const SMALL_LETTER_A = 'a';
export const SMALL_LETTER_B = 'b';
export const SMALL_LETTER_C = 'c';
export const SMALL_LETTER_D = 'd';
export const SMALL_LETTER_E = 'e';
export const SMALL_LETTER_F = 'f';
export const SMALL_LETTER_G = 'g';
export const SMALL_LETTER_H = 'h';
export const SMALL_LETTER_I = 'i';
export const SMALL_LETTER_J = 'j';
export const SMALL_LETTER_K = 'k';
export const SMALL_LETTER_L = 'l';
export const SMALL_LETTER_M = 'm';
export const SMALL_LETTER_N = 'n';
export const SMALL_LETTER_O = 'o';
export const SMALL_LETTER_P = 'p';
export const SMALL_LETTER_Q = 'q';
export const SMALL_LETTER_R = 'r';
export const SMALL_LETTER_S = 's';
export const SMALL_LETTER_T = 't';
export const SMALL_LETTER_U = 'u';
export const SMALL_LETTER_V = 'v';
export const SMALL_LETTER_W = 'w';
export const SMALL_LETTER_X = 'x';
export const SMALL_LETTER_Y = 'y';
export const SMALL_LETTER_Z = 'z';

// Capital letters
export const CAPITAL_LETTER_A = 'A';
export const CAPITAL_LETTER_B = 'B';
export const CAPITAL_LETTER_C = 'C';
export const CAPITAL_LETTER_D = 'D';
export const CAPITAL_LETTER_E = 'E';
export const CAPITAL_LETTER_F = 'F';
export const CAPITAL_LETTER_G = 'G';
export const CAPITAL_LETTER_H = 'H';
export const CAPITAL_LETTER_I = 'I';
export const CAPITAL_LETTER_J = 'J';
export const CAPITAL_LETTER_K = 'K';
export const CAPITAL_LETTER_L = 'L';
export const CAPITAL_LETTER_M = 'M';
export const CAPITAL_LETTER_N = 'N';
export const CAPITAL_LETTER_O = 'O';
export const CAPITAL_LETTER_P = 'P';
export const CAPITAL_LETTER_Q = 'Q';
export const CAPITAL_LETTER_R = 'R';
export const CAPITAL_LETTER_S = 'S';
export const CAPITAL_LETTER_T = 'T';
export const CAPITAL_LETTER_U = 'U';
export const CAPITAL_LETTER_V = 'V';
export const CAPITAL_LETTER_W = 'W';
export const CAPITAL_LETTER_X = 'X';
export const CAPITAL_LETTER_Y = 'Y';
export const CAPITAL_LETTER_Z = 'Z';

// Numbers as strings
export const NUMBER_0 = '0';
export const NUMBER_1 = '1';
export const NUMBER_2 = '2';
export const NUMBER_3 = '3';
export const NUMBER_4 = '4';
export const NUMBER_5 = '5';
export const NUMBER_6 = '6';
export const NUMBER_7 = '7';
export const NUMBER_8 = '8';
export const NUMBER_9 = '9';

export const ADG_SCRIPTLET_MASK = '//scriptlet';
export const UBO_SCRIPTLET_MASK = 'js';

// Modifiers are separated by ",". For example: "script,domain=example.com"
export const MODIFIERS_SEPARATOR = ',';
export const MODIFIER_EXCEPTION_MARKER = '~';
export const MODIFIER_ASSIGN_OPERATOR = '=';

export const DOMAIN_EXCEPTION_MARKER = '~';

/**
 * Classic domain separator.
 *
 * @example
 * ```adblock
 * ! Domains are separated by ",":
 * example.com,~example.org##.ads
 * ```
 */
export const CLASSIC_DOMAIN_SEPARATOR = ',';

/**
 * Modifier domain separator.
 *
 * @example
 * ```adblock
 * ! Domains are separated by "|":
 * ads.js^$script,domains=example.com|~example.org
 * ```
 */
export const MODIFIER_DOMAIN_SEPARATOR = '|';

export const DOMAIN_LIST_TYPE = 'DomainList';

// CSS
export const CSS_CLASS_MARKER = '.';
export const CSS_ID_MARKER = '#';

export const CSS_SELECTORS_SEPARATOR = ',';

export const CSS_MEDIA_MARKER = '@media';

export const CSS_PSEUDO_MARKER = ':';
export const CSS_PSEUDO_OPEN = '(';
export const CSS_PSEUDO_CLOSE = ')';

export const CSS_NOT_PSEUDO = 'not';

export const CSS_BLOCK_OPEN = '{';
export const CSS_BLOCK_CLOSE = '}';

export const CSS_ATTRIBUTE_SELECTOR_OPEN = '[';
export const CSS_ATTRIBUTE_SELECTOR_CLOSE = ']';

export const CSS_IMPORTANT = '!important';
export const CSS_DECLARATION_END = ';';
export const CSS_DECLARATION_SEPARATOR = ':';

export const HINT_MARKER = '!+';
export const HINT_MARKER_LEN = HINT_MARKER.length;

export const NETWORK_RULE_EXCEPTION_MARKER = '@@';
export const NETWORK_RULE_EXCEPTION_MARKER_LEN = NETWORK_RULE_EXCEPTION_MARKER.length;
export const NETWORK_RULE_SEPARATOR = '$';

export const AGLINT_COMMAND_PREFIX = 'aglint';
export const AGLINT_CONFIG_COMMENT_MARKER = '--';

export const PREPROCESSOR_MARKER = '!#';
export const PREPROCESSOR_MARKER_LEN = PREPROCESSOR_MARKER.length;
export const PREPROCESSOR_SEPARATOR = ' ';

export const IF_DIRECTIVE = 'if';
export const ELSE_DIRECTIVE = 'else';
export const ENDIF_DIRECTIVE = 'endif';
export const INCLUDE_DIRECTIVE = 'include';
export const SAFARI_CB_AFFINITY_DIRECTIVE = 'safari_cb_affinity';

export const SUPPORTED_PREPROCESSOR_DIRECTIVES = new Set([
    ELSE_DIRECTIVE,
    ENDIF_DIRECTIVE,
    IF_DIRECTIVE,
    INCLUDE_DIRECTIVE,
    SAFARI_CB_AFFINITY_DIRECTIVE,
]);
