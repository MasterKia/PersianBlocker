/*
 * AGTree v1.1.8 (build date: Wed, 24 Apr 2024 15:20:41 GMT)
 * (c) 2024 Adguard Software Ltd.
 * Released under the MIT license
 * https://github.com/AdguardTeam/tsurlfilter/tree/master/packages/agtree#readme
 */
import valid from 'semver/functions/valid.js';
import coerce from 'semver/functions/coerce.js';
import JSON5 from 'json5';
import { walk, parse, toPlainObject, find, generate, List, fromPlainObject } from '@adguard/ecss-tree';
import * as ecssTree from '@adguard/ecss-tree';
export { ecssTree as ECSSTree };
import cloneDeep from 'clone-deep';
import XRegExp from 'xregexp';
import { parse as parse$1 } from 'tldts';
import scriptlets from '@adguard/scriptlets';

/**
 * @file Possible adblock syntaxes are listed here.
 */
/**
 * Possible adblock syntaxes (supported by this library)
 */
var AdblockSyntax;
(function (AdblockSyntax) {
    /**
     * Common syntax, which is supported by more than one adblocker (or by all adblockers).
     *
     * We typically use this syntax when we cannot determine the concrete syntax of the rule,
     * because the syntax is used by more than one adblocker natively.
     *
     * @example
     * - `||example.org^$important` is a common syntax, since it is used by all adblockers natively, and
     * we cannot determine at parsing level whether `important` is a valid option or not, and if it is valid,
     * then which adblocker supports it.
     */
    AdblockSyntax["Common"] = "Common";
    /**
     * Adblock Plus syntax.
     *
     * @example
     * - `example.org#$#abort-on-property-read alert` is an Adblock Plus syntax, since it is not used by any other
     * adblockers directly (probably supported by some on-the-fly conversion, but this is not the native syntax).
     * @see {@link https://adblockplus.org/}
     */
    AdblockSyntax["Abp"] = "AdblockPlus";
    /**
     * uBlock Origin syntax.
     *
     * @example
     * - `example.com##+js(set, atob, noopFunc)` is an uBlock Origin syntax, since it is not used by any other
     * adblockers directly (probably supported by some on-the-fly conversion, but this is not the native syntax).
     * @see {@link https://github.com/gorhill/uBlock}
     */
    AdblockSyntax["Ubo"] = "UblockOrigin";
    /**
     * AdGuard syntax.
     *
     * @example
     * - `example.org#%#//scriptlet("abort-on-property-read", "alert")` is an AdGuard syntax, since it is not used
     * by any other adblockers directly (probably supported by some on-the-fly conversion, but this is not the native
     * syntax).
     * @see {@link https://adguard.com/}
     */
    AdblockSyntax["Adg"] = "AdGuard";
})(AdblockSyntax || (AdblockSyntax = {}));

/**
 * @file Constant values used by all parts of the library
 */
// General
/**
 * Empty string.
 */
const EMPTY = '';
const SPACE = ' ';
const TAB = '\t';
const COLON = ':';
const COMMA = ',';
const DOT = '.';
const SEMICOLON = ';';
const AMPERSAND = '&';
const ASTERISK = '*';
const AT_SIGN = '@';
const CARET = '^';
const DOLLAR_SIGN = '$';
const EQUALS = '=';
const EXCLAMATION_MARK = '!';
const HASHMARK = '#';
const PIPE = '|';
const PLUS = '+';
const QUESTION_MARK = '?';
const SLASH = '/';
const UNDERSCORE = '_';
// Escape characters
const BACKSLASH = '\\';
const ESCAPE_CHARACTER = BACKSLASH;
// Newlines
const CR = '\r';
const FF = '\f';
const LF = '\n';
const CRLF = CR + LF;
const NEWLINE = LF;
const DOUBLE_QUOTE = '"';
const SINGLE_QUOTE = '\'';
// Brackets
const OPEN_PARENTHESIS = '(';
const CLOSE_PARENTHESIS = ')';
const OPEN_SQUARE_BRACKET = '[';
const CLOSE_SQUARE_BRACKET = ']';
const OPEN_CURLY_BRACKET = '{';
const CLOSE_CURLY_BRACKET = '}';
// Letters
const SMALL_LETTER_A = 'a';
const SMALL_LETTER_B = 'b';
const SMALL_LETTER_C = 'c';
const SMALL_LETTER_D = 'd';
const SMALL_LETTER_E = 'e';
const SMALL_LETTER_F = 'f';
const SMALL_LETTER_G = 'g';
const SMALL_LETTER_H = 'h';
const SMALL_LETTER_I = 'i';
const SMALL_LETTER_J = 'j';
const SMALL_LETTER_K = 'k';
const SMALL_LETTER_L = 'l';
const SMALL_LETTER_M = 'm';
const SMALL_LETTER_N = 'n';
const SMALL_LETTER_O = 'o';
const SMALL_LETTER_P = 'p';
const SMALL_LETTER_Q = 'q';
const SMALL_LETTER_R = 'r';
const SMALL_LETTER_S = 's';
const SMALL_LETTER_T = 't';
const SMALL_LETTER_U = 'u';
const SMALL_LETTER_V = 'v';
const SMALL_LETTER_W = 'w';
const SMALL_LETTER_X = 'x';
const SMALL_LETTER_Y = 'y';
const SMALL_LETTER_Z = 'z';
/**
 * Set of all small letters.
 */
const SMALL_LETTERS = new Set([
    SMALL_LETTER_A,
    SMALL_LETTER_B,
    SMALL_LETTER_C,
    SMALL_LETTER_D,
    SMALL_LETTER_E,
    SMALL_LETTER_F,
    SMALL_LETTER_G,
    SMALL_LETTER_H,
    SMALL_LETTER_I,
    SMALL_LETTER_J,
    SMALL_LETTER_K,
    SMALL_LETTER_L,
    SMALL_LETTER_M,
    SMALL_LETTER_N,
    SMALL_LETTER_O,
    SMALL_LETTER_P,
    SMALL_LETTER_Q,
    SMALL_LETTER_R,
    SMALL_LETTER_S,
    SMALL_LETTER_T,
    SMALL_LETTER_U,
    SMALL_LETTER_V,
    SMALL_LETTER_W,
    SMALL_LETTER_X,
    SMALL_LETTER_Y,
    SMALL_LETTER_Z,
]);
// Capital letters
const CAPITAL_LETTER_A = 'A';
const CAPITAL_LETTER_B = 'B';
const CAPITAL_LETTER_C = 'C';
const CAPITAL_LETTER_D = 'D';
const CAPITAL_LETTER_E = 'E';
const CAPITAL_LETTER_F = 'F';
const CAPITAL_LETTER_G = 'G';
const CAPITAL_LETTER_H = 'H';
const CAPITAL_LETTER_I = 'I';
const CAPITAL_LETTER_J = 'J';
const CAPITAL_LETTER_K = 'K';
const CAPITAL_LETTER_L = 'L';
const CAPITAL_LETTER_M = 'M';
const CAPITAL_LETTER_N = 'N';
const CAPITAL_LETTER_O = 'O';
const CAPITAL_LETTER_P = 'P';
const CAPITAL_LETTER_Q = 'Q';
const CAPITAL_LETTER_R = 'R';
const CAPITAL_LETTER_S = 'S';
const CAPITAL_LETTER_T = 'T';
const CAPITAL_LETTER_U = 'U';
const CAPITAL_LETTER_V = 'V';
const CAPITAL_LETTER_W = 'W';
const CAPITAL_LETTER_X = 'X';
const CAPITAL_LETTER_Y = 'Y';
const CAPITAL_LETTER_Z = 'Z';
/**
 * Set of all capital letters.
 */
const CAPITAL_LETTERS = new Set([
    CAPITAL_LETTER_A,
    CAPITAL_LETTER_B,
    CAPITAL_LETTER_C,
    CAPITAL_LETTER_D,
    CAPITAL_LETTER_E,
    CAPITAL_LETTER_F,
    CAPITAL_LETTER_G,
    CAPITAL_LETTER_H,
    CAPITAL_LETTER_I,
    CAPITAL_LETTER_J,
    CAPITAL_LETTER_K,
    CAPITAL_LETTER_L,
    CAPITAL_LETTER_M,
    CAPITAL_LETTER_N,
    CAPITAL_LETTER_O,
    CAPITAL_LETTER_P,
    CAPITAL_LETTER_Q,
    CAPITAL_LETTER_R,
    CAPITAL_LETTER_S,
    CAPITAL_LETTER_T,
    CAPITAL_LETTER_U,
    CAPITAL_LETTER_V,
    CAPITAL_LETTER_W,
    CAPITAL_LETTER_X,
    CAPITAL_LETTER_Y,
    CAPITAL_LETTER_Z,
]);
// Numbers as strings
const NUMBER_0 = '0';
const NUMBER_1 = '1';
const NUMBER_2 = '2';
const NUMBER_3 = '3';
const NUMBER_4 = '4';
const NUMBER_5 = '5';
const NUMBER_6 = '6';
const NUMBER_7 = '7';
const NUMBER_8 = '8';
const NUMBER_9 = '9';
/**
 * Set of all numbers as strings.
 */
const NUMBERS = new Set([
    NUMBER_0,
    NUMBER_1,
    NUMBER_2,
    NUMBER_3,
    NUMBER_4,
    NUMBER_5,
    NUMBER_6,
    NUMBER_7,
    NUMBER_8,
    NUMBER_9,
]);
const REGEX_MARKER = '/';
const ADG_SCRIPTLET_MASK = '//scriptlet';
const UBO_SCRIPTLET_MASK = 'js';
// Modifiers are separated by ",". For example: "script,domain=example.com"
const MODIFIERS_SEPARATOR = ',';
const MODIFIER_ASSIGN_OPERATOR = '=';
const NEGATION_MARKER = '~';
/**
 * The wildcard symbol — `*`.
 */
const WILDCARD = ASTERISK;
/**
 * Classic domain separator.
 *
 * @example
 * ```adblock
 * ! Domains are separated by ",":
 * example.com,~example.org##.ads
 * ```
 */
const COMMA_DOMAIN_LIST_SEPARATOR = ',';
/**
 * Modifier separator for $app, $denyallow, $domain, $method.
 *
 * @example
 * ```adblock
 * ! Domains are separated by "|":
 * ads.js^$script,domains=example.com|~example.org
 * ```
 */
const PIPE_MODIFIER_SEPARATOR = '|';
const CSS_IMPORTANT = '!important';
const HINT_MARKER = '!+';
const HINT_MARKER_LEN = HINT_MARKER.length;
const NETWORK_RULE_EXCEPTION_MARKER = '@@';
const NETWORK_RULE_EXCEPTION_MARKER_LEN = NETWORK_RULE_EXCEPTION_MARKER.length;
const NETWORK_RULE_SEPARATOR = '$';
const AGLINT_COMMAND_PREFIX = 'aglint';
const AGLINT_CONFIG_COMMENT_MARKER = '--';
const PREPROCESSOR_MARKER = '!#';
const PREPROCESSOR_MARKER_LEN = PREPROCESSOR_MARKER.length;
const PREPROCESSOR_SEPARATOR = ' ';
const SAFARI_CB_AFFINITY = 'safari_cb_affinity';
const IF = 'if';
const INCLUDE = 'include';

/**
 * @file Utility functions for location and location range management.
 */
/**
 * Shifts the specified location by the specified offset.
 *
 * @param loc Location to shift
 * @param offset Offset to shift by
 * @returns Location shifted by the specified offset
 */
function shiftLoc(loc, offset) {
    return {
        offset: loc.offset + offset,
        line: loc.line,
        column: loc.column + offset,
    };
}
/**
 * Calculates a location range from the specified base location and offsets.
 *
 * Since every adblock rule is a single line, the start and end locations
 * of the range will have the same line, no need to calculate it here.
 *
 * @param loc Base location
 * @param startOffset Start offset
 * @param endOffset End offset
 * @returns Calculated location range
 */
function locRange(loc, startOffset, endOffset) {
    return {
        start: shiftLoc(loc, startOffset),
        end: shiftLoc(loc, endOffset),
    };
}

/**
 * @file Utility functions for string manipulation.
 */
const SINGLE_QUOTE_MARKER = "'";
const DOUBLE_QUOTE_MARKER = '"';
class StringUtils {
    /**
     * Finds the first occurrence of a character that:
     * - isn't preceded by an escape character
     *
     * @param pattern - Source pattern
     * @param searchedCharacter - Searched character
     * @param start - Start index
     * @param escapeCharacter - Escape character, \ by default
     * @returns Index or -1 if the character not found
     */
    static findNextUnescapedCharacter(pattern, searchedCharacter, start = 0, escapeCharacter = ESCAPE_CHARACTER) {
        for (let i = start; i < pattern.length; i += 1) {
            // The searched character cannot be preceded by an escape
            if (pattern[i] === searchedCharacter && pattern[i - 1] !== escapeCharacter) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Finds the last occurrence of a character that:
     * - isn't preceded by an escape character
     *
     * @param pattern - Source pattern
     * @param searchedCharacter - Searched character
     * @param escapeCharacter - Escape character, \ by default
     * @returns Index or -1 if the character not found
     */
    static findLastUnescapedCharacter(pattern, searchedCharacter, escapeCharacter = ESCAPE_CHARACTER) {
        for (let i = pattern.length - 1; i >= 0; i -= 1) {
            // The searched character cannot be preceded by an escape
            if (pattern[i] === searchedCharacter && pattern[i - 1] !== escapeCharacter) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Finds the next occurrence of a character that:
     * - isn't preceded by an escape character
     * - isn't followed by the specified character
     *
     * @param pattern - Source pattern
     * @param start - Start index
     * @param searchedCharacter - Searched character
     * @param notFollowedBy - Searched character not followed by this character
     * @param escapeCharacter - Escape character, \ by default
     * @returns Index or -1 if the character not found
     */
    static findNextUnescapedCharacterThatNotFollowedBy(pattern, start, searchedCharacter, notFollowedBy, escapeCharacter = ESCAPE_CHARACTER) {
        for (let i = start; i < pattern.length; i += 1) {
            // The searched character cannot be preceded by an escape
            if (pattern[i] === searchedCharacter
                && pattern[i + 1] !== notFollowedBy
                && pattern[i - 1] !== escapeCharacter) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Finds the last occurrence of a character that:
     * - isn't preceded by an escape character
     * - isn't followed by the specified character
     *
     * @param pattern - Source pattern
     * @param searchedCharacter - Searched character
     * @param notFollowedBy - Searched character not followed by this character
     * @param escapeCharacter - Escape character, \ by default
     * @returns Index or -1 if the character not found
     */
    static findLastUnescapedCharacterThatNotFollowedBy(pattern, searchedCharacter, notFollowedBy, escapeCharacter = ESCAPE_CHARACTER) {
        for (let i = pattern.length - 1; i >= 0; i -= 1) {
            // The searched character cannot be preceded by an escape
            if (pattern[i] === searchedCharacter
                && pattern[i + 1] !== notFollowedBy
                && pattern[i - 1] !== escapeCharacter) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Finds the next occurrence of a character that:
     * - isn't part of any string literal ('literal' or "literal")
     * - isn't part of any RegExp expression (/regexp/)
     *
     * @param pattern - Source pattern
     * @param searchedCharacter - Searched character
     * @param start - Start index
     * @returns Index or -1 if the character not found
     */
    static findUnescapedNonStringNonRegexChar(pattern, searchedCharacter, start = 0) {
        let open = null;
        for (let i = start; i < pattern.length; i += 1) {
            if ((pattern[i] === SINGLE_QUOTE_MARKER
                || pattern[i] === DOUBLE_QUOTE_MARKER
                || pattern[i] === REGEX_MARKER)
                && pattern[i - 1] !== ESCAPE_CHARACTER) {
                if (open === pattern[i]) {
                    open = null;
                }
                else if (open === null) {
                    open = pattern[i];
                }
            }
            else if (open === null && pattern[i] === searchedCharacter && pattern[i - 1] !== ESCAPE_CHARACTER) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Finds the next occurrence of a character that:
     * - isn't part of any string literal ('literal' or "literal")
     * - isn't preceded by an escape character
     *
     * @param pattern - Source pattern
     * @param searchedCharacter - Searched character
     * @param start - Start index
     * @param escapeCharacter - Escape character, \ by default
     * @returns Index or -1 if the character not found
     */
    static findNextUnquotedUnescapedCharacter(pattern, searchedCharacter, start = 0, escapeCharacter = ESCAPE_CHARACTER) {
        let openQuote = null;
        for (let i = start; i < pattern.length; i += 1) {
            // Unescaped ' or "
            if ((pattern[i] === SINGLE_QUOTE_MARKER || pattern[i] === DOUBLE_QUOTE_MARKER)
                && pattern[i - 1] !== escapeCharacter) {
                if (!openQuote)
                    openQuote = pattern[i];
                else if (openQuote === pattern[i])
                    openQuote = null;
            }
            else if (pattern[i] === searchedCharacter && pattern[i - 1] !== escapeCharacter) {
                // Unescaped character
                if (!openQuote) {
                    return i;
                }
            }
        }
        return -1;
    }
    /**
     * Finds the next occurrence of a character that:
     * - isn't "bracketed"
     * - isn't preceded by an escape character
     *
     * @param pattern - Source pattern
     * @param searchedCharacter - Searched character
     * @param start - Start index
     * @param escapeCharacter - Escape character, \ by default
     * @param openBracket - Open bracket, ( by default
     * @param closeBracket - Close bracket, ( by default
     * @throws If the opening and closing brackets are the same
     * @returns Index or -1 if the character not found
     */
    static findNextNotBracketedUnescapedCharacter(pattern, searchedCharacter, start = 0, escapeCharacter = ESCAPE_CHARACTER, openBracket = '(', closeBracket = ')') {
        if (openBracket === closeBracket) {
            throw new Error('Open and close bracket cannot be the same');
        }
        let depth = 0;
        for (let i = start; i < pattern.length; i += 1) {
            if (pattern[i] === openBracket) {
                depth += 1;
            }
            else if (pattern[i] === closeBracket) {
                depth -= 1;
            }
            else if (depth < 1 && pattern[i] === searchedCharacter && pattern[i - 1] !== escapeCharacter) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Splits the source pattern along characters that:
     * - isn't part of any string literal ('literal' or "literal")
     * - isn't preceded by an escape character
     *
     * @param pattern - Source pattern
     * @param delimeterCharacter - Delimeter character
     * @returns Splitted string
     */
    static splitStringByUnquotedUnescapedCharacter(pattern, delimeterCharacter) {
        const parts = [];
        let delimeterIndex = -1;
        do {
            const prevDelimeterIndex = delimeterIndex;
            delimeterIndex = StringUtils.findNextUnquotedUnescapedCharacter(pattern, delimeterCharacter, delimeterIndex + 1);
            if (delimeterIndex !== -1) {
                parts.push(pattern.substring(prevDelimeterIndex + 1, delimeterIndex));
            }
            else {
                parts.push(pattern.substring(prevDelimeterIndex + 1, pattern.length));
            }
        } while (delimeterIndex !== -1);
        return parts;
    }
    /**
     * Splits the source pattern along characters that:
     * - isn't part of any string literal ('literal' or "literal")
     * - isn't part of any RegExp expression (/regexp/)
     * - isn't preceded by an escape character
     *
     * @param pattern - Source pattern
     * @param delimeterCharacter - Delimeter character
     * @returns Splitted string
     */
    static splitStringByUnescapedNonStringNonRegexChar(pattern, delimeterCharacter) {
        const parts = [];
        let delimeterIndex = -1;
        do {
            const prevDelimeterIndex = delimeterIndex;
            delimeterIndex = StringUtils.findUnescapedNonStringNonRegexChar(pattern, delimeterCharacter, delimeterIndex + 1);
            if (delimeterIndex !== -1) {
                parts.push(pattern.substring(prevDelimeterIndex + 1, delimeterIndex));
            }
            else {
                parts.push(pattern.substring(prevDelimeterIndex + 1, pattern.length));
            }
        } while (delimeterIndex !== -1);
        return parts;
    }
    /**
     * Splits the source pattern along characters that:
     * - isn't preceded by an escape character
     *
     * @param pattern - Source pattern
     * @param delimeterCharacter - Delimeter character
     * @returns Splitted string
     */
    static splitStringByUnescapedCharacter(pattern, delimeterCharacter) {
        const parts = [];
        let delimeterIndex = -1;
        do {
            const prevDelimeterIndex = delimeterIndex;
            delimeterIndex = StringUtils.findNextUnescapedCharacter(pattern, delimeterCharacter, delimeterIndex + 1);
            if (delimeterIndex !== -1) {
                parts.push(pattern.substring(prevDelimeterIndex + 1, delimeterIndex));
            }
            else {
                parts.push(pattern.substring(prevDelimeterIndex + 1, pattern.length));
            }
        } while (delimeterIndex !== -1);
        return parts;
    }
    /**
     * Determines whether the given character is a space or tab character.
     *
     * @param char - The character to check.
     * @returns true if the given character is a space or tab character, false otherwise.
     */
    static isWhitespace(char) {
        return char === SPACE || char === TAB;
    }
    /**
     * Checks if the given character is a digit.
     *
     * @param char The character to check.
     * @returns `true` if the given character is a digit, `false` otherwise.
     */
    static isDigit(char) {
        return char >= NUMBER_0 && char <= NUMBER_9;
    }
    /**
     * Checks if the given character is a small letter.
     *
     * @param char The character to check.
     * @returns `true` if the given character is a small letter, `false` otherwise.
     */
    static isSmallLetter(char) {
        return char >= SMALL_LETTER_A && char <= SMALL_LETTER_Z;
    }
    /**
     * Checks if the given character is a capital letter.
     *
     * @param char The character to check.
     * @returns `true` if the given character is a capital letter, `false` otherwise.
     */
    static isCapitalLetter(char) {
        return char >= CAPITAL_LETTER_A && char <= CAPITAL_LETTER_Z;
    }
    /**
     * Checks if the given character is a letter (small or capital).
     *
     * @param char The character to check.
     * @returns `true` if the given character is a letter, `false` otherwise.
     */
    static isLetter(char) {
        return StringUtils.isSmallLetter(char) || StringUtils.isCapitalLetter(char);
    }
    /**
     * Checks if the given character is a letter or a digit.
     *
     * @param char Character to check
     * @returns `true` if the given character is a letter or a digit, `false` otherwise.
     */
    static isAlphaNumeric(char) {
        return StringUtils.isLetter(char) || StringUtils.isDigit(char);
    }
    /**
     * Searches for the first non-whitespace character in the source pattern.
     *
     * @param pattern - Source pattern
     * @param start - Start index
     * @returns Index or -1 if the character not found
     */
    static findFirstNonWhitespaceCharacter(pattern, start = 0) {
        for (let i = start; i < pattern.length; i += 1) {
            if (!StringUtils.isWhitespace(pattern[i])) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Searches for the last non-whitespace character in the source pattern.
     *
     * @param pattern - Source pattern
     * @returns Index or -1 if the character not found
     */
    static findLastNonWhitespaceCharacter(pattern) {
        for (let i = pattern.length - 1; i >= 0; i -= 1) {
            if (!StringUtils.isWhitespace(pattern[i])) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Finds the next whitespace character in the pattern.
     *
     * @param pattern Pattern to search in
     * @param start Start index
     * @returns Index of the next whitespace character or the length of the pattern if not found
     */
    static findNextWhitespaceCharacter(pattern, start = 0) {
        for (let i = start; i < pattern.length; i += 1) {
            if (StringUtils.isWhitespace(pattern[i])) {
                return i;
            }
        }
        return pattern.length;
    }
    /**
     * Escapes a specified character in the string.
     *
     * @param pattern - Input string
     * @param character - Character to escape
     * @param escapeCharacter - Escape character (optional)
     * @returns Escaped string
     */
    static escapeCharacter(pattern, character, escapeCharacter = ESCAPE_CHARACTER) {
        let result = EMPTY;
        for (let i = 0; i < pattern.length; i += 1) {
            if (pattern[i] === character && pattern[i - 1] !== escapeCharacter) {
                result += escapeCharacter;
            }
            result += pattern[i];
        }
        return result;
    }
    /**
     * Searches for the next non-whitespace character in the source pattern.
     *
     * @param pattern Pattern to search
     * @param start Start index
     * @returns Index of the next non-whitespace character or the length of the pattern
     */
    static skipWS(pattern, start = 0) {
        let i = start;
        while (i < pattern.length && StringUtils.isWhitespace(pattern[i])) {
            i += 1;
        }
        return Math.min(i, pattern.length);
    }
    /**
     * Searches for the previous non-whitespace character in the source pattern.
     *
     * @param pattern Pattern to search
     * @param start Start index
     * @returns Index of the previous non-whitespace character or -1
     */
    static skipWSBack(pattern, start = pattern.length - 1) {
        let i = start;
        while (i >= 0 && StringUtils.isWhitespace(pattern[i])) {
            i -= 1;
        }
        return Math.max(i, -1);
    }
    /**
     * Checks if the given character is a new line character.
     *
     * @param char Character to check
     * @returns `true` if the given character is a new line character, `false` otherwise.
     */
    static isEOL(char) {
        return char === CR || char === LF || char === FF;
    }
    /**
     * Splits a string along newline characters.
     *
     * @param input - Input string
     * @returns Splitted string
     */
    static splitStringByNewLines(input) {
        return input.split(/\r?\n/);
    }
    /**
     * Splits a string by new lines and stores the new line type for each line
     *
     * @param input The input string to be split
     * @returns An array of tuples, where each tuple contains a line of the input string and its
     * corresponding new line type ("lf", "crlf", or "cr")
     */
    static splitStringByNewLinesEx(input) {
        // Array to store the tuples of line and new line type
        const result = [];
        let currentLine = EMPTY;
        let newLineType = null;
        // Iterate over each character in the input string
        for (let i = 0; i < input.length; i += 1) {
            const char = input[i];
            if (char === CR) {
                if (input[i + 1] === LF) {
                    newLineType = 'crlf';
                    i += 1;
                }
                else {
                    newLineType = 'cr';
                }
                result.push([currentLine, newLineType]);
                currentLine = EMPTY;
                newLineType = null;
            }
            else if (char === LF) {
                newLineType = 'lf';
                result.push([currentLine, newLineType]);
                currentLine = EMPTY;
                newLineType = null;
            }
            else {
                currentLine += char;
            }
        }
        if (result.length === 0 || currentLine !== EMPTY) {
            result.push([currentLine, newLineType]);
        }
        return result;
    }
    /**
     * Merges an array of tuples (line, newLineType) into a single string
     *
     * @param input The array of tuples to be merged
     * @returns A single string containing the lines and new line characters from the input array
     */
    static mergeStringByNewLines(input) {
        let result = EMPTY;
        // Iterate over each tuple in the input array
        for (let i = 0; i < input.length; i += 1) {
            const [line, newLineType] = input[i];
            // Add the line to the result string
            result += line;
            // Add the appropriate new line character based on the newLineType
            if (newLineType !== null) {
                if (newLineType === 'crlf') {
                    result += CRLF;
                }
                else if (newLineType === 'cr') {
                    result += CR;
                }
                else {
                    result += LF;
                }
            }
        }
        return result;
    }
    /**
     * Helper method to parse a raw string as a number
     *
     * @param raw Raw string to parse
     * @returns Parsed number
     * @throws If the raw string can't be parsed as a number
     */
    static parseNumber(raw) {
        const result = parseInt(raw, 10);
        if (Number.isNaN(result)) {
            throw new Error('Expected a number');
        }
        return result;
    }
    /**
     * Checks if the given value is a string.
     *
     * @param value Value to check
     * @returns `true` if the value is a string, `false` otherwise
     */
    static isString(value) {
        return typeof value === 'string';
    }
    /**
     * Escapes the given characters in the input string.
     *
     * @param input Input string
     * @param characters Characters to escape (by default, no characters are escaped)
     * @returns Escaped string
     */
    static escapeCharacters(input, characters = new Set()) {
        let result = EMPTY;
        for (let i = 0; i < input.length; i += 1) {
            if (characters.has(input[i])) {
                result += ESCAPE_CHARACTER;
            }
            result += input[i];
        }
        return result;
    }
}

/**
 * Default location for AST nodes.
 */
const defaultLocation = {
    offset: 0,
    line: 1,
    column: 1,
};
/**
 * Represents the different comment markers that can be used in an adblock rule.
 *
 * @example
 * - If the rule is `! This is just a comment`, then the marker will be `!`.
 * - If the rule is `# This is just a comment`, then the marker will be `#`.
 */
var CommentMarker;
(function (CommentMarker) {
    /**
     * Regular comment marker. It is supported by all ad blockers.
     */
    CommentMarker["Regular"] = "!";
    /**
     * Hashmark comment marker. It is supported by uBlock Origin and AdGuard,
     * and also used in hosts files.
     */
    CommentMarker["Hashmark"] = "#";
})(CommentMarker || (CommentMarker = {}));
/**
 * Represents the main categories that an adblock rule can belong to.
 * Of course, these include additional subcategories.
 */
var RuleCategory;
(function (RuleCategory) {
    /**
     * Empty "rules" that are only containing whitespaces. These rules are handled just for convenience.
     */
    RuleCategory["Empty"] = "Empty";
    /**
     * Syntactically invalid rules (tolerant mode only).
     */
    RuleCategory["Invalid"] = "Invalid";
    /**
     * Comment rules, such as comment rules, metadata rules, preprocessor rules, etc.
     */
    RuleCategory["Comment"] = "Comment";
    /**
     * Cosmetic rules, such as element hiding rules, CSS rules, scriptlet rules, HTML rules, and JS rules.
     */
    RuleCategory["Cosmetic"] = "Cosmetic";
    /**
     * Network rules, such as basic network rules, header remover network rules, redirect network rules,
     * response header filtering rules, etc.
     */
    RuleCategory["Network"] = "Network";
})(RuleCategory || (RuleCategory = {}));
/**
 * Represents similar types of modifiers values
 * which may be separated by a comma `,` (only for DomainList) or a pipe `|`.
 */
var ListNodeType;
(function (ListNodeType) {
    ListNodeType["AppList"] = "AppList";
    ListNodeType["DomainList"] = "DomainList";
    ListNodeType["MethodList"] = "MethodList";
    ListNodeType["StealthOptionList"] = "StealthOptionList";
})(ListNodeType || (ListNodeType = {}));
/**
 * Represents child items for {@link ListNodeType}.
 */
var ListItemNodeType;
(function (ListItemNodeType) {
    ListItemNodeType["App"] = "App";
    ListItemNodeType["Domain"] = "Domain";
    ListItemNodeType["Method"] = "Method";
    ListItemNodeType["StealthOption"] = "StealthOption";
})(ListItemNodeType || (ListItemNodeType = {}));
/**
 * Represents possible comment types.
 */
var CommentRuleType;
(function (CommentRuleType) {
    CommentRuleType["AgentCommentRule"] = "AgentCommentRule";
    CommentRuleType["CommentRule"] = "CommentRule";
    CommentRuleType["ConfigCommentRule"] = "ConfigCommentRule";
    CommentRuleType["HintCommentRule"] = "HintCommentRule";
    CommentRuleType["MetadataCommentRule"] = "MetadataCommentRule";
    CommentRuleType["PreProcessorCommentRule"] = "PreProcessorCommentRule";
})(CommentRuleType || (CommentRuleType = {}));
/**
 * Represents possible cosmetic rule types.
 */
var CosmeticRuleType;
(function (CosmeticRuleType) {
    CosmeticRuleType["ElementHidingRule"] = "ElementHidingRule";
    CosmeticRuleType["CssInjectionRule"] = "CssInjectionRule";
    CosmeticRuleType["ScriptletInjectionRule"] = "ScriptletInjectionRule";
    CosmeticRuleType["HtmlFilteringRule"] = "HtmlFilteringRule";
    CosmeticRuleType["JsInjectionRule"] = "JsInjectionRule";
})(CosmeticRuleType || (CosmeticRuleType = {}));
/**
 * Represents possible cosmetic rule separators.
 */
var CosmeticRuleSeparator;
(function (CosmeticRuleSeparator) {
    /**
     * @see {@link https://help.eyeo.com/adblockplus/how-to-write-filters#elemhide_basic}
     */
    CosmeticRuleSeparator["ElementHiding"] = "##";
    /**
     * @see {@link https://help.eyeo.com/adblockplus/how-to-write-filters#elemhide_basic}
     */
    CosmeticRuleSeparator["ElementHidingException"] = "#@#";
    /**
     * @see {@link https://help.eyeo.com/adblockplus/how-to-write-filters#elemhide_basic}
     */
    CosmeticRuleSeparator["ExtendedElementHiding"] = "#?#";
    /**
     * @see {@link https://help.eyeo.com/adblockplus/how-to-write-filters#elemhide_basic}
     */
    CosmeticRuleSeparator["ExtendedElementHidingException"] = "#@?#";
    /**
     * @see {@link https://help.eyeo.com/adblockplus/how-to-write-filters#elemhide_basic}
     */
    CosmeticRuleSeparator["AbpSnippet"] = "#$#";
    /**
     * @see {@link https://help.eyeo.com/adblockplus/how-to-write-filters#elemhide_basic}
     */
    CosmeticRuleSeparator["AbpSnippetException"] = "#@$#";
    /**
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#cosmetic-css-rules}
     */
    CosmeticRuleSeparator["AdgCssInjection"] = "#$#";
    /**
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#cosmetic-css-rules}
     */
    CosmeticRuleSeparator["AdgCssInjectionException"] = "#@$#";
    /**
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#cosmetic-css-rules}
     */
    CosmeticRuleSeparator["AdgExtendedCssInjection"] = "#$?#";
    /**
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#cosmetic-css-rules}
     */
    CosmeticRuleSeparator["AdgExtendedCssInjectionException"] = "#@$?#";
    /**
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#scriptlets}
     */
    CosmeticRuleSeparator["AdgJsInjection"] = "#%#";
    /**
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#scriptlets}
     */
    CosmeticRuleSeparator["AdgJsInjectionException"] = "#@%#";
    /**
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#html-filtering-rules}
     */
    CosmeticRuleSeparator["AdgHtmlFiltering"] = "$$";
    /**
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#html-filtering-rules}
     */
    CosmeticRuleSeparator["AdgHtmlFilteringException"] = "$@$";
    /**
     * @see {@link https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#scriptlet-injection}
     */
    CosmeticRuleSeparator["UboScriptletInjection"] = "##+";
    /**
     * @see {@link https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#scriptlet-injection}
     */
    CosmeticRuleSeparator["UboScriptletInjectionException"] = "#@#+";
    /**
     * @see {@link https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#html-filters}
     */
    CosmeticRuleSeparator["UboHtmlFiltering"] = "##^";
    /**
     * @see {@link https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#html-filters}
     */
    CosmeticRuleSeparator["UboHtmlFilteringException"] = "#@#^";
})(CosmeticRuleSeparator || (CosmeticRuleSeparator = {}));

/**
 * @file Customized syntax error class for Adblock Filter Parser.
 */
const ERROR_NAME$2 = 'AdblockSyntaxError';
/**
 * Customized syntax error class for Adblock Filter Parser,
 * which contains the location range of the error.
 */
class AdblockSyntaxError extends SyntaxError {
    /**
     * Location range of the error.
     */
    loc;
    /**
     * Constructs a new `AdblockSyntaxError` instance.
     *
     * @param message Error message
     * @param loc Location range of the error
     */
    constructor(message, loc) {
        super(message);
        this.name = ERROR_NAME$2;
        this.loc = loc;
    }
}

const ADG_NAME_MARKERS = new Set([
    'adguard',
    'adg',
]);
const UBO_NAME_MARKERS = new Set([
    'ublock',
    'ublock origin',
    'ubo',
]);
const ABP_NAME_MARKERS = new Set([
    'adblock',
    'adblock plus',
    'adblockplus',
    'abp',
]);
/**
 * Returns the adblock syntax based on the adblock name
 * parsed from the agent type comment.
 * Needed for modifiers validation of network rules by AGLint.
 *
 * @param name Adblock name.
 *
 * @returns Adblock syntax.
 */
const getAdblockSyntax = (name) => {
    let syntax = AdblockSyntax.Common;
    if (ADG_NAME_MARKERS.has(name.toLowerCase())) {
        syntax = AdblockSyntax.Adg;
    }
    else if (UBO_NAME_MARKERS.has(name.toLowerCase())) {
        syntax = AdblockSyntax.Ubo;
    }
    else if (ABP_NAME_MARKERS.has(name.toLowerCase())) {
        syntax = AdblockSyntax.Abp;
    }
    return syntax;
};
/**
 * `AgentParser` is responsible for parsing single adblock agent elements.
 *
 * @example
 * If the adblock agent rule is
 * ```adblock
 * [Adblock Plus 2.0; AdGuard]
 * ```
 * then the adblock agents are `Adblock Plus 2.0` and `AdGuard`, and this
 * class is responsible for parsing them. The rule itself is parsed by
 * `AgentCommentRuleParser`, which uses this class to parse single agents.
 */
class AgentParser {
    /**
     * Checks if the string is a valid version.
     *
     * @param str String to check
     * @returns `true` if the string is a valid version, `false` otherwise
     */
    static isValidVersion(str) {
        return valid(coerce(str)) !== null;
    }
    /**
     * Parses a raw rule as an adblock agent comment.
     *
     * @param raw Raw rule
     * @param loc Base location
     * @returns Agent rule AST
     * @throws {AdblockSyntaxError} If the raw rule cannot be parsed as an adblock agent
     */
    static parse(raw, loc = defaultLocation) {
        let offset = 0;
        // Save name start position
        const nameStartIndex = offset;
        let nameEndIndex = offset;
        // Prepare variables for name and version
        let name = null;
        let version = null;
        // default value for the syntax
        let syntax = AdblockSyntax.Common;
        // Get agent parts by splitting it by spaces. The last part may be a version.
        // Example: "Adblock Plus 2.0"
        while (offset < raw.length) {
            // Skip whitespace before the part
            offset = StringUtils.skipWS(raw, offset);
            const partEnd = StringUtils.findNextWhitespaceCharacter(raw, offset);
            const part = raw.substring(offset, partEnd);
            if (AgentParser.isValidVersion(part)) {
                // Multiple versions aren't allowed
                if (version !== null) {
                    throw new AdblockSyntaxError('Duplicated versions are not allowed', locRange(loc, offset, partEnd));
                }
                const parsedNamePart = raw.substring(nameStartIndex, nameEndIndex);
                // Save name
                name = {
                    type: 'Value',
                    loc: locRange(loc, nameStartIndex, nameEndIndex),
                    value: parsedNamePart,
                };
                // Save version
                version = {
                    type: 'Value',
                    loc: locRange(loc, offset, partEnd),
                    value: part,
                };
                // Save syntax
                syntax = getAdblockSyntax(parsedNamePart);
            }
            else {
                nameEndIndex = partEnd;
            }
            // Skip whitespace after the part
            offset = StringUtils.skipWS(raw, partEnd);
        }
        // If we didn't find a version, the whole string is the name
        if (name === null) {
            const parsedNamePart = raw.substring(nameStartIndex, nameEndIndex);
            name = {
                type: 'Value',
                loc: locRange(loc, nameStartIndex, nameEndIndex),
                value: parsedNamePart,
            };
            syntax = getAdblockSyntax(parsedNamePart);
        }
        // Agent name cannot be empty
        if (name.value.length === 0) {
            throw new AdblockSyntaxError('Agent name cannot be empty', locRange(loc, 0, raw.length));
        }
        return {
            type: 'Agent',
            loc: locRange(loc, 0, raw.length),
            adblock: name,
            version,
            syntax,
        };
    }
    /**
     * Converts an adblock agent AST to a string.
     *
     * @param ast Agent AST
     * @returns Raw string
     */
    static generate(ast) {
        let result = EMPTY;
        // Agent adblock name
        result += ast.adblock.value;
        // Agent adblock version (if present)
        if (ast.version !== null) {
            // Add a space between the name and the version
            result += SPACE;
            result += ast.version.value;
        }
        return result;
    }
}

/**
 * @file Cosmetic rule separator finder and categorizer
 */
/**
 * Utility class for cosmetic rule separators.
 */
class CosmeticRuleSeparatorUtils {
    /**
     * Checks whether the specified separator is an exception.
     *
     * @param separator Separator to check
     * @returns `true` if the separator is an exception, `false` otherwise
     */
    static isException(separator) {
        // Simply check the second character
        return separator[1] === AT_SIGN;
    }
    /**
     * Checks whether the specified separator is marks an Extended CSS cosmetic rule.
     *
     * @param separator Separator to check
     * @returns `true` if the separator is marks an Extended CSS cosmetic rule, `false` otherwise
     */
    static isExtendedCssMarker(separator) {
        return (separator === CosmeticRuleSeparator.ExtendedElementHiding
            || separator === CosmeticRuleSeparator.ExtendedElementHidingException
            || separator === CosmeticRuleSeparator.AdgExtendedCssInjection
            || separator === CosmeticRuleSeparator.AdgExtendedCssInjectionException);
    }
    /**
     * Looks for the cosmetic rule separator in the rule. This is a simplified version that
     * masks the recursive function.
     *
     * @param rule Raw rule
     * @returns Separator result or null if no separator was found
     */
    static find(rule) {
        /**
         * Helper function to create results of the `find` method.
         *
         * @param start Start position
         * @param separator Separator type
         * @returns Cosmetic rule separator node
         */
        // eslint-disable-next-line max-len
        function createResult(start, separator) {
            return {
                separator,
                start,
                end: start + separator.length,
            };
        }
        for (let i = 0; i < rule.length; i += 1) {
            if (rule[i] === '#') {
                if (rule[i + 1] === '#') {
                    if (rule[i + 2] === '+') {
                        // ##+
                        return createResult(i, CosmeticRuleSeparator.UboScriptletInjection);
                    }
                    if (rule[i + 2] === '^') {
                        // ##^
                        return createResult(i, CosmeticRuleSeparator.UboHtmlFiltering);
                    }
                    if (rule[i - 1] !== SPACE) {
                        // ##
                        return createResult(i, CosmeticRuleSeparator.ElementHiding);
                    }
                }
                if (rule[i + 1] === '?' && rule[i + 2] === '#') {
                    // #?#
                    return createResult(i, CosmeticRuleSeparator.ExtendedElementHiding);
                }
                if (rule[i + 1] === '%' && rule[i + 2] === '#') {
                    // #%#
                    return createResult(i, CosmeticRuleSeparator.AdgJsInjection);
                }
                if (rule[i + 1] === '$') {
                    if (rule[i + 2] === '#') {
                        // #$#
                        return createResult(i, CosmeticRuleSeparator.AdgCssInjection);
                    }
                    if (rule[i + 2] === '?' && rule[i + 3] === '#') {
                        // #$?#
                        return createResult(i, CosmeticRuleSeparator.AdgExtendedCssInjection);
                    }
                }
                // Exceptions
                if (rule[i + 1] === '@') {
                    if (rule[i + 2] === '#') {
                        if (rule[i + 3] === '+') {
                            // #@#+
                            return createResult(i, CosmeticRuleSeparator.UboScriptletInjectionException);
                        }
                        if (rule[i + 3] === '^') {
                            // #@#^
                            return createResult(i, CosmeticRuleSeparator.UboHtmlFilteringException);
                        }
                        if (rule[i - 1] !== SPACE) {
                            // #@#
                            return createResult(i, CosmeticRuleSeparator.ElementHidingException);
                        }
                    }
                    if (rule[i + 2] === '?' && rule[i + 3] === '#') {
                        // #@?#
                        return createResult(i, CosmeticRuleSeparator.ExtendedElementHidingException);
                    }
                    if (rule[i + 2] === '%' && rule[i + 3] === '#') {
                        // #@%#
                        return createResult(i, CosmeticRuleSeparator.AdgJsInjectionException);
                    }
                    if (rule[i + 2] === '$') {
                        if (rule[i + 3] === '#') {
                            // #@$#
                            return createResult(i, CosmeticRuleSeparator.AdgCssInjectionException);
                        }
                        if (rule[i + 3] === '?' && rule[i + 4] === '#') {
                            // #@$?#
                            return createResult(i, CosmeticRuleSeparator.AdgExtendedCssInjectionException);
                        }
                    }
                }
            }
            if (rule[i] === '$') {
                if (rule[i + 1] === '$') {
                    // $$
                    return createResult(i, CosmeticRuleSeparator.AdgHtmlFiltering);
                }
                if (rule[i + 1] === '@' && rule[i + 2] === '$') {
                    // $@$
                    return createResult(i, CosmeticRuleSeparator.AdgHtmlFilteringException);
                }
            }
        }
        return null;
    }
}

/**
 * `AgentParser` is responsible for parsing an Adblock agent rules.
 * Adblock agent comment marks that the filter list is supposed to
 * be used by the specified ad blockers.
 *
 * @example
 *  - ```adblock
 *    [AdGuard]
 *    ```
 *  - ```adblock
 *    [Adblock Plus 2.0]
 *    ```
 *  - ```adblock
 *    [uBlock Origin]
 *    ```
 *  - ```adblock
 *    [uBlock Origin 1.45.3]
 *    ```
 *  - ```adblock
 *    [Adblock Plus 2.0; AdGuard]
 *    ```
 */
class AgentCommentRuleParser {
    /**
     * Checks if the raw rule is an adblock agent comment.
     *
     * @param raw Raw rule
     * @returns `true` if the rule is an adblock agent, `false` otherwise
     */
    static isAgentRule(raw) {
        const rawTrimmed = raw.trim();
        if (rawTrimmed.startsWith(OPEN_SQUARE_BRACKET) && rawTrimmed.endsWith(CLOSE_SQUARE_BRACKET)) {
            // Avoid this case: [$adg-modifier]##[class^="adg-"]
            return CosmeticRuleSeparatorUtils.find(rawTrimmed) === null;
        }
        return false;
    }
    /**
     * Parses a raw rule as an adblock agent comment.
     *
     * @param raw Raw rule
     * @param loc Base location
     * @returns Agent rule AST or null (if the raw rule cannot be parsed as an adblock agent comment)
     */
    static parse(raw, loc = defaultLocation) {
        // Ignore non-agent rules
        if (!AgentCommentRuleParser.isAgentRule(raw)) {
            return null;
        }
        let offset = 0;
        // Skip whitespace characters before the rule
        offset = StringUtils.skipWS(raw, offset);
        // Skip opening bracket
        offset += 1;
        const closingBracketIndex = raw.lastIndexOf(CLOSE_SQUARE_BRACKET);
        // Initialize the agent list
        const agents = [];
        while (offset < closingBracketIndex) {
            // Skip whitespace characters before the agent
            offset = StringUtils.skipWS(raw, offset);
            // Find the separator or the closing bracket
            let separatorIndex = raw.indexOf(SEMICOLON, offset);
            if (separatorIndex === -1) {
                separatorIndex = closingBracketIndex;
            }
            // Find the last non-whitespace character of the agent
            const agentEndIndex = StringUtils.findLastNonWhitespaceCharacter(raw.substring(offset, separatorIndex)) + offset + 1;
            const agent = AgentParser.parse(raw.substring(offset, agentEndIndex), shiftLoc(loc, offset));
            // Collect the agent
            agents.push(agent);
            // Set the offset to the next agent or the end of the rule
            offset = separatorIndex + 1;
        }
        if (agents.length === 0) {
            throw new AdblockSyntaxError('Empty agent list', locRange(loc, 0, raw.length));
        }
        return {
            type: CommentRuleType.AgentCommentRule,
            loc: locRange(loc, 0, raw.length),
            raws: {
                text: raw,
            },
            syntax: AdblockSyntax.Common,
            category: RuleCategory.Comment,
            children: agents,
        };
    }
    /**
     * Converts an adblock agent AST to a string.
     *
     * @param ast Agent rule AST
     * @returns Raw string
     */
    static generate(ast) {
        let result = OPEN_SQUARE_BRACKET;
        result += ast.children
            .map(AgentParser.generate)
            .join(SEMICOLON + SPACE);
        result += CLOSE_SQUARE_BRACKET;
        return result;
    }
}

class ParameterListParser {
    /**
     * Parses a raw parameter list.
     *
     * @param raw Raw parameter list
     * @param separator Separator character (default: comma)
     * @param loc Base location
     * @returns Parameter list AST
     */
    static parse(raw, separator = COMMA, loc = defaultLocation) {
        // Prepare the parameter list node
        const params = {
            type: 'ParameterList',
            loc: locRange(loc, 0, raw.length),
            children: [],
        };
        let offset = 0;
        // Skip leading whitespace (if any)
        offset = StringUtils.skipWS(raw, offset);
        // Parse parameters: skip whitespace before and after each parameter, and
        // split parameters by the separator character.
        while (offset < raw.length) {
            // Skip whitespace before parameter
            offset = StringUtils.skipWS(raw, offset);
            // Get parameter start position
            const paramStart = offset;
            // Get next unescaped separator position
            const nextSeparator = StringUtils.findUnescapedNonStringNonRegexChar(raw, separator, offset);
            // Get parameter end position
            const paramEnd = nextSeparator !== -1
                ? StringUtils.skipWSBack(raw, nextSeparator - 1)
                : StringUtils.skipWSBack(raw);
            // Add parameter to the list
            params.children.push({
                type: 'Parameter',
                loc: locRange(loc, paramStart, paramEnd + 1),
                value: raw.substring(paramStart, paramEnd + 1),
            });
            // Set offset to the next separator position + 1
            offset = nextSeparator !== -1 ? nextSeparator + 1 : raw.length;
        }
        return params;
    }
    /**
     * Converts a parameter list AST to a string.
     *
     * @param params Parameter list AST
     * @param separator Separator character (default: comma)
     * @returns String representation of the parameter list
     */
    static generate(params, separator = COMMA) {
        // Join parameters with the separator character and a space
        return params.children.map((param) => param.value).join(
        // If the separator is a space, do not add an extra space
        separator === SPACE ? separator : separator + SPACE);
    }
}

/**
 * @file AGLint configuration comments. Inspired by ESLint inline configuration comments.
 * @see {@link https://eslint.org/docs/latest/user-guide/configuring/rules#using-configuration-comments}
 */
/**
 * `ConfigCommentParser` is responsible for parsing inline AGLint configuration rules.
 * Generally, the idea is inspired by ESLint inline configuration comments.
 *
 * @see {@link https://eslint.org/docs/latest/user-guide/configuring/rules#using-configuration-comments}
 */
class ConfigCommentRuleParser {
    /**
     * Checks if the raw rule is an inline configuration comment rule.
     *
     * @param raw Raw rule
     * @returns `true` if the rule is an inline configuration comment rule, otherwise `false`.
     */
    static isConfigComment(raw) {
        const trimmed = raw.trim();
        if (trimmed[0] === CommentMarker.Regular || trimmed[0] === CommentMarker.Hashmark) {
            // Skip comment marker and trim comment text (it is necessary because of "!     something")
            const text = raw.slice(1).trim();
            // The code below is "not pretty", but it runs fast, which is necessary, since it will run on EVERY comment
            // The essence of the indicator is that the control comment always starts with the "aglint" prefix
            return ((text[0] === 'a' || text[0] === 'A')
                && (text[1] === 'g' || text[1] === 'G')
                && (text[2] === 'l' || text[2] === 'L')
                && (text[3] === 'i' || text[3] === 'I')
                && (text[4] === 'n' || text[4] === 'N')
                && (text[5] === 't' || text[5] === 'T'));
        }
        return false;
    }
    /**
     * Parses a raw rule as an inline configuration comment.
     *
     * @param raw Raw rule
     * @param loc Base location
     * @returns
     * Inline configuration comment AST or null (if the raw rule cannot be parsed as configuration comment)
     */
    static parse(raw, loc = defaultLocation) {
        if (!ConfigCommentRuleParser.isConfigComment(raw)) {
            return null;
        }
        let offset = 0;
        // Skip leading whitespace (if any)
        offset = StringUtils.skipWS(raw, offset);
        // Get comment marker
        const marker = {
            type: 'Value',
            loc: locRange(loc, offset, offset + 1),
            value: raw[offset] === CommentMarker.Hashmark ? CommentMarker.Hashmark : CommentMarker.Regular,
        };
        // Skip marker
        offset += 1;
        // Skip whitespace (if any)
        offset = StringUtils.skipWS(raw, offset);
        // Save the command start position
        const commandStart = offset;
        // Get comment text, for example: "aglint-disable-next-line"
        offset = StringUtils.findNextWhitespaceCharacter(raw, offset);
        const command = {
            type: 'Value',
            loc: locRange(loc, commandStart, offset),
            value: raw.substring(commandStart, offset),
        };
        // Skip whitespace after command
        offset = StringUtils.skipWS(raw, offset);
        // Get comment (if any)
        const commentStart = raw.indexOf(AGLINT_CONFIG_COMMENT_MARKER, offset);
        const commentEnd = commentStart !== -1 ? StringUtils.skipWSBack(raw) + 1 : -1;
        let comment;
        // Check if there is a comment
        if (commentStart !== -1) {
            comment = {
                type: 'Value',
                loc: locRange(loc, commentStart, commentEnd),
                value: raw.substring(commentStart, commentEnd),
            };
        }
        // Get parameter
        const paramsStart = offset;
        const paramsEnd = commentStart !== -1
            ? StringUtils.skipWSBack(raw, commentStart - 1) + 1
            : StringUtils.skipWSBack(raw) + 1;
        let params;
        // ! aglint config
        if (command.value === AGLINT_COMMAND_PREFIX) {
            params = {
                type: 'Value',
                loc: locRange(loc, paramsStart, paramsEnd),
                // It is necessary to use JSON5.parse instead of JSON.parse
                // because JSON5 allows unquoted keys.
                // But don't forget to add { } to the beginning and end of the string,
                // otherwise JSON5 will not be able to parse it.
                // TODO: Better solution? ESLint uses "levn" package for parsing these comments.
                value: JSON5.parse(`{${raw.substring(paramsStart, paramsEnd)}}`),
            };
            // Throw error for empty config
            if (Object.keys(params.value).length === 0) {
                throw new Error('Empty AGLint config');
            }
        }
        else if (paramsStart < paramsEnd) {
            params = ParameterListParser.parse(raw.substring(paramsStart, paramsEnd), COMMA, shiftLoc(loc, paramsStart));
        }
        return {
            type: CommentRuleType.ConfigCommentRule,
            loc: locRange(loc, 0, raw.length),
            raws: {
                text: raw,
            },
            category: RuleCategory.Comment,
            syntax: AdblockSyntax.Common,
            marker,
            command,
            params,
            comment,
        };
    }
    /**
     * Converts an inline configuration comment AST to a string.
     *
     * @param ast Inline configuration comment AST
     * @returns Raw string
     */
    static generate(ast) {
        let result = EMPTY;
        result += ast.marker.value;
        result += SPACE;
        result += ast.command.value;
        if (ast.params) {
            result += SPACE;
            if (ast.params.type === 'ParameterList') {
                result += ParameterListParser.generate(ast.params, COMMA);
            }
            else {
                // Trim JSON boundaries
                result += JSON.stringify(ast.params.value).slice(1, -1).trim();
            }
        }
        // Add comment within the config comment
        if (ast.comment) {
            result += SPACE;
            result += ast.comment.value;
        }
        return result;
    }
}

/**
 * @file AdGuard Hints
 * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#hints}
 */
/**
 * `HintParser` is responsible for parsing AdGuard hints.
 *
 * @example
 * If the hint rule is
 * ```adblock
 * !+ NOT_OPTIMIZED PLATFORM(windows)
 * ```
 * then the hints are `NOT_OPTIMIZED` and `PLATFORM(windows)`, and this
 * class is responsible for parsing them. The rule itself is parsed by
 * the `HintRuleParser`, which uses this class to parse single hints.
 */
class HintParser {
    /**
     * Parses a raw rule as a hint.
     *
     * @param raw Raw rule
     * @param loc Base location
     * @returns Hint rule AST or null
     * @throws If the syntax is invalid
     */
    static parse(raw, loc = defaultLocation) {
        let offset = 0;
        // Skip whitespace characters before the hint
        offset = StringUtils.skipWS(raw);
        // Hint should start with the hint name in every case
        // Save the start offset of the hint name
        const nameStartIndex = offset;
        // Parse the hint name
        for (; offset < raw.length; offset += 1) {
            const char = raw[offset];
            // Abort consuming the hint name if we encounter a whitespace character
            // or an opening parenthesis, which means 'HIT_NAME(' case
            if (char === OPEN_PARENTHESIS || char === SPACE) {
                break;
            }
            // Hint name should only contain letters, digits, and underscores
            if (!StringUtils.isAlphaNumeric(char) && char !== UNDERSCORE) {
                // eslint-disable-next-line max-len
                throw new AdblockSyntaxError(`Invalid character "${char}" in hint name: "${char}"`, locRange(loc, nameStartIndex, offset));
            }
        }
        // Save the end offset of the hint name
        const nameEndIndex = offset;
        // Save the hint name token
        const name = raw.substring(nameStartIndex, nameEndIndex);
        // Hint name cannot be empty
        if (name === EMPTY) {
            throw new AdblockSyntaxError('Empty hint name', locRange(loc, 0, nameEndIndex));
        }
        // Now we have two case:
        //  1. We have HINT_NAME and should return it
        //  2. We have HINT_NAME(PARAMS) and should continue parsing
        // Skip whitespace characters after the hint name
        offset = StringUtils.skipWS(raw, offset);
        // Throw error for 'HINT_NAME (' case
        if (offset > nameEndIndex && raw[offset] === OPEN_PARENTHESIS) {
            throw new AdblockSyntaxError(
            // eslint-disable-next-line max-len
            'Unexpected whitespace(s) between hint name and opening parenthesis', locRange(loc, nameEndIndex, offset));
        }
        // Create the hint name node (we can reuse it in the 'HINT_NAME' case, if needed)
        const nameNode = {
            type: 'Value',
            loc: locRange(loc, nameStartIndex, nameEndIndex),
            value: name,
        };
        // Just return the hint name if we have 'HINT_NAME' case (no params)
        if (raw[offset] !== OPEN_PARENTHESIS) {
            return {
                type: 'Hint',
                loc: locRange(loc, 0, offset),
                name: nameNode,
            };
        }
        // Skip the opening parenthesis
        offset += 1;
        // Find closing parenthesis
        const closeParenthesisIndex = raw.lastIndexOf(CLOSE_PARENTHESIS);
        // Throw error if we don't have closing parenthesis
        if (closeParenthesisIndex === -1) {
            throw new AdblockSyntaxError(`Missing closing parenthesis for hint "${name}"`, locRange(loc, nameStartIndex, raw.length));
        }
        // Save the start and end index of the params
        const paramsStartIndex = offset;
        const paramsEndIndex = closeParenthesisIndex;
        // Parse the params
        const params = ParameterListParser.parse(raw.substring(paramsStartIndex, paramsEndIndex), COMMA, shiftLoc(loc, paramsStartIndex));
        offset = closeParenthesisIndex + 1;
        // Skip whitespace characters after the closing parenthesis
        offset = StringUtils.skipWS(raw, offset);
        // Throw error if we don't reach the end of the input
        if (offset !== raw.length) {
            throw new AdblockSyntaxError(
            // eslint-disable-next-line max-len
            `Unexpected input after closing parenthesis for hint "${name}": "${raw.substring(closeParenthesisIndex + 1, offset + 1)}"`, locRange(loc, closeParenthesisIndex + 1, offset + 1));
        }
        // Return the HINT_NAME(PARAMS) case AST
        return {
            type: 'Hint',
            loc: locRange(loc, 0, offset),
            name: nameNode,
            params,
        };
    }
    /**
     * Converts a single hint AST to a string.
     *
     * @param hint Hint AST
     * @returns Hint string
     */
    static generate(hint) {
        let result = EMPTY;
        result += hint.name.value;
        if (hint.params && hint.params.children.length > 0) {
            result += OPEN_PARENTHESIS;
            result += ParameterListParser.generate(hint.params, COMMA);
            result += CLOSE_PARENTHESIS;
        }
        return result;
    }
}

/**
 * `HintRuleParser` is responsible for parsing AdGuard hint rules.
 *
 * @example
 * The following hint rule
 * ```adblock
 * !+ NOT_OPTIMIZED PLATFORM(windows)
 * ```
 * contains two hints: `NOT_OPTIMIZED` and `PLATFORM`.
 * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#hints}
 */
class HintCommentRuleParser {
    /**
     * Checks if the raw rule is a hint rule.
     *
     * @param raw Raw rule
     * @returns `true` if the rule is a hint rule, `false` otherwise
     */
    static isHintRule(raw) {
        return raw.trim().startsWith(HINT_MARKER);
    }
    /**
     * Parses a raw rule as a hint comment.
     *
     * @param raw Raw rule
     * @param loc Base location
     * @returns Hint AST or null (if the raw rule cannot be parsed as a hint comment)
     * @throws If the input matches the HINT pattern but syntactically invalid
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#hints-1}
     */
    static parse(raw, loc = defaultLocation) {
        // Ignore non-hint rules
        if (!HintCommentRuleParser.isHintRule(raw)) {
            return null;
        }
        let offset = 0;
        // Skip whitespace characters before the rule
        offset = StringUtils.skipWS(raw);
        // Skip hint marker
        offset += HINT_MARKER_LEN;
        const hints = [];
        // Collect hints. Each hint is a string, optionally followed by a parameter list,
        // enclosed in parentheses. One rule can contain multiple hints.
        while (offset < raw.length) {
            // Split rule into raw hints (e.g. 'HINT_NAME' or 'HINT_NAME(PARAMS)')
            // Hints are separated by whitespace characters, but we should ignore
            // whitespace characters inside the parameter list
            // Ignore whitespace characters before the hint
            offset = StringUtils.skipWS(raw, offset);
            // Save the start index of the hint
            const hintStartIndex = offset;
            // Find the end of the hint
            let hintEndIndex = offset;
            let balance = 0;
            while (hintEndIndex < raw.length) {
                if (raw[hintEndIndex] === OPEN_PARENTHESIS && raw[hintEndIndex - 1] !== BACKSLASH) {
                    balance += 1;
                    // Throw error for nesting
                    if (balance > 1) {
                        throw new AdblockSyntaxError('Invalid hint: nested parentheses are not allowed', locRange(loc, hintStartIndex, hintEndIndex));
                    }
                }
                else if (raw[hintEndIndex] === CLOSE_PARENTHESIS && raw[hintEndIndex - 1] !== BACKSLASH) {
                    balance -= 1;
                }
                else if (StringUtils.isWhitespace(raw[hintEndIndex]) && balance === 0) {
                    break;
                }
                hintEndIndex += 1;
            }
            offset = hintEndIndex;
            // Skip whitespace characters after the hint
            offset = StringUtils.skipWS(raw, offset);
            // Parse the hint
            const hint = HintParser.parse(raw.substring(hintStartIndex, hintEndIndex), shiftLoc(loc, hintStartIndex));
            hints.push(hint);
        }
        // Throw error if no hints were found
        if (hints.length === 0) {
            throw new AdblockSyntaxError('Empty hint rule', locRange(loc, 0, offset));
        }
        return {
            type: CommentRuleType.HintCommentRule,
            loc: locRange(loc, 0, offset),
            raws: {
                text: raw,
            },
            category: RuleCategory.Comment,
            syntax: AdblockSyntax.Adg,
            children: hints,
        };
    }
    /**
     * Converts a hint rule AST to a raw string.
     *
     * @param ast Hint rule AST
     * @returns Raw string
     */
    static generate(ast) {
        let result = HINT_MARKER + SPACE;
        result += ast.children.map(HintParser.generate).join(SPACE);
        return result;
    }
}

/**
 * Known metadata headers
 */
const METADATA_HEADERS = [
    'Checksum',
    'Description',
    'Expires',
    'Homepage',
    'Last Modified',
    'Last modified',
    'Licence',
    'License',
    'TimeUpdated',
    'Version',
    'Title',
];

/**
 * @file Metadata comments
 */
/**
 * `MetadataParser` is responsible for parsing metadata comments.
 * Metadata comments are special comments that specify some properties of the list.
 *
 * @example
 * For example, in the case of
 * ```adblock
 * ! Title: My List
 * ```
 * the name of the header is `Title`, and the value is `My List`, which means that
 * the list title is `My List`, and it can be used in the adblocker UI.
 * @see {@link https://help.eyeo.com/adblockplus/how-to-write-filters#special-comments}
 */
class MetadataCommentRuleParser {
    /**
     * Parses a raw rule as a metadata comment.
     *
     * @param raw Raw rule
     * @param loc Base location
     * @returns Metadata comment AST or null (if the raw rule cannot be parsed as a metadata comment)
     */
    static parse(raw, loc = defaultLocation) {
        // Fast check to avoid unnecessary work
        if (raw.indexOf(COLON) === -1) {
            return null;
        }
        let offset = 0;
        // Skip leading spaces before the comment marker
        offset = StringUtils.skipWS(raw, offset);
        // Check if the rule starts with a comment marker (first non-space sequence)
        if (raw[offset] !== CommentMarker.Regular && raw[offset] !== CommentMarker.Hashmark) {
            return null;
        }
        // Consume the comment marker
        const marker = {
            type: 'Value',
            loc: locRange(loc, offset, offset + 1),
            value: raw[offset] === CommentMarker.Hashmark ? CommentMarker.Hashmark : CommentMarker.Regular,
        };
        offset += 1;
        // Skip spaces
        offset = StringUtils.skipWS(raw, offset);
        // Save header start position
        const headerStart = offset;
        // Check if the comment text starts with a known header
        const text = raw.slice(offset);
        for (let i = 0; i < METADATA_HEADERS.length; i += 1) {
            // Check if the comment text starts with the header (case-insensitive)
            if (text.toLocaleLowerCase().startsWith(METADATA_HEADERS[i].toLocaleLowerCase())) {
                // Skip the header
                offset += METADATA_HEADERS[i].length;
                // Save header
                const header = {
                    type: 'Value',
                    loc: locRange(loc, headerStart, offset),
                    value: raw.slice(headerStart, offset),
                };
                // Skip spaces after the header
                offset = StringUtils.skipWS(raw, offset);
                // Check if the rule contains a separator after the header
                if (raw[offset] !== COLON) {
                    return null;
                }
                // Skip the separator
                offset += 1;
                // Skip spaces after the separator
                offset = StringUtils.skipWS(raw, offset);
                // Save the value start position
                const valueStart = offset;
                // Check if the rule contains a value
                if (offset >= raw.length) {
                    return null;
                }
                const valueEnd = StringUtils.skipWSBack(raw, raw.length - 1) + 1;
                // Save the value
                const value = {
                    type: 'Value',
                    loc: locRange(loc, valueStart, valueEnd),
                    value: raw.substring(valueStart, valueEnd),
                };
                return {
                    type: CommentRuleType.MetadataCommentRule,
                    loc: locRange(loc, 0, raw.length),
                    raws: {
                        text: raw,
                    },
                    category: RuleCategory.Comment,
                    syntax: AdblockSyntax.Common,
                    marker,
                    header,
                    value,
                };
            }
        }
        return null;
    }
    /**
     * Converts a metadata comment AST to a string.
     *
     * @param ast - Metadata comment AST
     * @returns Raw string
     */
    static generate(ast) {
        let result = EMPTY;
        result += ast.marker.value;
        result += SPACE;
        result += ast.header.value;
        result += COLON;
        result += SPACE;
        result += ast.value.value;
        return result;
    }
}

const OPERATOR_PRECEDENCE = {
    '!': 3,
    '&&': 2,
    '||': 1,
};
/**
 * `LogicalExpressionParser` is responsible for parsing logical expressions.
 *
 * @example
 * From the following rule:
 * ```adblock
 * !#if (adguard_ext_android_cb || adguard_ext_safari)
 * ```
 * this parser will parse the expression `(adguard_ext_android_cb || adguard_ext_safari)`.
 */
class LogicalExpressionParser {
    /**
     * Split the expression into tokens.
     *
     * @param raw Source code of the expression
     * @param loc Location of the expression
     * @returns Token list
     * @throws {AdblockSyntaxError} If the expression is invalid
     */
    static tokenize(raw, loc = defaultLocation) {
        const tokens = [];
        let offset = 0;
        while (offset < raw.length) {
            const char = raw[offset];
            if (StringUtils.isWhitespace(char)) {
                // Ignore whitespace
                offset += 1;
            }
            else if (StringUtils.isLetter(char)) {
                // Consume variable name
                let name = char;
                // Save the start offset of the variable name
                const nameStart = offset;
                // Variable name shouldn't start with a number or underscore,
                // but can contain them
                while (offset + 1 < raw.length
                    && (StringUtils.isAlphaNumeric(raw[offset + 1]) || raw[offset + 1] === UNDERSCORE)) {
                    offset += 1;
                    name += raw[offset];
                }
                tokens.push({
                    type: 'Variable',
                    value: name,
                    loc: locRange(loc, nameStart, offset + 1),
                });
                offset += 1;
            }
            else if (char === OPEN_PARENTHESIS || char === CLOSE_PARENTHESIS) {
                // Parenthesis
                tokens.push({
                    type: 'Parenthesis',
                    value: char,
                    loc: locRange(loc, offset, offset + 1),
                });
                offset += 1;
            }
            else if (char === AMPERSAND || char === PIPE) {
                // Parse operator
                if (offset + 1 < raw.length && raw[offset + 1] === char) {
                    tokens.push({
                        type: 'Operator',
                        value: char + char,
                        loc: locRange(loc, offset, offset + 2),
                    });
                    offset += 2;
                }
                else {
                    throw new AdblockSyntaxError(`Unexpected character "${char}"`, locRange(loc, offset, offset + 1));
                }
            }
            else if (char === EXCLAMATION_MARK) {
                tokens.push({
                    type: 'Operator',
                    value: char,
                    loc: locRange(loc, offset, offset + 1),
                });
                offset += 1;
            }
            else {
                throw new AdblockSyntaxError(`Unexpected character "${char}"`, locRange(loc, offset, offset + 1));
            }
        }
        return tokens;
    }
    /**
     * Parses a logical expression.
     *
     * @param raw Source code of the expression
     * @param loc Location of the expression
     * @returns Parsed expression
     * @throws {AdblockSyntaxError} If the expression is invalid
     */
    static parse(raw, loc = defaultLocation) {
        // Tokenize the source (produces an array of tokens)
        const tokens = LogicalExpressionParser.tokenize(raw, loc);
        // Current token index
        let tokenIndex = 0;
        /**
         * Consumes a token of the expected type.
         *
         * @param type Expected token type
         * @returns The consumed token
         */
        function consume(type) {
            const token = tokens[tokenIndex];
            if (!token) {
                throw new AdblockSyntaxError(`Expected token of type "${type}", but reached end of input`, locRange(loc, 0, raw.length));
            }
            // We only use this function internally, so we can safely ignore this
            // from the coverage report
            // istanbul ignore next
            if (token.type !== type) {
                throw new AdblockSyntaxError(`Expected token of type "${type}", but got "${token.type}"`, 
                // Token location is always shifted, no need locRange
                {
                    start: token.loc.start,
                    end: token.loc.end,
                });
            }
            tokenIndex += 1;
            return token;
        }
        /**
         * Parses a variable.
         *
         * @returns Variable node
         */
        function parseVariable() {
            const token = consume('Variable');
            return {
                type: 'Variable',
                // Token location is always shifted, no need locRange
                loc: token.loc,
                name: token.value,
            };
        }
        /**
         * Parses a binary expression.
         *
         * @param left Left-hand side of the expression
         * @param minPrecedence Minimum precedence of the operator
         * @returns Binary expression node
         */
        function parseBinaryExpression(left, minPrecedence = 0) {
            let node = left;
            let operatorToken;
            while (tokens[tokenIndex]) {
                operatorToken = tokens[tokenIndex];
                if (!operatorToken || operatorToken.type !== 'Operator') {
                    break;
                }
                // It is safe to cast here, because we already checked the type
                const operator = operatorToken.value;
                const precedence = OPERATOR_PRECEDENCE[operator];
                if (precedence < minPrecedence) {
                    break;
                }
                tokenIndex += 1;
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                const right = parseExpression(precedence + 1);
                node = {
                    type: 'Operator',
                    // Token location is always shifted, no need locRange
                    loc: {
                        start: node.loc?.start ?? operatorToken.loc.start,
                        end: right.loc?.end ?? operatorToken.loc.end,
                    },
                    operator,
                    left: node,
                    right,
                };
            }
            return node;
        }
        /**
         * Parses a parenthesized expression.
         *
         * @returns Parenthesized expression node
         */
        function parseParenthesizedExpression() {
            consume('Parenthesis');
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            const expression = parseExpression();
            consume('Parenthesis');
            return {
                type: 'Parenthesis',
                loc: expression.loc,
                expression,
            };
        }
        /**
         * Parses an expression.
         *
         * @param minPrecedence Minimum precedence of the operator
         * @returns Expression node
         */
        function parseExpression(minPrecedence = 0) {
            let node;
            const token = tokens[tokenIndex];
            if (token.type === 'Variable') {
                node = parseVariable();
            }
            else if (token.type === 'Operator' && token.value === '!') {
                tokenIndex += 1;
                const expression = parseExpression(OPERATOR_PRECEDENCE['!']);
                node = {
                    type: 'Operator',
                    // Token location is always shifted, no need locRange
                    loc: { start: token.loc.start, end: expression.loc?.end ?? token.loc.end },
                    operator: '!',
                    left: expression,
                };
            }
            else if (token.type === 'Parenthesis' && token.value === OPEN_PARENTHESIS) {
                node = parseParenthesizedExpression();
            }
            else {
                throw new AdblockSyntaxError(`Unexpected token "${token.value}"`, 
                // Token location is always shifted, no need locRange
                {
                    start: token.loc.start,
                    end: token.loc.end,
                });
            }
            return parseBinaryExpression(node, minPrecedence);
        }
        const expression = parseExpression();
        if (tokenIndex !== tokens.length) {
            throw new AdblockSyntaxError(`Unexpected token "${tokens[tokenIndex].value}"`, 
            // Token location is always shifted, no need locRange
            {
                start: tokens[tokenIndex].loc.start,
                end: tokens[tokenIndex].loc.end,
            });
        }
        return expression;
    }
    /**
     * Generates a string representation of the logical expression (serialization).
     *
     * @param ast Expression node
     * @returns String representation of the logical expression
     */
    static generate(ast) {
        if (ast.type === 'Variable') {
            return ast.name;
        }
        if (ast.type === 'Operator') {
            const left = LogicalExpressionParser.generate(ast.left);
            const right = ast.right ? LogicalExpressionParser.generate(ast.right) : undefined;
            const { operator } = ast;
            if (operator === '!') {
                return `${operator}${left}`;
            }
            const leftString = operator === '||' ? `${left}` : left;
            const rightString = operator === '||' ? `${right}` : right;
            return `${leftString} ${operator} ${rightString}`;
        }
        if (ast.type === 'Parenthesis') {
            const expressionString = LogicalExpressionParser.generate(ast.expression);
            return `(${expressionString})`;
        }
        // Theoretically, this shouldn't happen if the library is used correctly
        throw new Error('Unexpected node type');
    }
}

/**
 * Pre-processor directives
 *
 * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#pre-processor-directives}
 * @see {@link https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#pre-parsing-directives}
 */
/**
 * `PreProcessorParser` is responsible for parsing preprocessor rules.
 * Pre-processor comments are special comments that are used to control the behavior of the filter list processor.
 * Please note that this parser only handles general syntax for now, and does not validate the parameters at
 * the parsing stage.
 *
 * @example
 * If your rule is
 * ```adblock
 * !#if (adguard)
 * ```
 * then the directive's name is `if` and its value is `(adguard)`, but the parameter list
 * is not parsed / validated further.
 * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#pre-processor-directives}
 * @see {@link https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#pre-parsing-directives}
 */
class PreProcessorCommentRuleParser {
    /**
     * Determines whether the rule is a pre-processor rule.
     *
     * @param raw Raw rule
     * @returns `true` if the rule is a pre-processor rule, `false` otherwise
     */
    static isPreProcessorRule(raw) {
        const trimmed = raw.trim();
        // Avoid this case: !##... (commonly used in AdGuard filters)
        return trimmed.startsWith(PREPROCESSOR_MARKER) && trimmed[PREPROCESSOR_MARKER_LEN] !== HASHMARK;
    }
    /**
     * Parses a raw rule as a pre-processor comment.
     *
     * @param raw Raw rule
     * @param loc Base location
     * @returns
     * Pre-processor comment AST or null (if the raw rule cannot be parsed as a pre-processor comment)
     */
    static parse(raw, loc = defaultLocation) {
        // Ignore non-pre-processor rules
        if (!PreProcessorCommentRuleParser.isPreProcessorRule(raw)) {
            return null;
        }
        let offset = 0;
        // Ignore whitespace characters before the rule (if any)
        offset = StringUtils.skipWS(raw, offset);
        // Ignore the pre-processor marker
        offset += PREPROCESSOR_MARKER_LEN;
        // Ignore whitespace characters after the pre-processor marker (if any)
        // Note: this is incorrect according to the spec, but we do it for tolerance
        offset = StringUtils.skipWS(raw, offset);
        // Directive name should start at this offset, so we save this offset now
        const nameStart = offset;
        // Consume directive name, so parse the sequence until the first
        // whitespace / opening parenthesis / end of string
        while (offset < raw.length) {
            const ch = raw[offset];
            if (ch === PREPROCESSOR_SEPARATOR || ch === OPEN_PARENTHESIS) {
                break;
            }
            offset += 1;
        }
        // Save name end offset
        const nameEnd = offset;
        // Create name node
        const name = {
            type: 'Value',
            loc: locRange(loc, nameStart, nameEnd),
            value: raw.substring(nameStart, nameEnd),
        };
        // Ignore whitespace characters after the directive name (if any)
        // Note: this may incorrect according to the spec, but we do it for tolerance
        offset = StringUtils.skipWS(raw, offset);
        // If the directive name is "safari_cb_affinity", then we have a special case
        if (name.value === SAFARI_CB_AFFINITY) {
            // Throw error if there are spaces after the directive name
            if (offset > nameEnd) {
                throw new AdblockSyntaxError(`Unexpected whitespace after "${SAFARI_CB_AFFINITY}" directive name`, locRange(loc, nameEnd, offset));
            }
            // safari_cb_affinity directive optionally accepts a parameter list
            // So at this point we should check if there are parameters or not
            // (cb_affinity directive followed by an opening parenthesis or if we
            // skip the whitespace we reach the end of the string)
            if (StringUtils.skipWS(raw, offset) !== raw.length) {
                if (raw[offset] !== OPEN_PARENTHESIS) {
                    throw new AdblockSyntaxError(`Unexpected character '${raw[offset]}' after '${SAFARI_CB_AFFINITY}' directive name`, locRange(loc, offset, offset + 1));
                }
                // If we have parameters, then we should parse them
                // Note: we don't validate the parameters at this stage
                // Ignore opening parenthesis
                offset += 1;
                // Save parameter list start offset
                const parameterListStart = offset;
                // Check for closing parenthesis
                const closingParenthesesIndex = StringUtils.skipWSBack(raw);
                if (closingParenthesesIndex === -1 || raw[closingParenthesesIndex] !== CLOSE_PARENTHESIS) {
                    throw new AdblockSyntaxError(`Missing closing parenthesis for '${SAFARI_CB_AFFINITY}' directive`, locRange(loc, offset, raw.length));
                }
                // Save parameter list end offset
                const parameterListEnd = closingParenthesesIndex;
                // Parse parameters between the opening and closing parentheses
                return {
                    type: CommentRuleType.PreProcessorCommentRule,
                    loc: locRange(loc, 0, raw.length),
                    raws: {
                        text: raw,
                    },
                    category: RuleCategory.Comment,
                    syntax: AdblockSyntax.Adg,
                    name,
                    // comma separated list of parameters
                    params: ParameterListParser.parse(raw.substring(parameterListStart, parameterListEnd), COMMA, shiftLoc(loc, parameterListStart)),
                };
            }
        }
        // If we reached the end of the string, then we have a directive without parameters
        // (e.g. "!#safari_cb_affinity" or "!#endif")
        // No need to continue parsing in this case.
        if (offset === raw.length) {
            // Throw error if the directive name is "if" or "include", because these directives
            // should have parameters
            if (name.value === IF || name.value === INCLUDE) {
                throw new AdblockSyntaxError(`Directive "${name.value}" requires parameters`, locRange(loc, 0, raw.length));
            }
            return {
                type: CommentRuleType.PreProcessorCommentRule,
                loc: locRange(loc, 0, raw.length),
                raws: {
                    text: raw,
                },
                category: RuleCategory.Comment,
                syntax: AdblockSyntax.Common,
                name,
            };
        }
        // Get start and end offsets of the directive parameters
        const paramsStart = offset;
        const paramsEnd = StringUtils.skipWSBack(raw) + 1;
        // Prepare parameters node
        let params;
        // Parse parameters. Handle "if" and "safari_cb_affinity" directives
        // separately.
        if (name.value === IF) {
            params = LogicalExpressionParser.parse(raw.substring(paramsStart, paramsEnd), shiftLoc(loc, paramsStart));
        }
        else {
            params = {
                type: 'Value',
                loc: locRange(loc, paramsStart, paramsEnd),
                value: raw.substring(paramsStart, paramsEnd),
            };
        }
        return {
            type: CommentRuleType.PreProcessorCommentRule,
            loc: locRange(loc, 0, raw.length),
            raws: {
                text: raw,
            },
            category: RuleCategory.Comment,
            syntax: AdblockSyntax.Common,
            name,
            params,
        };
    }
    /**
     * Converts a pre-processor comment AST to a string.
     *
     * @param ast - Pre-processor comment AST
     * @returns Raw string
     */
    static generate(ast) {
        let result = EMPTY;
        result += PREPROCESSOR_MARKER;
        result += ast.name.value;
        if (ast.params) {
            // Space is not allowed after "safari_cb_affinity" directive,
            // so we need to handle it separately.
            if (ast.name.value !== SAFARI_CB_AFFINITY) {
                result += SPACE;
            }
            if (ast.params.type === 'Value') {
                result += ast.params.value;
            }
            else if (ast.params.type === 'ParameterList') {
                result += OPEN_PARENTHESIS;
                result += ParameterListParser.generate(ast.params);
                result += CLOSE_PARENTHESIS;
            }
            else {
                result += LogicalExpressionParser.generate(ast.params);
            }
        }
        return result;
    }
}

/**
 * `CommentParser` is responsible for parsing any comment-like adblock rules.
 *
 * @example
 * Example rules:
 *  - Adblock agent rules:
 *      - ```adblock
 *        [AdGuard]
 *        ```
 *      - ```adblock
 *        [Adblock Plus 2.0]
 *        ```
 *      - etc.
 *  - AdGuard hint rules:
 *      - ```adblock
 *        !+ NOT_OPTIMIZED
 *        ```
 *      - ```adblock
 *        !+ NOT_OPTIMIZED PLATFORM(windows)
 *        ```
 *      - etc.
 *  - Pre-processor rules:
 *      - ```adblock
 *        !#if (adguard)
 *        ```
 *      - ```adblock
 *        !#endif
 *        ```
 *      - etc.
 *  - Metadata rules:
 *      - ```adblock
 *        ! Title: My List
 *        ```
 *      - ```adblock
 *        ! Version: 2.0.150
 *        ```
 *      - etc.
 *  - AGLint inline config rules:
 *      - ```adblock
 *        ! aglint-enable some-rule
 *        ```
 *      - ```adblock
 *        ! aglint-disable some-rule
 *        ```
 *      - etc.
 *  - Simple comments:
 *      - Regular version:
 *        ```adblock
 *        ! This is just a comment
 *        ```
 *      - uBlock Origin / "hostlist" version:
 *        ```adblock
 *        # This is just a comment
 *        ```
 *      - etc.
 */
class CommentRuleParser {
    /**
     * Checks whether a rule is a regular comment. Regular comments are the ones that start with
     * an exclamation mark (`!`).
     *
     * @param raw Raw rule
     * @returns `true` if the rule is a regular comment, `false` otherwise
     */
    static isRegularComment(raw) {
        // Source may start with a whitespace, so we need to trim it first
        return raw.trim().startsWith(CommentMarker.Regular);
    }
    /**
     * Checks whether a rule is a comment.
     *
     * @param raw Raw rule
     * @returns `true` if the rule is a comment, `false` otherwise
     */
    static isCommentRule(raw) {
        const trimmed = raw.trim();
        // Regular comments
        if (CommentRuleParser.isRegularComment(trimmed)) {
            return true;
        }
        // Hashmark based comments
        if (trimmed.startsWith(CommentMarker.Hashmark)) {
            const result = CosmeticRuleSeparatorUtils.find(trimmed);
            // No separator
            if (result === null) {
                return true;
            }
            // Separator end index
            const { end } = result;
            // No valid selector
            if (!trimmed[end + 1]
                || StringUtils.isWhitespace(trimmed[end + 1])
                || (trimmed[end + 1] === CommentMarker.Hashmark && trimmed[end + 2] === CommentMarker.Hashmark)) {
                return true;
            }
        }
        // Adblock agent comment rules
        return AgentCommentRuleParser.isAgentRule(trimmed);
    }
    /**
     * Parses a raw rule as comment.
     *
     * @param raw Raw rule
     * @param loc Base location
     * @returns Comment AST or null (if the raw rule cannot be parsed as comment)
     */
    static parse(raw, loc = defaultLocation) {
        // Ignore non-comment rules
        if (!CommentRuleParser.isCommentRule(raw)) {
            return null;
        }
        // First, try to parse as non-regular comment
        const nonRegular = AgentCommentRuleParser.parse(raw, loc)
            || HintCommentRuleParser.parse(raw, loc)
            || PreProcessorCommentRuleParser.parse(raw, loc)
            || MetadataCommentRuleParser.parse(raw, loc)
            || ConfigCommentRuleParser.parse(raw, loc);
        if (nonRegular) {
            return nonRegular;
        }
        // If we are here, it means that the rule is a regular comment
        let offset = 0;
        // Skip leading whitespace (if any)
        offset = StringUtils.skipWS(raw, offset);
        // Get comment marker
        const marker = {
            type: 'Value',
            loc: locRange(loc, offset, offset + 1),
            value: raw[offset] === CommentMarker.Hashmark ? CommentMarker.Hashmark : CommentMarker.Regular,
        };
        // Skip marker
        offset += 1;
        // Get comment text
        const text = {
            type: 'Value',
            loc: locRange(loc, offset, raw.length),
            value: raw.slice(offset),
        };
        // Regular comment rule
        return {
            category: RuleCategory.Comment,
            type: CommentRuleType.CommentRule,
            loc: locRange(loc, 0, raw.length),
            raws: {
                text: raw,
            },
            // TODO: Change syntax when hashmark is used?
            syntax: AdblockSyntax.Common,
            marker,
            text,
        };
    }
    /**
     * Converts a comment AST to a string.
     *
     * @param ast Comment AST
     * @returns Raw string
     */
    static generate(ast) {
        let result = EMPTY;
        // Generate based on the rule type
        switch (ast.type) {
            case CommentRuleType.AgentCommentRule:
                return AgentCommentRuleParser.generate(ast);
            case CommentRuleType.HintCommentRule:
                return HintCommentRuleParser.generate(ast);
            case CommentRuleType.PreProcessorCommentRule:
                return PreProcessorCommentRuleParser.generate(ast);
            case CommentRuleType.MetadataCommentRule:
                return MetadataCommentRuleParser.generate(ast);
            case CommentRuleType.ConfigCommentRule:
                return ConfigCommentRuleParser.generate(ast);
            // Regular comment rule
            case CommentRuleType.CommentRule:
                result += ast.marker.value;
                result += ast.text.value;
                return result;
            default:
                throw new Error('Unknown comment rule type');
        }
    }
}

/**
 * Prefixes for error messages which are used for parsing of value lists.
 */
const LIST_PARSE_ERROR_PREFIX = {
    EMPTY_ITEM: 'Empty value specified in the list',
    NO_MULTIPLE_NEGATION: 'Exception marker cannot be followed by another exception marker',
    NO_SEPARATOR_AFTER_NEGATION: 'Exception marker cannot be followed by a separator',
    NO_SEPARATOR_AT_THE_END: 'Value list cannot end with a separator',
    NO_WHITESPACE_AFTER_NEGATION: 'Exception marker cannot be followed by whitespace',
};
/**
 * Parses a `raw` modifier value which may be represented as a list of items separated by `separator`.
 * Needed for $app, $denyallow, $domain, $method.
 *
 * @param raw Raw modifier value.
 * @param separator Separator character.
 * @param loc Location of the modifier value.
 *
 * @returns List AST children — {@link App} | {@link Domain} | {@link Method} —
 * but with no `type` specified (see {@link ListItemNoType}).
 * @throws An {@link AdblockSyntaxError} if the list is syntactically invalid
 *
 * @example
 * - parses an app list — `com.example.app|Example.exe`
 * - parses a domain list — `example.com,example.org,~example.org` or `example.com|~example.org`
 * - parses a method list — `~post|~put`
 */
const parseListItems = (raw, separator, loc = defaultLocation) => {
    const rawListItems = [];
    // If the last character is a separator, then the list item is invalid
    // and no need to continue parsing
    const realEndIndex = StringUtils.skipWSBack(raw);
    if (raw[realEndIndex] === separator) {
        throw new AdblockSyntaxError(LIST_PARSE_ERROR_PREFIX.NO_SEPARATOR_AT_THE_END, locRange(loc, realEndIndex, realEndIndex + 1));
    }
    let offset = 0;
    // Skip whitespace before the list
    offset = StringUtils.skipWS(raw, offset);
    // Split list items by unescaped separators
    while (offset < raw.length) {
        // Skip whitespace before the list item
        offset = StringUtils.skipWS(raw, offset);
        let itemStart = offset;
        // Find the index of the first unescaped separator character
        const separatorStartIndex = StringUtils.findNextUnescapedCharacter(raw, separator, offset);
        const itemEnd = separatorStartIndex === -1
            ? StringUtils.skipWSBack(raw) + 1
            : StringUtils.skipWSBack(raw, separatorStartIndex - 1) + 1;
        const exception = raw[itemStart] === NEGATION_MARKER;
        // Skip the exception marker
        if (exception) {
            itemStart += 1;
            // Exception marker cannot be followed by another exception marker
            if (raw[itemStart] === NEGATION_MARKER) {
                throw new AdblockSyntaxError(LIST_PARSE_ERROR_PREFIX.NO_MULTIPLE_NEGATION, locRange(loc, itemStart, itemStart + 1));
            }
            // Exception marker cannot be followed by a separator
            if (raw[itemStart] === separator) {
                throw new AdblockSyntaxError(LIST_PARSE_ERROR_PREFIX.NO_SEPARATOR_AFTER_NEGATION, locRange(loc, itemStart, itemStart + 1));
            }
            // Exception marker cannot be followed by whitespace
            if (StringUtils.isWhitespace(raw[itemStart])) {
                throw new AdblockSyntaxError(LIST_PARSE_ERROR_PREFIX.NO_WHITESPACE_AFTER_NEGATION, locRange(loc, itemStart, itemStart + 1));
            }
        }
        // List item can't be empty
        if (itemStart === itemEnd) {
            throw new AdblockSyntaxError(LIST_PARSE_ERROR_PREFIX.EMPTY_ITEM, locRange(loc, itemStart, raw.length));
        }
        // Collect list item
        rawListItems.push({
            loc: locRange(loc, itemStart, itemEnd),
            value: raw.substring(itemStart, itemEnd),
            exception,
        });
        // Increment the offset to the next list item (or the end of the string)
        offset = separatorStartIndex === -1 ? raw.length : separatorStartIndex + 1;
    }
    return rawListItems;
};

/**
 * `DomainListParser` is responsible for parsing a domain list.
 *
 * @example
 * - If the rule is `example.com,~example.net##.ads`, the domain list is `example.com,~example.net`.
 * - If the rule is `ads.js^$script,domains=example.com|~example.org`, the domain list is `example.com|~example.org`.
 * This parser is responsible for parsing these domain lists.
 * @see {@link https://help.eyeo.com/adblockplus/how-to-write-filters#elemhide_domains}
 */
class DomainListParser {
    /**
     * Parses a domain list, eg. `example.com,example.org,~example.org`
     *
     * @param raw Raw domain list.
     * @param separator Separator character.
     * @param loc Location of the domain list in the rule. If not set, the default location is used.
     *
     * @returns Domain list AST.
     * @throws An {@link AdblockSyntaxError} if the domain list is syntactically invalid.
     */
    static parse(raw, separator = COMMA_DOMAIN_LIST_SEPARATOR, loc = defaultLocation) {
        const rawItems = parseListItems(raw, separator, loc);
        const children = rawItems.map((rawListItem) => ({
            ...rawListItem,
            type: ListItemNodeType.Domain,
        }));
        return {
            type: ListNodeType.DomainList,
            loc: locRange(loc, 0, raw.length),
            separator,
            children,
        };
    }
    /**
     * Converts a domain list AST to a string.
     *
     * @param ast Domain list AST.
     *
     * @returns Raw string.
     */
    static generate(ast) {
        const result = ast.children
            .map(({ value, exception }) => {
            let subresult = EMPTY;
            if (exception) {
                subresult += NEGATION_MARKER;
            }
            subresult += value.trim();
            return subresult;
        })
            .join(ast.separator);
        return result;
    }
}

/**
 * `ModifierParser` is responsible for parsing modifiers.
 *
 * @example
 * `match-case`, `~third-party`, `domain=example.com|~example.org`
 */
class ModifierParser {
    /**
     * Parses a modifier.
     *
     * @param raw Raw modifier string
     * @param loc Location of the modifier
     *
     * @returns Parsed modifier
     * @throws An error if modifier name or value is empty.
     */
    static parse(raw, loc = defaultLocation) {
        let offset = 0;
        // Skip leading whitespace
        offset = StringUtils.skipWS(raw, offset);
        // Save the offset of the first character of the modifier (whole modifier)
        const modifierStart = offset;
        // Check if the modifier is an exception
        let exception = false;
        if (raw[offset] === NEGATION_MARKER) {
            offset += NEGATION_MARKER.length;
            exception = true;
        }
        // Skip whitespace after the exception marker (if any)
        offset = StringUtils.skipWS(raw, offset);
        // Save the offset of the first character of the modifier name
        const modifierNameStart = offset;
        // Find assignment operator
        const assignmentIndex = StringUtils.findNextUnescapedCharacter(raw, MODIFIER_ASSIGN_OPERATOR);
        // Find the end of the modifier
        const modifierEnd = Math.max(StringUtils.skipWSBack(raw) + 1, modifierNameStart);
        // Modifier name can't be empty
        if (modifierNameStart === modifierEnd) {
            throw new AdblockSyntaxError('Modifier name cannot be empty', locRange(loc, 0, raw.length));
        }
        let modifier;
        let value;
        // If there is no assignment operator, the whole modifier is the name
        // without a value
        if (assignmentIndex === -1) {
            modifier = {
                type: 'Value',
                loc: locRange(loc, modifierNameStart, modifierEnd),
                value: raw.slice(modifierNameStart, modifierEnd),
            };
        }
        else {
            // If there is an assignment operator, first we need to find the
            // end of the modifier name, then we can parse the value
            const modifierNameEnd = StringUtils.skipWSBack(raw, assignmentIndex - 1) + 1;
            modifier = {
                type: 'Value',
                loc: locRange(loc, modifierNameStart, modifierNameEnd),
                value: raw.slice(modifierNameStart, modifierNameEnd),
            };
            // Value can't be empty
            if (assignmentIndex + 1 === modifierEnd) {
                throw new AdblockSyntaxError('Modifier value cannot be empty', locRange(loc, 0, raw.length));
            }
            // Skip whitespace after the assignment operator
            const valueStart = StringUtils.skipWS(raw, assignmentIndex + MODIFIER_ASSIGN_OPERATOR.length);
            value = {
                type: 'Value',
                loc: locRange(loc, valueStart, modifierEnd),
                value: raw.slice(valueStart, modifierEnd),
            };
        }
        return {
            type: 'Modifier',
            loc: locRange(loc, modifierStart, modifierEnd),
            modifier,
            value,
            exception,
        };
    }
    /**
     * Generates a string from a modifier (serializes it).
     *
     * @param modifier Modifier to generate string from
     * @returns String representation of the modifier
     */
    static generate(modifier) {
        let result = EMPTY;
        if (modifier.exception) {
            result += NEGATION_MARKER;
        }
        result += modifier.modifier.value;
        if (modifier.value !== undefined) {
            result += MODIFIER_ASSIGN_OPERATOR;
            result += modifier.value.value;
        }
        return result;
    }
}

/**
 * `ModifierListParser` is responsible for parsing modifier lists. Please note that the name is not
 * uniform, "modifiers" are also known as "options".
 *
 * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#basic-rules-modifiers}
 * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#non-basic-rules-modifiers}
 * @see {@link https://help.eyeo.com/adblockplus/how-to-write-filters#options}
 */
class ModifierListParser {
    /**
     * Parses the cosmetic rule modifiers, eg. `third-party,domain=example.com|~example.org`.
     *
     * _Note:_ you should remove `$` separator before passing the raw modifiers to this function,
     *  or it will be parsed in the first modifier.
     *
     * @param raw Raw modifier list
     * @param loc Location of the modifier list
     * @returns Parsed modifiers interface
     */
    static parse(raw, loc = defaultLocation) {
        const result = {
            type: 'ModifierList',
            loc: locRange(loc, 0, raw.length),
            children: [],
        };
        let offset = StringUtils.skipWS(raw);
        let separatorIndex = -1;
        // Split modifiers by unescaped commas
        while (offset < raw.length) {
            // Skip whitespace before the modifier
            offset = StringUtils.skipWS(raw, offset);
            const modifierStart = offset;
            // Find the index of the first unescaped comma
            separatorIndex = StringUtils.findNextUnescapedCharacter(raw, MODIFIERS_SEPARATOR, offset);
            const modifierEnd = separatorIndex === -1
                ? raw.length
                : StringUtils.skipWSBack(raw, separatorIndex - 1) + 1;
            // Parse the modifier
            const modifier = ModifierParser.parse(raw.substring(modifierStart, modifierEnd), shiftLoc(loc, modifierStart));
            result.children.push(modifier);
            // Increment the offset to the next modifier (or the end of the string)
            offset = separatorIndex === -1 ? raw.length : separatorIndex + 1;
        }
        // Check if there are any modifiers after the last separator
        if (separatorIndex !== -1) {
            const modifierStart = StringUtils.skipWS(raw, separatorIndex + 1);
            result.children.push(ModifierParser.parse(raw.substring(modifierStart, raw.length), shiftLoc(loc, modifierStart)));
        }
        return result;
    }
    /**
     * Converts a modifier list AST to a string.
     *
     * @param ast Modifier list AST
     * @returns Raw string
     */
    static generate(ast) {
        const result = ast.children
            .map(ModifierParser.generate)
            .join(MODIFIERS_SEPARATOR);
        return result;
    }
}

/**
 * @file Helper file for CSSTree to provide better compatibility with TypeScript.
 * @see {@link https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/62536}
 */
/**
 * CSSTree node types.
 *
 * @see {@link https://github.com/csstree/csstree/blob/master/docs/ast.md#node-types}
 */
var CssTreeNodeType;
(function (CssTreeNodeType) {
    CssTreeNodeType["AnPlusB"] = "AnPlusB";
    CssTreeNodeType["Atrule"] = "Atrule";
    CssTreeNodeType["AtrulePrelude"] = "AtrulePrelude";
    CssTreeNodeType["AttributeSelector"] = "AttributeSelector";
    CssTreeNodeType["Block"] = "Block";
    CssTreeNodeType["Brackets"] = "Brackets";
    CssTreeNodeType["CDC"] = "CDC";
    CssTreeNodeType["CDO"] = "CDO";
    CssTreeNodeType["ClassSelector"] = "ClassSelector";
    CssTreeNodeType["Combinator"] = "Combinator";
    CssTreeNodeType["Comment"] = "Comment";
    CssTreeNodeType["Declaration"] = "Declaration";
    CssTreeNodeType["DeclarationList"] = "DeclarationList";
    CssTreeNodeType["Dimension"] = "Dimension";
    CssTreeNodeType["Function"] = "Function";
    CssTreeNodeType["Hash"] = "Hash";
    CssTreeNodeType["Identifier"] = "Identifier";
    CssTreeNodeType["IdSelector"] = "IdSelector";
    CssTreeNodeType["MediaFeature"] = "MediaFeature";
    CssTreeNodeType["MediaQuery"] = "MediaQuery";
    CssTreeNodeType["MediaQueryList"] = "MediaQueryList";
    CssTreeNodeType["NestingSelector"] = "NestingSelector";
    CssTreeNodeType["Nth"] = "Nth";
    CssTreeNodeType["Number"] = "Number";
    CssTreeNodeType["Operator"] = "Operator";
    CssTreeNodeType["Parentheses"] = "Parentheses";
    CssTreeNodeType["Percentage"] = "Percentage";
    CssTreeNodeType["PseudoClassSelector"] = "PseudoClassSelector";
    CssTreeNodeType["PseudoElementSelector"] = "PseudoElementSelector";
    CssTreeNodeType["Ratio"] = "Ratio";
    CssTreeNodeType["Raw"] = "Raw";
    CssTreeNodeType["Rule"] = "Rule";
    CssTreeNodeType["Selector"] = "Selector";
    CssTreeNodeType["SelectorList"] = "SelectorList";
    CssTreeNodeType["String"] = "String";
    CssTreeNodeType["StyleSheet"] = "StyleSheet";
    CssTreeNodeType["TypeSelector"] = "TypeSelector";
    CssTreeNodeType["UnicodeRange"] = "UnicodeRange";
    CssTreeNodeType["Url"] = "Url";
    CssTreeNodeType["Value"] = "Value";
    CssTreeNodeType["WhiteSpace"] = "WhiteSpace";
})(CssTreeNodeType || (CssTreeNodeType = {}));
/**
 * Parser context for CSSTree.
 *
 * @see {@link https://github.com/csstree/csstree/blob/master/docs/parsing.md#context}
 */
var CssTreeParserContext;
(function (CssTreeParserContext) {
    /**
     * Regular stylesheet, should be suitable in most cases (default)
     */
    CssTreeParserContext["stylesheet"] = "stylesheet";
    /**
     * at-rule (e.g. `@media screen`, `print { ... }`)
     */
    CssTreeParserContext["atrule"] = "atrule";
    /**
     * at-rule prelude (screen, print for example above)
     */
    CssTreeParserContext["atrulePrelude"] = "atrulePrelude";
    /**
     * used to parse comma separated media query list
     */
    CssTreeParserContext["mediaQueryList"] = "mediaQueryList";
    /**
     * used to parse media query
     */
    CssTreeParserContext["mediaQuery"] = "mediaQuery";
    /**
     * rule (e.g. `.foo`, `.bar:hover { color: red; border: 1px solid black; }`)
     */
    CssTreeParserContext["rule"] = "rule";
    /**
     * selector group (`.foo`, `.bar:hover` for rule example)
     */
    CssTreeParserContext["selectorList"] = "selectorList";
    /**
     * selector (`.foo` or `.bar:hover` for rule example)
     */
    CssTreeParserContext["selector"] = "selector";
    /**
     * block with curly braces ({ color: red; border: 1px solid black; } for rule example)
     */
    CssTreeParserContext["block"] = "block";
    /**
     * block content w/o curly braces (`color: red; border: 1px solid black;` for rule example),
     * useful for parsing HTML style attribute value
     */
    CssTreeParserContext["declarationList"] = "declarationList";
    /**
     * declaration (`color: red` or `border: 1px solid black` for rule example)
     */
    CssTreeParserContext["declaration"] = "declaration";
    /**
     * declaration value (`red` or `1px solid black` for rule example)
     */
    CssTreeParserContext["value"] = "value";
})(CssTreeParserContext || (CssTreeParserContext = {}));

/**
 * @file Known CSS elements and attributes.
 * TODO: Implement a compatibility table for Extended CSS
 */
const LEGACY_EXT_CSS_ATTRIBUTE_PREFIX = '-ext-';
/**
 * Known Extended CSS pseudo-classes. Please, keep this list sorted.
 */
const EXT_CSS_PSEUDO_CLASSES = new Set([
    // AdGuard
    // https://github.com/AdguardTeam/ExtendedCss
    'contains',
    'has',
    'if-not',
    'is',
    'matches-attr',
    'matches-css',
    'matches-property',
    'nth-ancestor',
    'remove',
    'upward',
    'xpath',
    // uBlock Origin
    // https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#procedural-cosmetic-filters
    'has-text',
    'matches-css-after',
    'matches-css-before',
    'matches-path',
    'min-text-length',
    'watch-attr',
    // Adblock Plus
    // https://help.eyeo.com/adblockplus/how-to-write-filters#elemhide-emulation
    '-abp-contains',
    '-abp-has',
    '-abp-properties',
]);
/**
 * Known legacy Extended CSS attributes. These attributes are deprecated and
 * should be replaced with the corresponding pseudo-classes. In a long term,
 * these attributes will be COMPLETELY removed from the Extended CSS syntax.
 *
 * Please, keep this list sorted.
 */
const EXT_CSS_LEGACY_ATTRIBUTES = new Set([
    // AdGuard
    '-ext-contains',
    '-ext-has',
    '-ext-if-not',
    '-ext-is',
    '-ext-matches-attr',
    '-ext-matches-css',
    '-ext-matches-property',
    '-ext-nth-ancestor',
    '-ext-remove',
    '-ext-upward',
    '-ext-xpath',
    // uBlock Origin
    '-ext-has-text',
    '-ext-matches-css-after',
    '-ext-matches-css-before',
    '-ext-matches-path',
    '-ext-min-text-length',
    '-ext-watch-attr',
    // Adblock Plus
    '-ext-abp-contains',
    '-ext-abp-has',
    '-ext-abp-properties',
]);
/**
 * Known CSS functions that aren't allowed in CSS injection rules, because they
 * able to load external resources. Please, keep this list sorted.
 */
const FORBIDDEN_CSS_FUNCTIONS = new Set([
    // https://developer.mozilla.org/en-US/docs/Web/CSS/cross-fade
    '-webkit-cross-fade',
    'cross-fade',
    // https://developer.mozilla.org/en-US/docs/Web/CSS/image
    'image',
    // https://developer.mozilla.org/en-US/docs/Web/CSS/image-set
    '-webkit-image-set',
    'image-set',
    // https://developer.mozilla.org/en-US/docs/Web/CSS/url
    'url',
]);

/**
 * @file Clone related utilities
 *
 * We should keep clone related functions in this file. Thus, we just provide
 * a simple interface for cloning values, we use it across the AGTree project,
 * and the implementation "under the hood" can be improved later, if needed.
 */
/**
 * Clones an input value to avoid side effects. Use it only in justified cases,
 * because it can impact performance negatively.
 *
 * @param value Value to clone
 * @returns Cloned value
 */
function clone(value) {
    // TODO: Replace cloneDeep with a more efficient implementation
    return cloneDeep(value);
}

/**
 * @file Additional / helper functions for ECSSTree / CSSTree.
 *
 * @note There are no tests for some functions, but during the AGTree optimization we remove them anyway.
 */
/**
 * Common CSSTree parsing options.
 */
const commonCssTreeOptions = {
    parseAtrulePrelude: true,
    parseRulePrelude: true,
    parseValue: true,
    parseCustomProperty: true,
    positions: true,
};
const URL_FUNCTION = 'url';
/**
 * Additional / helper functions for CSSTree.
 */
class CssTree {
    /**
     * Shifts location of the CSSTree node. Temporary workaround for CSSTree issue:
     * https://github.com/csstree/csstree/issues/251
     *
     * @param root Root CSSTree node
     * @param loc Location to shift
     * @returns Root CSSTree node with shifted location
     */
    static shiftNodePosition(root, loc = defaultLocation) {
        walk(root, (node) => {
            if (node.loc) {
                /* eslint-disable no-param-reassign */
                node.loc.start.offset += loc.offset;
                node.loc.start.line += loc.line - 1;
                node.loc.start.column += loc.column - 1;
                node.loc.end.offset += loc.offset;
                node.loc.end.line += loc.line - 1;
                node.loc.end.column += loc.column - 1;
                /* eslint-enable no-param-reassign */
            }
        });
        return root;
    }
    /**
     * Helper function for parsing CSS parts.
     *
     * @param raw Raw CSS input
     * @param context CSSTree context for parsing
     * @param tolerant If `true`, then the parser will not throw an error on parsing fallbacks. Default is `false`
     * @param loc Base location for the parsed node
     * @returns CSSTree node (AST)
     */
    static parse(raw, context, tolerant = false, loc = defaultLocation) {
        try {
            // TODO: Workaround for wrong error management: https://github.com/csstree/csstree/issues/251
            return CssTree.shiftNodePosition(parse(raw, {
                context,
                ...commonCssTreeOptions,
                // https://github.com/csstree/csstree/blob/master/docs/parsing.md#onparseerror
                onParseError: (error) => {
                    // Strict mode
                    if (!tolerant) {
                        throw new AdblockSyntaxError(
                        // eslint-disable-next-line max-len
                        `ECSSTree parsing error: '${error.rawMessage || error.message}'`, locRange(loc, error.offset, raw.length));
                    }
                },
                // TODO: Resolve false positive alert for :xpath('//*[contains(text(),"a")]')
                // Temporarily disabled to avoid false positive alerts
                // We don't need CSS comments
                // onComment: (value: string, commentLoc: CssLocation) => {
                //     throw new AdblockSyntaxError(
                //         'ECSSTree parsing error: \'Unexpected comment\'',
                //         locRange(loc, commentLoc.start.offset, commentLoc.end.offset),
                //     );
                // },
            }), loc);
        }
        catch (error) {
            if (error instanceof Error) {
                let errorLoc;
                // Get start offset of the error (if available), otherwise use the whole inputs length
                if ('offset' in error && typeof error.offset === 'number') {
                    errorLoc = locRange(loc, error.offset, raw.length);
                }
                else {
                    // istanbul ignore next
                    errorLoc = locRange(loc, 0, raw.length);
                }
                throw new AdblockSyntaxError(`ECSSTree parsing error: '${error.message}'`, errorLoc);
            }
            // Pass through any other error just in case, but theoretically it should never happen,
            // so it is ok to ignore it from the coverage
            // istanbul ignore next
            throw error;
        }
    }
    /**
     * Helper function for parsing CSS parts.
     *
     * @param raw Raw CSS input
     * @param context CSSTree context
     * @param tolerant If `true`, then the parser will not throw an error on parsing fallbacks. Default is `false`
     * @param loc Base location for the parsed node
     * @returns CSSTree node (AST)
     */
    // istanbul ignore next
    // eslint-disable-next-line max-len
    static parsePlain(raw, context, tolerant = false, loc = defaultLocation) {
        return toPlainObject(CssTree.parse(raw, context, tolerant, loc));
    }
    /**
     * Checks if the CSSTree node is an ExtendedCSS node.
     *
     * @param node Node to check
     * @param pseudoClasses List of the names of the pseudo classes to check
     * @param attributeSelectors List of the names of the attribute selectors to check
     * @returns `true` if the node is an ExtendedCSS node, otherwise `false`
     */
    static isExtendedCssNode(node, pseudoClasses, attributeSelectors) {
        return ((node.type === CssTreeNodeType.PseudoClassSelector && pseudoClasses.has(node.name))
            || (node.type === CssTreeNodeType.AttributeSelector && attributeSelectors.has(node.name.name)));
    }
    /**
     * Walks through the CSSTree node and returns all ExtendedCSS nodes.
     *
     * @param selectorList Selector list (can be a string or a CSSTree node)
     * @param pseudoClasses List of the names of the pseudo classes to check
     * @param attributeSelectors List of the names of the attribute selectors to check
     * @returns Extended CSS nodes (pseudos and attributes)
     * @see {@link https://github.com/csstree/csstree/blob/master/docs/ast.md#selectorlist}
     */
    static getSelectorExtendedCssNodes(selectorList, pseudoClasses = EXT_CSS_PSEUDO_CLASSES, attributeSelectors = EXT_CSS_LEGACY_ATTRIBUTES) {
        // Parse the block if string is passed
        let ast;
        if (StringUtils.isString(selectorList)) {
            ast = CssTree.parse(selectorList, CssTreeParserContext.selectorList);
        }
        else {
            ast = clone(selectorList);
        }
        const nodes = [];
        // TODO: Need to improve CSSTree types, until then we need to use any type here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        walk(ast, (node) => {
            if (CssTree.isExtendedCssNode(node, pseudoClasses, attributeSelectors)) {
                nodes.push(node);
            }
        });
        return nodes;
    }
    /**
     * Checks if the selector contains any ExtendedCSS nodes. It is a faster alternative to
     * `getSelectorExtendedCssNodes` if you only need to know if the selector contains any ExtendedCSS nodes,
     * because it stops the search on the first ExtendedCSS node instead of going through the whole selector
     * and collecting all ExtendedCSS nodes.
     *
     * @param selectorList Selector list (can be a string or a CSSTree node)
     * @param pseudoClasses List of the names of the pseudo classes to check
     * @param attributeSelectors List of the names of the attribute selectors to check
     * @returns `true` if the selector contains any ExtendedCSS nodes
     * @see {@link https://github.com/csstree/csstree/blob/master/docs/ast.md#selectorlist}
     * @see {@link https://github.com/csstree/csstree/blob/master/docs/traversal.md#findast-fn}
     */
    static hasAnySelectorExtendedCssNode(selectorList, pseudoClasses = EXT_CSS_PSEUDO_CLASSES, attributeSelectors = EXT_CSS_LEGACY_ATTRIBUTES) {
        // Parse the block if string is passed
        let ast;
        if (StringUtils.isString(selectorList)) {
            ast = CssTree.parse(selectorList, CssTreeParserContext.selectorList);
        }
        else {
            ast = selectorList;
        }
        // TODO: Need to improve CSSTree types, until then we need to use any type here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return find(ast, (node) => CssTree.isExtendedCssNode(node, pseudoClasses, attributeSelectors)) !== null;
    }
    /**
     * Checks if the node is a forbidden function (unsafe resource loading). Typically it is used to check
     * if the node is a `url()` function, which is a security risk when using filter lists from untrusted
     * sources.
     *
     * @param node Node to check
     * @param forbiddenFunctions Set of the names of the functions to check
     * @returns `true` if the node is a forbidden function
     */
    static isForbiddenFunction(node, forbiddenFunctions = FORBIDDEN_CSS_FUNCTIONS) {
        return (
        // General case: check if it's a forbidden function
        (node.type === CssTreeNodeType.Function && forbiddenFunctions.has(node.name))
            // Special case: CSSTree handles `url()` function in a separate node type,
            // and we also should check if the `url()` are marked as a forbidden function
            || (node.type === CssTreeNodeType.Url && forbiddenFunctions.has(URL_FUNCTION)));
    }
    /**
     * Gets the list of the forbidden function nodes in the declaration block. Typically it is used to get
     * the list of the functions that can be used to load external resources, which is a security risk
     * when using filter lists from untrusted sources.
     *
     * @param declarationList Declaration list to check (can be a string or a CSSTree node)
     * @param forbiddenFunctions Set of the names of the functions to check
     * @returns List of the forbidden function nodes in the declaration block (can be empty)
     */
    static getForbiddenFunctionNodes(declarationList, forbiddenFunctions = FORBIDDEN_CSS_FUNCTIONS) {
        // Parse the block if string is passed
        let ast;
        if (StringUtils.isString(declarationList)) {
            ast = CssTree.parse(declarationList, CssTreeParserContext.declarationList);
        }
        else {
            ast = clone(declarationList);
        }
        const nodes = [];
        // While walking the AST we should skip the nested functions,
        // for example skip url()s in cross-fade(url(), url()), since
        // cross-fade() itself is already a forbidden function
        let inForbiddenFunction = false;
        // TODO: Need to improve CSSTree types, until then we need to use any type here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        walk(ast, {
            enter: (node) => {
                if (!inForbiddenFunction && CssTree.isForbiddenFunction(node, forbiddenFunctions)) {
                    nodes.push(node);
                    inForbiddenFunction = true;
                }
            },
            leave: (node) => {
                if (inForbiddenFunction && CssTree.isForbiddenFunction(node, forbiddenFunctions)) {
                    inForbiddenFunction = false;
                }
            },
        });
        return nodes;
    }
    /**
     * Checks if the declaration block contains any forbidden functions. Typically it is used to check
     * if the declaration block contains any functions that can be used to load external resources,
     * which is a security risk when using filter lists from untrusted sources.
     *
     * @param declarationList Declaration list to check (can be a string or a CSSTree node)
     * @param forbiddenFunctions Set of the names of the functions to check
     * @returns `true` if the declaration block contains any forbidden functions
     * @throws If you pass a string, but it is not a valid CSS
     * @throws If you pass an invalid CSSTree node / AST
     * @see {@link https://github.com/csstree/csstree/blob/master/docs/ast.md#declarationlist}
     * @see {@link https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1196}
     * @see {@link https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1920}
     */
    static hasAnyForbiddenFunction(declarationList, forbiddenFunctions = FORBIDDEN_CSS_FUNCTIONS) {
        // Parse the block if string is passed
        let ast;
        if (StringUtils.isString(declarationList)) {
            ast = CssTree.parse(declarationList, CssTreeParserContext.declarationList);
        }
        else {
            ast = clone(declarationList);
        }
        // TODO: Need to improve CSSTree types, until then we need to use any type here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return find(ast, (node) => CssTree.isForbiddenFunction(node, forbiddenFunctions)) !== null;
    }
    /**
     * Generates string representation of the media query list.
     *
     * @param ast Media query list AST
     * @returns String representation of the media query list
     */
    static generateMediaQueryList(ast) {
        let result = EMPTY;
        if (!ast.children || ast.children.size === 0) {
            throw new Error('Media query list cannot be empty');
        }
        ast.children.forEach((mediaQuery, listItem) => {
            if (mediaQuery.type !== CssTreeNodeType.MediaQuery) {
                throw new Error(`Unexpected node type: ${mediaQuery.type}`);
            }
            result += this.generateMediaQuery(mediaQuery);
            if (listItem.next !== null) {
                result += COMMA;
                result += SPACE;
            }
        });
        return result;
    }
    /**
     * Generates string representation of the media query.
     *
     * @param ast Media query AST
     * @returns String representation of the media query
     */
    static generateMediaQuery(ast) {
        let result = EMPTY;
        if (!ast.children || ast.children.size === 0) {
            throw new Error('Media query cannot be empty');
        }
        ast.children.forEach((node, listItem) => {
            if (node.type === CssTreeNodeType.MediaFeature) {
                result += OPEN_PARENTHESIS;
                result += node.name;
                if (node.value !== null) {
                    result += COLON;
                    result += SPACE;
                    // Use default generator for media feature value
                    result += generate(node.value);
                }
                result += CLOSE_PARENTHESIS;
            }
            else if (node.type === CssTreeNodeType.Identifier) {
                result += node.name;
            }
            else {
                throw new Error(`Unexpected node type: ${node.type}`);
            }
            if (listItem.next !== null) {
                result += SPACE;
            }
        });
        return result;
    }
    /**
     * Generates string representation of the selector list.
     *
     * @param ast SelectorList AST
     * @returns String representation of the selector list
     */
    static generateSelectorList(ast) {
        let result = EMPTY;
        if (!ast.children || ast.children.size === 0) {
            throw new Error('Selector list cannot be empty');
        }
        ast.children.forEach((selector, listItem) => {
            if (selector.type !== CssTreeNodeType.Selector) {
                throw new Error(`Unexpected node type: ${selector.type}`);
            }
            result += this.generateSelector(selector);
            if (listItem.next !== null) {
                result += COMMA;
                result += SPACE;
            }
        });
        return result;
    }
    /**
     * Selector generation based on CSSTree's AST. This is necessary because CSSTree
     * only adds spaces in some edge cases.
     *
     * @param ast CSS Tree AST
     * @returns CSS selector as string
     */
    static generateSelector(ast) {
        let result = EMPTY;
        let inAttributeSelector = false;
        let depth = 0;
        let selectorListDepth = -1;
        let prevNode = ast;
        walk(ast, {
            enter: (node) => {
                depth += 1;
                // Skip attribute selector / selector list children
                if (inAttributeSelector || selectorListDepth > -1) {
                    return;
                }
                switch (node.type) {
                    // "Trivial" nodes
                    case CssTreeNodeType.TypeSelector:
                        result += node.name;
                        break;
                    case CssTreeNodeType.ClassSelector:
                        result += DOT;
                        result += node.name;
                        break;
                    case CssTreeNodeType.IdSelector:
                        result += HASHMARK;
                        result += node.name;
                        break;
                    case CssTreeNodeType.Identifier:
                        result += node.name;
                        break;
                    case CssTreeNodeType.Raw:
                        result += node.value;
                        break;
                    // "Advanced" nodes
                    case CssTreeNodeType.Nth:
                        // Default generation enough
                        result += generate(node);
                        break;
                    // For example :not([id], [name])
                    case CssTreeNodeType.SelectorList:
                        // eslint-disable-next-line no-case-declarations
                        const selectors = [];
                        node.children.forEach((selector) => {
                            if (selector.type === CssTreeNodeType.Selector) {
                                selectors.push(CssTree.generateSelector(selector));
                            }
                            else if (selector.type === CssTreeNodeType.Raw) {
                                selectors.push(selector.value);
                            }
                        });
                        // Join selector lists
                        result += selectors.join(COMMA + SPACE);
                        // Skip nodes here
                        selectorListDepth = depth;
                        break;
                    case CssTreeNodeType.Combinator:
                        if (node.name === SPACE) {
                            result += node.name;
                            break;
                        }
                        // Prevent this case (unnecessary space): has( > .something)
                        if (prevNode.type !== CssTreeNodeType.Selector) {
                            result += SPACE;
                        }
                        result += node.name;
                        result += SPACE;
                        break;
                    case CssTreeNodeType.AttributeSelector:
                        result += OPEN_SQUARE_BRACKET;
                        // Identifier name
                        if (node.name) {
                            result += node.name.name;
                        }
                        // Matcher operator, eg =
                        if (node.matcher) {
                            result += node.matcher;
                            // Value can be String, Identifier or null
                            if (node.value !== null) {
                                // String node
                                if (node.value.type === CssTreeNodeType.String) {
                                    result += generate(node.value);
                                }
                                else if (node.value.type === CssTreeNodeType.Identifier) {
                                    // Identifier node
                                    result += node.value.name;
                                }
                            }
                        }
                        // Flags
                        if (node.flags) {
                            // Space before flags
                            result += SPACE;
                            result += node.flags;
                        }
                        result += CLOSE_SQUARE_BRACKET;
                        inAttributeSelector = true;
                        break;
                    case CssTreeNodeType.PseudoElementSelector:
                        result += COLON;
                        result += COLON;
                        result += node.name;
                        if (node.children !== null) {
                            result += OPEN_PARENTHESIS;
                        }
                        break;
                    case CssTreeNodeType.PseudoClassSelector:
                        result += COLON;
                        result += node.name;
                        if (node.children !== null) {
                            result += OPEN_PARENTHESIS;
                        }
                        break;
                }
                prevNode = node;
            },
            leave: (node) => {
                depth -= 1;
                if (node.type === CssTreeNodeType.SelectorList && depth + 1 === selectorListDepth) {
                    selectorListDepth = -1;
                }
                if (selectorListDepth > -1) {
                    return;
                }
                if (node.type === CssTreeNodeType.AttributeSelector) {
                    inAttributeSelector = false;
                }
                if (inAttributeSelector) {
                    return;
                }
                switch (node.type) {
                    case CssTreeNodeType.PseudoElementSelector:
                    case CssTreeNodeType.PseudoClassSelector:
                        if (node.children !== null) {
                            result += CLOSE_PARENTHESIS;
                        }
                        break;
                }
            },
        });
        return result.trim();
    }
    /**
     * Generates string representation of the selector list.
     *
     * @param ast SelectorList AST
     * @returns String representation of the selector list
     */
    static generateSelectorListPlain(ast) {
        const result = [];
        if (!ast.children || ast.children.length === 0) {
            throw new Error('Selector list cannot be empty');
        }
        ast.children.forEach((selector, index, nodeList) => {
            if (selector.type !== CssTreeNodeType.Selector) {
                throw new Error(`Unexpected node type: ${selector.type}`);
            }
            result.push(this.generateSelectorPlain(selector));
            // If there is a next node, add a comma and a space after the selector
            if (nodeList[index + 1]) {
                result.push(COMMA, SPACE);
            }
        });
        return result.join(EMPTY);
    }
    /**
     * Selector generation based on CSSTree's AST. This is necessary because CSSTree
     * only adds spaces in some edge cases.
     *
     * @param ast CSS Tree AST
     * @returns CSS selector as string
     */
    static generateSelectorPlain(ast) {
        let result = EMPTY;
        let inAttributeSelector = false;
        let depth = 0;
        let selectorListDepth = -1;
        let prevNode = ast;
        // TODO: Need to improve CSSTree types, until then we need to use any type here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        walk(ast, {
            // TODO: Need to improve CSSTree types, until then we need to use any type here
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            enter: (node) => {
                depth += 1;
                // Skip attribute selector / selector list children
                if (inAttributeSelector || selectorListDepth > -1) {
                    return;
                }
                switch (node.type) {
                    // "Trivial" nodes
                    case CssTreeNodeType.TypeSelector:
                        result += node.name;
                        break;
                    case CssTreeNodeType.ClassSelector:
                        result += DOT;
                        result += node.name;
                        break;
                    case CssTreeNodeType.IdSelector:
                        result += HASHMARK;
                        result += node.name;
                        break;
                    case CssTreeNodeType.Identifier:
                        result += node.name;
                        break;
                    case CssTreeNodeType.Raw:
                        result += node.value;
                        break;
                    // "Advanced" nodes
                    case CssTreeNodeType.Nth:
                        // Default generation enough
                        result += generate(node);
                        break;
                    // For example :not([id], [name])
                    case CssTreeNodeType.SelectorList:
                        // eslint-disable-next-line no-case-declarations
                        const selectors = [];
                        node.children.forEach((selector) => {
                            if (selector.type === CssTreeNodeType.Selector) {
                                selectors.push(CssTree.generateSelectorPlain(selector));
                            }
                            else if (selector.type === CssTreeNodeType.Raw) {
                                selectors.push(selector.value);
                            }
                        });
                        // Join selector lists
                        result += selectors.join(COMMA + SPACE);
                        // Skip nodes here
                        selectorListDepth = depth;
                        break;
                    case CssTreeNodeType.Combinator:
                        if (node.name === SPACE) {
                            result += node.name;
                            break;
                        }
                        // Prevent this case (unnecessary space): has( > .something)
                        if (prevNode.type !== CssTreeNodeType.Selector) {
                            result += SPACE;
                        }
                        result += node.name;
                        result += SPACE;
                        break;
                    case CssTreeNodeType.AttributeSelector:
                        result += OPEN_SQUARE_BRACKET;
                        // Identifier name
                        if (node.name) {
                            result += node.name.name;
                        }
                        // Matcher operator, eg =
                        if (node.matcher) {
                            result += node.matcher;
                            // Value can be String, Identifier or null
                            if (node.value !== null) {
                                // String node
                                if (node.value.type === CssTreeNodeType.String) {
                                    result += generate(node.value);
                                }
                                else if (node.value.type === CssTreeNodeType.Identifier) {
                                    // Identifier node
                                    result += node.value.name;
                                }
                            }
                        }
                        // Flags
                        if (node.flags) {
                            // Space before flags
                            result += SPACE;
                            result += node.flags;
                        }
                        result += CLOSE_SQUARE_BRACKET;
                        inAttributeSelector = true;
                        break;
                    case CssTreeNodeType.PseudoElementSelector:
                        result += COLON;
                        result += COLON;
                        result += node.name;
                        if (node.children !== null) {
                            result += OPEN_PARENTHESIS;
                        }
                        break;
                    case CssTreeNodeType.PseudoClassSelector:
                        result += COLON;
                        result += node.name;
                        if (node.children !== null) {
                            result += OPEN_PARENTHESIS;
                        }
                        break;
                }
                prevNode = node;
            },
            leave: (node) => {
                depth -= 1;
                if (node.type === CssTreeNodeType.SelectorList && depth + 1 === selectorListDepth) {
                    selectorListDepth = -1;
                }
                if (selectorListDepth > -1) {
                    return;
                }
                if (node.type === CssTreeNodeType.AttributeSelector) {
                    inAttributeSelector = false;
                }
                if (inAttributeSelector) {
                    return;
                }
                switch (node.type) {
                    case CssTreeNodeType.PseudoElementSelector:
                    case CssTreeNodeType.PseudoClassSelector:
                        if (node.children) {
                            result += CLOSE_PARENTHESIS;
                        }
                        break;
                }
            },
        });
        return result.trim();
    }
    /**
     * Block generation based on CSSTree's AST. This is necessary because CSSTree only adds spaces in some edge cases.
     *
     * @param ast CSS Tree AST
     * @returns CSS selector as string
     */
    static generateDeclarationList(ast) {
        let result = EMPTY;
        walk(ast, {
            enter: (node) => {
                switch (node.type) {
                    case CssTreeNodeType.Declaration: {
                        result += node.property;
                        if (node.value) {
                            result += COLON;
                            result += SPACE;
                            // Fallback to CSSTree's default generate function for the value (enough at this point)
                            result += generate(node.value);
                        }
                        if (node.important) {
                            result += SPACE;
                            result += CSS_IMPORTANT;
                        }
                        break;
                    }
                }
            },
            leave: (node) => {
                switch (node.type) {
                    case CssTreeNodeType.Declaration: {
                        result += SEMICOLON;
                        result += SPACE;
                        break;
                    }
                }
            },
        });
        return result.trim();
    }
    /**
     * Helper method to assert that the attribute selector has a value
     *
     * @param node Attribute selector node
     */
    static assertAttributeSelectorHasStringValue(node) {
        if (!node.value || node.value.type !== CssTreeNodeType.String) {
            throw new Error(`Invalid argument '${node.value}' for '${node.name.name}', expected a string, but got '${node.value
                ? node.value.type
                : 'undefined'}'`);
        }
    }
    /**
     * Helper method to assert that the pseudo-class selector has at least one argument
     *
     * @param node Pseudo-class selector node
     */
    static assertPseudoClassHasAnyArgument(node) {
        if (!node.children || node.children.length === 0) {
            throw new Error(`Pseudo class '${node.name}' has no argument`);
        }
    }
    /**
     * Helper method to parse an attribute selector value as a number
     *
     * @param node Attribute selector node
     * @returns Parsed attribute selector value as a number
     * @throws If the attribute selector hasn't a string value or the string value is can't be parsed as a number
     */
    static parseAttributeSelectorValueAsNumber(node) {
        CssTree.assertAttributeSelectorHasStringValue(node);
        return StringUtils.parseNumber(node.value.value);
    }
    /**
     * Helper method to parse a pseudo-class argument as a number
     *
     * @param node Pseudo-class selector node to parse
     * @returns Parsed pseudo-class argument as a number
     */
    static parsePseudoClassArgumentAsNumber(node) {
        // Check if the pseudo-class has at least one child
        CssTree.assertPseudoClassHasAnyArgument(node);
        // Check if the pseudo-class has only one child
        if (node.children.length > 1) {
            throw new Error(`Invalid argument '${node.name}', expected a number, but got multiple arguments`);
        }
        // Check if the pseudo-class argument is a string / number / raw
        const argument = node.children[0];
        if (argument.type !== CssTreeNodeType.String
            && argument.type !== CssTreeNodeType.Number
            && argument.type !== CssTreeNodeType.Raw) {
            throw new Error(`Invalid argument '${node.name}', expected a ${CssTreeNodeType.String} or ${CssTreeNodeType.Number} or ${CssTreeNodeType.Raw}, but got '${argument.type}'`);
        }
        // Parse the argument as a number
        return StringUtils.parseNumber(argument.value);
    }
    /**
     * Helper method to create an attribute selector node
     *
     * @param name Name of the attribute
     * @param value Value of the attribute
     * @param matcher Matcher of the attribute
     * @param flags Flags of the attribute
     * @returns Attribute selector node
     * @see {@link https://github.com/csstree/csstree/blob/master/docs/ast.md#attributeselector}
     */
    static createAttributeSelectorNode(name, value, matcher = EQUALS, flags = null) {
        return {
            type: CssTreeNodeType.AttributeSelector,
            name: {
                type: CssTreeNodeType.Identifier,
                name,
            },
            value: {
                type: CssTreeNodeType.String,
                value,
            },
            matcher,
            flags,
        };
    }
    /**
     * Helper function to rename a CSSTree pseudo-class node
     *
     * @param node Node to rename
     * @param name New name
     */
    static renamePseudoClass(node, name) {
        Object.assign(node, {
            ...node,
            name,
        });
    }
    /**
     * Helper function to generate a raw string from a pseudo-class
     * selector's children
     *
     * @param node Pseudo-class selector node
     * @returns Generated pseudo-class value
     * @example
     * - `:nth-child(2n+1)` -> `2n+1`
     * - `:matches-path(/foo/bar)` -> `/foo/bar`
     */
    static generatePseudoClassValue(node) {
        let result = EMPTY;
        node.children?.forEach((child) => {
            switch (child.type) {
                case CssTreeNodeType.Selector:
                    result += CssTree.generateSelector(child);
                    break;
                case CssTreeNodeType.SelectorList:
                    result += CssTree.generateSelectorList(child);
                    break;
                case CssTreeNodeType.Raw:
                    result += child.value;
                    break;
                default:
                    // Fallback to CSSTree's default generate function
                    result += generate(child);
            }
        });
        return result;
    }
    /**
     * Helper function to generate a raw string from a function selector's children
     *
     * @param node Function node
     * @returns Generated function value
     * @example `responseheader(name)` -> `name`
     */
    static generateFunctionValue(node) {
        let result = EMPTY;
        node.children?.forEach((child) => {
            switch (child.type) {
                case CssTreeNodeType.Raw:
                    result += child.value;
                    break;
                default:
                    // Fallback to CSSTree's default generate function
                    result += generate(child);
            }
        });
        return result;
    }
    /**
     * Helper function to generate a raw string from a function selector's children
     *
     * @param node Function node
     * @returns Generated function value
     * @example `responseheader(name)` -> `name`
     */
    static generateFunctionPlainValue(node) {
        const result = [];
        node.children?.forEach((child) => {
            switch (child.type) {
                case CssTreeNodeType.Raw:
                    result.push(child.value);
                    break;
                default:
                    // Fallback to CSSTree's default generate function
                    // TODO: Need to improve CSSTree types, until then we need to use any type here
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    result.push(generate(child));
            }
        });
        return result.join(EMPTY);
    }
}

/**
 * @file Element hiding rule body parser
 */
/**
 * `ElementHidingBodyParser` is responsible for parsing element hiding rule bodies.
 *
 * It delegates CSS parsing to CSSTree, which is tolerant and therefore able to
 * parse Extended CSS parts as well.
 *
 * Please note that this parser will read ANY selector if it is syntactically correct.
 * Checking whether this selector is actually compatible with a given adblocker is not
 * done at this level.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors}
 * @see {@link https://github.com/AdguardTeam/ExtendedCss}
 * @see {@link https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#cosmetic-filter-operators}
 * @see {@link https://help.eyeo.com/adblockplus/how-to-write-filters#elemhide-emulation}
 * @see {@link https://github.com/csstree/csstree/tree/master/docs}
 */
class ElementHidingBodyParser {
    /**
     * Parses a raw cosmetic rule body as an element hiding rule body.
     *
     * @param raw Raw body
     * @param loc Location of the body
     * @returns Element hiding rule body AST
     * @throws If the selector is invalid according to the CSS syntax
     */
    static parse(raw, loc = defaultLocation) {
        // eslint-disable-next-line max-len
        const selectorList = CssTree.parsePlain(raw, CssTreeParserContext.selectorList, false, loc);
        return {
            type: 'ElementHidingRuleBody',
            loc: locRange(loc, 0, raw.length),
            selectorList,
        };
    }
    /**
     * Converts an element hiding rule body AST to a string.
     *
     * @param ast Element hiding rule body AST
     * @returns Raw string
     * @throws If the AST is invalid
     */
    static generate(ast) {
        return CssTree.generateSelectorListPlain(ast.selectorList);
    }
}

/**
 * @file CSS injection rule body parser
 */
const NONE = 'None';
const MEDIA = 'media';
const TRUE = 'true';
const REMOVE = 'remove';
const STYLE = 'style';
const MATCHES_MEDIA = 'matches-media';
const MEDIA_MARKER = AT_SIGN + MEDIA; // @media
const REMOVE_DECLARATION = REMOVE + COLON + SPACE + TRUE + SEMICOLON; // remove: true;
const SPECIAL_PSEUDO_CLASSES = [
    MATCHES_MEDIA,
    STYLE,
    REMOVE,
];
/**
 * `selectorList:style(declarations)` or `selectorList:remove()`
 */
// eslint-disable-next-line max-len
const UBO_CSS_INJECTION_PATTERN = /^(?<selectors>.+)(?:(?<style>:style\()(?<declarations>.+)\)|(?<remove>:remove\(\)))$/;
/**
 * `selectorList { declarations }`
 */
const ADG_CSS_INJECTION_PATTERN = /^(?:.+){(?:.+)}$/;
/**
 * `CssInjectionBodyParser` is responsible for parsing a CSS injection body.
 *
 * Please note that not all adblockers support CSS injection in the same way, e.g. uBO does not support media queries.
 *
 * Example rules (AdGuard):
 *  - ```adblock
 *    example.com#$#body { padding-top: 0 !important; }
 *    ```
 *  - ```adblock
 *    example.com#$#@media (min-width: 1024px) { body { padding-top: 0 !important; } }
 *    ```
 *  - ```adblock
 *    example.com#$?#@media (min-width: 1024px) { .something:has(.ads) { padding-top: 0 !important; } }
 *    ```
 *  - ```adblock
 *    example.com#$#.ads { remove: true; }
 *    ```
 *
 * Example rules (uBlock Origin):
 *  - ```adblock
 *    example.com##body:style(padding-top: 0 !important;)
 *    ```
 *  - ```adblock
 *    example.com##.ads:remove()
 *    ```
 *
 * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#cosmetic-css-rules}
 * @see {@link https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#subjectstylearg}
 * @see {@link https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#subjectremove}
 */
class CssInjectionBodyParser {
    /**
     * Checks if a selector is a uBlock CSS injection.
     *
     * @param raw Raw selector body
     * @returns `true` if the selector is a uBlock CSS injection, `false` otherwise
     */
    static isUboCssInjection(raw) {
        const trimmed = raw.trim();
        // Since it runs on every element hiding rule, we want to avoid unnecessary regex checks,
        // so we first check if the selector contains either `:style(` or `:remove(`.
        if (trimmed.indexOf(COLON + STYLE + OPEN_PARENTHESIS) !== -1
            || trimmed.indexOf(COLON + REMOVE + OPEN_PARENTHESIS) !== -1) {
            return UBO_CSS_INJECTION_PATTERN.test(trimmed);
        }
        return false;
    }
    /**
     * Checks if a selector is an AdGuard CSS injection.
     *
     * @param raw Raw selector body
     * @returns `true` if the selector is an AdGuard CSS injection, `false` otherwise
     */
    static isAdgCssInjection(raw) {
        return ADG_CSS_INJECTION_PATTERN.test(raw.trim());
    }
    /**
     * Parses a uBlock Origin CSS injection body.
     *
     * @param raw Raw CSS injection body
     * @param loc Location of the body
     * @returns Parsed CSS injection body
     * @throws {AdblockSyntaxError} If the body is invalid or unsupported
     */
    static parseUboStyleInjection(raw, loc = defaultLocation) {
        const selectorList = CssTree.parse(raw, CssTreeParserContext.selectorList, false, loc);
        const plainSelectorList = {
            type: CssTreeNodeType.SelectorList,
            children: [],
        };
        let mediaQueryList;
        let declarationList;
        let remove;
        // Check selector list
        if (selectorList.type !== CssTreeNodeType.SelectorList) {
            throw new AdblockSyntaxError(
            // eslint-disable-next-line max-len
            `Invalid selector list, expected '${CssTreeNodeType.SelectorList}' but got '${selectorList.type || NONE}' instead`, locRange(loc, 0, raw.length));
        }
        // Convert selector list to regular array
        const selectors = selectorList.children.toArray();
        // Iterate over selectors
        for (let i = 0; i < selectors.length; i += 1) {
            // Store current selector (just for convenience)
            const selector = selectors[i];
            // Type guard for the actual selector
            if (selector.type !== CssTreeNodeType.Selector) {
                throw new AdblockSyntaxError(
                // eslint-disable-next-line max-len
                `Invalid selector, expected '${CssTreeNodeType.Selector}' but got '${selector.type || NONE}' instead`, {
                    start: selector.loc?.start ?? loc,
                    end: selector.loc?.end ?? shiftLoc(loc, raw.length),
                });
            }
            // Not the last selector
            if (i !== selectors.length - 1) {
                // Special pseudo-classes (:style, :remove, :matches-media) can only be used in the last selector
                walk(selector, (node) => {
                    // eslint-disable-next-line max-len
                    if (node.type === CssTreeNodeType.PseudoClassSelector && SPECIAL_PSEUDO_CLASSES.includes(node.name)) {
                        throw new AdblockSyntaxError(`Invalid selector, pseudo-class '${node.name}' can only be used in the last selector`, {
                            start: node.loc?.start ?? loc,
                            end: node.loc?.end ?? shiftLoc(loc, raw.length),
                        });
                    }
                });
                // Add selector to plain selector list
                plainSelectorList.children.push(toPlainObject(selector));
            }
            else if (i === selectors.length - 1) {
                // Last selector can (should) contain special pseudo-classes
                const regularSelector = {
                    type: CssTreeNodeType.Selector,
                    children: new List(),
                };
                let depth = 0;
                walk(selector, {
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    enter: (node) => {
                        // Increment depth
                        depth += 1;
                        if (node.type === CssTreeNodeType.PseudoClassSelector) {
                            if (SPECIAL_PSEUDO_CLASSES.includes(node.name)) {
                                // Only allow special pseudo-classes at the top level
                                // Depth look like this:
                                //   1: Selector (root)
                                //   2: Direct child of the root selector (e.g. TypeSelector, PseudoClassSelector, etc.)
                                //      ...
                                if (depth !== 2) {
                                    throw new AdblockSyntaxError(
                                    // eslint-disable-next-line max-len
                                    `Invalid selector, pseudo-class '${node.name}' can only be used at the top level of the selector`, {
                                        start: node.loc?.start ?? loc,
                                        end: node.loc?.end ?? shiftLoc(loc, raw.length),
                                    });
                                }
                                // :matches-media(...)
                                if (node.name === MATCHES_MEDIA) {
                                    if (mediaQueryList) {
                                        throw new AdblockSyntaxError(`Duplicated pseudo-class '${node.name}'`, {
                                            start: node.loc?.start ?? loc,
                                            end: node.loc?.end ?? shiftLoc(loc, raw.length),
                                        });
                                    }
                                    // eslint-disable-next-line max-len
                                    if (!node.children || !node.children.first || node.children.first.type !== CssTreeNodeType.MediaQueryList) {
                                        throw new AdblockSyntaxError(
                                        // eslint-disable-next-line max-len
                                        `Invalid selector, pseudo-class '${node.name}' must be parametrized with a media query list`, {
                                            start: node.loc?.start ?? loc,
                                            end: node.loc?.end ?? shiftLoc(loc, raw.length),
                                        });
                                    }
                                    // Store media query list, but convert it to a plain object first
                                    mediaQueryList = toPlainObject(node.children.first);
                                    return;
                                }
                                // :style(...)
                                if (node.name === STYLE) {
                                    if (declarationList) {
                                        throw new AdblockSyntaxError(`Duplicated pseudo-class '${node.name}'`, {
                                            start: node.loc?.start ?? loc,
                                            end: node.loc?.end ?? shiftLoc(loc, raw.length),
                                        });
                                    }
                                    // Remove selected elements or style them, but not both
                                    if (remove) {
                                        throw new AdblockSyntaxError(`'${STYLE}' and '${REMOVE}' cannot be used together`, {
                                            start: node.loc?.start ?? loc,
                                            end: node.loc?.end ?? shiftLoc(loc, raw.length),
                                        });
                                    }
                                    // eslint-disable-next-line max-len
                                    if (!node.children || !node.children.first || node.children.first.type !== CssTreeNodeType.DeclarationList) {
                                        throw new AdblockSyntaxError(
                                        // eslint-disable-next-line max-len
                                        `Invalid selector, pseudo-class '${node.name}' must be parametrized with a declaration list`, {
                                            start: node.loc?.start ?? loc,
                                            end: node.loc?.end ?? shiftLoc(loc, raw.length),
                                        });
                                    }
                                    // Store declaration list, but convert it to plain object first
                                    declarationList = toPlainObject(node.children.first);
                                    return;
                                }
                                // :remove()
                                if (node.name === REMOVE) {
                                    if (remove) {
                                        throw new AdblockSyntaxError(`Duplicated pseudo-class '${node.name}'`, {
                                            start: node.loc?.start ?? loc,
                                            end: node.loc?.end ?? shiftLoc(loc, raw.length),
                                        });
                                    }
                                    // Remove selected elements or style them, but not both
                                    if (declarationList) {
                                        throw new AdblockSyntaxError(`'${STYLE}' and '${REMOVE}' cannot be used together`, {
                                            start: node.loc?.start ?? loc,
                                            end: node.loc?.end ?? shiftLoc(loc, raw.length),
                                        });
                                    }
                                    // Set remove flag to true (and don't store anything)
                                    remove = true;
                                    return;
                                }
                            }
                        }
                        // If the node is a direct child of the selector (depth === 2) and it's not a special
                        // pseudo-class, then it's a regular selector element, so add it to the regular selector
                        // (We split the selector into two parts: regular selector and special pseudo-classes)
                        if (depth === 2) {
                            // Regular selector elements can't be used after special pseudo-classes
                            if (mediaQueryList || declarationList || remove) {
                                throw new AdblockSyntaxError(
                                // eslint-disable-next-line max-len
                                'Invalid selector, regular selector elements cannot be used after special pseudo-classes', {
                                    start: node.loc?.start ?? loc,
                                    end: shiftLoc(loc, raw.length),
                                });
                            }
                            regularSelector.children.push(node);
                        }
                    },
                    leave: () => {
                        // Decrement depth
                        depth -= 1;
                    },
                });
                // Store the last selector with special pseudo-classes
                plainSelectorList.children.push(toPlainObject(regularSelector));
            }
        }
        // At least one of the following must be present: declaration list, :remove() pseudo-class
        if (!declarationList && !remove) {
            throw new AdblockSyntaxError('No CSS declaration list or :remove() pseudo-class found', locRange(loc, 0, raw.length));
        }
        return {
            type: 'CssInjectionRuleBody',
            loc: locRange(loc, 0, raw.length),
            selectorList: plainSelectorList,
            mediaQueryList,
            declarationList,
            remove,
        };
    }
    /**
     * Parse a CSS injection rule body from a raw string. It determines the syntax
     * automatically.
     *
     * @param raw Raw CSS injection rule body
     * @param loc Location of the body
     * @returns CSS injection rule body AST
     * @throws {AdblockSyntaxError} If the raw string is not a valid CSS injection rule body
     */
    static parse(raw, loc = defaultLocation) {
        // Parse stylesheet in tolerant mode.
        // "stylesheet" context handles "at-rules" and "rules", but if we only have a single
        // selector, then the strict parser will throw an error, but the tolerant parser will
        // parses it as a raw fragment.
        const stylesheet = CssTree.parse(raw, CssTreeParserContext.stylesheet, true, loc);
        // Check stylesheet
        if (stylesheet.type !== CssTreeNodeType.StyleSheet) {
            throw new AdblockSyntaxError(`Invalid stylesheet, expected '${CssTreeNodeType.StyleSheet}' but got '${stylesheet.type}' instead`, {
                start: stylesheet.loc?.start ?? loc,
                end: stylesheet.loc?.end ?? shiftLoc(loc, raw.length),
            });
        }
        // Stylesheet should contain a single rule
        if (stylesheet.children.size !== 1) {
            throw new AdblockSyntaxError(`Invalid stylesheet, expected a single rule but got ${stylesheet.children.size} instead`, {
                start: stylesheet.loc?.start ?? loc,
                end: stylesheet.loc?.end ?? shiftLoc(loc, raw.length),
            });
        }
        // At this point there are 3 possible cases:
        //
        // 1. At-rule (ADG):
        //      @media (media query list) { selector list { declaration list } }
        //      @media (media query list) { selector list { remove: true; } }
        //
        // 2. Rule (ADG):
        //      selector list { declaration list }
        //      selector list { remove: true; }
        //
        // 3. Raw:
        //      selector list:style(declaration list)
        //      selector list:remove()
        //      selector list:matches-media(media query list):style(declaration list)
        //      selector list:matches-media(media query list):remove()
        //      invalid input
        //
        const injection = stylesheet.children.first;
        if (!injection) {
            throw new AdblockSyntaxError('Invalid style injection, expected a CSS rule or at-rule, but got nothing', {
                start: stylesheet.loc?.start ?? loc,
                end: stylesheet.loc?.end ?? shiftLoc(loc, raw.length),
            });
        }
        let mediaQueryList;
        let rule;
        // Try to parse Raw fragment as uBO style injection
        if (injection.type === CssTreeNodeType.Raw) {
            return CssInjectionBodyParser.parseUboStyleInjection(raw, loc);
        }
        // Parse AdGuard style injection
        if (injection.type !== CssTreeNodeType.Rule && injection.type !== CssTreeNodeType.Atrule) {
            throw new AdblockSyntaxError(
            // eslint-disable-next-line max-len
            `Invalid injection, expected '${CssTreeNodeType.Rule}' or '${CssTreeNodeType.Atrule}' but got '${injection.type ?? NONE}' instead`, {
                start: injection.loc?.start ?? loc,
                end: injection.loc?.end ?? shiftLoc(loc, raw.length),
            });
        }
        // At-rule injection (typically used for media queries, but later can be extended easily)
        // TODO: Extend to support other at-rules if needed
        if (injection.type === CssTreeNodeType.Atrule) {
            const atrule = injection;
            // Check at-rule name
            if (atrule.name !== MEDIA) {
                throw new AdblockSyntaxError(`Invalid at-rule name, expected '${MEDIA_MARKER}' but got '${AT_SIGN}${atrule.name}' instead`, {
                    start: atrule.loc?.start ?? loc,
                    end: atrule.loc?.end ?? shiftLoc(loc, raw.length),
                });
            }
            // Check at-rule prelude
            if (!atrule.prelude || atrule.prelude.type !== CssTreeNodeType.AtrulePrelude) {
                throw new AdblockSyntaxError(
                // eslint-disable-next-line max-len
                `Invalid at-rule prelude, expected '${CssTreeNodeType.AtrulePrelude}' but got '${atrule.prelude?.type ?? NONE}' instead`, {
                    start: atrule.loc?.start ?? loc,
                    end: atrule.loc?.end ?? shiftLoc(loc, raw.length),
                });
            }
            // At-rule prelude should contain a single media query list
            // eslint-disable-next-line max-len
            if (!atrule.prelude.children.first || atrule.prelude.children.first.type !== CssTreeNodeType.MediaQueryList) {
                throw new AdblockSyntaxError(
                // eslint-disable-next-line max-len
                `Invalid at-rule prelude, expected a media query list but got '${atrule.prelude.children.first?.type ?? NONE}' instead`, {
                    start: atrule.loc?.start ?? loc,
                    end: atrule.loc?.end ?? shiftLoc(loc, raw.length),
                });
            }
            // Check at-rule block
            if (!atrule.block || atrule.block.type !== CssTreeNodeType.Block) {
                throw new AdblockSyntaxError(
                // eslint-disable-next-line max-len
                `Invalid at-rule block, expected '${CssTreeNodeType.Block}' but got '${atrule.block?.type ?? NONE}' instead`, {
                    start: atrule.loc?.start ?? loc,
                    end: atrule.loc?.end ?? shiftLoc(loc, raw.length),
                });
            }
            // At-rule block should contain a single rule
            if (!atrule.block.children.first || atrule.block.children.first.type !== CssTreeNodeType.Rule) {
                throw new AdblockSyntaxError(
                // eslint-disable-next-line max-len
                `Invalid at-rule block, expected a rule but got '${atrule.block.children.first?.type ?? NONE}' instead`, {
                    start: atrule.loc?.start ?? loc,
                    end: atrule.loc?.end ?? shiftLoc(loc, raw.length),
                });
            }
            mediaQueryList = atrule.prelude.children.first;
            rule = atrule.block.children.first;
        }
        else {
            // Otherwise the whole injection is a simple CSS rule (without at-rule)
            rule = injection;
        }
        // Check rule prelude
        if (!rule.prelude || rule.prelude.type !== CssTreeNodeType.SelectorList) {
            throw new AdblockSyntaxError(`Invalid rule prelude, expected a selector list but got '${rule.prelude?.type ?? NONE}' instead`, {
                start: rule.loc?.start ?? loc,
                end: rule.loc?.end ?? shiftLoc(loc, raw.length),
            });
        }
        // Don't allow :remove() in the selector list at this point, because
        // it doesn't make sense to have it here:
        //  - we parsed 'selector list:remove()' case as uBO-way before, and
        //  - we parse 'selector list { remove: true; }' case as ADG-way
        //    at the end of this function
        walk(rule.prelude, (node) => {
            if (node.type === CssTreeNodeType.PseudoClassSelector) {
                if (node.name === REMOVE) {
                    throw new AdblockSyntaxError(`Invalid selector list, '${REMOVE}' pseudo-class should be used in the declaration list`, {
                        start: node.loc?.start ?? loc,
                        end: node.loc?.end ?? shiftLoc(loc, raw.length),
                    });
                }
            }
        });
        // Check rule block
        if (!rule.block || rule.block.type !== CssTreeNodeType.Block) {
            throw new AdblockSyntaxError(`Invalid rule block, expected a block but got '${rule.block?.type ?? NONE}' instead`, locRange(loc, rule.loc?.start.offset ?? 0, raw.length));
        }
        // Rule block should contain a Declaration nodes
        rule.block.children.forEach((node) => {
            if (node.type !== CssTreeNodeType.Declaration) {
                throw new AdblockSyntaxError(`Invalid rule block, expected a declaration but got '${node.type}' instead`, {
                    start: node.loc?.start ?? loc,
                    end: node.loc?.end ?? shiftLoc(loc, raw.length),
                });
            }
        });
        const declarationList = {
            type: 'DeclarationList',
            loc: rule.block.loc,
            children: [],
        };
        const declarationKeys = [];
        let remove = false;
        // Walk through the rule block and collect declarations
        walk(rule.block, {
            enter(node) {
                if (node.type === CssTreeNodeType.Declaration) {
                    declarationList.children.push(toPlainObject(node));
                    declarationKeys.push(node.property);
                }
            },
        });
        // Check for "remove" declaration
        if (declarationKeys.includes(REMOVE)) {
            if (declarationKeys.length > 1) {
                throw new AdblockSyntaxError(`Invalid declaration list, '${REMOVE}' declaration should be used alone`, {
                    start: rule.block.loc?.start ?? loc,
                    end: rule.block.loc?.end ?? shiftLoc(loc, raw.length),
                });
            }
            remove = true;
        }
        // It is safe to cast plain objects here
        return {
            type: 'CssInjectionRuleBody',
            loc: locRange(loc, 0, raw.length),
            mediaQueryList: mediaQueryList ? toPlainObject(mediaQueryList) : undefined,
            selectorList: toPlainObject(rule.prelude),
            declarationList: remove ? undefined : declarationList,
            remove,
        };
    }
    /**
     * Generates a string representation of the CSS injection rule body (serialized).
     *
     * @param ast Raw CSS injection rule body
     * @param syntax Syntax to use (default: AdGuard)
     * @returns String representation of the CSS injection rule body
     * @throws If the body is invalid
     */
    static generate(ast, syntax = AdblockSyntax.Adg) {
        let result = EMPTY;
        if (ast.remove && ast.declarationList) {
            throw new Error('Invalid body, both "remove" and "declarationList" are present');
        }
        if (syntax === AdblockSyntax.Adg) {
            if (ast.mediaQueryList) {
                result += MEDIA_MARKER;
                result += SPACE;
                result += CssTree.generateMediaQueryList(fromPlainObject(ast.mediaQueryList));
                result += SPACE;
                result += OPEN_CURLY_BRACKET;
                result += SPACE;
            }
            result += CssTree.generateSelectorList(fromPlainObject(ast.selectorList));
            result += SPACE;
            result += OPEN_CURLY_BRACKET;
            result += SPACE;
            if (ast.remove) {
                result += REMOVE_DECLARATION;
            }
            else if (ast.declarationList) {
                result += CssTree.generateDeclarationList(fromPlainObject(ast.declarationList));
            }
            else {
                throw new Error('Invalid body');
            }
            result += SPACE;
            result += CLOSE_CURLY_BRACKET;
            if (ast.mediaQueryList) {
                result += SPACE;
                result += CLOSE_CURLY_BRACKET;
            }
        }
        else if (syntax === AdblockSyntax.Ubo) {
            // Generate regular selector list
            result += CssTree.generateSelectorList(fromPlainObject(ast.selectorList));
            // Generate media query list, if present (:matches-media(...))
            if (ast.mediaQueryList) {
                result += COLON;
                result += MATCHES_MEDIA;
                result += OPEN_PARENTHESIS;
                result += CssTree.generateMediaQueryList(fromPlainObject(ast.mediaQueryList));
                result += CLOSE_PARENTHESIS;
            }
            // Generate remove or style pseudo-class (:remove() or :style(...))
            if (ast.remove) {
                result += COLON;
                result += REMOVE;
                result += OPEN_PARENTHESIS;
                result += CLOSE_PARENTHESIS;
            }
            else if (ast.declarationList) {
                result += COLON;
                result += STYLE;
                result += OPEN_PARENTHESIS;
                result += CssTree.generateDeclarationList(fromPlainObject(ast.declarationList));
                result += CLOSE_PARENTHESIS;
            }
            else {
                throw new Error('Invalid body');
            }
        }
        else {
            throw new Error(`Unsupported syntax: ${syntax}`);
        }
        return result;
    }
}

/**
 * @file Scriptlet injection rule body parser
 */
/**
 * `ScriptletBodyParser` is responsible for parsing the body of a scriptlet rule.
 *
 * Please note that the parser will parse any scriptlet rule if it is syntactically correct.
 * For example, it will parse this:
 * ```adblock
 * example.com#%#//scriptlet('scriptlet0', 'arg0')
 * ```
 *
 * but it didn't check if the scriptlet `scriptlet0` actually supported by any adblocker.
 *
 * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#scriptlets}
 * @see {@link https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#scriptlet-injection}
 * @see {@link https://help.eyeo.com/adblockplus/snippet-filters-tutorial}
 */
class ScriptletInjectionBodyParser {
    /**
     * Parses a raw ADG/uBO scriptlet call body.
     *
     * @param raw Raw scriptlet call body
     * @param loc Location of the body
     * @returns Scriptlet rule body AST
     * @throws If the body is syntactically incorrect
     * @example
     * ```
     * //scriptlet('scriptlet0', 'arg0')
     * js(scriptlet0, arg0, arg1, arg2)
     * ```
     */
    static parseAdgAndUboScriptletCall(raw, loc = defaultLocation) {
        let offset = 0;
        // Skip leading spaces
        offset = StringUtils.skipWS(raw, offset);
        // Scriptlet call should start with "js" or "//scriptlet"
        if (raw.startsWith(ADG_SCRIPTLET_MASK, offset)) {
            offset += ADG_SCRIPTLET_MASK.length;
        }
        else if (raw.startsWith(UBO_SCRIPTLET_MASK, offset)) {
            offset += UBO_SCRIPTLET_MASK.length;
        }
        else {
            throw new AdblockSyntaxError(
            // eslint-disable-next-line max-len
            `Invalid AdGuard/uBlock scriptlet call, no scriptlet call mask '${ADG_SCRIPTLET_MASK}' or '${UBO_SCRIPTLET_MASK}' found`, locRange(loc, offset, raw.length));
        }
        // Whitespace is not allowed after the mask
        if (raw[offset] === SPACE) {
            throw new AdblockSyntaxError('Invalid AdGuard/uBlock scriptlet call, whitespace is not allowed after the scriptlet call mask', locRange(loc, offset, offset + 1));
        }
        // Parameter list should be wrapped in parentheses
        if (raw[offset] !== OPEN_PARENTHESIS) {
            throw new AdblockSyntaxError(
            // eslint-disable-next-line max-len
            `Invalid AdGuard/uBlock scriptlet call, no opening parentheses '${OPEN_PARENTHESIS}' found`, locRange(loc, offset, raw.length));
        }
        // Save the offset of the opening parentheses
        const openingParenthesesIndex = offset;
        // Skip whitespace from the end
        const closingParenthesesIndex = StringUtils.skipWSBack(raw, raw.length - 1);
        // Closing parentheses should be present
        if (raw[closingParenthesesIndex] !== CLOSE_PARENTHESIS
            || raw[closingParenthesesIndex - 1] === ESCAPE_CHARACTER) {
            throw new AdblockSyntaxError(
            // eslint-disable-next-line max-len
            `Invalid AdGuard/uBlock scriptlet call, no closing parentheses '${CLOSE_PARENTHESIS}' found`, locRange(loc, offset, raw.length));
        }
        // Parse parameter list
        const params = ParameterListParser.parse(raw.substring(openingParenthesesIndex + 1, closingParenthesesIndex), COMMA, shiftLoc(loc, openingParenthesesIndex + 1));
        // Allow empty scritptlet call: js() or //scriptlet(), but not allow parameters
        // without scriptlet: js(, arg0, arg1) or //scriptlet(, arg0, arg1)
        if (params.children.length > 0 && params.children[0].value.trim() === EMPTY) {
            throw new AdblockSyntaxError(
            // eslint-disable-next-line max-len
            'Invalid AdGuard/uBlock scriptlet call, no scriptlet name specified', locRange(loc, offset, raw.length));
        }
        return {
            type: 'ScriptletInjectionRuleBody',
            loc: locRange(loc, 0, raw.length),
            children: [
                params,
            ],
        };
    }
    /**
     * Parses a raw ABP scriptlet call body.
     *
     * @param raw Raw scriptlet call body
     * @param loc Body location
     * @returns Parsed scriptlet rule body
     * @throws If the body is syntactically incorrect
     * @example
     * ```
     * scriptlet0 arg0 arg1 arg2; scriptlet1 arg0 arg1 arg2
     * ```
     */
    static parseAbpSnippetCall(raw, loc = defaultLocation) {
        const result = {
            type: 'ScriptletInjectionRuleBody',
            loc: locRange(loc, 0, raw.length),
            children: [],
        };
        let offset = 0;
        // Skip leading spaces
        offset = StringUtils.skipWS(raw, offset);
        while (offset < raw.length) {
            offset = StringUtils.skipWS(raw, offset);
            const scriptletCallStart = offset;
            // Find the next semicolon or the end of the string
            let semicolonIndex = StringUtils.findUnescapedNonStringNonRegexChar(raw, SEMICOLON, offset);
            if (semicolonIndex === -1) {
                semicolonIndex = raw.length;
            }
            const scriptletCallEnd = Math.max(StringUtils.skipWSBack(raw, semicolonIndex - 1) + 1, scriptletCallStart);
            const params = ParameterListParser.parse(raw.substring(scriptletCallStart, scriptletCallEnd), SPACE, shiftLoc(loc, scriptletCallStart));
            // Parse the scriptlet call
            result.children.push(params);
            // Skip the semicolon
            offset = semicolonIndex + 1;
        }
        if (result.children.length === 0) {
            throw new AdblockSyntaxError(
            // eslint-disable-next-line max-len
            'Invalid ABP snippet call, no scriptlets specified at all', locRange(loc, 0, raw.length));
        }
        return result;
    }
    /**
     * Parses the specified scriptlet injection rule body into an AST.
     *
     * @param raw Raw rule body
     * @param syntax Preferred syntax to use. If not specified, the syntax will be
     * automatically detected, but it may lead to incorrect parsing results.
     * @param loc Rule body location
     * @returns Parsed rule body
     * @throws If the rule body is syntactically incorrect
     */
    static parse(raw, syntax = null, loc = defaultLocation) {
        const trimmed = raw.trim();
        if ((syntax === null && (trimmed.startsWith(ADG_SCRIPTLET_MASK)
            // We shouldn't parse ABP's json-prune as a uBlock scriptlet call
            || (trimmed.startsWith(UBO_SCRIPTLET_MASK) && !trimmed.startsWith('json'))))
            || syntax === AdblockSyntax.Adg
            || syntax === AdblockSyntax.Ubo) {
            return ScriptletInjectionBodyParser.parseAdgAndUboScriptletCall(trimmed, loc);
        }
        return ScriptletInjectionBodyParser.parseAbpSnippetCall(trimmed, loc);
    }
    /**
     * Generates a string representation of the rule body for the specified syntax.
     *
     * @param ast Scriptlet injection rule body
     * @param syntax Syntax to use
     * @returns String representation of the rule body
     * @throws If the rule body is not supported by the specified syntax
     * @throws If the AST is invalid
     */
    static generate(ast, syntax) {
        let result = EMPTY;
        if (ast.children.length === 0) {
            throw new Error('Invalid AST, no scriptlet calls specified');
        }
        // AdGuard and uBlock doesn't support multiple scriptlet calls in one rule
        if (syntax === AdblockSyntax.Adg || syntax === AdblockSyntax.Ubo) {
            if (ast.children.length > 1) {
                throw new Error('AdGuard and uBlock syntaxes don\'t support multiple scriptlet calls in one rule');
            }
            const scriptletCall = ast.children[0];
            if (scriptletCall.children.length === 0) {
                throw new Error('Scriptlet name is not specified');
            }
            if (syntax === AdblockSyntax.Adg) {
                result += ADG_SCRIPTLET_MASK;
            }
            else {
                result += UBO_SCRIPTLET_MASK;
            }
            result += OPEN_PARENTHESIS;
            result += ParameterListParser.generate(scriptletCall);
            result += CLOSE_PARENTHESIS;
        }
        else {
            // First generate a string representation of all scriptlet calls, then join them with semicolons
            const scriptletCalls = [];
            for (const scriptletCall of ast.children) {
                if (scriptletCall.children.length === 0) {
                    throw new Error('Scriptlet name is not specified');
                }
                scriptletCalls.push(ParameterListParser.generate(scriptletCall, SPACE));
            }
            result += scriptletCalls.join(SEMICOLON + SPACE);
        }
        return result;
    }
}

/**
 * @file HTML filtering rule body parser
 */
/**
 * `HtmlBodyParser` is responsible for parsing the body of HTML filtering rules.
 *
 * Please note that this parser will read ANY selector if it is syntactically correct.
 * Checking whether this selector is actually compatible with a given adblocker is not
 * done at this level.
 *
 * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#html-filtering-rules}
 * @see {@link https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#html-filters}
 */
class HtmlFilteringBodyParser {
    /**
     * Convert "" to \" within strings, because CSSTree does not recognize "".
     *
     * @param selector CSS selector string
     * @returns Escaped CSS selector
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#tag-content}
     */
    static escapeDoubleQuotes(selector) {
        let withinString = false;
        let result = EMPTY;
        for (let i = 0; i < selector.length; i += 1) {
            if (!withinString && selector[i] === DOUBLE_QUOTE_MARKER) {
                withinString = true;
                result += selector[i];
            }
            else if (withinString && selector[i] === DOUBLE_QUOTE_MARKER && selector[i + 1] === DOUBLE_QUOTE_MARKER) {
                result += ESCAPE_CHARACTER + DOUBLE_QUOTE_MARKER;
                i += 1;
            }
            else if (withinString && selector[i] === DOUBLE_QUOTE_MARKER && selector[i + 1] !== DOUBLE_QUOTE_MARKER) {
                result += DOUBLE_QUOTE_MARKER;
                withinString = false;
            }
            else {
                result += selector[i];
            }
        }
        return result;
    }
    /**
     * Convert \" to "" within strings.
     *
     * @param selector CSS selector string
     * @returns Unescaped CSS selector
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#tag-content}
     */
    static unescapeDoubleQuotes(selector) {
        let withinString = false;
        let result = EMPTY;
        for (let i = 0; i < selector.length; i += 1) {
            if (selector[i] === DOUBLE_QUOTE_MARKER && selector[i - 1] !== ESCAPE_CHARACTER) {
                withinString = !withinString;
                result += selector[i];
            }
            else if (withinString && selector[i] === ESCAPE_CHARACTER && selector[i + 1] === DOUBLE_QUOTE_MARKER) {
                result += DOUBLE_QUOTE_MARKER;
            }
            else {
                result += selector[i];
            }
        }
        return result;
    }
    /**
     * Parses a raw cosmetic rule body as an HTML filtering rule body.
     * Please note that compatibility is not yet checked at this point.
     *
     * @param raw Raw body
     * @param loc Location of the body
     * @throws If the body is not syntactically correct (CSSTree throws)
     * @returns HTML filtering rule body AST
     */
    static parse(raw, loc = defaultLocation) {
        // Convert "" to \" (this theoretically does not affect the uBlock rules)
        const escapedRawBody = HtmlFilteringBodyParser.escapeDoubleQuotes(raw);
        // eslint-disable-next-line max-len
        let body;
        try {
            // Try to parse the body as a CSS selector list (default)
            body = CssTree.parsePlain(escapedRawBody, CssTreeParserContext.selectorList, false, loc);
        }
        catch (error) {
            // If the body is not a selector list, it might be a function node: `example.org##^responseheader(name)`
            // We should check this error "strictly", because we don't want to loose other previously detected selector
            // errors (if any).
            if (error instanceof Error && error.message.indexOf('Selector is expected') !== -1) {
                const ast = CssTree.parsePlain(escapedRawBody, CssTreeParserContext.value, false, loc);
                if (ast.type !== 'Value') {
                    throw new AdblockSyntaxError(`Expected a 'Value' node first child, got '${ast.type}'`, locRange(loc, 0, raw.length));
                }
                // First child must be a function node
                const func = ast.children[0];
                if (func.type !== 'Function') {
                    throw new AdblockSyntaxError(`Expected a 'Function' node, got '${func.type}'`, locRange(loc, 0, raw.length));
                }
                body = func;
            }
            else {
                throw error;
            }
        }
        return {
            type: 'HtmlFilteringRuleBody',
            loc: locRange(loc, 0, raw.length),
            body,
        };
    }
    /**
     * Converts an HTML filtering rule body AST to a string.
     *
     * @param ast HTML filtering rule body AST
     * @param syntax Desired syntax of the generated result
     * @returns Raw string
     */
    static generate(ast, syntax = AdblockSyntax.Adg) {
        if (syntax === AdblockSyntax.Adg && ast.body.type === 'Function') {
            throw new Error('AdGuard syntax does not support function nodes');
        }
        let result = EMPTY;
        if (ast.body.type === 'SelectorList') {
            result = CssTree.generateSelectorList(fromPlainObject(ast.body));
        }
        else if (ast.body.type === 'Function') {
            result = generate(fromPlainObject(ast.body));
        }
        else {
            throw new Error('Unexpected body type');
        }
        // In the case of AdGuard syntax, the "" case must be handled
        if (syntax === AdblockSyntax.Adg) {
            result = HtmlFilteringBodyParser.unescapeDoubleQuotes(result);
        }
        return result;
    }
}

/**
 * Checks whether the given value is undefined.
 *
 * @param value Value to check.
 *
 * @returns True if the value type is not 'undefined'.
 */
const isUndefined = (value) => {
    return typeof value === 'undefined';
};

/**
 * @file Utility functions for working with modifier nodes
 */
/**
 * Creates a modifier node
 *
 * @param name Name of the modifier
 * @param value Value of the modifier
 * @param exception Whether the modifier is an exception
 * @returns Modifier node
 */
function createModifierNode(name, value = undefined, exception = false) {
    const result = {
        type: 'Modifier',
        exception,
        modifier: {
            type: 'Value',
            value: name,
        },
    };
    if (!isUndefined(value)) {
        result.value = {
            type: 'Value',
            value,
        };
    }
    return result;
}
/**
 * Creates a modifier list node
 *
 * @param modifiers Modifiers to put in the list (optional, defaults to an empty list)
 * @returns Modifier list node
 */
function createModifierListNode(modifiers = []) {
    const result = {
        type: 'ModifierList',
        // We need to clone the modifiers to avoid side effects
        children: modifiers.length ? clone(modifiers) : [],
    };
    return result;
}

/**
 * @file Utility to extract UBO rule modifiers from a selector list
 *
 * uBO rule modifiers are special pseudo-classes that are used to specify
 * the rule's behavior, for example, if you want to apply the rule only
 * to a specific path, you can use the `:matches-path(...)` pseudo-class.
 */
const UBO_MODIFIERS_INDICATOR = ':matches-';
const MATCHES_PATH_OPERATOR = 'matches-path';
const NOT_OPERATOR = 'not';
/**
 * List of supported UBO rule modifiers
 */
// TODO: Add support for other modifiers, if needed
const SUPPORTED_UBO_RULE_MODIFIERS = new Set([
    MATCHES_PATH_OPERATOR,
]);
/**
 * Fast check to determine if the selector list contains UBO rule modifiers.
 * This function helps to avoid unnecessary walk through the selector list.
 *
 * @param rawSelectorList Raw selector list to check
 * @returns `true` if the selector list contains UBO rule modifiers, `false` otherwise
 */
function hasUboModifierIndicator(rawSelectorList) {
    return rawSelectorList.includes(UBO_MODIFIERS_INDICATOR);
}
/**
 * Helper function that always returns the linked list version of the
 * selector node.
 *
 * @param selector Selector to process
 * @returns Linked list based selector
 */
function convertSelectorToLinkedList(selector) {
    // TODO: Need to improve CSSTree types, until then we need to use any type here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return fromPlainObject(clone(selector));
}
/**
 * Helper function that always returns the linked list version of the
 * selector list node.
 *
 * @param selectorList Selector list to process
 * @returns Linked list based selector list
 */
function convertSelectorListToLinkedList(selectorList) {
    // TODO: Need to improve CSSTree types, until then we need to use any type here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return fromPlainObject(clone(selectorList));
}
/**
 * Helper function for checking and removing bounding combinators
 *
 * @param ref Reference to the CSSTree node
 * @param name Name to error message
 */
function handleBoundingCombinators(ref, name) {
    // Check preceding combinator
    if (ref.item.prev?.data.type === CssTreeNodeType.Combinator) {
        // Special case is space combinator, it's allowed, but should be removed
        if (ref.item.prev.data.name === SPACE) {
            // Remove the combinator
            ref.list?.remove(ref.item.prev);
        }
        else {
            // Throw an error for other combinator types
            throw new Error(`Unexpected combinator before '${name}'`);
        }
    }
    // Check following combinator
    if (ref.item.next?.data.type === CssTreeNodeType.Combinator) {
        // Special case is space combinator, it's allowed, but should be removed
        if (ref.item.next.data.name === SPACE) {
            // Remove the combinator
            ref.list?.remove(ref.item.next);
        }
        else {
            // Throw an error for other combinator types
            throw new Error(`Unexpected combinator after '${name}'`);
        }
    }
}
/**
 * Extract UBO rule modifiers from the selector and clean the selector AST from them.
 *
 * @param selector Selector to process (can be linked list or array based)
 * @returns Extracted UBO rule modifiers and cleaned selector list
 */
function extractUboModifiersFromSelector(selector) {
    // We need a linked list based AST here
    const cleaned = convertSelectorToLinkedList(selector);
    // Prepare the modifiers list, we should add the modifiers to it
    const modifiers = {
        type: 'ModifierList',
        children: [],
    };
    let depth = 0;
    let notRef;
    // Walk through the selector nodes
    walk(cleaned, {
        enter: (node, item, list) => {
            // Don't take into account selectors and selector lists
            if (node.type === CssTreeNodeType.Selector || node.type === CssTreeNodeType.SelectorList) {
                return;
            }
            // Set the :not() reference if we are on the top level
            if (node.type === CssTreeNodeType.PseudoClassSelector && node.name === NOT_OPERATOR && depth === 0) {
                notRef = {
                    node,
                    item,
                    list,
                };
            }
            depth += 1;
        },
        leave: (node, item, list) => {
            // Don't take into account selectors and selector lists
            if (node.type === CssTreeNodeType.Selector || node.type === CssTreeNodeType.SelectorList) {
                return;
            }
            if (node.type === CssTreeNodeType.PseudoClassSelector) {
                if (SUPPORTED_UBO_RULE_MODIFIERS.has(node.name)) {
                    // depth should be 1 for :matches-path(...) and 2 for :not(:matches-path(...))
                    if (depth !== (notRef ? 2 : 1)) {
                        throw new Error(`Unexpected depth for ':${node.name}(...)'`);
                    }
                    // uBO modifier can't be preceded nor followed by a combinator
                    handleBoundingCombinators({ node, item, list }, `:${node.name}(...)`);
                    // if we have :not() ref, then we should check if the uBO modifier is the only child of :not()
                    if (notRef && list.size !== 1) {
                        throw new Error(`Unexpected nodes inside ':not(:${node.name}(...))'`);
                    }
                    // Add the modifier to the modifiers list node
                    modifiers.children.push(createModifierNode(node.name, CssTree.generatePseudoClassValue(node), 
                    // :not(:matches-path(...)) should be an exception modifier
                    !isUndefined(notRef)));
                    if (notRef) {
                        // If we have :not() ref, then we should remove the :not() node
                        // (which also removes the uBO modifier node, since it's the parent
                        // of the uBO modifier node).
                        // But before removing the :not() node, we should check
                        // :not() isn't preceded nor followed by a combinator.
                        handleBoundingCombinators(notRef, `:not(:${node.name}(...))`);
                        notRef.list?.remove(notRef.item);
                    }
                    else {
                        // Otherwise just remove the uBO modifier node
                        list?.remove(item);
                    }
                }
            }
            depth -= 1;
            // Reset the :not() ref if we're leaving the :not() node at the top level
            if (node.type === CssTreeNodeType.PseudoClassSelector && node.name === NOT_OPERATOR && depth === 0) {
                notRef = undefined;
            }
        },
    });
    return {
        modifiers,
        cleaned: toPlainObject(cleaned),
    };
}
/**
 * Extract UBO rule modifiers from the selector list and clean the selector
 * list AST from them.
 *
 * @param selectorList Selector list to process (can be linked list or array based)
 * @returns Extracted UBO rule modifiers and cleaned selector list
 * @example
 * If you have the following adblock rule:
 * ```adblock
 * ##:matches-path(/path) .foo > .bar:has(.baz)
 * ```
 * Then this function extracts the `:matches-path(/path)` pseudo-class as
 * a rule modifier with key `matches-path` and value `/path` and and returns
 * the following selector list:
 * ```css
 * .foo > .bar:has(.baz)
 * ```
 * (this is the 'cleaned' selector list - a selector list without the
 * special uBO pseudo-classes)
 */
function extractUboModifiersFromSelectorList(selectorList) {
    // We need a linked list based AST here
    const cleaned = convertSelectorListToLinkedList(selectorList);
    // Prepare the modifiers list, we should add the modifiers to it
    const modifiers = {
        type: 'ModifierList',
        children: [],
    };
    // Walk through the selector list nodes
    cleaned.children.forEach((child) => {
        if (child.type === CssTreeNodeType.Selector) {
            const result = extractUboModifiersFromSelector(child);
            // Add the modifiers to the modifiers list
            modifiers.children.push(...result.modifiers.children);
            // Replace the selector with the cleaned one
            Object.assign(child, result.cleaned);
        }
    });
    return {
        modifiers,
        cleaned: toPlainObject(cleaned),
    };
}

/**
 * `CosmeticRuleParser` is responsible for parsing cosmetic rules.
 *
 * Where possible, it automatically detects the difference between supported syntaxes:
 *  - AdGuard
 *  - uBlock Origin
 *  - Adblock Plus
 *
 * If the syntax is common / cannot be determined, the parser gives `Common` syntax.
 *
 * Please note that syntactically correct rules are parsed even if they are not actually
 * compatible with the given adblocker. This is a completely natural behavior, meaningful
 * checking of compatibility is not done at the parser level.
 */
// TODO: Make raw body parsing optional
class CosmeticRuleParser {
    /**
     * Determines whether a rule is a cosmetic rule. The rule is considered cosmetic if it
     * contains a cosmetic rule separator.
     *
     * @param raw Raw rule
     * @returns `true` if the rule is a cosmetic rule, `false` otherwise
     */
    static isCosmeticRule(raw) {
        const trimmed = raw.trim();
        if (CommentRuleParser.isCommentRule(trimmed)) {
            return false;
        }
        return CosmeticRuleSeparatorUtils.find(trimmed) !== null;
    }
    /**
     * Parses a cosmetic rule. The structure of the cosmetic rules:
     *  - pattern (AdGuard pattern can have modifiers, other syntaxes don't)
     *  - separator
     *  - body
     *
     * @param raw Raw cosmetic rule
     * @param loc Location of the rule
     * @returns
     * Parsed cosmetic rule AST or null if it failed to parse based on the known cosmetic rules
     * @throws If the input matches the cosmetic rule pattern but syntactically invalid
     */
    static parse(raw, loc = defaultLocation) {
        // Find separator (every cosmetic rule has one)
        const separatorResult = CosmeticRuleSeparatorUtils.find(raw);
        // If there is no separator, it is not a cosmetic rule
        if (!separatorResult) {
            return null;
        }
        // The syntax is initially common
        let syntax = AdblockSyntax.Common;
        const patternStart = StringUtils.skipWS(raw);
        const patternEnd = StringUtils.skipWSBack(raw, separatorResult.start - 1) + 1;
        const bodyStart = separatorResult.end;
        const bodyEnd = StringUtils.skipWSBack(raw) + 1;
        // Parse pattern
        const rawPattern = raw.substring(patternStart, patternEnd);
        let domainListStart = patternStart;
        let rawDomainList = rawPattern;
        let modifiers;
        // AdGuard modifier list
        if (rawPattern[0] === OPEN_SQUARE_BRACKET) {
            if (rawPattern[1] !== DOLLAR_SIGN) {
                throw new AdblockSyntaxError(`Missing $ at the beginning of the AdGuard modifier list in pattern '${rawPattern}'`, locRange(loc, patternStart, patternEnd));
            }
            // Find the end of the modifier list
            const modifierListEnd = StringUtils.findNextUnescapedCharacter(rawPattern, CLOSE_SQUARE_BRACKET);
            if (modifierListEnd === -1) {
                throw new AdblockSyntaxError(`Missing ] at the end of the AdGuard modifier list in pattern '${rawPattern}'`, locRange(loc, patternStart, patternEnd));
            }
            // Parse modifier list
            modifiers = ModifierListParser.parse(rawPattern.substring(patternStart + 2, modifierListEnd), shiftLoc(loc, patternStart + 2));
            // Domain list is everything after the modifier list
            rawDomainList = rawPattern.substring(modifierListEnd + 1);
            domainListStart = modifierListEnd + 1;
            // Change syntax, since only AdGuard supports this type of modifier list
            syntax = AdblockSyntax.Adg;
        }
        // Parse domain list
        const domains = DomainListParser.parse(rawDomainList, ',', shiftLoc(loc, domainListStart));
        // Parse body
        const rawBody = raw.substring(bodyStart, bodyEnd);
        let body;
        // Separator node
        const separator = {
            type: 'Value',
            loc: locRange(loc, separatorResult.start, separatorResult.end),
            value: separatorResult.separator,
        };
        const exception = CosmeticRuleSeparatorUtils.isException(separatorResult.separator);
        switch (separatorResult.separator) {
            // Element hiding rules
            case '##':
            case '#@#':
            case '#?#':
            case '#@?#':
                // Check if the body is a uBO CSS injection. Since element hiding rules
                // are very common, we should check this with a fast check first.
                if (CssInjectionBodyParser.isUboCssInjection(rawBody)) {
                    if (syntax === AdblockSyntax.Adg) {
                        throw new AdblockSyntaxError('AdGuard modifier list is not supported in uBO CSS injection rules', locRange(loc, patternStart, patternEnd));
                    }
                    const uboCssInjectionRuleNode = {
                        category: RuleCategory.Cosmetic,
                        type: CosmeticRuleType.CssInjectionRule,
                        loc: locRange(loc, 0, raw.length),
                        raws: {
                            text: raw,
                        },
                        syntax: AdblockSyntax.Ubo,
                        exception,
                        modifiers,
                        domains,
                        separator,
                        body: {
                            ...CssInjectionBodyParser.parse(rawBody, shiftLoc(loc, bodyStart)),
                            raw: rawBody,
                        },
                    };
                    if (hasUboModifierIndicator(rawBody)) {
                        const extractedUboModifiers = extractUboModifiersFromSelectorList(uboCssInjectionRuleNode.body.selectorList);
                        if (extractedUboModifiers.modifiers.children.length > 0) {
                            if (!uboCssInjectionRuleNode.modifiers) {
                                uboCssInjectionRuleNode.modifiers = {
                                    type: 'ModifierList',
                                    children: [],
                                };
                            }
                            uboCssInjectionRuleNode.modifiers.children.push(...extractedUboModifiers.modifiers.children);
                            uboCssInjectionRuleNode.body.selectorList = extractedUboModifiers.cleaned;
                            uboCssInjectionRuleNode.syntax = AdblockSyntax.Ubo;
                        }
                    }
                    return uboCssInjectionRuleNode;
                }
                // eslint-disable-next-line no-case-declarations
                const elementHidingRuleNode = {
                    category: RuleCategory.Cosmetic,
                    type: CosmeticRuleType.ElementHidingRule,
                    loc: locRange(loc, 0, raw.length),
                    raws: {
                        text: raw,
                    },
                    syntax,
                    exception,
                    modifiers,
                    domains,
                    separator,
                    body: {
                        ...ElementHidingBodyParser.parse(rawBody, shiftLoc(loc, bodyStart)),
                        raw: rawBody,
                    },
                };
                if (hasUboModifierIndicator(rawBody)) {
                    const extractedUboModifiers = extractUboModifiersFromSelectorList(elementHidingRuleNode.body.selectorList);
                    if (extractedUboModifiers.modifiers.children.length > 0) {
                        if (!elementHidingRuleNode.modifiers) {
                            elementHidingRuleNode.modifiers = {
                                type: 'ModifierList',
                                children: [],
                            };
                        }
                        elementHidingRuleNode.modifiers.children.push(...extractedUboModifiers.modifiers.children);
                        elementHidingRuleNode.body.selectorList = extractedUboModifiers.cleaned;
                        elementHidingRuleNode.syntax = AdblockSyntax.Ubo;
                    }
                }
                return elementHidingRuleNode;
            // ADG CSS injection / ABP snippet injection
            case '#$#':
            case '#@$#':
            case '#$?#':
            case '#@$?#':
                // ADG CSS injection
                if (CssInjectionBodyParser.isAdgCssInjection(rawBody)) {
                    return {
                        category: RuleCategory.Cosmetic,
                        type: CosmeticRuleType.CssInjectionRule,
                        loc: locRange(loc, 0, raw.length),
                        raws: {
                            text: raw,
                        },
                        syntax: AdblockSyntax.Adg,
                        exception,
                        modifiers,
                        domains,
                        separator,
                        body: {
                            ...CssInjectionBodyParser.parse(rawBody, shiftLoc(loc, bodyStart)),
                            raw: rawBody,
                        },
                    };
                }
                // ABP snippet injection
                if (['#$#', '#@$#'].includes(separator.value)) {
                    if (syntax === AdblockSyntax.Adg) {
                        throw new AdblockSyntaxError('AdGuard modifier list is not supported in ABP snippet injection rules', locRange(loc, patternStart, patternEnd));
                    }
                    return {
                        category: RuleCategory.Cosmetic,
                        type: CosmeticRuleType.ScriptletInjectionRule,
                        loc: locRange(loc, 0, raw.length),
                        raws: {
                            text: raw,
                        },
                        syntax: AdblockSyntax.Abp,
                        exception,
                        modifiers,
                        domains,
                        separator,
                        body: {
                            ...ScriptletInjectionBodyParser.parse(rawBody, AdblockSyntax.Abp, shiftLoc(loc, bodyStart)),
                            raw: rawBody,
                        },
                    };
                }
                // ABP snippet injection is not supported for #$?# and #@$?#
                throw new AdblockSyntaxError(`Separator '${separator.value}' is not supported for scriptlet injection`, locRange(loc, separator.loc?.start.offset ?? 0, separator.loc?.end.offset ?? raw.length));
            // uBO scriptlet injection
            case '##+':
            case '#@#+':
                if (syntax === AdblockSyntax.Adg) {
                    throw new AdblockSyntaxError('AdGuard modifier list is not supported in uBO scriptlet injection rules', locRange(loc, patternStart, patternEnd));
                }
                // uBO scriptlet injection
                return {
                    category: RuleCategory.Cosmetic,
                    type: CosmeticRuleType.ScriptletInjectionRule,
                    loc: locRange(loc, 0, raw.length),
                    raws: {
                        text: raw,
                    },
                    syntax: AdblockSyntax.Ubo,
                    exception,
                    modifiers,
                    domains,
                    separator,
                    body: {
                        ...ScriptletInjectionBodyParser.parse(rawBody, AdblockSyntax.Ubo, shiftLoc(loc, bodyStart)),
                        raw: rawBody,
                    },
                };
            // ADG JS / scriptlet injection
            case '#%#':
            case '#@%#':
                // ADG scriptlet injection
                if (rawBody.trim().startsWith(ADG_SCRIPTLET_MASK)) {
                    // ADG scriptlet injection
                    return {
                        category: RuleCategory.Cosmetic,
                        type: CosmeticRuleType.ScriptletInjectionRule,
                        loc: locRange(loc, 0, raw.length),
                        raws: {
                            text: raw,
                        },
                        syntax: AdblockSyntax.Adg,
                        exception,
                        modifiers,
                        domains,
                        separator,
                        body: {
                            ...ScriptletInjectionBodyParser.parse(rawBody, AdblockSyntax.Ubo, shiftLoc(loc, bodyStart)),
                            raw: rawBody,
                        },
                    };
                }
                // Don't allow empty body
                if (bodyEnd <= bodyStart) {
                    throw new AdblockSyntaxError('Empty body in JS injection rule', locRange(loc, 0, raw.length));
                }
                // ADG JS injection
                return {
                    category: RuleCategory.Cosmetic,
                    type: CosmeticRuleType.JsInjectionRule,
                    loc: locRange(loc, 0, raw.length),
                    raws: {
                        text: raw,
                    },
                    syntax: AdblockSyntax.Adg,
                    exception,
                    modifiers,
                    domains,
                    separator,
                    body: {
                        type: 'Value',
                        loc: locRange(loc, bodyStart, bodyEnd),
                        value: rawBody,
                        raw: rawBody,
                    },
                };
            // uBO HTML filtering
            case '##^':
            case '#@#^':
                if (syntax === AdblockSyntax.Adg) {
                    throw new AdblockSyntaxError('AdGuard modifier list is not supported in uBO HTML filtering rules', locRange(loc, patternStart, patternEnd));
                }
                // eslint-disable-next-line no-case-declarations
                const uboHtmlRuleNode = {
                    category: RuleCategory.Cosmetic,
                    type: CosmeticRuleType.HtmlFilteringRule,
                    loc: locRange(loc, 0, raw.length),
                    raws: {
                        text: raw,
                    },
                    syntax: AdblockSyntax.Ubo,
                    exception,
                    modifiers,
                    domains,
                    separator,
                    body: {
                        ...HtmlFilteringBodyParser.parse(rawBody, shiftLoc(loc, bodyStart)),
                        raw: rawBody,
                    },
                };
                if (hasUboModifierIndicator(rawBody)
                    && uboHtmlRuleNode.body.body.type === CssTreeNodeType.SelectorList) {
                    // eslint-disable-next-line max-len
                    const extractedUboModifiers = extractUboModifiersFromSelectorList(uboHtmlRuleNode.body.body);
                    if (extractedUboModifiers.modifiers.children.length > 0) {
                        if (!uboHtmlRuleNode.modifiers) {
                            uboHtmlRuleNode.modifiers = {
                                type: 'ModifierList',
                                children: [],
                            };
                        }
                        uboHtmlRuleNode.modifiers.children.push(...extractedUboModifiers.modifiers.children);
                        uboHtmlRuleNode.body.body = extractedUboModifiers.cleaned;
                        uboHtmlRuleNode.syntax = AdblockSyntax.Ubo;
                    }
                }
                return uboHtmlRuleNode;
            // ADG HTML filtering
            case '$$':
            case '$@$':
                body = HtmlFilteringBodyParser.parse(rawBody, shiftLoc(loc, bodyStart));
                body.raw = rawBody;
                if (body.body.type === 'Function') {
                    throw new AdblockSyntaxError('Functions are not supported in ADG HTML filtering rules', locRange(loc, bodyStart, bodyEnd));
                }
                return {
                    category: RuleCategory.Cosmetic,
                    type: CosmeticRuleType.HtmlFilteringRule,
                    loc: locRange(loc, 0, raw.length),
                    raws: {
                        text: raw,
                    },
                    syntax: AdblockSyntax.Adg,
                    exception,
                    modifiers,
                    domains,
                    separator,
                    body,
                };
            default:
                return null;
        }
    }
    /**
     * Generates the rule pattern from the AST.
     *
     * @param ast Cosmetic rule AST
     * @returns Raw rule pattern
     * @example
     * - '##.foo' → ''
     * - 'example.com,example.org##.foo' → 'example.com,example.org'
     * - '[$path=/foo/bar]example.com##.foo' → '[$path=/foo/bar]example.com'
     */
    static generatePattern(ast) {
        let result = EMPTY;
        // AdGuard modifiers (if any)
        if (ast.syntax === AdblockSyntax.Adg && ast.modifiers && ast.modifiers.children.length > 0) {
            result += OPEN_SQUARE_BRACKET;
            result += DOLLAR_SIGN;
            result += ModifierListParser.generate(ast.modifiers);
            result += CLOSE_SQUARE_BRACKET;
        }
        // Domain list (if any)
        result += DomainListParser.generate(ast.domains);
        return result;
    }
    /**
     * Generates the rule body from the AST.
     *
     * @param ast Cosmetic rule AST
     * @returns Raw rule body
     * @example
     * - '##.foo' → '.foo'
     * - 'example.com,example.org##.foo' → '.foo'
     * - 'example.com#%#//scriptlet('foo')' → '//scriptlet('foo')'
     */
    static generateBody(ast) {
        let result = EMPTY;
        // Body
        switch (ast.type) {
            case CosmeticRuleType.ElementHidingRule:
                result = ElementHidingBodyParser.generate(ast.body);
                break;
            case CosmeticRuleType.CssInjectionRule:
                result = CssInjectionBodyParser.generate(ast.body, ast.syntax);
                break;
            case CosmeticRuleType.HtmlFilteringRule:
                result = HtmlFilteringBodyParser.generate(ast.body, ast.syntax);
                break;
            case CosmeticRuleType.JsInjectionRule:
                // Native JS code
                result = ast.body.value;
                break;
            case CosmeticRuleType.ScriptletInjectionRule:
                result = ScriptletInjectionBodyParser.generate(ast.body, ast.syntax);
                break;
            default:
                throw new Error('Unknown cosmetic rule type');
        }
        return result;
    }
    /**
     * Converts a cosmetic rule AST into a string.
     *
     * @param ast Cosmetic rule AST
     * @returns Raw string
     */
    static generate(ast) {
        let result = EMPTY;
        // Pattern
        result += CosmeticRuleParser.generatePattern(ast);
        // Separator
        result += ast.separator.value;
        // uBO rule modifiers
        if (ast.syntax === AdblockSyntax.Ubo && ast.modifiers) {
            ast.modifiers.children.forEach((modifier) => {
                result += COLON;
                result += modifier.modifier.value;
                if (modifier.value) {
                    result += OPEN_PARENTHESIS;
                    result += modifier.value.value;
                    result += CLOSE_PARENTHESIS;
                }
            });
            // If there are at least one modifier, add a space
            if (ast.modifiers.children.length) {
                result += SPACE;
            }
        }
        // Body
        result += CosmeticRuleParser.generateBody(ast);
        return result;
    }
}

/**
 * `NetworkRuleParser` is responsible for parsing network rules.
 *
 * Please note that this will parse all syntactically correct network rules.
 * Modifier compatibility is not checked at the parser level.
 *
 * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#basic-rules}
 * @see {@link https://help.eyeo.com/adblockplus/how-to-write-filters#basic}
 */
class NetworkRuleParser {
    /**
     * Parses a network rule (also known as basic rule).
     *
     * @param raw Raw rule
     * @param loc Location of the rule
     * @returns Network rule AST
     */
    static parse(raw, loc = defaultLocation) {
        let offset = 0;
        // Skip leading whitespace
        offset = StringUtils.skipWS(raw, offset);
        // Handle exception rules
        let exception = false;
        // Rule starts with exception marker, eg @@||example.com,
        // where @@ is the exception marker
        if (raw.startsWith(NETWORK_RULE_EXCEPTION_MARKER, offset)) {
            offset += NETWORK_RULE_EXCEPTION_MARKER_LEN;
            exception = true;
        }
        // Save the start of the pattern
        const patternStart = offset;
        // Find corresponding (last) separator ($) character (if any)
        const separatorIndex = NetworkRuleParser.findNetworkRuleSeparatorIndex(raw);
        // Save the end of the pattern
        const patternEnd = separatorIndex === -1
            ? StringUtils.skipWSBack(raw) + 1
            : StringUtils.skipWSBack(raw, separatorIndex - 1) + 1;
        // Extract the pattern
        const pattern = {
            type: 'Value',
            loc: locRange(loc, patternStart, patternEnd),
            value: raw.substring(patternStart, patternEnd),
        };
        // Parse modifiers (if any)
        let modifiers;
        // Find start and end index of the modifiers
        const modifiersStart = separatorIndex + 1;
        const modifiersEnd = StringUtils.skipWSBack(raw) + 1;
        if (separatorIndex !== -1) {
            modifiers = ModifierListParser.parse(raw.substring(modifiersStart, modifiersEnd), shiftLoc(loc, modifiersStart));
        }
        // Throw error if there is no pattern and no modifiers
        if (pattern.value.length === 0 && (modifiers === undefined || modifiers.children.length === 0)) {
            throw new AdblockSyntaxError('Network rule must have a pattern or modifiers', locRange(loc, 0, raw.length));
        }
        return {
            type: 'NetworkRule',
            loc: locRange(loc, 0, raw.length),
            raws: {
                text: raw,
            },
            category: RuleCategory.Network,
            syntax: AdblockSyntax.Common,
            exception,
            pattern,
            modifiers,
        };
    }
    /**
     * Finds the index of the separator character in a network rule.
     *
     * @param rule Network rule to check
     * @returns The index of the separator character, or -1 if there is no separator
     */
    static findNetworkRuleSeparatorIndex(rule) {
        // As we are looking for the last separator, we start from the end of the string
        for (let i = rule.length - 1; i >= 0; i -= 1) {
            // If we find a potential separator, we should check
            // - if it's not escaped
            // - if it's not followed by a regex marker, for example: `example.org^$removeparam=/regex$/`
            // eslint-disable-next-line max-len
            if (rule[i] === NETWORK_RULE_SEPARATOR && rule[i + 1] !== REGEX_MARKER && rule[i - 1] !== ESCAPE_CHARACTER) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Converts a network rule (basic rule) AST to a string.
     *
     * @param ast - Network rule AST
     * @returns Raw string
     */
    static generate(ast) {
        let result = EMPTY;
        // If the rule is an exception, add the exception marker: `@@||example.org`
        if (ast.exception) {
            result += NETWORK_RULE_EXCEPTION_MARKER;
        }
        // Add the pattern: `||example.org`
        result += ast.pattern.value;
        // If there are modifiers, add a separator and the modifiers: `||example.org$important`
        if (ast.modifiers && ast.modifiers.children.length > 0) {
            result += NETWORK_RULE_SEPARATOR;
            result += ModifierListParser.generate(ast.modifiers);
        }
        return result;
    }
}

/**
 * `RuleParser` is responsible for parsing the rules.
 *
 * It automatically determines the category and syntax of the rule, so you can pass any kind of rule to it.
 */
class RuleParser {
    /**
     * Parse an adblock rule. You can pass any kind of rule to this method, since it will automatically determine
     * the category and syntax. If the rule is syntactically invalid, then an error will be thrown. If the
     * syntax / compatibility cannot be determined clearly, then the value of the `syntax` property will be
     * `Common`.
     *
     * For example, let's have this network rule:
     * ```adblock
     * ||example.org^$important
     * ```
     * The `syntax` property will be `Common`, since the rule is syntactically correct in every adblockers, but we
     * cannot determine at parsing level whether `important` is an existing option or not, nor if it exists, then
     * which adblocker supports it. This is why the `syntax` property is simply `Common` at this point.
     * The concrete COMPATIBILITY of the rule will be determined later, in a different, higher-level layer, called
     * "Compatibility table".
     *
     * But we can determinate the concrete syntax of this rule:
     * ```adblock
     * example.org#%#//scriptlet("scriptlet0", "arg0")
     * ```
     * since it is clearly an AdGuard-specific rule and no other adblockers uses this syntax natively. However, we also
     * cannot determine the COMPATIBILITY of this rule, as it is not clear at this point whether the `scriptlet0`
     * scriptlet is supported by AdGuard or not. This is also the task of the "Compatibility table". Here, we simply
     * mark the rule with the `AdGuard` syntax in this case.
     *
     * @param raw Raw adblock rule
     * @param tolerant If `true`, then the parser will not throw if the rule is syntactically invalid, instead it will
     * return an `InvalidRule` object with the error attached to it. Default is `false`.
     * @param loc Base location of the rule
     * @returns Adblock rule AST
     * @throws If the input matches a pattern but syntactically invalid
     * @example
     * Take a look at the following example:
     * ```js
     * // Parse a network rule
     * const ast1 = RuleParser.parse("||example.org^$important");
     *
     * // Parse another network rule
     * const ast2 = RuleParser.parse("/ads.js^$important,third-party,domain=example.org|~example.com");
     *
     * // Parse a cosmetic rule
     * const ast2 = RuleParser.parse("example.org##.banner");
     *
     * // Parse another cosmetic rule
     * const ast3 = RuleParser.parse("example.org#?#.banner:-abp-has(.ad)");
     *
     * // Parse a comment rule
     * const ast4 = RuleParser.parse("! Comment");
     *
     * // Parse an empty rule
     * const ast5 = RuleParser.parse("");
     *
     * // Parse a comment rule (with metadata)
     * const ast6 = RuleParser.parse("! Title: Example");
     *
     * // Parse a pre-processor rule
     * const ast7 = RuleParser.parse("!#if (adguard)");
     * ```
     */
    static parse(raw, tolerant = false, loc = defaultLocation) {
        try {
            // Empty lines / rules (handle it just for convenience)
            if (raw.trim().length === 0) {
                return {
                    type: 'EmptyRule',
                    loc: locRange(loc, 0, raw.length),
                    raws: {
                        text: raw,
                    },
                    category: RuleCategory.Empty,
                    syntax: AdblockSyntax.Common,
                };
            }
            // Try to parse the rule with all sub-parsers. If a rule doesn't match
            // the pattern of a parser, then it will return `null`. For example, a
            // network rule will not match the pattern of a comment rule, since it
            // doesn't start with comment marker. But if the rule matches the
            // pattern of a parser, then it will return the AST of the rule, or
            // throw an error if the rule is syntactically invalid.
            return CommentRuleParser.parse(raw, loc)
                || CosmeticRuleParser.parse(raw, loc)
                || NetworkRuleParser.parse(raw, loc);
        }
        catch (error) {
            // If tolerant mode is disabled or the error is not known, then simply
            // re-throw the error
            if (!tolerant || !(error instanceof Error)) {
                throw error;
            }
            // Otherwise, return an invalid rule (tolerant mode)
            const result = {
                type: 'InvalidRule',
                loc: locRange(loc, 0, raw.length),
                raws: {
                    text: raw,
                },
                category: RuleCategory.Invalid,
                syntax: AdblockSyntax.Common,
                raw,
                error: {
                    name: error.name,
                    message: error.message,
                },
            };
            // If the error is an AdblockSyntaxError, then we can add the
            // location of the error to the result
            if (error instanceof AdblockSyntaxError) {
                result.error.loc = error.loc;
            }
            return result;
        }
    }
    /**
     * Converts a rule AST to a string.
     *
     * @param ast - Adblock rule AST
     * @returns Raw string
     * @example
     * Take a look at the following example:
     * ```js
     * // Parse the rule to the AST
     * const ast = RuleParser.parse("example.org##.banner");
     * // Generate the rule from the AST
     * const raw = RuleParser.generate(ast);
     * // Print the generated rule
     * console.log(raw); // "example.org##.banner"
     * ```
     */
    static generate(ast) {
        switch (ast.category) {
            // Empty lines
            case RuleCategory.Empty:
                return EMPTY;
            // Invalid rules
            case RuleCategory.Invalid:
                return ast.raw;
            // Comment rules
            case RuleCategory.Comment:
                return CommentRuleParser.generate(ast);
            // Cosmetic / non-basic rules
            case RuleCategory.Cosmetic:
                return CosmeticRuleParser.generate(ast);
            // Network / basic rules
            case RuleCategory.Network:
                return NetworkRuleParser.generate(ast);
            default:
                throw new Error('Unknown rule category');
        }
    }
}

/**
 * `AppListParser` is responsible for parsing an app list.
 *
 * @see {@link https://adguard.app/kb/general/ad-filtering/create-own-filters/#app-modifier}
 */
class AppListParser {
    /**
     * Parses an app list which items are separated by `|`,
     * e.g. `Example.exe|com.example.osx`.
     *
     * @param raw Raw app list
     * @param loc Location of the app list in the rule. If not set, the default location is used.
     *
     * @returns App list AST.
     * @throws An {@link AdblockSyntaxError} if the app list is syntactically invalid.
     */
    static parse(raw, loc = defaultLocation) {
        const separator = PIPE_MODIFIER_SEPARATOR;
        const rawItems = parseListItems(raw, separator, loc);
        const children = rawItems.map((rawListItem) => ({
            ...rawListItem,
            type: ListItemNodeType.App,
        }));
        return {
            type: ListNodeType.AppList,
            loc: locRange(loc, 0, raw.length),
            separator,
            children,
        };
    }
}

/**
 * `MethodListParser` is responsible for parsing a method list.
 *
 * @see {@link https://adguard.app/kb/general/ad-filtering/create-own-filters/#method-modifier}
 */
class MethodListParser {
    /**
     * Parses a method list which items are separated by `|`,
     * e.g. `get|post|put`.
     *
     * @param raw Raw method list
     * @param loc Location of the method list in the rule. If not set, the default location is used.
     *
     * @returns Method list AST.
     * @throws An {@link AdblockSyntaxError} if the method list is syntactically invalid.
     */
    static parse(raw, loc = defaultLocation) {
        const separator = PIPE_MODIFIER_SEPARATOR;
        const rawItems = parseListItems(raw, separator, loc);
        const children = rawItems.map((rawListItem) => ({
            ...rawListItem,
            type: ListItemNodeType.Method,
        }));
        return {
            type: ListNodeType.MethodList,
            loc: locRange(loc, 0, raw.length),
            separator,
            children,
        };
    }
}

/**
 * `StealthOptionListParser` is responsible for parsing a list of stealth options.
 *
 * @see {@link https://adguard.app/kb/general/ad-filtering/create-own-filters/#stealth-modifier}
 */
class StealthOptionListParser {
    /**
     * Parses a stealth option list which items are separated by `|`,
     * e.g. `dpi|ip`.
     *
     * @param raw Raw list of stealth options.
     * @param loc Location of the stealth option list in the rule. If not set, the default location is used.
     *
     * @returns Stealth option list AST.
     * @throws An {@link AdblockSyntaxError} if the stealth option list is syntactically invalid.
     */
    static parse(raw, loc = defaultLocation) {
        const separator = PIPE_MODIFIER_SEPARATOR;
        const rawItems = parseListItems(raw, separator, loc);
        const children = rawItems.map((rawListItem) => ({
            ...rawListItem,
            type: ListItemNodeType.StealthOption,
        }));
        return {
            type: ListNodeType.StealthOptionList,
            loc: locRange(loc, 0, raw.length),
            separator,
            children,
        };
    }
}

/**
 * `FilterListParser` is responsible for parsing a whole adblock filter list (list of rules).
 * It is a wrapper around `RuleParser` which parses each line separately.
 */
class FilterListParser {
    /**
     * Parses a whole adblock filter list (list of rules).
     *
     * @param raw Filter list source code (including new lines)
     * @param tolerant If `true`, then the parser will not throw if the rule is syntactically invalid,
     * instead it will return an `InvalidRule` object with the error attached to it. Default is `true`.
     * It is useful for parsing filter lists with invalid rules, because most of the rules are valid,
     * and some invalid rules can't break the whole filter list parsing.
     * @returns AST of the source code (list of rules)
     * @example
     * ```js
     * import { readFileSync } from 'fs';
     * import { FilterListParser } from '@adguard/agtree';
     *
     * // Read filter list content from file
     * const content = readFileSync('your-adblock-filter-list.txt', 'utf-8');
     *
     * // Parse the filter list content, then do something with the AST
     * const ast = FilterListParser.parse(content);
     * ```
     * @throws If one of the rules is syntactically invalid (if `tolerant` is `false`)
     */
    static parse(raw, tolerant = true) {
        // Actual position in the source code
        let offset = 0;
        // Collect adblock rules here
        const rules = [];
        // Start offset of the current line (initially it's 0)
        let lineStartOffset = offset;
        while (offset < raw.length) {
            // Check if we found a new line
            if (StringUtils.isEOL(raw[offset])) {
                // Rule text
                const text = raw.substring(lineStartOffset, offset);
                // Parse the rule
                const rule = RuleParser.parse(text, tolerant, {
                    offset: lineStartOffset,
                    line: rules.length + 1,
                    column: 1,
                });
                // Get newline type (possible values: 'crlf', 'lf', 'cr' or undefined if no newline found)
                let nl;
                if (raw[offset] === CR) {
                    if (raw[offset + 1] === LF) {
                        nl = 'crlf';
                    }
                    else {
                        nl = 'cr';
                    }
                }
                else if (raw[offset] === LF) {
                    nl = 'lf';
                }
                // Add newline type to the rule (rule parser already added raws.text)
                if (!rule.raws) {
                    rule.raws = {
                        text,
                        nl,
                    };
                }
                else {
                    rule.raws.nl = nl;
                }
                // Add the rule to the list
                rules.push(rule);
                // Update offset: add 2 if we found CRLF, otherwise add 1
                offset += nl === 'crlf' ? 2 : 1;
                // Update line start offset
                lineStartOffset = offset;
            }
            else {
                // No new line found, just increase offset
                offset += 1;
            }
        }
        // Parse the last rule (it doesn't end with a new line)
        rules.push(RuleParser.parse(raw.substring(lineStartOffset, offset), tolerant, {
            offset: lineStartOffset,
            line: rules.length + 1,
            column: 1,
        }));
        // Return the list of rules (FilterList node)
        return {
            type: 'FilterList',
            loc: {
                // Start location is always the default, since we don't provide
                // "loc" parameter for FilterListParser.parse as it doesn't have
                // any parent
                start: defaultLocation,
                // Calculate end location
                end: {
                    offset: raw.length,
                    line: rules.length,
                    column: raw.length + 1,
                },
            },
            children: rules,
        };
    }
    /**
     * Serializes a whole adblock filter list (list of rules).
     *
     * @param ast AST to generate
     * @param preferRaw If `true`, then the parser will use `raws.text` property of each rule
     * if it is available. Default is `false`.
     * @returns Serialized filter list
     */
    static generate(ast, preferRaw = false) {
        let result = EMPTY;
        for (let i = 0; i < ast.children.length; i += 1) {
            const rule = ast.children[i];
            if (preferRaw && rule.raws?.text) {
                result += rule.raws.text;
            }
            else {
                result += RuleParser.generate(rule);
            }
            switch (rule.raws?.nl) {
                case 'crlf':
                    result += CRLF;
                    break;
                case 'cr':
                    result += CR;
                    break;
                case 'lf':
                    result += LF;
                    break;
                default:
                    if (i !== ast.children.length - 1) {
                        result += LF;
                    }
                    break;
            }
        }
        return result;
    }
}

/**
 * @file Customized error class for not implemented features.
 */
const ERROR_NAME$1 = 'NotImplementedError';
const BASE_MESSAGE = 'Not implemented';
/**
 * Customized error class for not implemented features.
 */
class NotImplementedError extends Error {
    /**
     * Constructs a new `NotImplementedError` instance.
     *
     * @param message Additional error message (optional)
     */
    constructor(message = undefined) {
        // Prepare the full error message
        const fullMessage = message
            ? `${BASE_MESSAGE}: ${message}`
            : BASE_MESSAGE;
        super(fullMessage);
        this.name = ERROR_NAME$1;
    }
}

/**
 * @file Customized error class for conversion errors.
 */
const ERROR_NAME = 'RuleConversionError';
/**
 * Customized error class for conversion errors.
 */
class RuleConversionError extends Error {
    /**
     * Constructs a new `RuleConversionError` instance.
     *
     * @param message Error message
     */
    constructor(message) {
        super(message);
        this.name = ERROR_NAME;
    }
}

var data$U = { adg_os_any:{ name:"all",
    description:"$all modifier is made of $document, $popup, and all content-type modifiers combined.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#all-modifier",
    negatable:false,
    block_only:true },
  adg_ext_any:{ name:"all",
    description:"$all modifier is made of $document, $popup, and all content-type modifiers combined.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#all-modifier",
    negatable:false,
    block_only:true },
  adg_cb_ios:{ name:"all",
    description:"The `$all` modifier is made of `$document`, `$popup`, and all content-type modifiers combined.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#all-modifier",
    negatable:false,
    block_only:true },
  adg_cb_safari:{ name:"all",
    description:"The `$all` modifier is made of `$document`, `$popup`, and all content-type modifiers combined.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#all-modifier",
    negatable:false,
    block_only:true },
  ubo_ext_any:{ name:"all",
    description:"The `all` option is equivalent to specifying all network-based types\n+ `popup`, `document`, `inline-font` and `inline-script`.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#all",
    negatable:false,
    block_only:false } };
data$U.adg_os_any;
data$U.adg_ext_any;
data$U.adg_cb_ios;
data$U.adg_cb_safari;
data$U.ubo_ext_any;

var data$T = { adg_os_any:{ name:"app",
    description:"The `$app` modifier lets you narrow the rule coverage down to a specific application or a list of applications.\nThe modifier's behavior and syntax perfectly match the corresponding basic rules `$app` modifier.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#app-modifier",
    assignable:true,
    negatable:false,
    value_format:"pipe_separated_apps" } };
data$T.adg_os_any;

var data$S = { adg_os_any:{ name:"badfilter",
    description:"The rules with the `$badfilter` modifier disable other basic rules to which they refer. It means that\nthe text of the disabled rule should match the text of the `$badfilter` rule (without the `$badfilter` modifier).",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#badfilter-modifier",
    negatable:false },
  adg_ext_any:{ name:"badfilter",
    description:"The rules with the `$badfilter` modifier disable other basic rules to which they refer. It means that\nthe text of the disabled rule should match the text of the `$badfilter` rule (without the `$badfilter` modifier).",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#badfilter-modifier",
    negatable:false },
  adg_cb_ios:{ name:"badfilter",
    description:"The rules with the `$badfilter` modifier disable other basic rules to which they refer. It means that\nthe text of the disabled rule should match the text of the `$badfilter` rule (without the `$badfilter` modifier).",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#badfilter-modifier",
    negatable:false },
  adg_cb_safari:{ name:"badfilter",
    description:"The rules with the `$badfilter` modifier disable other basic rules to which they refer. It means that\nthe text of the disabled rule should match the text of the `$badfilter` rule (without the `$badfilter` modifier).",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#badfilter-modifier",
    negatable:false },
  ubo_ext_any:{ name:"badfilter",
    description:"The rules with the `$badfilter` modifier disable other basic rules to which they refer. It means that\nthe text of the disabled rule should match the text of the `$badfilter` rule (without the `$badfilter` modifier).",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#badfilter",
    negatable:false } };
data$S.adg_os_any;
data$S.adg_ext_any;
data$S.adg_cb_ios;
data$S.adg_cb_safari;
data$S.ubo_ext_any;

var data$R = { ubo_ext_any:{ name:"cname",
    description:"When used in an exception filter,\nit will bypass blocking CNAME uncloaked requests for the current (specified) document.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#cname",
    negatable:false,
    exception_only:true } };
data$R.ubo_ext_any;

var data$Q = { adg_os_any:{ name:"content",
    description:"Disables HTML filtering and `$replace` rules on the pages that match the rule.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#content-modifier",
    negatable:false,
    exception_only:true } };
data$Q.adg_os_any;

var data$P = { adg_os_any:{ name:"cookie",
    description:"The `$cookie` modifier completely changes rule behavior.\nInstead of blocking a request, this modifier makes us suppress or modify the Cookie and Set-Cookie headers.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#cookie-modifier",
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"^([^;=\\s]*?)((?:;(maxAge=\\d+;?)?|(sameSite=(lax|none|strict);?)?){1,3})(?<!;)$" },
  adg_ext_any:{ name:"cookie",
    description:"The `$cookie` modifier completely changes rule behavior.\nInstead of blocking a request, this modifier makes us suppress or modify the Cookie and Set-Cookie headers.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#cookie-modifier",
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"^([^;=\\s]*?)((?:;(maxAge=\\d+;?)?|(sameSite=(lax|none|strict);?)?){1,3})(?<!;)$" } };
data$P.adg_os_any;
data$P.adg_ext_any;

var data$O = { adg_os_any:{ name:"csp",
    description:"This modifier completely changes the rule behavior.\nIf it is applied to a rule, it will not block the matching request.\nThe response headers are going to be modified instead.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#csp-modifier",
    conflicts:[ "domain",
      "important",
      "subdocument",
      "badfilter" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"csp_value" },
  adg_ext_any:{ name:"csp",
    description:"This modifier completely changes the rule behavior.\nIf it is applied to a rule, it will not block the matching request.\nThe response headers are going to be modified instead.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#csp-modifier",
    conflicts:[ "domain",
      "important",
      "subdocument",
      "badfilter" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"csp_value" },
  abp_ext_any:{ name:"csp",
    description:"This modifier completely changes the rule behavior.\nIf it is applied to a rule, it will not block the matching request.\nThe response headers are going to be modified instead.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#content-security-policies",
    conflicts:[ "domain",
      "subdocument" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"csp_value" },
  ubo_ext_any:{ name:"csp",
    description:"This modifier completely changes the rule behavior.\nIf it is applied to a rule, it will not block the matching request.\nThe response headers are going to be modified instead.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#csp",
    conflicts:[ "1p",
      "3p",
      "domain",
      "badfilter" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"csp_value" } };
data$O.adg_os_any;
data$O.adg_ext_any;
data$O.abp_ext_any;
data$O.ubo_ext_any;

var data$N = { adg_os_any:{ name:"denyallow",
    description:"The `$denyallow` modifier allows to avoid creating additional rules\nwhen it is needed to disable a certain rule for specific domains.\n`$denyallow` matches only target domains and not referrer domains.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#denyallow-modifier",
    conflicts:[ "to" ],
    assignable:true,
    negatable:false,
    value_format:"pipe_separated_denyallow_domains" },
  adg_ext_any:{ name:"denyallow",
    description:"The `$denyallow` modifier allows to avoid creating additional rules\nwhen it is needed to disable a certain rule for specific domains.\n`$denyallow` matches only target domains and not referrer domains.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#denyallow-modifier",
    conflicts:[ "to" ],
    assignable:true,
    negatable:false,
    value_format:"pipe_separated_denyallow_domains" },
  adg_cb_ios:{ name:"denyallow",
    description:"The `$denyallow` modifier allows to avoid creating additional rules\nwhen it is needed to disable a certain rule for specific domains.\n`$denyallow` matches only target domains and not referrer domains.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#denyallow-modifier",
    conflicts:[ "to" ],
    assignable:true,
    negatable:false,
    value_format:"pipe_separated_denyallow_domains" },
  adg_cb_safari:{ name:"denyallow",
    description:"The `$denyallow` modifier allows to avoid creating additional rules\nwhen it is needed to disable a certain rule for specific domains.\n`$denyallow` matches only target domains and not referrer domains.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#denyallow-modifier",
    conflicts:[ "to" ],
    assignable:true,
    negatable:false,
    value_format:"pipe_separated_denyallow_domains" },
  ubo_ext_any:{ name:"denyallow",
    description:"The `$denyallow` modifier allows to avoid creating additional rules\nwhen it is needed to disable a certain rule for specific domains.\n`$denyallow` matches only target domains and not referrer domains.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#denyallow",
    conflicts:[ "to" ],
    assignable:true,
    negatable:false,
    value_format:"pipe_separated_denyallow_domains" } };
data$N.adg_os_any;
data$N.adg_ext_any;
data$N.adg_cb_ios;
data$N.adg_cb_safari;
data$N.ubo_ext_any;

var data$M = { adg_os_any:{ name:"document",
    description:"The rule corresponds to the main frame document requests,\ni.e. HTML documents that are loaded in the browser tab.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#document-modifier",
    negatable:false },
  adg_ext_any:{ name:"document",
    description:"The rule corresponds to the main frame document requests,\ni.e. HTML documents that are loaded in the browser tab.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#document-modifier",
    negatable:false },
  adg_cb_ios:{ name:"document",
    description:"The rule corresponds to the main frame document requests,\ni.e. HTML documents that are loaded in the browser tab.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#document-modifier",
    negatable:false },
  adg_cb_safari:{ name:"document",
    description:"The rule corresponds to the main frame document requests,\ni.e. HTML documents that are loaded in the browser tab.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#document-modifier",
    negatable:false },
  abp_ext_any:{ name:"document",
    description:"The rule corresponds to the main frame document requests,\ni.e. HTML documents that are loaded in the browser tab.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#allowlist",
    negatable:false },
  ubo_ext_any:{ name:"document",
    aliases:[ "doc" ],
    description:"The rule corresponds to the main frame document requests,\ni.e. HTML documents that are loaded in the browser tab.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#document",
    negatable:false } };
data$M.adg_os_any;
data$M.adg_ext_any;
data$M.adg_cb_ios;
data$M.adg_cb_safari;
data$M.abp_ext_any;
data$M.ubo_ext_any;

var data$L = { adg_any:{ name:"domain",
    aliases:[ "from" ],
    description:"The `$domain` modifier limits the rule application area to a list of domains and their subdomains.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#domain-modifier",
    assignable:true,
    negatable:false,
    value_format:"pipe_separated_domains" },
  abp_any:{ name:"domain",
    description:"The `$domain` modifier limits the rule application area to a list of domains and their subdomains.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#domain-restrictions",
    assignable:true,
    negatable:false,
    value_format:"pipe_separated_domains" },
  ubo_any:{ name:"domain",
    aliases:[ "from" ],
    description:"The `$domain` modifier limits the rule application area to a list of domains and their subdomains.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#from",
    assignable:true,
    negatable:false,
    value_format:"pipe_separated_domains" } };
data$L.adg_any;
data$L.abp_any;
data$L.ubo_any;

var data$K = { adg_any:{ name:"elemhide",
    aliases:[ "ehide" ],
    description:"Disables any cosmetic rules on the pages matching the rule.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#elemhide-modifier",
    negatable:false,
    exception_only:true },
  abp_any:{ name:"elemhide",
    aliases:[ "ehide" ],
    description:"Disables any cosmetic rules on the pages matching the rule.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options",
    negatable:false,
    exception_only:true },
  ubo_any:{ name:"elemhide",
    aliases:[ "ehide" ],
    negatable:false,
    exception_only:true,
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#elemhide-1",
    description:"Disables any cosmetic rules on the pages matching the rule." } };
data$K.adg_any;
data$K.abp_any;
data$K.ubo_any;

var data$J = { adg_os_any:{ name:"empty",
    description:"This modifier is deprecated in favor of the $redirect modifier.\nRules with `$empty` are still supported and being converted into `$redirect=nooptext` now\nbut the support shall be removed in the future.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#empty-modifier",
    deprecated:true,
    deprecation_message:"Rules with `$empty` are still supported and being converted into `$redirect=nooptext` now\nbut the support shall be removed in the future.",
    negatable:false },
  adg_ext_any:{ name:"empty",
    description:"This modifier is deprecated in favor of the $redirect modifier.\nRules with `$empty` are still supported and being converted into `$redirect=nooptext` now\nbut the support shall be removed in the future.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#empty-modifier",
    deprecated:true,
    deprecation_message:"Rules with `$empty` are still supported and being converted into `$redirect=nooptext` now\nbut the support shall be removed in the future.",
    negatable:false },
  ubo_ext_any:{ name:"empty",
    description:"This modifier is deprecated in favor of the $redirect modifier.\nRules with `$empty` are supported and being converted into `$redirect=nooptext`.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#empty",
    negatable:false } };
data$J.adg_os_any;
data$J.adg_ext_any;
data$J.ubo_ext_any;

var data$I = { adg_any:{ name:"first-party",
    aliases:[ "1p",
      "~third-party" ],
    description:"A restriction of first-party requests. Equal to `~third-party`.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#third-party-modifier",
    negatable:false },
  ubo_any:{ name:"first-party",
    aliases:[ "1p",
      "~third-party" ],
    description:"A restriction of first-party requests. Equal to `~third-party`.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#1p",
    negatable:false } };
data$I.adg_any;
data$I.ubo_any;

var data$H = { adg_os_any:{ name:"extension",
    description:"Disables all userscripts on the pages matching this rule.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#extension-modifier",
    conflicts:[ "domain",
      "specifichide",
      "generichide",
      "elemhide",
      "genericblock",
      "urlblock",
      "jsinject",
      "content",
      "xmlhttprequest",
      "badfilter" ],
    inverse_conflicts:true,
    exception_only:true } };
data$H.adg_os_any;

var data$G = { adg_any:{ name:"font",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#font-modifier",
    description:"The rule corresponds to requests for fonts, e.g. `.woff` filename extension." },
  abp_any:{ name:"font",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293#options",
    description:"The rule corresponds to requests for fonts, e.g. `.woff` filename extension." },
  ubo_any:{ name:"font",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293#options",
    description:"The rule corresponds to requests for fonts, e.g. `.woff` filename extension." } };
data$G.adg_any;
data$G.abp_any;
data$G.ubo_any;

var data$F = { adg_os_any:{ name:"genericblock",
    description:"Disables generic basic rules on pages that correspond to exception rule.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#genericblock-modifier",
    conflicts:[ "domain",
      "specifichide",
      "generichide",
      "elemhide",
      "extension",
      "jsinject",
      "content",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true },
  adg_ext_any:{ name:"genericblock",
    description:"Disables generic basic rules on pages that correspond to exception rule.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#genericblock-modifier",
    conflicts:[ "domain",
      "specifichide",
      "generichide",
      "elemhide",
      "jsinject",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true },
  adg_cb_ios:{ name:"genericblock",
    description:"Disables generic basic rules on pages that correspond to exception rule.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#genericblock-modifier",
    conflicts:[ "domain",
      "specifichide",
      "generichide",
      "elemhide",
      "jsinject",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true },
  adg_cb_safari:{ name:"genericblock",
    description:"Disables generic basic rules on pages that correspond to exception rule.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#genericblock-modifier",
    conflicts:[ "domain",
      "specifichide",
      "generichide",
      "elemhide",
      "jsinject",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true },
  abp_ext_any:{ name:"genericblock",
    description:"Disables generic basic rules on pages that correspond to exception rule.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options",
    negatable:false,
    exception_only:true } };
data$F.adg_os_any;
data$F.adg_ext_any;
data$F.adg_cb_ios;
data$F.adg_cb_safari;
data$F.abp_ext_any;

var data$E = { adg_any:{ name:"generichide",
    aliases:[ "ghide" ],
    description:"Disables all generic cosmetic rules.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#generichide-modifier",
    conflicts:[ "domain",
      "genericblock",
      "urlblock",
      "extension",
      "jsinject",
      "content",
      "xmlhttprequest",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true },
  ubo_any:{ name:"generichide",
    aliases:[ "ghide" ],
    description:"Disables all generic cosmetic rules.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#generichide",
    conflicts:[ "domain",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true },
  abp_any:{ name:"generichide",
    description:"Disables all generic cosmetic rules.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options",
    conflicts:[ "domain" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true } };
data$E.adg_any;
data$E.ubo_any;
data$E.abp_any;

var data$D = { adg_os_any:{ name:"header",
    description:"The `$header` modifier allows matching the HTTP response\nhaving a specific header with (optionally) a specific value.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#header-modifier",
    assignable:true,
    value_format:"(?xi)\n  ^\n    # header name\n    [\\w-]+\n    (\n      :\n      # header value: string or regexp\n      (\\w+|\\/.+\\/)\n    )?" },
  adg_ext_any:{ name:"header",
    description:"The `$header` modifier allows matching the HTTP response\nhaving a specific header with (optionally) a specific value.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#header-modifier",
    assignable:true,
    value_format:"(?xi)\n  ^\n    # header name\n    [\\w-]+\n    (\n      :\n      # header value: string or regexp\n      (\\w+|\\/.+\\/)\n    )?" },
  ubo_ext_any:{ name:"header",
    description:"The `$header` modifier allows matching the HTTP response\nhaving a specific header with (optionally) a specific value.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#header",
    assignable:true,
    value_format:"(?xi)\n  ^\n    # header name\n    [\\w-]+\n    (\n      :\n      # header value: string or regexp\n      (\\w+|\\/.+\\/)\n    )?" } };
data$D.adg_os_any;
data$D.adg_ext_any;
data$D.ubo_ext_any;

var data$C = { adg_os_any:{ name:"hls",
    description:"The `$hls` rules modify the response of a matching request.\nThey are intended as a convenient way to remove segments from HLS playlists (RFC 8216).",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#hls-modifier",
    version_added:"CoreLibs 1.10",
    conflicts:[ "domain",
      "third-party",
      "app",
      "important",
      "match-case",
      "xmlhttprequest" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"(?xi)\n  (\n    # string pattern\n    \\w+\n    # or regexp pattern\n    |\n    # TODO: improve regexp pattern to invalidate unescaped `/`, `$`, and `,`\n    \\/.+\\/\n      # options\n      ([ti]*)?\n  )" } };
data$C.adg_os_any;

var data$B = { adg_any:{ name:"image",
    description:"The rule corresponds to images requests.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#image-modifier" },
  abp_any:{ name:"image",
    description:"The rule corresponds to images requests.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293#options" },
  ubo_any:{ name:"image",
    description:"The rule corresponds to images requests.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293#options" } };
data$B.adg_any;
data$B.abp_any;
data$B.ubo_any;

var data$A = { adg_any:{ name:"important",
    description:"The `$important` modifier applied to a rule increases its priority\nover any other rule without `$important` modifier. Even over basic exception rules.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#important-modifier",
    negatable:false },
  ubo_any:{ name:"important",
    description:"The `$important` modifier applied to a rule increases its priority\nover any other rule without `$important` modifier. Even over basic exception rules.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#important",
    negatable:false } };
data$A.adg_any;
data$A.ubo_any;

var data$z = { adg_os_any:{ name:"inline-font",
    description:"The `$inline-font` modifier is a sort of a shortcut for $csp modifier with specific value.\nE.g. `||example.org^$inline-font` is converting into:\n```adblock\n||example.org^$csp=font-src 'self' 'unsafe-eval' http: https: data: blob: mediastream: filesystem:\n```",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#inline-font-modifier" },
  adg_ext_any:{ name:"inline-font",
    description:"The `$inline-font` modifier is a sort of a shortcut for $csp modifier with specific value.\nE.g. `||example.org^$inline-font` is converting into:\n```adblock\n||example.org^$csp=font-src 'self' 'unsafe-eval' http: https: data: blob: mediastream: filesystem:\n```",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#inline-font-modifier" },
  ubo_ext_any:{ name:"inline-font",
    description:"The `$inline-font` modifier is a sort of a shortcut for $csp modifier with specific value.\nE.g. `||example.org^$inline-font` is converting into:\n```adblock\n||example.org^$csp=font-src 'self' 'unsafe-eval' http: https: data: blob: mediastream: filesystem:\n```",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#inline-font" } };
data$z.adg_os_any;
data$z.adg_ext_any;
data$z.ubo_ext_any;

var data$y = { adg_os_any:{ name:"inline-script",
    description:"The `$inline-script` modifier is a sort of a shortcut for $csp modifier with specific value.\nE.g. `||example.org^$inline-script` is converting into:\n```adblock\n||example.org^$csp=script-src 'self' 'unsafe-eval' http: https: data: blob: mediastream: filesystem:\n```",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#inline-script-modifier" },
  adg_ext_any:{ name:"inline-script",
    description:"The `$inline-script` modifier is a sort of a shortcut for $csp modifier with specific value.\nE.g. `||example.org^$inline-script` is converting into:\n```adblock\n||example.org^$csp=script-src 'self' 'unsafe-eval' http: https: data: blob: mediastream: filesystem:\n```",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#inline-script-modifier" },
  ubo_ext_any:{ name:"inline-script",
    description:"The `$inline-script` modifier is a sort of a shortcut for $csp modifier with specific value.\nE.g. `||example.org^$inline-script` is converting into:\n```adblock\n||example.org^$csp=script-src 'self' 'unsafe-eval' http: https: data: blob: mediastream: filesystem:\n```",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#inline-script" } };
data$y.adg_os_any;
data$y.adg_ext_any;
data$y.ubo_ext_any;

var data$x = { adg_os_any:{ name:"jsinject",
    description:"Forbids adding of javascript code to the page.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#jsinject-modifier",
    conflicts:[ "domain",
      "specifichide",
      "generichide",
      "elemhide",
      "genericblock",
      "urlblock",
      "extension",
      "content",
      "xmlhttprequest",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true },
  adg_ext_any:{ name:"jsinject",
    description:"Forbids adding of javascript code to the page.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#jsinject-modifier",
    conflicts:[ "domain",
      "specifichide",
      "generichide",
      "elemhide",
      "genericblock",
      "urlblock",
      "xmlhttprequest",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true },
  adg_cb_ios:{ name:"jsinject",
    description:"Forbids adding of javascript code to the page.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#jsinject-modifier",
    conflicts:[ "domain",
      "specifichide",
      "generichide",
      "elemhide",
      "genericblock",
      "urlblock",
      "xmlhttprequest",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true },
  adg_cb_safari:{ name:"jsinject",
    description:"Forbids adding of javascript code to the page.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#jsinject-modifier",
    conflicts:[ "domain",
      "specifichide",
      "generichide",
      "elemhide",
      "genericblock",
      "urlblock",
      "xmlhttprequest",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true } };
data$x.adg_os_any;
data$x.adg_ext_any;
data$x.adg_cb_ios;
data$x.adg_cb_safari;

var data$w = { adg_os_any:{ name:"jsonprune",
    description:"The `$jsonprune` rules modify the response to a matching request\nby removing JSON items that match a modified JSONPath expression.\nThey do not modify responses which are not valid JSON documents.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#jsonprune-modifier",
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"(?xi)\n  ^\n    # the expression always starts with a dollar sign (for root)\n    # which should be escaped\n    \\\\\n    \\$\n    \\.?\n    # TODO: improve the expression to invalidate unescaped `$` and `,`\n    .+\n  $" } };
data$w.adg_os_any;

var data$v = { adg_any:{ name:"match-case",
    description:"This modifier defines a rule which applies only to addresses that match the case.\nDefault rules are case-insensitive.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#match-case-modifier" },
  abp_any:{ name:"match-case",
    description:"This modifier defines a rule which applies only to addresses that match the case.\nDefault rules are case-insensitive.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" },
  ubo_any:{ name:"match-case",
    description:"This modifier defines a rule which applies only to addresses that match the case.\nDefault rules are case-insensitive.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#match-case" } };
data$v.adg_any;
data$v.abp_any;
data$v.ubo_any;

var data$u = { adg_any:{ name:"media",
    description:"A restriction of third-party and own requests.\nA third-party request is a request from a different domain.\nFor example, a request to `example.org` from `domain.com` is a third-party request.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#media-modifier" },
  abp_any:{ name:"media",
    description:"A restriction of third-party and own requests.\nA third-party request is a request from a different domain.\nFor example, a request to `example.org` from `domain.com` is a third-party request.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293#options" },
  ubo_any:{ name:"media",
    description:"A restriction of third-party and own requests.\nA third-party request is a request from a different domain.\nFor example, a request to `example.org` from `domain.com` is a third-party request.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293#options" } };
data$u.adg_any;
data$u.abp_any;
data$u.ubo_any;

var data$t = { adg_os_any:{ name:"method",
    description:"This modifier limits the rule scope to requests that use the specified set of HTTP methods.\nNegated methods are allowed.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#method-modifier",
    negatable:false,
    assignable:true,
    value_format:"pipe_separated_methods" },
  adg_ext_any:{ name:"method",
    description:"This modifier limits the rule scope to requests that use the specified set of HTTP methods.\nNegated methods are allowed.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#method-modifier",
    negatable:false,
    assignable:true,
    value_format:"pipe_separated_methods" },
  ubo_ext_any:{ name:"method",
    description:"This modifier limits the rule scope to requests that use the specified set of HTTP methods.\nNegated methods are allowed.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#method",
    negatable:false,
    assignable:true,
    value_format:"pipe_separated_methods" } };
data$t.adg_os_any;
data$t.adg_ext_any;
data$t.ubo_ext_any;

var data$s = { adg_os_any:{ name:"mp4",
    description:"As a response to blocked request AdGuard returns a short video placeholder.\nRules with `$mp4` are still supported and being converted into `$redirect=noopmp4-1s` now\nbut the support shall be removed in the future.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#mp4-modifier",
    deprecated:true,
    deprecation_message:"Rules with `$mp4` are still supported and being converted into `$redirect=noopmp4-1s` now\nbut the support shall be removed in the future.",
    negatable:false },
  adg_ext_any:{ name:"mp4",
    description:"As a response to blocked request AdGuard returns a short video placeholder.\nRules with `$mp4` are still supported and being converted into `$redirect=noopmp4-1s` now\nbut the support shall be removed in the future.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#mp4-modifier",
    deprecated:true,
    deprecation_message:"Rules with `$mp4` are still supported and being converted into `$redirect=noopmp4-1s` now\nbut the support shall be removed in the future.",
    negatable:false },
  ubo_ext_any:{ name:"mp4",
    description:"As a response to blocked request a short video placeholder is returned.\nRules with `$mp4` are supported and being converted into `$redirect=noopmp4-1s`.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#mp4",
    negatable:false } };
data$s.adg_os_any;
data$s.adg_ext_any;
data$s.ubo_ext_any;

var data$r = { adg_os_any:{ name:"network",
    description:"This is basically a Firewall-kind of rules allowing to fully block\nor unblock access to a specified remote address.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#network-modifier",
    conflicts:[ "app",
      "important" ],
    inverse_conflicts:true,
    negatable:false } };
data$r.adg_os_any;

var data$q = { adg_os_any:{ name:"_",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#noop-modifier",
    description:"The noop modifier does nothing and can be used solely to increase rules' readability.\nIt consists of a sequence of underscore characters (_) of any length\nand can appear in a rule as many times as needed.",
    negatable:false },
  adg_ext_any:{ name:"_",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#noop-modifier",
    description:"The noop modifier does nothing and can be used solely to increase rules' readability.\nIt consists of a sequence of underscore characters (_) of any length\nand can appear in a rule as many times as needed.",
    negatable:false },
  adg_cb_ios:{ name:"_",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#noop-modifier",
    description:"The noop modifier does nothing and can be used solely to increase rules' readability.\nIt consists of a sequence of underscore characters (_) of any length\nand can appear in a rule as many times as needed.",
    negatable:false },
  adg_cb_safari:{ name:"_",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#noop-modifier",
    description:"The noop modifier does nothing and can be used solely to increase rules' readability.\nIt consists of a sequence of underscore characters (_) of any length\nand can appear in a rule as many times as needed.",
    negatable:false },
  ubo_ext_any:{ name:"_",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#_-aka-noop",
    description:"The noop modifier does nothing and can be used solely to increase rules' readability.\nIt consists of a sequence of underscore characters (_) of any length\nand can appear in a rule as many times as needed.",
    negatable:false } };
data$q.adg_os_any;
data$q.adg_ext_any;
data$q.adg_cb_ios;
data$q.adg_cb_safari;
data$q.ubo_ext_any;

var data$p = { adg_any:{ name:"object-subrequest",
    description:"The `$object-subrequest` modifier is removed and is no longer supported.\nRules with it are considered as invalid.\nThe rule corresponds to requests by browser plugins (it is usually Flash).",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#object-subrequest-modifier",
    removed:true,
    removal_message:"The `$object-subrequest` modifier is removed and is no longer supported.\nRules with it are considered as invalid." } };
data$p.adg_any;

var data$o = { adg_any:{ name:"object",
    description:"The rule corresponds to browser plugins resources, e.g. Java or Flash",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#object-modifier" },
  abp_any:{ name:"object",
    description:"The rule corresponds to browser plugins resources, e.g. Java or Flash.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" },
  ubo_any:{ name:"object",
    description:"The rule corresponds to browser plugins resources, e.g. Java or Flash.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" } };
data$o.adg_any;
data$o.abp_any;
data$o.ubo_any;

var data$n = { adg_any:{ name:"other",
    description:"The rule applies to requests for which the type has not been determined\nor does not match the types listed above.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#other-modifier" },
  abp_any:{ name:"other",
    description:"The rule applies to requests for which the type has not been determined\nor does not match the types listed above.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" },
  ubo_any:{ name:"other",
    description:"The rule applies to requests for which the type has not been determined\nor does not match the types listed above.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" } };
data$n.adg_any;
data$n.abp_any;
data$n.ubo_any;

var data$m = { adg_os_any:{ name:"permissions",
    description:"For the requests matching a `$permissions` rule, ad blocker strengthens response's feature policy\nby adding additional feature policy equal to the `$permissions` modifier contents.\n`$permissions` rules are applied independently from any other rule type.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#permissions-modifier",
    version_added:"CoreLibs 1.11",
    conflicts:[ "domain",
      "important",
      "subdocument" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"permissions_value" } };
data$m.adg_os_any;

var data$l = { adg_any:{ name:"ping",
    description:"The rule corresponds to requests caused by either navigator.sendBeacon() or the ping attribute on links.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#ping-modifier" },
  abp_any:{ name:"ping",
    description:"The rule corresponds to requests caused by either navigator.sendBeacon() or the ping attribute on links.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" },
  ubo_any:{ name:"ping",
    description:"The rule corresponds to requests caused by either navigator.sendBeacon() or the ping attribute on links.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" } };
data$l.adg_any;
data$l.abp_any;
data$l.ubo_any;

var data$k = { ubo_ext_any:{ name:"popunder",
    description:"To block \"popunders\" windows/tabs where the original page redirects to an advertisement\nand the desired content loads in the newly created one.\nTo be used in the same manner as the popup filter option, except that it will block popunders.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#popunder",
    negatable:false,
    block_only:true } };
data$k.ubo_ext_any;

var data$j = { adg_any:{ name:"popup",
    description:"Pages opened in a new tab or window.\nNote: Filters will not block pop-ups by default, only if the `$popup`  type option is specified.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#popup-modifier",
    negatable:false },
  abp_any:{ name:"popup",
    description:"Pages opened in a new tab or window.\nNote: Filters will not block pop-ups by default, only if the `$popup`  type option is specified.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options",
    negatable:false },
  ubo_any:{ name:"popup",
    description:"Pages opened in a new tab or window.\nNote: Filters will not block pop-ups by default, only if the `$popup`  type option is specified.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options",
    negatable:false } };
data$j.adg_any;
data$j.abp_any;
data$j.ubo_any;

var data$i = { adg_os_any:{ name:"redirect-rule",
    description:"This is basically an alias to `$redirect`\nsince it has the same \"redirection\" values and the logic is almost similar.\nThe difference is that `$redirect-rule` is applied only in the case\nwhen the target request is blocked by a different basic rule.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#redirect-rule-modifier",
    conflicts:[ "domain",
      "to",
      "third-party",
      "popup",
      "match-case",
      "header",
      "first-party",
      "document",
      "image",
      "stylesheet",
      "script",
      "object",
      "font",
      "media",
      "subdocument",
      "ping",
      "xmlhttprequest",
      "websocket",
      "other",
      "webrtc",
      "important",
      "badfilter",
      "app" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"(?x)\n  ^(\n    1x1-transparent\\.gif|\n    2x2-transparent\\.png|\n    3x2-transparent\\.png|\n    32x32-transparent\\.png|\n    noopframe|\n    noopcss|\n    noopjs|\n    noopjson|\n    nooptext|\n    empty|\n    noopvmap-1\\.0|\n    noopvast-2\\.0|\n    noopvast-3\\.0|\n    noopvast-4\\.0|\n    noopmp3-0\\.1s|\n    noopmp4-1s|\n    amazon-apstag|\n    ati-smarttag|\n    didomi-loader|\n    fingerprintjs2|\n    fingerprintjs3|\n    gemius|\n    google-analytics-ga|\n    google-analytics|\n    google-ima3|\n    googlesyndication-adsbygoogle|\n    googletagservices-gpt|\n    matomo|\n    metrika-yandex-tag|\n    metrika-yandex-watch|\n    naver-wcslog|\n    noeval|\n    pardot-1\\.0|\n    prebid-ads|\n    prebid|\n    prevent-bab|\n    prevent-bab2|\n    prevent-fab-3\\.2\\.0|\n    prevent-popads-net|\n    scorecardresearch-beacon|\n    set-popads-dummy|\n    click2load\\.html|\n  )?$" },
  adg_ext_any:{ name:"redirect-rule",
    description:"This is basically an alias to `$redirect`\nsince it has the same \"redirection\" values and the logic is almost similar.\nThe difference is that `$redirect-rule` is applied only in the case\nwhen the target request is blocked by a different basic rule.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#redirect-rule-modifier",
    conflicts:[ "domain",
      "to",
      "third-party",
      "popup",
      "match-case",
      "header",
      "first-party",
      "document",
      "image",
      "stylesheet",
      "script",
      "object",
      "font",
      "media",
      "subdocument",
      "ping",
      "xmlhttprequest",
      "websocket",
      "other",
      "webrtc",
      "important",
      "badfilter" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"(?x)\n  ^(\n    1x1-transparent\\.gif|\n    2x2-transparent\\.png|\n    3x2-transparent\\.png|\n    32x32-transparent\\.png|\n    noopframe|\n    noopcss|\n    noopjs|\n    noopjson|\n    nooptext|\n    empty|\n    noopvmap-1\\.0|\n    noopvast-2\\.0|\n    noopvast-3\\.0|\n    noopvast-4\\.0|\n    noopmp3-0\\.1s|\n    noopmp4-1s|\n    amazon-apstag|\n    ati-smarttag|\n    didomi-loader|\n    fingerprintjs2|\n    fingerprintjs3|\n    gemius|\n    google-analytics-ga|\n    google-analytics|\n    google-ima3|\n    googlesyndication-adsbygoogle|\n    googletagservices-gpt|\n    matomo|\n    metrika-yandex-tag|\n    metrika-yandex-watch|\n    naver-wcslog|\n    noeval|\n    pardot-1\\.0|\n    prebid-ads|\n    prebid|\n    prevent-bab|\n    prevent-bab2|\n    prevent-fab-3\\.2\\.0|\n    prevent-popads-net|\n    scorecardresearch-beacon|\n    set-popads-dummy|\n    click2load\\.html|\n  )?$" },
  ubo_ext_any:{ name:"redirect-rule",
    description:"This is basically an alias to `$redirect`\nsince it has the same \"redirection\" values and the logic is almost similar.\nThe difference is that `$redirect-rule` is applied only in the case\nwhen the target request is blocked by a different basic rule.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#redirect-rule",
    conflicts:[ "domain",
      "to",
      "third-party",
      "popup",
      "match-case",
      "header",
      "first-party",
      "document",
      "image",
      "stylesheet",
      "script",
      "object",
      "font",
      "media",
      "subdocument",
      "ping",
      "xmlhttprequest",
      "websocket",
      "other",
      "webrtc",
      "important",
      "badfilter" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_format:"(?x)\n  ^(\n    1x1\\.gif|\n    2x2\\.png|\n    3x2\\.png|\n    32x32\\.png|\n    noop\\.css|\n    noop\\.html|\n    noopframe|\n    noop\\.js|\n    noop\\.txt|\n    noop-0\\.1s\\.mp3|\n    noop-0\\.5s\\.mp3|\n    noop-1s\\.mp4|\n    none|\n    click2load\\.html|\n    addthis_widget\\.js|\n    amazon_ads\\.js|\n    amazon_apstag\\.js|\n    monkeybroker\\.js|\n    doubleclick_instream_ad_status|\n    google-analytics_ga\\.js|\n    google-analytics_analytics\\.js|\n    google-analytics_inpage_linkid\\.js|\n    google-analytics_cx_api\\.js|\n    google-ima\\.js|\n    googletagservices_gpt\\.js|\n    googletagmanager_gtm\\.js|\n    googlesyndication_adsbygoogle\\.js|\n    scorecardresearch_beacon\\.js|\n    outbrain-widget\\.js|\n    hd-main\\.js\n  )\n  (:[0-9]+)?$" } };
data$i.adg_os_any;
data$i.adg_ext_any;
data$i.ubo_ext_any;

var data$h = { adg_os_any:{ name:"redirect",
    description:"Used to redirect web requests to a local \"resource\".",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#redirect-modifier",
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"(?x)\n  ^(\n    1x1-transparent\\.gif|\n    2x2-transparent\\.png|\n    3x2-transparent\\.png|\n    32x32-transparent\\.png|\n    noopframe|\n    noopcss|\n    noopjs|\n    noopjson|\n    nooptext|\n    empty|\n    noopvmap-1\\.0|\n    noopvast-2\\.0|\n    noopvast-3\\.0|\n    noopvast-4\\.0|\n    noopmp3-0\\.1s|\n    noopmp4-1s|\n    amazon-apstag|\n    ati-smarttag|\n    didomi-loader|\n    fingerprintjs2|\n    fingerprintjs3|\n    gemius|\n    google-analytics-ga|\n    google-analytics|\n    googletagmanager-gtm|\n    google-ima3|\n    googlesyndication-adsbygoogle|\n    googletagservices-gpt|\n    matomo|\n    metrika-yandex-tag|\n    metrika-yandex-watch|\n    naver-wcslog|\n    noeval|\n    pardot-1\\.0|\n    prebid-ads|\n    prebid|\n    prevent-bab|\n    prevent-bab2|\n    prevent-fab-3\\.2\\.0|\n    prevent-popads-net|\n    scorecardresearch-beacon|\n    set-popads-dummy|\n    click2load\\.html\n  )?$" },
  adg_ext_any:{ name:"redirect",
    description:"Used to redirect web requests to a local \"resource\".",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#redirect-modifier",
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"(?x)\n  ^(\n    1x1-transparent\\.gif|\n    2x2-transparent\\.png|\n    3x2-transparent\\.png|\n    32x32-transparent\\.png|\n    noopframe|\n    noopcss|\n    noopjs|\n    noopjson|\n    nooptext|\n    empty|\n    noopvmap-1\\.0|\n    noopvast-2\\.0|\n    noopvast-3\\.0|\n    noopvast-4\\.0|\n    noopmp3-0\\.1s|\n    noopmp4-1s|\n    amazon-apstag|\n    ati-smarttag|\n    didomi-loader|\n    fingerprintjs2|\n    fingerprintjs3|\n    gemius|\n    google-analytics-ga|\n    google-analytics|\n    googletagmanager-gtm|\n    google-ima3|\n    googlesyndication-adsbygoogle|\n    googletagservices-gpt|\n    matomo|\n    metrika-yandex-tag|\n    metrika-yandex-watch|\n    naver-wcslog|\n    noeval|\n    pardot-1\\.0|\n    prebid-ads|\n    prebid|\n    prevent-bab|\n    prevent-bab2|\n    prevent-fab-3\\.2\\.0|\n    prevent-popads-net|\n    scorecardresearch-beacon|\n    set-popads-dummy|\n    click2load\\.html\n  )?$" },
  ubo_ext_any:{ name:"redirect",
    description:"Used to redirect web requests to a local \"resource\".",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#redirect",
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"(?x)\n  ^(\n    1x1\\.gif|\n    2x2\\.png|\n    3x2\\.png|\n    32x32\\.png|\n    noop\\.css|\n    noop\\.html|\n    noopframe|\n    noop\\.js|\n    noop\\.txt|\n    noop-0\\.1s\\.mp3|\n    noop-0\\.5s\\.mp3|\n    noop-1s\\.mp4|\n    none|\n    click2load\\.html|\n    addthis_widget\\.js|\n    amazon_ads\\.js|\n    amazon_apstag\\.js|\n    monkeybroker\\.js|\n    doubleclick_instream_ad_status|\n    google-analytics_ga\\.js|\n    google-analytics_analytics\\.js|\n    google-analytics_inpage_linkid\\.js|\n    google-analytics_cx_api\\.js|\n    google-ima\\.js|\n    googletagservices_gpt\\.js|\n    googletagmanager_gtm\\.js|\n    googlesyndication_adsbygoogle\\.js|\n    scorecardresearch_beacon\\.js|\n    outbrain-widget\\.js|\n    hd-main\\.js\n  )\n  (:[0-9]+)?$" },
  abp_ext_any:{ name:"rewrite",
    description:"The `rewrite=` option allows the rewriting of URLs (or redirecting requests) to an internal\nresource in order to deactivate it without causing an error. Indicate the internal resource\nby name and prefix `abp-resource:` in order to be recognized. For example\n`$rewrite=abp-resource:blank-js` sends an empty JavaScript.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293#rewrite",
    assignable:true,
    negatable:false,
    value_format:"(?x)\n  # ABP resources always starts with the `abp-resource:` prefix\n  ^abp-resource:\n  # Possible resource names\n  (\n    blank-text|\n    blank-css|\n    blank-js|\n    blank-html|\n    blank-mp3|\n    1x1-transparent-gif|\n    2x2-transparent-png|\n    3x2-transparent-png|\n    32x32-transparent-png\n  )$" } };
data$h.adg_os_any;
data$h.adg_ext_any;
data$h.ubo_ext_any;
data$h.abp_ext_any;

var data$g = { adg_os_any:{ name:"referrerpolicy",
    description:"This modifier allows overriding of a page's referrer policy.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#referrerpolicy-modifier",
    conflicts:[ "document",
      "subdocument" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"referrerpolicy_value" } };
data$g.adg_os_any;

var data$f = { adg_os_any:{ name:"removeheader",
    description:"Rules with the `$removeheader` modifier are intended to remove headers from HTTP requests and responses.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#removeheader-modifier",
    conflicts:[ "domain",
      "third-party",
      "first-party",
      "app",
      "important",
      "match-case",
      "document",
      "image",
      "stylesheet",
      "script",
      "object",
      "font",
      "media",
      "subdocument",
      "ping",
      "xmlhttpreqeust",
      "websocket",
      "other",
      "webrtc" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"(?xi)\n  ^\n    # Value may start with \"request:\"\n    (request:)?\n\n    # Forbidden header names\n    (?!\n      (\n        access-control-allow-origin|\n        access-control-allow-credentials|\n        access-control-allow-headers|\n        access-control-allow-methods|\n        access-control-expose-headers|\n        access-control-max-age|\n        access-control-request-headers|\n        access-control-request-method|\n        origin|\n        timing-allow-origin|\n        allow|\n        cross-origin-embedder-policy|\n        cross-origin-opener-policy|\n        cross-origin-resource-policy|\n        content-security-policy|\n        content-security-policy-report-only|\n        expect-ct|\n        feature-policy|\n        origin-isolation|\n        strict-transport-security|\n        upgrade-insecure-requests|\n        x-content-type-options|\n        x-download-options|\n        x-frame-options|\n        x-permitted-cross-domain-policies|\n        x-powered-by|\n        x-xss-protection|\n        public-key-pins|\n        public-key-pins-report-only|\n        sec-websocket-key|\n        sec-websocket-extensions|\n        sec-websocket-accept|\n        sec-websocket-protocol|\n        sec-websocket-version|\n        p3p|\n        sec-fetch-mode|\n        sec-fetch-dest|\n        sec-fetch-site|\n        sec-fetch-user|\n        referrer-policy|\n        content-type|\n        content-length|\n        accept|\n        accept-encoding|\n        host|\n        connection|\n        transfer-encoding|\n        upgrade\n      )\n    $)\n\n    # Any other header name is allowed, if it matches the following regex\n    [A-z0-9-]+\n  $" },
  adg_ext_any:{ name:"removeheader",
    description:"Rules with the `$removeheader` modifier are intended to remove headers from HTTP requests and responses.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#removeheader-modifier",
    conflicts:[ "domain",
      "third-party",
      "first-party",
      "app",
      "important",
      "match-case",
      "document",
      "image",
      "stylesheet",
      "script",
      "object",
      "font",
      "media",
      "subdocument",
      "ping",
      "xmlhttpreqeust",
      "websocket",
      "other",
      "webrtc" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"(?xi)\n  ^\n    # Value may start with \"request:\"\n    (request:)?\n\n    # Forbidden header names\n    (?!\n      (\n        access-control-allow-origin|\n        access-control-allow-credentials|\n        access-control-allow-headers|\n        access-control-allow-methods|\n        access-control-expose-headers|\n        access-control-max-age|\n        access-control-request-headers|\n        access-control-request-method|\n        origin|\n        timing-allow-origin|\n        allow|\n        cross-origin-embedder-policy|\n        cross-origin-opener-policy|\n        cross-origin-resource-policy|\n        content-security-policy|\n        content-security-policy-report-only|\n        expect-ct|\n        feature-policy|\n        origin-isolation|\n        strict-transport-security|\n        upgrade-insecure-requests|\n        x-content-type-options|\n        x-download-options|\n        x-frame-options|\n        x-permitted-cross-domain-policies|\n        x-powered-by|\n        x-xss-protection|\n        public-key-pins|\n        public-key-pins-report-only|\n        sec-websocket-key|\n        sec-websocket-extensions|\n        sec-websocket-accept|\n        sec-websocket-protocol|\n        sec-websocket-version|\n        p3p|\n        sec-fetch-mode|\n        sec-fetch-dest|\n        sec-fetch-site|\n        sec-fetch-user|\n        referrer-policy|\n        content-type|\n        content-length|\n        accept|\n        accept-encoding|\n        host|\n        connection|\n        transfer-encoding|\n        upgrade\n      )\n    $)\n\n    # Any other header name is allowed, if it matches the following regex\n    [A-z0-9-]+\n  $" } };
data$f.adg_os_any;
data$f.adg_ext_any;

var data$e = { adg_os_any:{ name:"removeparam",
    description:"Rules with the `$removeparam` modifier are intended to strip query parameters from requests' URLs.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#removeparam-modifier",
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"(?xi)\n  (\n    # string pattern\n    \\w+\n    # or regexp pattern\n    |\n    \\/.+\\/\n      # flags\n      ([gimuy]+)?\n  )" },
  adg_ext_any:{ name:"removeparam",
    description:"Rules with the `$removeparam` modifier are intended to strip query parameters from requests' URLs.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#removeparam-modifier",
    assignable:true,
    negatable:false,
    value_optional:true,
    value_format:"(?xi)\n  (\n    # string pattern\n    \\w+\n    # or regexp pattern\n    |\n    \\/.+\\/\n      # flags\n      ([gimuy]+)?\n  )" },
  ubo_ext_any:{ name:"removeparam",
    description:"Rules with the `$removeparam` modifier are intended to strip query parameters from requests' URLs.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#removeparam",
    assignable:true,
    negatable:false,
    value_format:"(?xi)\n  (\n    # string pattern\n    \\w+\n    # or regexp pattern\n    |\n    \\/.+\\/\n      # flags\n      ([gimuy]+)?\n  )" } };
data$e.adg_os_any;
data$e.adg_ext_any;
data$e.ubo_ext_any;

var data$d = { adg_os_any:{ name:"replace",
    description:"This modifier completely changes the rule behavior.\nIf it is applied, the rule will not block the request. The response is going to be modified instead.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#replace-modifier",
    conflicts:[ "app",
      "domain",
      "document",
      "subdocument",
      "script",
      "stylesheet",
      "other",
      "xmlhttprequest",
      "first-party",
      "third-party",
      "important",
      "badfilter" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_format:"(?xi)\n  ^\n    \\/\n      # the regexp to match by\n      (.+)\n    # separator\n    \\/\n      # replacement\n      (.+)?\n    \\/\n      # flags\n      ([gimuy]*)?\n  $" },
  adg_ext_firefox:{ name:"replace",
    description:"This modifier completely changes the rule behavior.\nIf it is applied, the rule will not block the request. The response is going to be modified instead.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#replace-modifier",
    conflicts:[ "domain",
      "document",
      "subdocument",
      "script",
      "stylesheet",
      "other",
      "xmlhttprequest",
      "first-party",
      "third-party",
      "important",
      "badfilter" ],
    inverse_conflicts:true,
    assignable:true,
    negatable:false,
    value_format:"(?xi)\n  ^\n    \\/\n      # the regexp to match by\n      (.+)\n    # separator\n    \\/\n      # replacement\n      (.+)?\n    \\/\n      # flags\n      ([gimuy]*)?\n  $" } };
data$d.adg_os_any;
data$d.adg_ext_firefox;

var data$c = { adg_any:{ name:"script",
    description:"The rule corresponds to script requests, e.g. javascript, vbscript.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#script-modifier" },
  abp_any:{ name:"script",
    description:"The rule corresponds to script requests, e.g. javascript, vbscript.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" },
  ubo_any:{ name:"script",
    description:"The rule corresponds to script requests, e.g. javascript, vbscript.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293#options" } };
data$c.adg_any;
data$c.abp_any;
data$c.ubo_any;

var data$b = { adg_any:{ name:"specifichide",
    aliases:[ "shide" ],
    description:"Disables all specific element hiding and CSS rules, but not general ones.\nHas an opposite effect to `$generichide`.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#specifichide-modifier",
    conflicts:[ "domain",
      "genericblock",
      "urlblock",
      "extension",
      "jsinject",
      "content",
      "xmlhttprequest",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true },
  ubo_any:{ name:"specifichide",
    aliases:[ "shide" ],
    description:"Disables all specific element hiding and CSS rules, but not general ones.\nHas an opposite effect to `$generichide`.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#specifichide",
    conflicts:[ "domain",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true } };
data$b.adg_any;
data$b.ubo_any;

var data$a = { adg_os_any:{ name:"stealth",
    description:"Disables the Stealth Mode module for all corresponding pages and requests.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#stealth-modifier",
    assignable:true,
    negatable:false,
    exception_only:true,
    value_optional:true,
    value_format:"pipe_separated_stealth_options" },
  adg_ext_chrome:{ name:"stealth",
    description:"Disables the Stealth Mode module for all corresponding pages and requests.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#stealth-modifier",
    assignable:true,
    negatable:false,
    exception_only:true,
    value_optional:true,
    value_format:"pipe_separated_stealth_options" },
  adg_ext_firefox:{ name:"stealth",
    description:"Disables the Stealth Mode module for all corresponding pages and requests.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#stealth-modifier",
    assignable:true,
    negatable:false,
    exception_only:true,
    value_optional:true,
    value_format:"pipe_separated_stealth_options" },
  adg_ext_opera:{ name:"stealth",
    description:"Disables the Stealth Mode module for all corresponding pages and requests.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#stealth-modifier",
    assignable:true,
    negatable:false,
    exception_only:true,
    value_optional:true,
    value_format:"pipe_separated_stealth_options" },
  adg_ext_edge:{ name:"stealth",
    description:"Disables the Stealth Mode module for all corresponding pages and requests.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#stealth-modifier",
    assignable:true,
    negatable:false,
    exception_only:true,
    value_optional:true,
    value_format:"pipe_separated_stealth_options" } };
data$a.adg_os_any;
data$a.adg_ext_chrome;
data$a.adg_ext_firefox;
data$a.adg_ext_opera;
data$a.adg_ext_edge;

var data$9 = { ubo_any:{ name:"strict1p",
    description:"This new `strict1p` option can check for strict partyness.\nFor example, a network request qualifies as 1st-party if both the context and the request share the same hostname.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#strict1p" } };
data$9.ubo_any;

var data$8 = { ubo_any:{ name:"strict3p",
    description:"This new `strict3p` option can check for strict partyness.\nFor example, a network request qualifies as 3rd-party if the context and the request hostnames are different.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#strict3p" } };
data$8.ubo_any;

var data$7 = { adg_any:{ name:"stylesheet",
    description:"The rule corresponds to CSS files requests.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#stylesheet-modifier" },
  abp_any:{ name:"stylesheet",
    description:"The rule corresponds to CSS files requests.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" },
  ubo_any:{ name:"stylesheet",
    aliases:[ "css" ],
    description:"The rule corresponds to CSS files requests.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#css" } };
data$7.adg_any;
data$7.abp_any;
data$7.ubo_any;

var data$6 = { adg_any:{ name:"subdocument",
    description:"The rule corresponds to requests for built-in pages — HTML tags frame and iframe.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#subdocument-modifier" },
  abp_any:{ name:"subdocument",
    description:"The rule corresponds to requests for built-in pages — HTML tags frame and iframe.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" },
  ubo_any:{ name:"subdocument",
    aliases:[ "frame" ],
    description:"The rule corresponds to requests for built-in pages — HTML tags frame and iframe.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#frame" } };
data$6.adg_any;
data$6.abp_any;
data$6.ubo_any;

var data$5 = { adg_any:{ name:"third-party",
    aliases:[ "3p" ],
    description:"A restriction of third-party and own requests.\nA third-party request is a request from a different domain.\nFor example, a request to `example.org` from `domain.com` is a third-party request.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#third-party-modifier" },
  ubo_any:{ name:"3p",
    aliases:[ "third-party" ],
    description:"A restriction of third-party and own requests.\nA third-party request is a request from a different domain.\nFor example, a request to `example.org` from `domain.com` is a third-party request.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#3p" },
  abp_any:{ name:"third-party",
    description:"A restriction of third-party and own requests.\nA third-party request is a request from a different domain.\nFor example, a request to `example.org` from `domain.com` is a third-party request.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293#party-requests" } };
data$5.adg_any;
data$5.ubo_any;
data$5.abp_any;

var data$4 = { ubo_ext_any:{ name:"to",
    description:"The main motivation of this option is\nto give static network filtering engine an equivalent of DNR's `requestDomains` and `excludedRequestDomains`.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#to",
    assignable:true,
    negatable:false,
    value_format:"pipe_separated_domains" } };
data$4.ubo_ext_any;

var data$3 = { adg_any:{ name:"urlblock",
    description:"Disables blocking of all requests sent from the pages matching the rule.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#urlblock-modifier",
    conflicts:[ "domain",
      "specifichide",
      "generichide",
      "elemhide",
      "extension",
      "jsinject",
      "content",
      "badfilter" ],
    inverse_conflicts:true,
    negatable:false,
    exception_only:true } };
data$3.adg_any;

var data$2 = { adg_any:{ name:"webrtc",
    description:"The rule applies only to WebRTC connections.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#webrtc-modifier",
    removed:true,
    removal_message:"This modifier is removed and is no longer supported.\nRules with it are considered as invalid. If you need to suppress WebRTC, consider using\nthe [nowebrtc scriptlet](https://github.com/AdguardTeam/Scriptlets/blob/master/wiki/about-scriptlets.md#nowebrtc)." },
  ubo_any:{ name:"webrtc",
    description:"The rule applies only to WebRTC connections.",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax",
    removed:true,
    removal_message:"This modifier is removed and is no longer supported.\nIf you need to suppress WebRTC, consider using\nthe [nowebrtc scriptlet](https://github.com/gorhill/uBlock/wiki/Resources-Library#nowebrtcjs-)." },
  abp_any:{ name:"webrtc",
    description:"The rule applies only to WebRTC connections.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options",
    version_added:"1.13.3" } };
data$2.adg_any;
data$2.ubo_any;
data$2.abp_any;

var data$1 = { adg_os_any:{ name:"websocket",
    description:"The rule applies only to WebSocket connections.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#websocket-modifier" },
  adg_ext_any:{ name:"websocket",
    description:"The rule applies only to WebSocket connections.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#websocket-modifier" },
  adg_cb_ios:{ name:"websocket",
    description:"The rule applies only to WebSocket connections.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#websocket-modifier" },
  adg_cb_safari:{ name:"websocket",
    description:"The rule applies only to WebSocket connections.",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#websocket-modifier" },
  abp_ext_any:{ name:"websocket",
    description:"The rule applies only to WebSocket connections.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" },
  ubo_ext_any:{ name:"websocket",
    description:"The rule applies only to WebSocket connections.",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" } };
data$1.adg_os_any;
data$1.adg_ext_any;
data$1.adg_cb_ios;
data$1.adg_cb_safari;
data$1.abp_ext_any;
data$1.ubo_ext_any;

var data = { adg_any:{ name:"xmlhttprequest",
    aliases:[ "xhr" ],
    description:"The rule applies only to ajax requests (requests sent via javascript object XMLHttpRequest).",
    docs:"https://adguard.app/kb/general/ad-filtering/create-own-filters/#xmlhttprequest-modifier" },
  abp_any:{ name:"xmlhttprequest",
    description:"The rule applies only to ajax requests (requests sent via javascript object XMLHttpRequest).",
    docs:"https://help.adblockplus.org/hc/en-us/articles/360062733293-How-to-write-filters#type-options" },
  ubo_any:{ name:"xhr",
    aliases:[ "xmlhttprequest" ],
    description:"The rule applies only to ajax requests (requests sent via javascript object XMLHttpRequest).",
    docs:"https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#xhr" } };
data.adg_any;
data.abp_any;
data.ubo_any;

/**
 * @file Raw compatibility tables data reexport from yaml files.
 *
 * '@ts-nocheck' is used here once instead of adding @ts-ignore for each import.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Please keep imports and exports in alphabetical order
const rawModifiersData = {
    all: data$U,
    app: data$T,
    badfilter: data$S,
    cname: data$R,
    content: data$Q,
    cookie: data$P,
    csp: data$O,
    denyallow: data$N,
    document: data$M,
    domain: data$L,
    elemhide: data$K,
    empty: data$J,
    firstParty: data$I,
    extension: data$H,
    font: data$G,
    genericblock: data$F,
    generichide: data$E,
    header: data$D,
    hls: data$C,
    image: data$B,
    important: data$A,
    inlineFont: data$z,
    inlineScript: data$y,
    jsinject: data$x,
    jsonprune: data$w,
    matchCase: data$v,
    media: data$u,
    method: data$t,
    mp4: data$s,
    network: data$r,
    noop: data$q,
    objectSubrequest: data$p,
    object: data$o,
    other: data$n,
    permissions: data$m,
    ping: data$l,
    popunder: data$k,
    popup: data$j,
    redirectRule: data$i,
    redirect: data$h,
    referrerpolicy: data$g,
    removeheader: data$f,
    removeparam: data$e,
    replace: data$d,
    script: data$c,
    specifichide: data$b,
    stealth: data$a,
    strict1p: data$9,
    strict3p: data$8,
    stylesheet: data$7,
    subdocument: data$6,
    thirdParty: data$5,
    to: data$4,
    urlblock: data$3,
    webrtc: data$2,
    websocket: data$1,
    xmlhttprequest: data,
};

/**
 * @file Compatibility tables types.
 */
/**
 * List of properties names for modifier data.
 *
 * @see {@link https://github.com/AdguardTeam/tsurlfilter/blob/master/packages/agtree/src/compatibility-tables/modifiers/README.md#file-structure}
 */
var SpecificKey;
(function (SpecificKey) {
    SpecificKey["Name"] = "name";
    SpecificKey["Aliases"] = "aliases";
    SpecificKey["Description"] = "description";
    SpecificKey["Docs"] = "docs";
    SpecificKey["Deprecated"] = "deprecated";
    SpecificKey["DeprecationMessage"] = "deprecation_message";
    SpecificKey["Removed"] = "removed";
    SpecificKey["RemovalMessage"] = "removal_message";
    SpecificKey["Conflicts"] = "conflicts";
    SpecificKey["InverseConflicts"] = "inverse_conflicts";
    SpecificKey["Assignable"] = "assignable";
    SpecificKey["Negatable"] = "negatable";
    SpecificKey["BlockOnly"] = "block_only";
    SpecificKey["ExceptionOnly"] = "exception_only";
    SpecificKey["ValueOptional"] = "value_optional";
    SpecificKey["ValueFormat"] = "value_format";
    // TODO: following fields should be handled later
    // VersionAdded = 'version_added',
    // VersionRemoved = 'version_removed',
})(SpecificKey || (SpecificKey = {}));

/**
 * Prepares specific platform modifier data from raw modifiers data —
 * sets [default values] to properties that are not defined in raw data.
 *
 * [default values]: ./modifiers/README.md "Check File structure table for default values."
 *
 * @param blockerId Key in ModifierData, i.e. 'adg_os_any', 'ubo_ext_any', etc.
 * @param rawModifierData Specific platform modifier data from raw modifiers data.
 *
 * @returns Prepared specific platform modifier data where properties cannot be undefined.
 */
const prepareBlockerData = (blockerId, rawModifierData) => {
    const rawData = rawModifierData[blockerId];
    const blockerData = {
        [SpecificKey.Name]: rawData[SpecificKey.Name],
        [SpecificKey.Aliases]: rawData[SpecificKey.Aliases] || null,
        [SpecificKey.Description]: rawData[SpecificKey.Description] || null,
        [SpecificKey.Docs]: rawData[SpecificKey.Docs] || null,
        [SpecificKey.Deprecated]: rawData[SpecificKey.Deprecated] || false,
        [SpecificKey.DeprecationMessage]: rawData[SpecificKey.DeprecationMessage] || null,
        [SpecificKey.Removed]: rawData[SpecificKey.Removed] || false,
        [SpecificKey.RemovalMessage]: rawData[SpecificKey.RemovalMessage] || null,
        [SpecificKey.Conflicts]: rawData[SpecificKey.Conflicts] || null,
        [SpecificKey.InverseConflicts]: rawData[SpecificKey.InverseConflicts] || false,
        [SpecificKey.Assignable]: rawData[SpecificKey.Assignable] || false,
        // 'negatable' should be checked whether it is undefined or not
        // because if it is 'false', default value 'true' will override it
        [SpecificKey.Negatable]: isUndefined(rawData[SpecificKey.Negatable])
            ? true
            : rawData[SpecificKey.Negatable],
        [SpecificKey.BlockOnly]: rawData[SpecificKey.BlockOnly] || false,
        [SpecificKey.ExceptionOnly]: rawData[SpecificKey.ExceptionOnly] || false,
        [SpecificKey.ValueOptional]: rawData[SpecificKey.ValueOptional] || false,
        [SpecificKey.ValueFormat]: rawData[SpecificKey.ValueFormat] || null,
    };
    return blockerData;
};
/**
 * Prepares raw modifiers data into a data map with default values for properties
 * that are not defined in raw data.
 *
 * @returns Map of parsed and prepared modifiers data.
 */
const getModifiersData = () => {
    const dataMap = new Map();
    Object.keys(rawModifiersData).forEach((modifierId) => {
        const rawModifierData = rawModifiersData[modifierId];
        const modifierData = {};
        Object.keys(rawModifierData).forEach((blockerId) => {
            modifierData[blockerId] = prepareBlockerData(blockerId, rawModifierData);
        });
        dataMap.set(modifierId, modifierData);
    });
    return dataMap;
};

/**
 * Prefixes for different adblockers to describe the platform-specific modifiers data
 * stored in the yaml files.
 */
const BLOCKER_PREFIX = {
    [AdblockSyntax.Adg]: 'adg_',
    [AdblockSyntax.Ubo]: 'ubo_',
    [AdblockSyntax.Abp]: 'abp_',
};
/**
 * Set of all allowed characters for app name except the dot `.`.
 */
const APP_NAME_ALLOWED_CHARS = new Set([
    ...CAPITAL_LETTERS,
    ...SMALL_LETTERS,
    ...NUMBERS,
    UNDERSCORE,
]);
/**
 * Allowed methods for $method modifier.
 *
 * @see {@link https://adguard.app/kb/general/ad-filtering/create-own-filters/#method-modifier}
 */
const ALLOWED_METHODS = new Set([
    'connect',
    'delete',
    'get',
    'head',
    'options',
    'patch',
    'post',
    'put',
    'trace',
]);
/**
 * Allowed stealth options for $stealth modifier.
 *
 * @see {@link https://adguard.app/kb/general/ad-filtering/create-own-filters/#stealth-modifier}
 */
const ALLOWED_STEALTH_OPTIONS = new Set([
    'searchqueries',
    'donottrack',
    '3p-cookie',
    '1p-cookie',
    '3p-cache',
    '3p-auth',
    'webrtc',
    'push',
    'location',
    'flash',
    'java',
    'referrer',
    'useragent',
    'ip',
    'xclientdata',
    'dpi',
]);
/**
 * Allowed CSP directives for $csp modifier.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives}
 */
const ALLOWED_CSP_DIRECTIVES = new Set([
    'base-uri',
    'child-src',
    'connect-src',
    'default-src',
    'fenced-frame-src',
    'font-src',
    'form-action',
    'frame-ancestors',
    'frame-src',
    'img-src',
    'manifest-src',
    'media-src',
    'navigate-to',
    'object-src',
    'plugin-types',
    'prefetch-src',
    'referrer',
    'report-to',
    'report-uri',
    'require-trusted-types-for',
    'sandbox',
    'script-src',
    'script-src-attr',
    'script-src-elem',
    'style-src',
    'style-src-attr',
    'style-src-elem',
    'trusted-types',
    'upgrade-insecure-requests',
    'worker-src',
]);
/**
 * Allowed directives for $permissions modifier.
 *
 * @see {@link https://adguard.app/kb/general/ad-filtering/create-own-filters/#permissions-modifier}
 */
const ALLOWED_PERMISSION_DIRECTIVES = new Set([
    'accelerometer',
    'ambient-light-sensor',
    'autoplay',
    'battery',
    'camera',
    'display-capture',
    'document-domain',
    'encrypted-media',
    'execution-while-not-rendered',
    'execution-while-out-of-viewport',
    'fullscreen',
    'gamepad',
    'geolocation',
    'gyroscope',
    'hid',
    'identity-credentials-get',
    'idle-detection',
    'local-fonts',
    'magnetometer',
    'microphone',
    'midi',
    'payment',
    'picture-in-picture',
    'publickey-credentials-create',
    'publickey-credentials-get',
    'screen-wake-lock',
    'serial',
    'speaker-selection',
    'storage-access',
    'usb',
    'web-share',
    'xr-spatial-tracking',
]);
/**
 * One of available tokens for $permission modifier value.
 *
 * @see {@link https://w3c.github.io/webappsec-permissions-policy/#structured-header-serialization}
 */
const PERMISSIONS_TOKEN_SELF = 'self';
/**
 * One of allowlist values for $permissions modifier.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy#allowlists}
 */
const EMPTY_PERMISSIONS_ALLOWLIST = `${OPEN_PARENTHESIS}${CLOSE_PARENTHESIS}`;
/**
 * Allowed directives for $referrerpolicy modifier.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy}
 */
const REFERRER_POLICY_DIRECTIVES = new Set([
    'no-referrer',
    'no-referrer-when-downgrade',
    'origin',
    'origin-when-cross-origin',
    'same-origin',
    'strict-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url',
]);
/**
 * Prefixes for error messages used in modifier validation.
 */
const VALIDATION_ERROR_PREFIX = {
    BLOCK_ONLY: 'Only blocking rules may contain the modifier',
    EXCEPTION_ONLY: 'Only exception rules may contain the modifier',
    INVALID_CSP_DIRECTIVES: 'Invalid CSP directives for the modifier',
    INVALID_LIST_VALUES: 'Invalid values for the modifier',
    INVALID_NOOP: 'Invalid noop modifier',
    INVALID_PERMISSION_DIRECTIVE: 'Invalid Permissions-Policy directive for the modifier',
    INVALID_PERMISSION_ORIGINS: 'Origins in the value is invalid for the modifier and the directive',
    INVALID_PERMISSION_ORIGIN_QUOTES: 'Double quotes should be used for origins in the value of the modifier',
    INVALID_REFERRER_POLICY_DIRECTIVE: 'Invalid Referrer-Policy directive for the modifier',
    MIXED_NEGATIONS: 'Simultaneous usage of negated and not negated values is forbidden for the modifier',
    NO_CSP_VALUE: 'No CSP value for the modifier and the directive',
    NO_CSP_DIRECTIVE_QUOTE: 'CSP directives should no be quoted for the modifier',
    NO_UNESCAPED_PERMISSION_COMMA: 'Unescaped comma in the value is not allowed for the modifier',
    // TODO: implement later for $scp and $permissions
    // NO_VALUE_ONLY_FOR_EXCEPTION: 'Modifier without value can be used only in exception rules',
    NOT_EXISTENT: 'Non-existent modifier',
    NOT_NEGATABLE_MODIFIER: 'Non-negatable modifier',
    NOT_NEGATABLE_VALUE: 'Values cannot be negated for the modifier',
    NOT_SUPPORTED: 'The adblocker does not support the modifier',
    REMOVED: 'Removed and no longer supported modifier',
    VALUE_FORBIDDEN: 'Value is not allowed for the modifier',
    VALUE_INVALID: 'Value is invalid for the modifier',
    VALUE_REQUIRED: 'Value is required for the modifier',
};
/**
 * Prefixes for error messages related to issues in the source YAML files' data.
 */
const SOURCE_DATA_ERROR_PREFIX = {
    INVALID_VALUE_FORMAT_REGEXP: "Invalid regular expression in 'value_format' for the modifier",
    NO_DEPRECATION_MESSAGE: "Property 'deprecation_message' is required for the 'deprecated' modifier",
    NO_VALUE_FORMAT_FOR_ASSIGNABLE: "Property 'value_format' should be specified for the assignable modifier",
};

/**
 * Validates the noop modifier (i.e. only underscores).
 *
 * @param value Value of the modifier.
 *
 * @returns True if the modifier is valid, false otherwise.
 */
const isValidNoopModifier = (value) => {
    return value.split('').every((char) => char === UNDERSCORE);
};
/**
 * Returns invalid validation result with given error message.
 *
 * @param error Error message.
 *
 * @returns Validation result `{ valid: false, error }`.
 */
const getInvalidValidationResult = (error) => {
    return {
        valid: false,
        error,
    };
};
/**
 * Returns invalid validation result which uses {@link VALIDATION_ERROR_PREFIX.VALUE_REQUIRED} as prefix
 * and specifies the given `modifierName` in the error message.
 *
 * @param modifierName Modifier name.
 *
 * @returns Validation result `{ valid: false, error }`.
 */
const getValueRequiredValidationResult = (modifierName) => {
    return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.VALUE_REQUIRED}: '${modifierName}'`);
};
/**
 * Collects names and aliases for all supported modifiers.
 * Deprecated and removed modifiers are included because they are known and existent
 * and they should be validated properly.
 *
 * @param dataMap Parsed all modifiers data.
 *
 * @returns Set of all modifier names (and their aliases).
 */
const getAllModifierNames = (dataMap) => {
    const names = new Set();
    dataMap.forEach((modifierData) => {
        Object.keys(modifierData).forEach((blockerId) => {
            const blockerData = modifierData[blockerId];
            names.add(blockerData.name);
            if (!blockerData.aliases) {
                return;
            }
            blockerData.aliases.forEach((alias) => names.add(alias));
        });
    });
    return names;
};
/**
 * Returns modifier data for given modifier name and adblocker.
 *
 * @param modifiersData Parsed all modifiers data map.
 * @param blockerPrefix Prefix of the adblocker, e.g. 'adg_', 'ubo_', or 'abp_'.
 * @param modifierName Modifier name.
 *
 * @returns Modifier data or `null` if not found.
 */
const getSpecificBlockerData = (modifiersData, blockerPrefix, modifierName) => {
    let specificBlockerData = null;
    modifiersData.forEach((modifierData) => {
        Object.keys(modifierData).forEach((blockerId) => {
            const blockerData = modifierData[blockerId];
            if (blockerData.name === modifierName
                || (blockerData.aliases && blockerData.aliases.includes(modifierName))) {
                // modifier is found by name or alias
                // so its support by specific adblocker should be checked
                if (blockerId.startsWith(blockerPrefix)) {
                    // so maybe other data objects should be checked as well (not sure)
                    specificBlockerData = blockerData;
                }
            }
        });
    });
    return specificBlockerData;
};

/**
 * @file Utility functions for domain and hostname validation.
 */
/**
 * Marker for a wildcard top-level domain — `.*`.
 *
 * @example
 * `example.*` — matches with any TLD, e.g. `example.org`, `example.com`, etc.
 */
const WILDCARD_TLD = DOT + WILDCARD;
/**
 * Marker for a wildcard subdomain — `*.`.
 *
 * @example
 * `*.example.org` — matches with any subdomain, e.g. `foo.example.org` or `bar.example.org`
 */
const WILDCARD_SUBDOMAIN = WILDCARD + DOT;
class DomainUtils {
    /**
     * Check if the input is a valid domain or hostname.
     *
     * @param domain Domain to check
     * @returns `true` if the domain is valid, `false` otherwise
     */
    static isValidDomainOrHostname(domain) {
        let domainToCheck = domain;
        // Wildcard-only domain, typically a generic rule
        if (domainToCheck === WILDCARD) {
            return true;
        }
        // https://adguard.com/kb/general/ad-filtering/create-own-filters/#wildcard-for-tld
        if (domainToCheck.endsWith(WILDCARD_TLD)) {
            // Remove the wildcard TLD
            domainToCheck = domainToCheck.substring(0, domainToCheck.length - WILDCARD_TLD.length);
        }
        if (domainToCheck.startsWith(WILDCARD_SUBDOMAIN)) {
            // Remove the wildcard subdomain
            domainToCheck = domainToCheck.substring(WILDCARD_SUBDOMAIN.length);
        }
        // Parse the domain with tldts
        const tldtsResult = parse$1(domainToCheck);
        // Check if the domain is valid
        return domainToCheck === tldtsResult.domain || domainToCheck === tldtsResult.hostname;
    }
}

/**
 * @file Utility functions for working with quotes
 */
/**
 * Possible quote types for scriptlet parameters
 */
var QuoteType;
(function (QuoteType) {
    /**
     * No quotes at all
     */
    QuoteType["None"] = "none";
    /**
     * Single quotes (`'`)
     */
    QuoteType["Single"] = "single";
    /**
     * Double quotes (`"`)
     */
    QuoteType["Double"] = "double";
})(QuoteType || (QuoteType = {}));
/**
 * Utility functions for working with quotes
 */
class QuoteUtils {
    /**
     * Escape all unescaped occurrences of the character
     *
     * @param string String to escape
     * @param char Character to escape
     * @returns Escaped string
     */
    static escapeUnescapedOccurrences(string, char) {
        let result = EMPTY;
        for (let i = 0; i < string.length; i += 1) {
            if (string[i] === char && (i === 0 || string[i - 1] !== ESCAPE_CHARACTER)) {
                result += ESCAPE_CHARACTER;
            }
            result += string[i];
        }
        return result;
    }
    /**
     * Unescape all single escaped occurrences of the character
     *
     * @param string String to unescape
     * @param char Character to unescape
     * @returns Unescaped string
     */
    static unescapeSingleEscapedOccurrences(string, char) {
        let result = EMPTY;
        for (let i = 0; i < string.length; i += 1) {
            if (string[i] === char
                && string[i - 1] === ESCAPE_CHARACTER
                && (i === 1 || string[i - 2] !== ESCAPE_CHARACTER)) {
                result = result.slice(0, -1);
            }
            result += string[i];
        }
        return result;
    }
    /**
     * Get quote type of the string
     *
     * @param string String to check
     * @returns Quote type of the string
     */
    static getStringQuoteType(string) {
        // Don't check 1-character strings to avoid false positives
        if (string.length > 1) {
            if (string.startsWith(SINGLE_QUOTE) && string.endsWith(SINGLE_QUOTE)) {
                return QuoteType.Single;
            }
            if (string.startsWith(DOUBLE_QUOTE) && string.endsWith(DOUBLE_QUOTE)) {
                return QuoteType.Double;
            }
        }
        return QuoteType.None;
    }
    /**
     * Set quote type of the string
     *
     * @param string String to set quote type of
     * @param quoteType Quote type to set
     * @returns String with the specified quote type
     */
    static setStringQuoteType(string, quoteType) {
        const actualQuoteType = QuoteUtils.getStringQuoteType(string);
        switch (quoteType) {
            case QuoteType.None:
                if (actualQuoteType === QuoteType.Single) {
                    return QuoteUtils.escapeUnescapedOccurrences(string.slice(1, -1), SINGLE_QUOTE);
                }
                if (actualQuoteType === QuoteType.Double) {
                    return QuoteUtils.escapeUnescapedOccurrences(string.slice(1, -1), DOUBLE_QUOTE);
                }
                return string;
            case QuoteType.Single:
                if (actualQuoteType === QuoteType.None) {
                    return SINGLE_QUOTE + QuoteUtils.escapeUnescapedOccurrences(string, SINGLE_QUOTE) + SINGLE_QUOTE;
                }
                if (actualQuoteType === QuoteType.Double) {
                    return SINGLE_QUOTE
                        + QuoteUtils.escapeUnescapedOccurrences(QuoteUtils.unescapeSingleEscapedOccurrences(string.slice(1, -1), DOUBLE_QUOTE), SINGLE_QUOTE) + SINGLE_QUOTE;
                }
                return string;
            case QuoteType.Double:
                if (actualQuoteType === QuoteType.None) {
                    return DOUBLE_QUOTE + QuoteUtils.escapeUnescapedOccurrences(string, DOUBLE_QUOTE) + DOUBLE_QUOTE;
                }
                if (actualQuoteType !== QuoteType.Double) {
                    // eslint-disable-next-line max-len
                    return DOUBLE_QUOTE
                        + QuoteUtils.escapeUnescapedOccurrences(QuoteUtils.unescapeSingleEscapedOccurrences(string.slice(1, -1), SINGLE_QUOTE), DOUBLE_QUOTE) + DOUBLE_QUOTE;
                }
                return string;
            default:
                return string;
        }
    }
    /**
     * Removes bounding quotes from a string, if any
     *
     * @param string Input string
     * @returns String without quotes
     */
    static removeQuotes(string) {
        if (
        // We should check for string length to avoid false positives
        string.length > 1
            && (string[0] === SINGLE_QUOTE || string[0] === DOUBLE_QUOTE)
            && string[0] === string[string.length - 1]) {
            return string.slice(1, -1);
        }
        return string;
    }
    /**
     * Wraps given `strings` with `quote` (defaults to single quote `'`)
     * and joins them with `separator` (defaults to comma+space `, `).
     *
     * @param strings Strings to quote and join.
     * @param quoteType Quote to use.
     * @param separator Separator to use.
     *
     * @returns String with joined items.
     *
     * @example
     * ['abc', 'def']: strings[]  ->  "'abc', 'def'": string
     */
    static quoteAndJoinStrings(strings, quoteType = QuoteType.Single, separator = `${COMMA}${SPACE}`) {
        return strings
            .map((s) => QuoteUtils.setStringQuoteType(s, quoteType))
            .join(separator);
    }
}

/**
 * Pre-defined available validators for modifiers with custom `value_format`.
 */
var CustomValueFormatValidatorName;
(function (CustomValueFormatValidatorName) {
    CustomValueFormatValidatorName["App"] = "pipe_separated_apps";
    CustomValueFormatValidatorName["Csp"] = "csp_value";
    // there are some differences between $domain and $denyallow
    CustomValueFormatValidatorName["DenyAllow"] = "pipe_separated_denyallow_domains";
    CustomValueFormatValidatorName["Domain"] = "pipe_separated_domains";
    CustomValueFormatValidatorName["Method"] = "pipe_separated_methods";
    CustomValueFormatValidatorName["Permissions"] = "permissions_value";
    CustomValueFormatValidatorName["ReferrerPolicy"] = "referrerpolicy_value";
    CustomValueFormatValidatorName["StealthOption"] = "pipe_separated_stealth_options";
})(CustomValueFormatValidatorName || (CustomValueFormatValidatorName = {}));
/**
 * Checks whether the `chunk` of app name (which if splitted by dot `.`) is valid.
 * Only letters, numbers, and underscore `_` are allowed.
 *
 * @param chunk Chunk of app name to check.
 *
 * @returns True if the `chunk` is valid part of app name, false otherwise.
 */
const isValidAppNameChunk = (chunk) => {
    // e.g. 'Example..exe'
    if (chunk.length === 0) {
        return false;
    }
    for (let i = 0; i < chunk.length; i += 1) {
        const char = chunk[i];
        if (!APP_NAME_ALLOWED_CHARS.has(char)) {
            return false;
        }
    }
    return true;
};
/**
 * Checks whether the given `value` is valid app name as $app modifier value.
 *
 * @param value App name to check.
 *
 * @returns True if the `value` is valid app name, false otherwise.
 */
const isValidAppModifierValue = (value) => {
    // $app modifier does not support wildcard tld
    // https://adguard.app/kb/general/ad-filtering/create-own-filters/#app-modifier
    if (value.includes(WILDCARD)) {
        return false;
    }
    return value
        .split(DOT)
        .every((chunk) => isValidAppNameChunk(chunk));
};
/**
 * Checks whether the given `value` is valid HTTP method as $method modifier value.
 *
 * @param value Method to check.
 *
 * @returns True if the `value` is valid HTTP method, false otherwise.
 */
const isValidMethodModifierValue = (value) => {
    return ALLOWED_METHODS.has(value);
};
/**
 * Checks whether the given `value` is valid option as $stealth modifier value.
 *
 * @param value Stealth option to check.
 *
 * @returns True if the `value` is valid stealth option, false otherwise.
 */
const isValidStealthModifierValue = (value) => {
    return ALLOWED_STEALTH_OPTIONS.has(value);
};
/**
 * Checks whether the given `rawOrigin` is valid as Permissions Allowlist origin.
 *
 * @see {@link https://w3c.github.io/webappsec-permissions-policy/#allowlists}
 *
 * @param rawOrigin The raw origin.
 *
 * @returns True if the origin is valid, false otherwise.
 */
const isValidPermissionsOrigin = (rawOrigin) => {
    // origins should be quoted by double quote
    const actualQuoteType = QuoteUtils.getStringQuoteType(rawOrigin);
    if (actualQuoteType !== QuoteType.Double) {
        return false;
    }
    const origin = QuoteUtils.removeQuotes(rawOrigin);
    try {
        // validate the origin by URL constructor
        // https://w3c.github.io/webappsec-permissions-policy/#algo-parse-policy-directive
        new URL(origin);
    }
    catch (e) {
        return false;
    }
    return true;
};
/**
 * Checks whether the given `value` is valid domain as $denyallow modifier value.
 * Important: wildcard tld are not supported, compared to $domain.
 *
 * @param value Value to check.
 *
 * @returns True if the `value` is valid domain and does not contain wildcard `*`, false otherwise.
 */
const isValidDenyAllowModifierValue = (value) => {
    // $denyallow modifier does not support wildcard tld
    // https://adguard.app/kb/general/ad-filtering/create-own-filters/#denyallow-modifier
    // but here we are simply checking whether the value contains wildcard `*`, not ends with `.*`
    if (value.includes(WILDCARD)) {
        return false;
    }
    // TODO: add cache for domains validation
    return DomainUtils.isValidDomainOrHostname(value);
};
/**
 * Checks whether the given `value` is valid domain as $domain modifier value.
 *
 * @param value Value to check.
 *
 * @returns True if the `value` is valid domain, false otherwise.
 */
const isValidDomainModifierValue = (value) => {
    // TODO: add cache for domains validation
    return DomainUtils.isValidDomainOrHostname(value);
};
/**
 * Checks whether the all list items' exceptions are `false`.
 * Those items which `exception` is `true` is to be specified in the validation result error message.
 *
 * @param modifierName Modifier name.
 * @param listItems List items to check.
 *
 * @returns Validation result.
 */
const customNoNegatedListItemsValidator = (modifierName, listItems) => {
    const negatedValues = [];
    listItems.forEach((listItem) => {
        if (listItem.exception) {
            negatedValues.push(listItem.value);
        }
    });
    if (negatedValues.length > 0) {
        const valuesToStr = QuoteUtils.quoteAndJoinStrings(negatedValues);
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.NOT_NEGATABLE_VALUE}: '${modifierName}': ${valuesToStr}`);
    }
    return { valid: true };
};
/**
 * Checks whether the all list items' exceptions are consistent,
 * i.e. all items are either negated or not negated.
 *
 * The `exception` value of the first item is used as a reference, and all other items are checked against it.
 * Those items which `exception` is not consistent with the first item
 * is to be specified in the validation result error message.
 *
 * @see {@link https://adguard.com/kb/general/ad-filtering/create-own-filters/#method-modifier}
 *
 * @param modifierName Modifier name.
 * @param listItems List items to check.
 *
 * @returns Validation result.
 */
const customConsistentExceptionsValidator = (modifierName, listItems) => {
    const firstException = listItems[0].exception;
    const nonConsistentItemValues = [];
    listItems.forEach((listItem) => {
        if (listItem.exception !== firstException) {
            nonConsistentItemValues.push(listItem.value);
        }
    });
    if (nonConsistentItemValues.length > 0) {
        const valuesToStr = QuoteUtils.quoteAndJoinStrings(nonConsistentItemValues);
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.MIXED_NEGATIONS}: '${modifierName}': ${valuesToStr}`);
    }
    return { valid: true };
};
/**
 * Checks whether the given `modifier` value is valid.
 * Supposed to validate the value of modifiers which values are lists separated by pipe `|` —
 * $app, $domain, $denyallow, $method.
 *
 * @param modifier Modifier AST node.
 * @param listParser Parser function for parsing modifier value
 * which is supposed to be a list separated by pipe `|`.
 * @param isValidListItem Predicate function for checking of modifier's list item validity,
 * e.g. $denyallow modifier does not support wildcard tld, but $domain does.
 * @param customListValidator Optional; custom validator for specific modifier,
 * e.g. $denyallow modifier does not support negated domains.
 *
 * @returns Result of modifier domains validation.
 */
const validateListItemsModifier = (modifier, listParser, isValidListItem, customListValidator) => {
    const modifierName = modifier.modifier.value;
    const defaultInvalidValueResult = getValueRequiredValidationResult(modifierName);
    if (!modifier.value?.value) {
        return defaultInvalidValueResult;
    }
    let theList;
    try {
        theList = listParser(modifier.value.value, PIPE_MODIFIER_SEPARATOR);
    }
    catch (e) {
        if (e instanceof AdblockSyntaxError) {
            return {
                valid: false,
                error: e.message,
            };
        }
        return defaultInvalidValueResult;
    }
    const invalidListItems = [];
    theList.children.forEach((item) => {
        // different validators are used for $denyallow and $domain modifiers
        // because of different requirements and restrictions
        if (!isValidListItem(item.value)) {
            invalidListItems.push(item.value);
        }
    });
    if (invalidListItems.length > 0) {
        const itemsToStr = QuoteUtils.quoteAndJoinStrings(invalidListItems);
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.INVALID_LIST_VALUES}: '${modifierName}': ${itemsToStr}`);
    }
    // IMPORTANT: run custom validator after all other checks
    // Some lists should be fully checked, not just the list items:
    // e.g. Safari does not support allowed and disallowed domains for $domain in the same list
    // or   domains cannot be negated for $denyallow modifier
    if (customListValidator) {
        return customListValidator(modifierName, theList.children);
    }
    return { valid: true };
};
/**
 * Validates 'pipe_separated_apps' custom value format.
 * Used for $app modifier.
 *
 * @param modifier Modifier AST node.
 *
 * @returns Validation result.
 */
const validatePipeSeparatedApps = (modifier) => {
    return validateListItemsModifier(modifier, (raw) => AppListParser.parse(raw), isValidAppModifierValue);
};
/**
 * Validates 'pipe_separated_denyallow_domains' custom value format.
 * Used for $denyallow modifier.
 *
 * @param modifier Modifier AST node.
 *
 * @returns Validation result.
 */
const validatePipeSeparatedDenyAllowDomains = (modifier) => {
    return validateListItemsModifier(modifier, DomainListParser.parse, isValidDenyAllowModifierValue, customNoNegatedListItemsValidator);
};
/**
 * Validates 'pipe_separated_domains' custom value format.
 * Used for $domains modifier.
 *
 * @param modifier Modifier AST node.
 *
 * @returns Validation result.
 */
const validatePipeSeparatedDomains = (modifier) => {
    return validateListItemsModifier(modifier, DomainListParser.parse, isValidDomainModifierValue);
};
/**
 * Validates 'pipe_separated_methods' custom value format.
 * Used for $method modifier.
 *
 * @param modifier Modifier AST node.
 *
 * @returns Validation result.
 */
const validatePipeSeparatedMethods = (modifier) => {
    return validateListItemsModifier(modifier, (raw) => MethodListParser.parse(raw), isValidMethodModifierValue, customConsistentExceptionsValidator);
};
/**
 * Validates 'pipe_separated_stealth_options' custom value format.
 * Used for $stealth modifier.
 *
 * @param modifier Modifier AST node.
 *
 * @returns Validation result.
 */
const validatePipeSeparatedStealthOptions = (modifier) => {
    return validateListItemsModifier(modifier, (raw) => StealthOptionListParser.parse(raw), isValidStealthModifierValue, customNoNegatedListItemsValidator);
};
/**
 * Validates `csp_value` custom value format.
 * Used for $csp modifier.
 *
 * @param modifier Modifier AST node.
 *
 * @returns Validation result.
 */
const validateCspValue = (modifier) => {
    const modifierName = modifier.modifier.value;
    if (!modifier.value?.value) {
        return getValueRequiredValidationResult(modifierName);
    }
    // $csp modifier value may contain multiple directives
    // e.g. "csp=child-src 'none'; frame-src 'self' *; worker-src 'none'"
    const policyDirectives = modifier.value.value
        .split(SEMICOLON)
        // rule with $csp modifier may end with semicolon
        // e.g. "$csp=sandbox allow-same-origin;"
        // TODO: add predicate helper for `(i) => !!i`
        .filter((i) => !!i);
    const invalidValueValidationResult = getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.VALUE_INVALID}: '${modifierName}': "${modifier.value.value}"`);
    if (policyDirectives.length === 0) {
        return invalidValueValidationResult;
    }
    const invalidDirectives = [];
    for (let i = 0; i < policyDirectives.length; i += 1) {
        const policyDirective = policyDirectives[i].trim();
        if (!policyDirective) {
            return invalidValueValidationResult;
        }
        const chunks = policyDirective.split(SPACE);
        const [directive, ...valueChunks] = chunks;
        // e.g. "csp=child-src 'none'; ; worker-src 'none'"
        // validator it here          ↑
        if (!directive) {
            return invalidValueValidationResult;
        }
        if (!ALLOWED_CSP_DIRECTIVES.has(directive)) {
            // e.g. "csp='child-src' 'none'"
            if (ALLOWED_CSP_DIRECTIVES.has(QuoteUtils.removeQuotes(directive))) {
                return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.NO_CSP_DIRECTIVE_QUOTE}: '${modifierName}': ${directive}`);
            }
            invalidDirectives.push(directive);
            continue;
        }
        if (valueChunks.length === 0) {
            return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.NO_CSP_VALUE}: '${modifierName}': '${directive}'`);
        }
    }
    if (invalidDirectives.length > 0) {
        const directivesToStr = QuoteUtils.quoteAndJoinStrings(invalidDirectives, QuoteType.Double);
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.INVALID_CSP_DIRECTIVES}: '${modifierName}': ${directivesToStr}`);
    }
    return { valid: true };
};
/**
 * Validates permission allowlist origins in the value of $permissions modifier.
 *
 * @see {@link https://w3c.github.io/webappsec-permissions-policy/#allowlists}
 *
 * @param allowlistChunks Array of allowlist chunks.
 * @param directive Permission directive name.
 * @param modifierName Modifier name.
 *
 * @returns Validation result.
 */
const validatePermissionAllowlistOrigins = (allowlistChunks, directive, modifierName) => {
    const invalidOrigins = [];
    for (let i = 0; i < allowlistChunks.length; i += 1) {
        const chunk = allowlistChunks[i].trim();
        // skip few spaces between origins (they were splitted by space)
        // e.g. 'geolocation=("https://example.com"  "https://*.example.com")'
        if (chunk.length === 0) {
            continue;
        }
        /**
         * 'self' should be checked case-insensitively
         *
         * @see {@link https://w3c.github.io/webappsec-permissions-policy/#algo-parse-policy-directive}
         *
         * @example 'geolocation=(self)'
         */
        if (chunk.toLowerCase() === PERMISSIONS_TOKEN_SELF) {
            continue;
        }
        if (QuoteUtils.getStringQuoteType(chunk) !== QuoteType.Double) {
            return getInvalidValidationResult(
            // eslint-disable-next-line max-len
            `${VALIDATION_ERROR_PREFIX.INVALID_PERMISSION_ORIGIN_QUOTES}: '${modifierName}': '${directive}': '${QuoteUtils.removeQuotes(chunk)}'`);
        }
        if (!isValidPermissionsOrigin(chunk)) {
            invalidOrigins.push(chunk);
        }
    }
    if (invalidOrigins.length > 0) {
        const originsToStr = QuoteUtils.quoteAndJoinStrings(invalidOrigins);
        return getInvalidValidationResult(
        // eslint-disable-next-line max-len
        `${VALIDATION_ERROR_PREFIX.INVALID_PERMISSION_ORIGINS}: '${modifierName}': '${directive}': ${originsToStr}`);
    }
    return { valid: true };
};
/**
 * Validates permission allowlist in the modifier value.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy#allowlists}
 * @see {@link https://w3c.github.io/webappsec-permissions-policy/#allowlists}
 *
 * @param allowlist Allowlist value.
 * @param directive Permission directive name.
 * @param modifierName Modifier name.
 *
 * @returns Validation result.
 */
const validatePermissionAllowlist = (allowlist, directive, modifierName) => {
    // `*` is one of available permissions tokens
    // e.g. 'fullscreen=*'
    // https://w3c.github.io/webappsec-permissions-policy/#structured-header-serialization
    if (allowlist === WILDCARD
        // e.g. 'autoplay=()'
        || allowlist === EMPTY_PERMISSIONS_ALLOWLIST) {
        return { valid: true };
    }
    if (!(allowlist.startsWith(OPEN_PARENTHESIS) && allowlist.endsWith(CLOSE_PARENTHESIS))) {
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.VALUE_INVALID}: '${modifierName}'`);
    }
    const allowlistChunks = allowlist.slice(1, -1).split(SPACE);
    return validatePermissionAllowlistOrigins(allowlistChunks, directive, modifierName);
};
/**
 * Validates single permission in the modifier value.
 *
 * @param permission Single permission value.
 * @param modifierName Modifier name.
 * @param modifierValue Modifier value.
 *
 * @returns Validation result.
 */
const validateSinglePermission = (permission, modifierName, modifierValue) => {
    // empty permission in the rule
    // e.g. 'permissions=storage-access=()\\, \\, camera=()'
    // the validator is here                 ↑
    if (!permission) {
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.VALUE_INVALID}: '${modifierName}'`);
    }
    if (permission.includes(COMMA)) {
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.NO_UNESCAPED_PERMISSION_COMMA}: '${modifierName}': '${modifierValue}'`);
    }
    const [directive, allowlist] = permission.split(EQUALS);
    if (!ALLOWED_PERMISSION_DIRECTIVES.has(directive)) {
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.INVALID_PERMISSION_DIRECTIVE}: '${modifierName}': '${directive}'`);
    }
    return validatePermissionAllowlist(allowlist, directive, modifierName);
};
/**
 * Validates `permissions_value` custom value format.
 * Used for $permissions modifier.
 *
 * @param modifier Modifier AST node.
 *
 * @returns Validation result.
 */
const validatePermissions = (modifier) => {
    if (!modifier.value?.value) {
        return getValueRequiredValidationResult(modifier.modifier.value);
    }
    const modifierName = modifier.modifier.value;
    const modifierValue = modifier.value.value;
    // multiple permissions may be separated by escaped commas
    const permissions = modifier.value.value.split(`${BACKSLASH}${COMMA}`);
    for (let i = 0; i < permissions.length; i += 1) {
        const permission = permissions[i].trim();
        const singlePermissionValidationResult = validateSinglePermission(permission, modifierName, modifierValue);
        if (!singlePermissionValidationResult.valid) {
            return singlePermissionValidationResult;
        }
    }
    return { valid: true };
};
/**
 * Validates `referrerpolicy_value` custom value format.
 * Used for $referrerpolicy modifier.
 *
 * @param modifier Modifier AST node.
 *
 * @returns Validation result.
 */
const validateReferrerPolicy = (modifier) => {
    if (!modifier.value?.value) {
        return getValueRequiredValidationResult(modifier.modifier.value);
    }
    const modifierName = modifier.modifier.value;
    const modifierValue = modifier.value.value;
    if (!REFERRER_POLICY_DIRECTIVES.has(modifierValue)) {
        // eslint-disable-next-line max-len
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.INVALID_REFERRER_POLICY_DIRECTIVE}: '${modifierName}': '${modifierValue}'`);
    }
    return { valid: true };
};
/**
 * Map of all available pre-defined validators for modifiers with custom `value_format`.
 */
const CUSTOM_VALUE_FORMAT_MAP = {
    [CustomValueFormatValidatorName.App]: validatePipeSeparatedApps,
    [CustomValueFormatValidatorName.Csp]: validateCspValue,
    [CustomValueFormatValidatorName.DenyAllow]: validatePipeSeparatedDenyAllowDomains,
    [CustomValueFormatValidatorName.Domain]: validatePipeSeparatedDomains,
    [CustomValueFormatValidatorName.Method]: validatePipeSeparatedMethods,
    [CustomValueFormatValidatorName.Permissions]: validatePermissions,
    [CustomValueFormatValidatorName.ReferrerPolicy]: validateReferrerPolicy,
    [CustomValueFormatValidatorName.StealthOption]: validatePipeSeparatedStealthOptions,
};
/**
 * Returns whether the given `valueFormat` is a valid custom value format validator name.
 *
 * @param valueFormat Value format for the modifier.
 *
 * @returns True if `valueFormat` is a supported pre-defined value format validator name, false otherwise.
 */
const isCustomValueFormatValidator = (valueFormat) => {
    return Object.keys(CUSTOM_VALUE_FORMAT_MAP).includes(valueFormat);
};
/**
 * Checks whether the value for given `modifier` is valid.
 *
 * @param modifier Modifier AST node.
 * @param valueFormat Value format for the modifier.
 *
 * @returns Validation result.
 */
const validateValue = (modifier, valueFormat) => {
    if (isCustomValueFormatValidator(valueFormat)) {
        const validator = CUSTOM_VALUE_FORMAT_MAP[valueFormat];
        return validator(modifier);
    }
    const modifierName = modifier.modifier.value;
    if (!modifier.value?.value) {
        return getValueRequiredValidationResult(modifierName);
    }
    let xRegExp;
    try {
        xRegExp = XRegExp(valueFormat);
    }
    catch (e) {
        throw new Error(`${SOURCE_DATA_ERROR_PREFIX.INVALID_VALUE_FORMAT_REGEXP}: '${modifierName}'`);
    }
    const isValid = xRegExp.test(modifier.value?.value);
    if (!isValid) {
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.VALUE_INVALID}: '${modifierName}'`);
    }
    return { valid: true };
};

/**
 * @file Validator for modifiers.
 */
/**
 * Fully checks whether the given `modifier` valid for given blocker `syntax`:
 * is it supported by the blocker, deprecated, assignable, negatable, etc.
 *
 * @param modifiersData Parsed all modifiers data map.
 * @param syntax Adblock syntax to check the modifier for.
 * 'Common' is not supported, it should be specific — 'AdGuard', 'uBlockOrigin', or 'AdblockPlus'.
 * @param modifier Parsed modifier AST node.
 * @param isException Whether the modifier is used in exception rule.
 * Needed to check whether the modifier is allowed only in blocking or exception rules.
 *
 * @returns Result of modifier validation.
 */
const validateForSpecificSyntax = (modifiersData, syntax, modifier, isException) => {
    if (syntax === AdblockSyntax.Common) {
        throw new Error(`Syntax should be specific, '${AdblockSyntax.Common}' is not supported`);
    }
    const modifierName = modifier.modifier.value;
    const blockerPrefix = BLOCKER_PREFIX[syntax];
    if (!blockerPrefix) {
        throw new Error(`Unknown syntax: ${syntax}`);
    }
    // needed for validation of negation, assignment, etc.
    const specificBlockerData = getSpecificBlockerData(modifiersData, blockerPrefix, modifierName);
    // if no specific blocker data is found
    if (!specificBlockerData) {
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.NOT_SUPPORTED}: '${modifierName}'`);
    }
    // e.g. 'object-subrequest'
    if (specificBlockerData[SpecificKey.Removed]) {
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.REMOVED}: '${modifierName}'`);
    }
    if (specificBlockerData[SpecificKey.Deprecated]) {
        if (!specificBlockerData[SpecificKey.DeprecationMessage]) {
            throw new Error(`${SOURCE_DATA_ERROR_PREFIX.NO_DEPRECATION_MESSAGE}: '${modifierName}'`);
        }
        // prepare the message which is multiline in the yaml file
        const warn = specificBlockerData[SpecificKey.DeprecationMessage].replace(NEWLINE, SPACE);
        return {
            valid: true,
            warn,
        };
    }
    if (specificBlockerData[SpecificKey.BlockOnly] && isException) {
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.BLOCK_ONLY}: '${modifierName}'`);
    }
    if (specificBlockerData[SpecificKey.ExceptionOnly] && !isException) {
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.EXCEPTION_ONLY}: '${modifierName}'`);
    }
    // e.g. '~domain=example.com'
    if (!specificBlockerData[SpecificKey.Negatable] && modifier.exception) {
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.NOT_NEGATABLE_MODIFIER}: '${modifierName}'`);
    }
    // e.g. 'domain'
    if (specificBlockerData[SpecificKey.Assignable]) {
        if (!modifier.value) {
            // TODO: ditch value_optional after custom validators are implemented for value_format for all modifiers.
            // This checking should be done in each separate custom validator,
            // because $csp and $permissions without value can be used only in extension rules,
            // but $cookie with no value can be used in both blocking and exception rules.
            /**
             * Some assignable modifiers can be used without a value,
             * e.g. '@@||example.com^$cookie'.
             */
            if (specificBlockerData[SpecificKey.ValueOptional]) {
                return { valid: true };
            }
            // for other assignable modifiers the value is required
            return getValueRequiredValidationResult(modifierName);
        }
        /**
         * TODO: consider to return `{ valid: true, warn: 'Modifier value may be specified' }` (???)
         * for $stealth modifier without a value
         * but only after the extension will support value for $stealth:
         * https://github.com/AdguardTeam/AdguardBrowserExtension/issues/2107
         */
        if (!specificBlockerData[SpecificKey.ValueFormat]) {
            throw new Error(`${SOURCE_DATA_ERROR_PREFIX.NO_VALUE_FORMAT_FOR_ASSIGNABLE}: '${modifierName}'`);
        }
        return validateValue(modifier, specificBlockerData[SpecificKey.ValueFormat]);
    }
    if (modifier?.value) {
        // e.g. 'third-party=true'
        return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.VALUE_FORBIDDEN}: '${modifierName}'`);
    }
    return { valid: true };
};
/**
 * Returns documentation URL for given modifier and adblocker.
 *
 * @param modifiersData Parsed all modifiers data map.
 * @param blockerPrefix Prefix of the adblocker, e.g. 'adg_', 'ubo_', or 'abp_'.
 * @param modifier Parsed modifier AST node.
 *
 * @returns Documentation URL or `null` if not found.
 */
const getBlockerDocumentationLink = (modifiersData, blockerPrefix, modifier) => {
    const specificBlockerData = getSpecificBlockerData(modifiersData, blockerPrefix, modifier.modifier.value);
    return specificBlockerData?.docs || null;
};
// TODO: move to modifier.ts and use index.ts only for exporting
/**
 * Modifier validator class.
 */
class ModifierValidator {
    /**
     * Map of all modifiers data parsed from yaml files.
     */
    modifiersData;
    /**
     * List of all modifier names for any adblocker.
     *
     * Please note that **deprecated** modifiers are **included** as well.
     */
    allModifierNames;
    constructor() {
        // data map based on yaml files
        this.modifiersData = getModifiersData();
        this.allModifierNames = getAllModifierNames(this.modifiersData);
    }
    /**
     * Simply checks whether the modifier exists in any adblocker.
     *
     * **Deprecated** and **removed** modifiers are considered as **existent**.
     *
     * @param modifier Already parsed modifier AST node.
     *
     * @returns True if modifier exists, false otherwise.
     */
    exists = (modifier) => {
        return this.allModifierNames.has(modifier.modifier.value);
    };
    /**
     * Checks whether the given `modifier` is valid for specified `syntax`.
     *
     * For `Common` syntax it simply checks whether the modifier exists.
     * For specific syntax the validation is more complex —
     * deprecated, assignable, negatable and other requirements are checked.
     *
     * @param syntax Adblock syntax to check the modifier for.
     * @param rawModifier Modifier AST node.
     * @param isException Whether the modifier is used in exception rule, default to false.
     * Needed to check whether the modifier is allowed only in blocking or exception rules.
     *
     * @returns Result of modifier validation.
     */
    validate = (syntax, rawModifier, isException = false) => {
        const modifier = clone(rawModifier);
        // special case: handle noop modifier which may be used as multiple underscores (not just one)
        // https://adguard.com/kb/general/ad-filtering/create-own-filters/#noop-modifier
        if (modifier.modifier.value.startsWith(UNDERSCORE)) {
            // check whether the modifier value contains something else besides underscores
            if (!isValidNoopModifier(modifier.modifier.value)) {
                return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.INVALID_NOOP}: '${modifier.modifier.value}'`);
            }
            // otherwise, replace the modifier value with single underscore.
            // it is needed to check whether the modifier is supported by specific adblocker due to the syntax
            modifier.modifier.value = UNDERSCORE;
        }
        if (!this.exists(modifier)) {
            return getInvalidValidationResult(`${VALIDATION_ERROR_PREFIX.NOT_EXISTENT}: '${modifier.modifier.value}'`);
        }
        // for 'Common' syntax we cannot check something more
        if (syntax === AdblockSyntax.Common) {
            return { valid: true };
        }
        return validateForSpecificSyntax(this.modifiersData, syntax, modifier, isException);
    };
    /**
     * Returns AdGuard documentation URL for given modifier.
     *
     * @param modifier Parsed modifier AST node.
     *
     * @returns AdGuard documentation URL or `null` if not found.
     */
    getAdgDocumentationLink = (modifier) => {
        if (!this.exists(modifier)) {
            return null;
        }
        return getBlockerDocumentationLink(this.modifiersData, BLOCKER_PREFIX[AdblockSyntax.Adg], modifier);
    };
    /**
     * Returns Ublock Origin documentation URL for given modifier.
     *
     * @param modifier Parsed modifier AST node.
     *
     * @returns Ublock Origin documentation URL or `null` if not found.
     */
    getUboDocumentationLink = (modifier) => {
        if (!this.exists(modifier)) {
            return null;
        }
        return getBlockerDocumentationLink(this.modifiersData, BLOCKER_PREFIX[AdblockSyntax.Ubo], modifier);
    };
    /**
     * Returns AdBlock Plus documentation URL for given modifier.
     *
     * @param modifier Parsed modifier AST node.
     *
     * @returns AdBlock Plus documentation URL or `null` if not found.
     */
    getAbpDocumentationLink = (modifier) => {
        if (!this.exists(modifier)) {
            return null;
        }
        return getBlockerDocumentationLink(this.modifiersData, BLOCKER_PREFIX[AdblockSyntax.Abp], modifier);
    };
}
const modifierValidator = new ModifierValidator();

/**
 * @file Base class for converters
 *
 * TS doesn't support abstract static methods, so we should use
 * a workaround and extend this class instead of implementing it
 */
/* eslint-disable jsdoc/require-returns-check */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Basic class for rule converters
 */
class ConverterBase {
    /**
     * Converts some data to AdGuard format
     *
     * @param data Data to convert
     * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
     * the converted node, and its `isConverted` flag indicates whether the original node was converted.
     * If the node was not converted, the result will contain the original node with the same object reference
     * @throws If the data is invalid or incompatible
     */
    static convertToAdg(data) {
        throw new NotImplementedError();
    }
    /**
     * Converts some data to Adblock Plus format
     *
     * @param data Data to convert
     * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
     * the converted node, and its `isConverted` flag indicates whether the original node was converted.
     * If the node was not converted, the result will contain the original node with the same object reference
     * @throws If the data is invalid or incompatible
     */
    static convertToAbp(data) {
        throw new NotImplementedError();
    }
    /**
     * Converts some data to uBlock Origin format
     *
     * @param data Data to convert
     * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
     * the converted node, and its `isConverted` flag indicates whether the original node was converted.
     * If the node was not converted, the result will contain the original node with the same object reference
     * @throws If the data is invalid or incompatible
     */
    static convertToUbo(data) {
        throw new NotImplementedError();
    }
}

/**
 * @file Base class for rule converters
 *
 * TS doesn't support abstract static methods, so we should use
 * a workaround and extend this class instead of implementing it
 */
/* eslint-disable jsdoc/require-returns-check */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Basic class for rule converters
 */
class RuleConverterBase extends ConverterBase {
    /**
     * Converts an adblock filtering rule to AdGuard format, if possible.
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToAdg(rule) {
        throw new NotImplementedError();
    }
    /**
     * Converts an adblock filtering rule to Adblock Plus format, if possible.
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToAbp(rule) {
        throw new NotImplementedError();
    }
    /**
     * Converts an adblock filtering rule to uBlock Origin format, if possible.
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToUbo(rule) {
        throw new NotImplementedError();
    }
}

/**
 * @file Conversion result interface and helper functions
 */
/**
 * Helper function to create a generic conversion result.
 *
 * @param result Conversion result
 * @param isConverted Indicates whether the input item was converted
 * @template T Type of the item to convert
 * @template U Type of the conversion result (defaults to `T`, but can be `T[]` as well)
 * @returns Generic conversion result
 */
// eslint-disable-next-line max-len
function createConversionResult(result, isConverted) {
    return {
        result,
        isConverted,
    };
}
/**
 * Helper function to create a node conversion result.
 *
 * @param nodes Array of nodes
 * @param isConverted Indicates whether the input item was converted
 * @template T Type of the node (extends `Node`)
 * @returns Node conversion result
 */
function createNodeConversionResult(nodes, isConverted) {
    return createConversionResult(nodes, isConverted);
}

/**
 * @file Comment rule converter
 */
/**
 * Comment rule converter class
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 */
class CommentRuleConverter extends RuleConverterBase {
    /**
     * Converts a comment rule to AdGuard format, if possible.
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToAdg(rule) {
        // TODO: Add support for other comment types, if needed
        // Main task is # -> ! conversion
        switch (rule.type) {
            case CommentRuleType.CommentRule:
                // Check if the rule needs to be converted
                if (rule.type === CommentRuleType.CommentRule && rule.marker.value === CommentMarker.Hashmark) {
                    // Add a ! to the beginning of the comment
                    // TODO: Replace with custom clone method
                    const ruleClone = clone(rule);
                    ruleClone.marker.value = CommentMarker.Regular;
                    // Add the hashmark to the beginning of the comment text
                    ruleClone.text.value = `${SPACE}${CommentMarker.Hashmark}${ruleClone.text.value}`;
                    return createNodeConversionResult([ruleClone], true);
                }
                return createNodeConversionResult([rule], false);
            // Leave any other comment rule as is
            default:
                return createNodeConversionResult([rule], false);
        }
    }
}

/**
 * @file Regular expression utilities
 */
// Special RegExp constants
const REGEX_START = CARET; // '^'
const REGEX_END = DOLLAR_SIGN; // '$'
const REGEX_ANY_CHARACTERS = DOT + ASTERISK; // '.*'
// Special adblock pattern symbols and their RegExp equivalents
const ADBLOCK_URL_START = PIPE + PIPE; // '||'
const ADBLOCK_URL_START_REGEX = '^(http|https|ws|wss)://([a-z0-9-_.]+\\.)?';
const ADBLOCK_URL_SEPARATOR = CARET; // '^'
const ADBLOCK_URL_SEPARATOR_REGEX = '([^ a-zA-Z0-9.%_-]|$)';
const ADBLOCK_WILDCARD = ASTERISK; // '*'
const ADBLOCK_WILDCARD_REGEX = REGEX_ANY_CHARACTERS;
// Negation wrapper for RegExp patterns
const REGEX_NEGATION_PREFIX = '^((?!';
const REGEX_NEGATION_SUFFIX = ').)*$';
/**
 * Special RegExp symbols
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-escape
 */
const SPECIAL_REGEX_SYMBOLS = new Set([
    ASTERISK,
    CARET,
    CLOSE_CURLY_BRACKET,
    CLOSE_PARENTHESIS,
    CLOSE_SQUARE_BRACKET,
    DOLLAR_SIGN,
    DOT,
    ESCAPE_CHARACTER,
    OPEN_CURLY_BRACKET,
    OPEN_PARENTHESIS,
    OPEN_SQUARE_BRACKET,
    PIPE,
    PLUS,
    QUESTION_MARK,
    SLASH,
]);
/**
 * Utility functions for working with RegExp patterns
 */
class RegExpUtils {
    /**
     * Checks whether a string is a RegExp pattern.
     * Flags are not supported.
     *
     * @param pattern - Pattern to check
     * @returns `true` if the string is a RegExp pattern, `false` otherwise
     */
    static isRegexPattern(pattern) {
        const trimmedPattern = pattern.trim();
        // Avoid false positives
        if (trimmedPattern.length > REGEX_MARKER.length * 2 && trimmedPattern.startsWith(REGEX_MARKER)) {
            const last = StringUtils.findNextUnescapedCharacter(trimmedPattern, REGEX_MARKER, REGEX_MARKER.length);
            return last === trimmedPattern.length - 1;
        }
        return false;
    }
    /**
     * Negates a RegExp pattern. Technically, this method wraps the pattern in `^((?!` and `).)*$`.
     *
     * RegExp modifiers are not supported.
     *
     * @param pattern Pattern to negate (can be wrapped in slashes or not)
     * @returns Negated RegExp pattern
     */
    static negateRegexPattern(pattern) {
        let result = pattern.trim();
        let slashes = false;
        // Remove the leading and trailing slashes (/)
        if (RegExpUtils.isRegexPattern(result)) {
            result = result.substring(REGEX_MARKER.length, result.length - REGEX_MARKER.length);
            slashes = true;
        }
        // Only negate the pattern if it's not already negated
        if (!(result.startsWith(REGEX_NEGATION_PREFIX) && result.endsWith(REGEX_NEGATION_SUFFIX))) {
            // Remove leading caret (^)
            if (result.startsWith(REGEX_START)) {
                result = result.substring(REGEX_START.length);
            }
            // Remove trailing dollar sign ($)
            if (result.endsWith(REGEX_END)) {
                result = result.substring(0, result.length - REGEX_END.length);
            }
            // Wrap the pattern in the negation
            result = `${REGEX_NEGATION_PREFIX}${result}${REGEX_NEGATION_SUFFIX}`;
        }
        // Add the leading and trailing slashes back if they were there
        if (slashes) {
            result = `${REGEX_MARKER}${result}${REGEX_MARKER}`;
        }
        return result;
    }
    /**
     * Converts a basic adblock rule pattern to a RegExp pattern. Based on
     * https://github.com/AdguardTeam/tsurlfilter/blob/9b26e0b4a0e30b87690bc60f7cf377d112c3085c/packages/tsurlfilter/src/rules/simple-regex.ts#L219
     *
     * @param pattern Pattern to convert
     * @returns RegExp equivalent of the pattern
     * @see {@link https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters#basic-rules}
     */
    static patternToRegexp(pattern) {
        const trimmed = pattern.trim();
        // Return regex for any character sequence if the pattern is just |, ||, * or empty
        if (trimmed === ADBLOCK_URL_START
            || trimmed === PIPE
            || trimmed === ADBLOCK_WILDCARD
            || trimmed === EMPTY) {
            return REGEX_ANY_CHARACTERS;
        }
        // If the pattern is already a RegExp, just return it, but remove the leading and trailing slashes
        if (RegExpUtils.isRegexPattern(pattern)) {
            return pattern.substring(REGEX_MARKER.length, pattern.length - REGEX_MARKER.length);
        }
        let result = EMPTY;
        let offset = 0;
        let len = trimmed.length;
        // Handle leading pipes
        if (trimmed[0] === PIPE) {
            if (trimmed[1] === PIPE) {
                // Replace adblock url start (||) with its RegExp equivalent
                result += ADBLOCK_URL_START_REGEX;
                offset = ADBLOCK_URL_START.length;
            }
            else {
                // Replace single pipe (|) with the RegExp start symbol (^)
                result += REGEX_START;
                offset = REGEX_START.length;
            }
        }
        // Handle trailing pipes
        let trailingPipe = false;
        if (trimmed.endsWith(PIPE)) {
            trailingPipe = true;
            len -= PIPE.length;
        }
        // Handle the rest of the pattern, if any
        for (; offset < len; offset += 1) {
            if (trimmed[offset] === ADBLOCK_WILDCARD) {
                // Replace adblock wildcard (*) with its RegExp equivalent
                result += ADBLOCK_WILDCARD_REGEX;
            }
            else if (trimmed[offset] === ADBLOCK_URL_SEPARATOR) {
                // Replace adblock url separator (^) with its RegExp equivalent
                result += ADBLOCK_URL_SEPARATOR_REGEX;
            }
            else if (SPECIAL_REGEX_SYMBOLS.has(trimmed[offset])) {
                // Escape special RegExp symbols (we handled pipe (|) and asterisk (*) already)
                result += ESCAPE_CHARACTER + trimmed[offset];
            }
            else {
                // Just add any other character
                result += trimmed[offset];
            }
        }
        // Handle trailing pipes
        if (trailingPipe) {
            // Replace trailing pipe (|) with the RegExp end symbol ($)
            result += REGEX_END;
        }
        return result;
    }
}

/**
 * @file Custom clone functions for AST nodes, this is probably the most efficient way to clone AST nodes.
 * @todo Maybe move them to parser classes as 'clone' methods
 */
/**
 * Clones a scriptlet rule node.
 *
 * @param node Node to clone
 * @returns Cloned node
 */
function cloneScriptletRuleNode(node) {
    return {
        type: node.type,
        children: node.children.map((child) => ({ ...child })),
    };
}
/**
 * Clones a domain list node.
 *
 * @param node Node to clone
 * @returns Cloned node
 */
function cloneDomainListNode(node) {
    return {
        type: node.type,
        separator: node.separator,
        children: node.children.map((domain) => ({ ...domain })),
    };
}
/**
 * Clones a modifier list node.
 *
 * @param node Node to clone
 * @returns Cloned node
 */
function cloneModifierListNode(node) {
    return {
        type: node.type,
        children: node.children.map((modifier) => {
            const res = {
                type: modifier.type,
                exception: modifier.exception,
                modifier: { ...modifier.modifier },
            };
            if (modifier.value) {
                res.value = { ...modifier.value };
            }
            return res;
        }),
    };
}

/**
 * @file HTML filtering rule converter
 */
/**
 * From the AdGuard docs:
 * Specifies the maximum length for content of HTML element. If this parameter is
 * set and the content length exceeds the value, a rule does not apply to the element.
 * If this parameter is not specified, the max-length is considered to be 8192 (8 KB).
 * When converting from other formats, we set the max-length to 262144 (256 KB).
 *
 * @see {@link https://adguard.com/kb/general/ad-filtering/create-own-filters/#html-filtering-rules}
 */
const ADG_HTML_DEFAULT_MAX_LENGTH = 8192;
const ADG_HTML_CONVERSION_MAX_LENGTH = ADG_HTML_DEFAULT_MAX_LENGTH * 32;
const NOT_SPECIFIED = -1;
var PseudoClasses$1;
(function (PseudoClasses) {
    PseudoClasses["Contains"] = "contains";
    PseudoClasses["HasText"] = "has-text";
    PseudoClasses["MinTextLength"] = "min-text-length";
})(PseudoClasses$1 || (PseudoClasses$1 = {}));
var AttributeSelectors;
(function (AttributeSelectors) {
    AttributeSelectors["MaxLength"] = "max-length";
    AttributeSelectors["MinLength"] = "min-length";
    AttributeSelectors["TagContent"] = "tag-content";
    AttributeSelectors["Wildcard"] = "wildcard";
})(AttributeSelectors || (AttributeSelectors = {}));
/**
 * HTML filtering rule converter class
 *
 * @todo Implement `convertToUbo` (ABP currently doesn't support HTML filtering rules)
 */
class HtmlRuleConverter extends RuleConverterBase {
    /**
     * Converts a HTML rule to AdGuard syntax, if possible. Also can be used to convert
     * AdGuard rules to AdGuard syntax to validate them.
     *
     * _Note:_ uBlock Origin supports multiple selectors within a single rule, but AdGuard doesn't,
     * so the following rule
     * ```
     * example.com##^div[attr1="value1"][attr2="value2"], script:has-text(value)
     * ```
     * will be converted to multiple AdGuard rules:
     * ```
     * example.com$$div[attr1="value1"][attr2="value2"][max-length="262144"]
     * example.com$$script[tag-content="value"][max-length="262144"]
     * ```
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToAdg(rule) {
        // Ignore AdGuard rules
        if (rule.syntax === AdblockSyntax.Adg) {
            return createNodeConversionResult([rule], false);
        }
        if (rule.syntax === AdblockSyntax.Abp) {
            throw new RuleConversionError('Invalid rule, ABP does not support HTML filtering rules');
        }
        // Prepare the conversion result
        const conversionResult = [];
        // Iterate over selector list
        for (const selector of rule.body.body.children) {
            // Check selector, just in case
            if (selector.type !== CssTreeNodeType.Selector) {
                throw new RuleConversionError(`Expected selector, got '${selector.type}'`);
            }
            // At least one child is required, and first child may be a tag selector
            if (selector.children.length === 0) {
                throw new RuleConversionError('Invalid selector, no children are present');
            }
            // Prepare bounds
            let minLength = NOT_SPECIFIED;
            let maxLength = NOT_SPECIFIED;
            // Prepare the converted selector
            const convertedSelector = {
                type: CssTreeNodeType.Selector,
                children: [],
            };
            for (let i = 0; i < selector.children.length; i += 1) {
                // Current node within the current selector
                const node = selector.children[i];
                switch (node.type) {
                    case CssTreeNodeType.TypeSelector:
                        // First child in the selector may be a tag selector
                        if (i !== 0) {
                            throw new RuleConversionError('Tag selector should be the first child, if present');
                        }
                        // Simply store the tag selector
                        convertedSelector.children.push(clone(node));
                        break;
                    case CssTreeNodeType.AttributeSelector:
                        // Check if the attribute selector is a special AdGuard attribute
                        switch (node.name.name) {
                            case AttributeSelectors.MinLength:
                                minLength = CssTree.parseAttributeSelectorValueAsNumber(node);
                                break;
                            case AttributeSelectors.MaxLength:
                                maxLength = CssTree.parseAttributeSelectorValueAsNumber(node);
                                break;
                            case AttributeSelectors.TagContent:
                            case AttributeSelectors.Wildcard:
                                CssTree.assertAttributeSelectorHasStringValue(node);
                                convertedSelector.children.push(clone(node));
                                break;
                            default:
                                convertedSelector.children.push(clone(node));
                        }
                        break;
                    case CssTreeNodeType.PseudoClassSelector:
                        CssTree.assertPseudoClassHasAnyArgument(node);
                        // eslint-disable-next-line no-case-declarations
                        const arg = node.children[0];
                        if (arg.type !== CssTreeNodeType.String
                            && arg.type !== CssTreeNodeType.Raw
                            && arg.type !== CssTreeNodeType.Number) {
                            throw new RuleConversionError(`Unsupported argument type '${arg.type}' for pseudo class '${node.name}'`);
                        }
                        // Process the pseudo class based on its name
                        switch (node.name) {
                            case PseudoClasses$1.HasText:
                            case PseudoClasses$1.Contains:
                                // Check if the argument is a RegExp
                                if (RegExpUtils.isRegexPattern(arg.value)) {
                                    // TODO: Add some support for RegExp patterns later
                                    // Need to find a way to convert some RegExp patterns to glob patterns
                                    throw new RuleConversionError('Conversion of RegExp patterns is not yet supported');
                                }
                                convertedSelector.children.push(CssTree.createAttributeSelectorNode(AttributeSelectors.TagContent, arg.value));
                                break;
                            // https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectmin-text-lengthn
                            case PseudoClasses$1.MinTextLength:
                                minLength = CssTree.parsePseudoClassArgumentAsNumber(node);
                                break;
                            default:
                                throw new RuleConversionError(`Unsupported pseudo class '${node.name}'`);
                        }
                        break;
                    default:
                        throw new RuleConversionError(`Unsupported node type '${node.type}'`);
                }
            }
            if (minLength !== NOT_SPECIFIED) {
                convertedSelector.children.push(CssTree.createAttributeSelectorNode(AttributeSelectors.MinLength, String(minLength)));
            }
            convertedSelector.children.push(CssTree.createAttributeSelectorNode(AttributeSelectors.MaxLength, String(maxLength === NOT_SPECIFIED
                ? ADG_HTML_CONVERSION_MAX_LENGTH
                : maxLength)));
            // Create the converted rule
            conversionResult.push({
                category: RuleCategory.Cosmetic,
                type: CosmeticRuleType.HtmlFilteringRule,
                syntax: AdblockSyntax.Adg,
                // Convert the separator based on the exception status
                separator: {
                    type: 'Value',
                    value: rule.exception
                        ? CosmeticRuleSeparator.AdgHtmlFilteringException
                        : CosmeticRuleSeparator.AdgHtmlFiltering,
                },
                // Create the body based on the converted selector
                body: {
                    type: 'HtmlFilteringRuleBody',
                    body: {
                        type: CssTreeNodeType.SelectorList,
                        children: [{
                                type: CssTreeNodeType.Selector,
                                children: [convertedSelector],
                            }],
                    },
                },
                exception: rule.exception,
                domains: cloneDomainListNode(rule.domains),
            });
        }
        return createNodeConversionResult(conversionResult, true);
    }
}

/**
 * @file Utility functions for working with scriptlet nodes
 */
/**
 * Get name of the scriptlet from the scriptlet node
 *
 * @param scriptletNode Scriptlet node to get name of
 * @returns Name of the scriptlet
 * @throws If the scriptlet is empty
 */
function getScriptletName(scriptletNode) {
    if (scriptletNode.children.length === 0) {
        throw new Error('Empty scriptlet');
    }
    return scriptletNode.children[0].value;
}
/**
 * Set name of the scriptlet.
 * Modifies input `scriptletNode` if needed.
 *
 * @param scriptletNode Scriptlet node to set name of
 * @param name Name to set
 */
function setScriptletName(scriptletNode, name) {
    if (scriptletNode.children.length > 0) {
        // eslint-disable-next-line no-param-reassign
        scriptletNode.children[0].value = name;
    }
}
/**
 * Set quote type of the scriptlet parameters
 *
 * @param scriptletNode Scriptlet node to set quote type of
 * @param quoteType Preferred quote type
 */
function setScriptletQuoteType(scriptletNode, quoteType) {
    if (scriptletNode.children.length > 0) {
        for (let i = 0; i < scriptletNode.children.length; i += 1) {
            // eslint-disable-next-line no-param-reassign
            scriptletNode.children[i].value = QuoteUtils.setStringQuoteType(scriptletNode.children[i].value, quoteType);
        }
    }
}

/**
 * @file Scriptlet injection rule converter
 */
const ABP_SCRIPTLET_PREFIX = 'abp-';
const UBO_SCRIPTLET_PREFIX = 'ubo-';
/**
 * Scriptlet injection rule converter class
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 */
class ScriptletRuleConverter extends RuleConverterBase {
    /**
     * Converts a scriptlet injection rule to AdGuard format, if possible.
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToAdg(rule) {
        // Ignore AdGuard rules
        if (rule.syntax === AdblockSyntax.Adg) {
            return createNodeConversionResult([rule], false);
        }
        const separator = rule.separator.value;
        let convertedSeparator = separator;
        convertedSeparator = rule.exception
            ? CosmeticRuleSeparator.AdgJsInjectionException
            : CosmeticRuleSeparator.AdgJsInjection;
        const convertedScriptlets = [];
        for (const scriptlet of rule.body.children) {
            // Clone the node to avoid any side effects
            const scriptletClone = cloneScriptletRuleNode(scriptlet);
            // Remove possible quotes just to make it easier to work with the scriptlet name
            const scriptletName = QuoteUtils.setStringQuoteType(getScriptletName(scriptletClone), QuoteType.None);
            // Add prefix if it's not already there
            let prefix;
            switch (rule.syntax) {
                case AdblockSyntax.Abp:
                    prefix = ABP_SCRIPTLET_PREFIX;
                    break;
                case AdblockSyntax.Ubo:
                    prefix = UBO_SCRIPTLET_PREFIX;
                    break;
                default:
                    prefix = EMPTY;
            }
            if (!scriptletName.startsWith(prefix)) {
                setScriptletName(scriptletClone, `${prefix}${scriptletName}`);
            }
            // ADG scriptlet parameters should be quoted, and single quoted are preferred
            setScriptletQuoteType(scriptletClone, QuoteType.Single);
            convertedScriptlets.push(scriptletClone);
        }
        return createNodeConversionResult(convertedScriptlets.map((scriptlet) => {
            const res = {
                category: rule.category,
                type: rule.type,
                syntax: AdblockSyntax.Adg,
                exception: rule.exception,
                domains: cloneDomainListNode(rule.domains),
                separator: {
                    type: 'Value',
                    value: convertedSeparator,
                },
                body: {
                    type: rule.body.type,
                    children: [scriptlet],
                },
            };
            if (rule.modifiers) {
                res.modifiers = cloneModifierListNode(rule.modifiers);
            }
            return res;
        }), true);
    }
}

/**
 * A very simple map extension that allows to store multiple values for the same key
 * by storing them in an array.
 *
 * @todo Add more methods if needed
 */
class MultiValueMap extends Map {
    /**
     * Adds a value to the map. If the key already exists, the value will be appended to the existing array,
     * otherwise a new array will be created for the key.
     *
     * @param key Key to add
     * @param values Value(s) to add
     */
    add(key, ...values) {
        let currentValues = super.get(key);
        if (isUndefined(currentValues)) {
            currentValues = [];
            super.set(key, values);
        }
        currentValues.push(...values);
    }
}

/**
 * @file Cosmetic rule modifier converter from uBO to ADG
 */
const UBO_MATCHES_PATH_OPERATOR = 'matches-path';
const ADG_PATH_MODIFIER = 'path';
/**
 * Special characters in modifier regexps that should be escaped
 */
const SPECIAL_MODIFIER_REGEX_CHARS = new Set([
    OPEN_SQUARE_BRACKET,
    CLOSE_SQUARE_BRACKET,
    COMMA,
    ESCAPE_CHARACTER,
]);
/**
 * Helper class for converting cosmetic rule modifiers from uBO to ADG
 */
class AdgCosmeticRuleModifierConverter {
    /**
     * Converts a uBO cosmetic rule modifier list to ADG, if possible.
     *
     * @param modifierList Cosmetic rule modifier list node to convert
     * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
     * the converted node, and its `isConverted` flag indicates whether the original node was converted.
     * If the node was not converted, the result will contain the original node with the same object reference
     * @throws If the modifier list cannot be converted
     * @see {@link https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#cosmetic-filter-operators}
     */
    static convertFromUbo(modifierList) {
        const conversionMap = new MultiValueMap();
        modifierList.children.forEach((modifier, index) => {
            // :matches-path
            if (modifier.modifier.value === UBO_MATCHES_PATH_OPERATOR) {
                if (!modifier.value) {
                    throw new RuleConversionError(`'${UBO_MATCHES_PATH_OPERATOR}' operator requires a value`);
                }
                const value = RegExpUtils.isRegexPattern(modifier.value.value)
                    ? StringUtils.escapeCharacters(modifier.value.value, SPECIAL_MODIFIER_REGEX_CHARS)
                    : modifier.value.value;
                // Convert uBO's `:matches-path(...)` operator to ADG's `$path=...` modifier
                conversionMap.add(index, createModifierNode(ADG_PATH_MODIFIER, 
                // We should negate the regexp if the modifier is an exception
                modifier.exception
                    // eslint-disable-next-line max-len
                    ? `${REGEX_MARKER}${RegExpUtils.negateRegexPattern(RegExpUtils.patternToRegexp(value))}${REGEX_MARKER}`
                    : value));
            }
        });
        // Check if we have any converted modifiers
        if (conversionMap.size) {
            const modifierListClone = clone(modifierList);
            // Replace the original modifiers with the converted ones
            modifierListClone.children = modifierListClone.children.map((modifier, index) => {
                const convertedModifier = conversionMap.get(index);
                return convertedModifier ?? modifier;
            }).flat();
            return createConversionResult(modifierListClone, true);
        }
        // Otherwise, just return the original modifier list
        return createConversionResult(modifierList, false);
    }
}

var PseudoClasses;
(function (PseudoClasses) {
    PseudoClasses["AbpContains"] = "-abp-contains";
    PseudoClasses["AbpHas"] = "-abp-has";
    PseudoClasses["Contains"] = "contains";
    PseudoClasses["Has"] = "has";
    PseudoClasses["HasText"] = "has-text";
    PseudoClasses["MatchesCss"] = "matches-css";
    PseudoClasses["MatchesCssAfter"] = "matches-css-after";
    PseudoClasses["MatchesCssBefore"] = "matches-css-before";
    PseudoClasses["Not"] = "not";
})(PseudoClasses || (PseudoClasses = {}));
var PseudoElements;
(function (PseudoElements) {
    PseudoElements["After"] = "after";
    PseudoElements["Before"] = "before";
})(PseudoElements || (PseudoElements = {}));
const PSEUDO_ELEMENT_NAMES = new Set([
    PseudoElements.After,
    PseudoElements.Before,
]);
const LEGACY_MATCHES_CSS_NAMES = new Set([
    PseudoClasses.MatchesCssAfter,
    PseudoClasses.MatchesCssBefore,
]);
const LEGACY_EXT_CSS_INDICATOR_PSEUDO_NAMES = new Set([
    PseudoClasses.Not,
    PseudoClasses.MatchesCssBefore,
    PseudoClasses.MatchesCssAfter,
]);
const CSS_CONVERSION_INDICATOR_PSEUDO_NAMES = new Set([
    PseudoClasses.AbpContains,
    PseudoClasses.AbpHas,
    PseudoClasses.HasText,
]);
/**
 * Converts some pseudo-classes to pseudo-elements. For example:
 * - `:before` → `::before`
 *
 * @param selectorList Selector list to convert
 * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
 * the converted node, and its `isConverted` flag indicates whether the original node was converted.
 * If the node was not converted, the result will contain the original node with the same object reference
 */
function convertToPseudoElements(selectorList) {
    // Check conversion indications before doing any heavy work
    const hasIndicator = find(
    // TODO: Need to improve CSSTree types, until then we need to use any type here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectorList, (node) => node.type === CssTreeNodeType.PseudoClassSelector && PSEUDO_ELEMENT_NAMES.has(node.name));
    if (!hasIndicator) {
        return createConversionResult(selectorList, false);
    }
    // Make a clone of the selector list to avoid modifying the original one,
    // then convert & return the cloned version
    const selectorListClone = clone(selectorList);
    // TODO: Need to improve CSSTree types, until then we need to use any type here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    walk(selectorListClone, {
        // TODO: Need to improve CSSTree types, until then we need to use any type here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        leave: (node) => {
            if (node.type === CssTreeNodeType.PseudoClassSelector) {
                // If the pseudo-class is `:before` or `:after`, then we should
                // convert the node type to pseudo-element:
                //  :after  → ::after
                //  :before → ::before
                if (PSEUDO_ELEMENT_NAMES.has(node.name)) {
                    Object.assign(node, {
                        ...node,
                        type: CssTreeNodeType.PseudoElementSelector,
                    });
                }
            }
        },
    });
    return createConversionResult(selectorListClone, true);
}
/**
 * Converts legacy Extended CSS `matches-css-before` and `matches-css-after`
 * pseudo-classes to the new 'matches-css' pseudo-class:
 * - `:matches-css-before(...)` → `:matches-css(before, ...)`
 * - `:matches-css-after(...)`  → `:matches-css(after, ...)`
 *
 * @param node Node to convert
 * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
 * the converted node, and its `isConverted` flag indicates whether the original node was converted.
 * If the node was not converted, the result will contain the original node with the same object reference
 * @throws If the node is invalid
 */
function convertLegacyMatchesCss(node) {
    // Check conversion indications before doing any heavy work
    if (node.type !== CssTreeNodeType.PseudoClassSelector || !LEGACY_MATCHES_CSS_NAMES.has(node.name)) {
        return createConversionResult(node, false);
    }
    const nodeClone = clone(node);
    if (!nodeClone.children || nodeClone.children.length < 1) {
        throw new Error(`Invalid ${node.name} pseudo-class: missing argument`);
    }
    // Rename the pseudo-class
    nodeClone.name = PseudoClasses.MatchesCss;
    // Remove the 'matches-css-' prefix to get the direction
    const direction = node.name.substring(PseudoClasses.MatchesCss.length + 1);
    // Add the direction to the first raw argument
    const arg = nodeClone.children[0];
    // Check argument
    if (!arg) {
        throw new Error(`Invalid ${node.name} pseudo-class: argument shouldn't be null`);
    }
    if (arg.type !== CssTreeNodeType.Raw) {
        throw new Error(`Invalid ${node.name} pseudo-class: unexpected argument type`);
    }
    // Add the direction as the first argument
    arg.value = `${direction},${arg.value}`;
    return createConversionResult(nodeClone, true);
}
/**
 * Converts legacy Extended CSS selectors to the modern Extended CSS syntax.
 * For example:
 * - `[-ext-has=...]` → `:has(...)`
 * - `[-ext-contains=...]` → `:contains(...)`
 * - `[-ext-matches-css-before=...]` → `:matches-css(before, ...)`
 *
 * @param selectorList Selector list AST to convert
 * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
 * the converted node, and its `isConverted` flag indicates whether the original node was converted.
 * If the node was not converted, the result will contain the original node with the same object reference
 */
function convertFromLegacyExtendedCss(selectorList) {
    // Check conversion indications before doing any heavy work
    const hasIndicator = find(
    // TODO: Need to improve CSSTree types, until then we need to use any type here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectorList, (node) => {
        if (node.type === CssTreeNodeType.PseudoClassSelector) {
            return LEGACY_EXT_CSS_INDICATOR_PSEUDO_NAMES.has(node.name);
        }
        if (node.type === CssTreeNodeType.AttributeSelector) {
            return node.name.name.startsWith(LEGACY_EXT_CSS_ATTRIBUTE_PREFIX);
        }
        return false;
    });
    if (!hasIndicator) {
        return createConversionResult(selectorList, false);
    }
    const selectorListClone = clone(selectorList);
    // TODO: Need to improve CSSTree types, until then we need to use any type here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    walk(selectorListClone, {
        // TODO: Need to improve CSSTree types, until then we need to use any type here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        leave: (node) => {
            // :matches-css-before(arg) → :matches-css(before,arg)
            // :matches-css-after(arg)  → :matches-css(after,arg)
            const convertedLegacyExtCss = convertLegacyMatchesCss(node);
            if (convertedLegacyExtCss.isConverted) {
                Object.assign(node, convertedLegacyExtCss.result);
            }
            // [-ext-name=...]   → :name(...)
            // [-ext-name='...'] → :name(...)
            // [-ext-name="..."] → :name(...)
            if (node.type === CssTreeNodeType.AttributeSelector
                && node.name.name.startsWith(LEGACY_EXT_CSS_ATTRIBUTE_PREFIX)
                && node.matcher === EQUALS) {
                // Node value should be exist
                if (!node.value) {
                    throw new Error(`Invalid ${node.name} attribute selector: missing value`);
                }
                // Remove the '-ext-' prefix to get the pseudo-class name
                const name = node.name.name.substring(LEGACY_EXT_CSS_ATTRIBUTE_PREFIX.length);
                // Prepare the children list for the pseudo-class node
                const children = [];
                // TODO: Change String node to Raw node to drop the quotes.
                // The structure of the node is the same, just the type
                // is different and generate() will generate the quotes
                // for String node. See:
                //  - https://github.com/csstree/csstree/blob/master/docs/ast.md#string
                //  - https://github.com/csstree/csstree/blob/master/docs/ast.md#raw
                // if (node.value.type === "String") {
                //     node.value.type = "Raw";
                // }
                // For example, if the input is [-ext-has="> .selector"], then
                // we need to parse "> .selector" as a selector instead of string
                // it as a raw value
                if ([PseudoClasses.Has, PseudoClasses.Not].includes(name)) {
                    // Get the value of the attribute selector
                    const { value } = node;
                    // If the value is an identifier, then simply push it to the
                    // children list, otherwise parse it as a selector list before
                    if (value.type === CssTreeNodeType.Identifier) {
                        children.push(value);
                    }
                    else if (value.type === CssTreeNodeType.String) {
                        // Parse the value as a selector
                        const parsedChildren = CssTree.parsePlain(value.value, CssTreeParserContext.selectorList);
                        // Don't forget convert the parsed AST again, because
                        // it was a raw string before
                        const convertedChildren = convertFromLegacyExtendedCss(parsedChildren);
                        // Push the converted children to the list
                        children.push(convertedChildren.result);
                    }
                }
                else {
                    let value = EMPTY;
                    if (node.value.type === CssTreeNodeType.String) {
                        // If the value is a string, then use its value
                        value = node.value.value;
                    }
                    else if (node.value.type === CssTreeNodeType.Identifier) {
                        // If the value is an identifier, then use its name
                        value = node.value.name;
                    }
                    // In other cases, convert value to raw
                    children.push({
                        type: CssTreeNodeType.Raw,
                        value,
                    });
                }
                // Create a pseudo-class node with the data from the attribute
                // selector
                const pseudoNode = {
                    type: CssTreeNodeType.PseudoClassSelector,
                    name,
                    children,
                };
                // Handle this case: [-ext-matches-css-before=...] → :matches-css(before,...)
                const convertedPseudoNode = convertLegacyMatchesCss(pseudoNode);
                Object.assign(node, convertedPseudoNode.isConverted ? convertedPseudoNode.result : pseudoNode);
            }
        },
    });
    return createConversionResult(selectorListClone, true);
}
/**
 * CSS selector converter
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 */
class CssSelectorConverter extends ConverterBase {
    /**
     * Converts Extended CSS elements to AdGuard-compatible ones
     *
     * @param selectorList Selector list to convert
     * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
     * the converted node, and its `isConverted` flag indicates whether the original node was converted.
     * If the node was not converted, the result will contain the original node with the same object reference
     * @throws If the rule is invalid or incompatible
     */
    static convertToAdg(selectorList) {
        // First, convert
        //  - legacy Extended CSS selectors to the modern Extended CSS syntax and
        //  - some pseudo-classes to pseudo-elements
        const legacyExtCssConverted = convertFromLegacyExtendedCss(selectorList);
        const pseudoElementsConverted = convertToPseudoElements(legacyExtCssConverted.result);
        const hasIndicator = legacyExtCssConverted.isConverted || pseudoElementsConverted.isConverted || find(
        // TODO: Need to improve CSSTree types, until then we need to use any type here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        selectorList, 
        // eslint-disable-next-line max-len
        (node) => node.type === CssTreeNodeType.PseudoClassSelector && CSS_CONVERSION_INDICATOR_PSEUDO_NAMES.has(node.name));
        if (!hasIndicator) {
            return createConversionResult(selectorList, false);
        }
        const selectorListClone = legacyExtCssConverted.isConverted || pseudoElementsConverted.isConverted
            ? pseudoElementsConverted.result
            : clone(selectorList);
        // Then, convert some Extended CSS pseudo-classes to AdGuard-compatible ones
        // TODO: Need to improve CSSTree types, until then we need to use any type here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        walk(selectorListClone, {
            // TODO: Need to improve CSSTree types, until then we need to use any type here
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            leave: (node) => {
                if (node.type === CssTreeNodeType.PseudoClassSelector) {
                    // :-abp-contains(...) → :contains(...)
                    // :has-text(...)      → :contains(...)
                    if (node.name === PseudoClasses.AbpContains || node.name === PseudoClasses.HasText) {
                        CssTree.renamePseudoClass(node, PseudoClasses.Contains);
                    }
                    // :-abp-has(...) → :has(...)
                    if (node.name === PseudoClasses.AbpHas) {
                        CssTree.renamePseudoClass(node, PseudoClasses.Has);
                    }
                    // TODO: check uBO's `:others()` and `:watch-attr()` pseudo-classes
                }
            },
        });
        return createConversionResult(selectorListClone, true);
    }
}

/**
 * @file CSS injection rule converter
 */
/**
 * CSS injection rule converter class
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 */
class CssInjectionRuleConverter extends RuleConverterBase {
    /**
     * Converts a CSS injection rule to AdGuard format, if possible.
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToAdg(rule) {
        const separator = rule.separator.value;
        let convertedSeparator = separator;
        // Change the separator if the rule contains ExtendedCSS selectors
        if (CssTree.hasAnySelectorExtendedCssNode(rule.body.selectorList) || rule.body.remove) {
            convertedSeparator = rule.exception
                ? CosmeticRuleSeparator.AdgExtendedCssInjectionException
                : CosmeticRuleSeparator.AdgExtendedCssInjection;
        }
        else {
            convertedSeparator = rule.exception
                ? CosmeticRuleSeparator.AdgCssInjectionException
                : CosmeticRuleSeparator.AdgCssInjection;
        }
        const convertedSelectorList = CssSelectorConverter.convertToAdg(rule.body.selectorList);
        // Check if the rule needs to be converted
        if (!(rule.syntax === AdblockSyntax.Common || rule.syntax === AdblockSyntax.Adg)
            || separator !== convertedSeparator
            || convertedSelectorList.isConverted) {
            // TODO: Replace with custom clone method
            const ruleClone = clone(rule);
            ruleClone.syntax = AdblockSyntax.Adg;
            ruleClone.separator.value = convertedSeparator;
            ruleClone.body.selectorList = convertedSelectorList.result;
            return createNodeConversionResult([ruleClone], true);
        }
        // Otherwise, return the original rule
        return createNodeConversionResult([rule], false);
    }
}

/**
 * @file Element hiding rule converter
 */
/**
 * Element hiding rule converter class
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 */
class ElementHidingRuleConverter extends RuleConverterBase {
    /**
     * Converts an element hiding rule to AdGuard format, if possible.
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToAdg(rule) {
        const separator = rule.separator.value;
        let convertedSeparator = separator;
        // Change the separator if the rule contains ExtendedCSS selectors
        if (CssTree.hasAnySelectorExtendedCssNode(rule.body.selectorList)) {
            convertedSeparator = rule.exception
                ? CosmeticRuleSeparator.ExtendedElementHidingException
                : CosmeticRuleSeparator.ExtendedElementHiding;
        }
        else {
            convertedSeparator = rule.exception
                ? CosmeticRuleSeparator.ElementHidingException
                : CosmeticRuleSeparator.ElementHiding;
        }
        const convertedSelectorList = CssSelectorConverter.convertToAdg(rule.body.selectorList);
        // Check if the rule needs to be converted
        if (!(rule.syntax === AdblockSyntax.Common || rule.syntax === AdblockSyntax.Adg)
            || separator !== convertedSeparator
            || convertedSelectorList.isConverted) {
            // TODO: Replace with custom clone method
            const ruleClone = clone(rule);
            ruleClone.syntax = AdblockSyntax.Adg;
            ruleClone.separator.value = convertedSeparator;
            ruleClone.body.selectorList = convertedSelectorList.result;
            return createNodeConversionResult([ruleClone], true);
        }
        // Otherwise, return the original rule
        return createNodeConversionResult([rule], false);
    }
}

/**
 * @file Utility functions for working with network rule nodes
 */
/**
 * Creates a network rule node
 *
 * @param pattern Rule pattern
 * @param modifiers Rule modifiers (optional, default: undefined)
 * @param exception Exception rule flag (optional, default: false)
 * @param syntax Adblock syntax (optional, default: Common)
 * @returns Network rule node
 */
function createNetworkRuleNode(pattern, modifiers = undefined, exception = false, syntax = AdblockSyntax.Common) {
    const result = {
        category: RuleCategory.Network,
        type: 'NetworkRule',
        syntax,
        exception,
        pattern: {
            type: 'Value',
            value: pattern,
        },
    };
    if (!isUndefined(modifiers)) {
        result.modifiers = clone(modifiers);
    }
    return result;
}

/**
 * @file Converter for request header removal rules
 */
const UBO_RESPONSEHEADER_MARKER = 'responseheader';
const ADG_REMOVEHEADER_MODIFIER = 'removeheader';
/**
 * Converter for request header removal rules
 *
 * @todo Implement `convertToUbo` (ABP currently doesn't support header removal rules)
 */
class HeaderRemovalRuleConverter extends RuleConverterBase {
    /**
     * Converts a header removal rule to AdGuard syntax, if possible.
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     * @example
     * If the input rule is:
     * ```adblock
     * example.com##^responseheader(header-name)
     * ```
     * The output will be:
     * ```adblock
     * ||example.com^$removeheader=header-name
     * ```
     */
    static convertToAdg(rule) {
        // TODO: Add support for ABP syntax once it starts supporting header removal rules
        // Leave the rule as is if it's not a header removal rule
        if (rule.category !== RuleCategory.Cosmetic
            || rule.type !== CosmeticRuleType.HtmlFilteringRule
            || rule.body.body.type !== CssTreeNodeType.Function
            || rule.body.body.name !== UBO_RESPONSEHEADER_MARKER) {
            return createNodeConversionResult([rule], false);
        }
        // Prepare network rule pattern
        const pattern = [];
        if (rule.domains.children.length === 1) {
            // If the rule has only one domain, we can use a simple network rule pattern:
            // ||single-domain-from-the-rule^
            pattern.push(ADBLOCK_URL_START, rule.domains.children[0].value, ADBLOCK_URL_SEPARATOR);
        }
        else if (rule.domains.children.length > 1) {
            // TODO: Add support for multiple domains, for example:
            // example.com,example.org,example.net##^responseheader(header-name)
            // We should consider allowing $domain with $removeheader modifier,
            // for example:
            // $removeheader=header-name,domain=example.com|example.org|example.net
            throw new RuleConversionError('Multiple domains are not supported yet');
        }
        // Prepare network rule modifiers
        const modifiers = createModifierListNode();
        modifiers.children.push(createModifierNode(ADG_REMOVEHEADER_MODIFIER, CssTree.generateFunctionPlainValue(rule.body.body)));
        // Construct the network rule
        return createNodeConversionResult([
            createNetworkRuleNode(pattern.join(EMPTY), modifiers, 
            // Copy the exception flag
            rule.exception, AdblockSyntax.Adg),
        ], true);
    }
}

/**
 * @file Cosmetic rule converter
 */
/**
 * Cosmetic rule converter class (also known as "non-basic rule converter")
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 */
class CosmeticRuleConverter extends RuleConverterBase {
    /**
     * Converts a cosmetic rule to AdGuard syntax, if possible.
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToAdg(rule) {
        let subconverterResult;
        // Convert cosmetic rule based on its type
        switch (rule.type) {
            case CosmeticRuleType.ElementHidingRule:
                subconverterResult = ElementHidingRuleConverter.convertToAdg(rule);
                break;
            case CosmeticRuleType.ScriptletInjectionRule:
                subconverterResult = ScriptletRuleConverter.convertToAdg(rule);
                break;
            case CosmeticRuleType.CssInjectionRule:
                subconverterResult = CssInjectionRuleConverter.convertToAdg(rule);
                break;
            case CosmeticRuleType.HtmlFilteringRule:
                // Handle special case: uBO response header filtering rule
                if (rule.body.body.type === CssTreeNodeType.Function
                    && rule.body.body.name === UBO_RESPONSEHEADER_MARKER) {
                    subconverterResult = HeaderRemovalRuleConverter.convertToAdg(rule);
                }
                else {
                    subconverterResult = HtmlRuleConverter.convertToAdg(rule);
                }
                break;
            // Note: Currently, only ADG supports JS injection rules, so we don't need to convert them
            case CosmeticRuleType.JsInjectionRule:
                subconverterResult = createNodeConversionResult([rule], false);
                break;
            default:
                throw new RuleConversionError('Unsupported cosmetic rule type');
        }
        let convertedModifiers;
        // Convert cosmetic rule modifiers, if any
        if (rule.modifiers) {
            if (rule.syntax === AdblockSyntax.Ubo) {
                // uBO doesn't support this rule:
                // example.com##+js(set-constant.js, foo, bar):matches-path(/baz)
                if (rule.type === CosmeticRuleType.ScriptletInjectionRule) {
                    throw new RuleConversionError('uBO scriptlet injection rules don\'t support cosmetic rule modifiers');
                }
                convertedModifiers = AdgCosmeticRuleModifierConverter.convertFromUbo(rule.modifiers);
            }
            else if (rule.syntax === AdblockSyntax.Abp) {
                // TODO: Implement once ABP starts supporting cosmetic rule modifiers
                throw new RuleConversionError('ABP don\'t support cosmetic rule modifiers');
            }
        }
        if ((subconverterResult.result.length > 1 || subconverterResult.isConverted)
            || (convertedModifiers && convertedModifiers.isConverted)) {
            // Add modifier list to the subconverter result rules
            subconverterResult.result.forEach((subconverterRule) => {
                if (convertedModifiers && subconverterRule.category === RuleCategory.Cosmetic) {
                    // eslint-disable-next-line no-param-reassign
                    subconverterRule.modifiers = convertedModifiers.result;
                }
            });
            return subconverterResult;
        }
        return createNodeConversionResult([rule], false);
    }
}

/**
 * @file Network rule modifier list converter.
 */
// Since scriptlets library doesn't have ESM exports, we should import
// the whole module and then extract the required functions from it here.
// Otherwise importing AGTree will cause an error in ESM environment,
// because scriptlets library doesn't support named exports.
const { redirects } = scriptlets;
/**
 * @see {@link https://adguard.com/kb/general/ad-filtering/create-own-filters/#csp-modifier}
 */
const CSP_MODIFIER = 'csp';
const CSP_SEPARATOR = SEMICOLON + SPACE;
/**
 * @see {@link https://adguard.com/kb/general/ad-filtering/create-own-filters/#csp-modifier}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy}
 */
const COMMON_CSP_PARAMS = '\'self\' \'unsafe-eval\' http: https: data: blob: mediastream: filesystem:';
/**
 * @see {@link https://help.adblockplus.org/hc/en-us/articles/360062733293#rewrite}
 */
const ABP_REWRITE_MODIFIER = 'rewrite';
/**
 * @see {@link https://adguard.com/kb/general/ad-filtering/create-own-filters/#redirect-modifier}
 */
const REDIRECT_MODIFIER = 'redirect';
/**
 * @see {@link https://adguard.com/kb/general/ad-filtering/create-own-filters/#redirect-rule-modifier}
 */
const REDIRECT_RULE_MODIFIER = 'redirect-rule';
/**
 * Redirect-related modifiers.
 */
const REDIRECT_MODIFIERS = new Set([
    ABP_REWRITE_MODIFIER,
    REDIRECT_MODIFIER,
    REDIRECT_RULE_MODIFIER,
]);
/**
 * Conversion map for ADG network rule modifiers.
 */
const ADG_CONVERSION_MAP = new Map([
    ['1p', [{ name: () => 'third-party', exception: (actual) => !actual }]],
    ['3p', [{ name: () => 'third-party' }]],
    ['css', [{ name: () => 'stylesheet' }]],
    ['doc', [{ name: () => 'document' }]],
    ['ehide', [{ name: () => 'elemhide' }]],
    ['empty', [{ name: () => 'redirect', value: () => 'nooptext' }]],
    ['first-party', [{ name: () => 'third-party', exception: (actual) => !actual }]],
    ['frame', [{ name: () => 'subdocument' }]],
    ['ghide', [{ name: () => 'generichide' }]],
    ['inline-font', [{ name: () => CSP_MODIFIER, value: () => `font-src ${COMMON_CSP_PARAMS}` }]],
    ['inline-script', [{ name: () => CSP_MODIFIER, value: () => `script-src ${COMMON_CSP_PARAMS}` }]],
    ['mp4', [{ name: () => 'redirect', value: () => 'noopmp4-1s' }, { name: () => 'media', value: () => undefined }]],
    ['queryprune', [{ name: () => 'removeparam' }]],
    ['shide', [{ name: () => 'specifichide' }]],
    ['xhr', [{ name: () => 'xmlhttprequest' }]],
]);
/**
 * Helper class for converting network rule modifier lists.
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 */
class NetworkRuleModifierListConverter extends ConverterBase {
    /**
     * Converts a network rule modifier list to AdGuard format, if possible.
     *
     * @param modifierList Network rule modifier list node to convert
     * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
     * the converted node, and its `isConverted` flag indicates whether the original node was converted.
     * If the node was not converted, the result will contain the original node with the same object reference
     * @throws If the conversion is not possible
     */
    static convertToAdg(modifierList) {
        const conversionMap = new MultiValueMap();
        // Special case: $csp modifier
        let cspCount = 0;
        modifierList.children.forEach((modifierNode, index) => {
            const modifierConversions = ADG_CONVERSION_MAP.get(modifierNode.modifier.value);
            if (modifierConversions) {
                for (const modifierConversion of modifierConversions) {
                    const name = modifierConversion.name(modifierNode.modifier.value);
                    const exception = modifierConversion.exception
                        // If the exception value is undefined in the original modifier, it
                        // means that the modifier isn't negated
                        ? modifierConversion.exception(modifierNode.exception || false)
                        : modifierNode.exception;
                    const value = modifierConversion.value
                        ? modifierConversion.value(modifierNode.value?.value)
                        : modifierNode.value?.value;
                    // Check if the name or the value is different from the original modifier
                    // If so, add the converted modifier to the list
                    if (name !== modifierNode.modifier.value || value !== modifierNode.value?.value) {
                        conversionMap.add(index, createModifierNode(name, value, exception));
                    }
                    // Special case: $csp modifier
                    if (name === CSP_MODIFIER) {
                        cspCount += 1;
                    }
                }
                return;
            }
            // Handle special case: resource redirection modifiers
            if (REDIRECT_MODIFIERS.has(modifierNode.modifier.value)) {
                // Redirect modifiers can't be negated
                if (modifierNode.exception === true) {
                    throw new RuleConversionError(`Modifier '${modifierNode.modifier.value}' cannot be negated`);
                }
                // Convert the redirect resource name to ADG format
                const redirectResource = modifierNode.value?.value;
                if (!redirectResource) {
                    throw new RuleConversionError(`No redirect resource specified for '${modifierNode.modifier.value}' modifier`);
                }
                // Leave $redirect and $redirect-rule modifiers as is, but convert $rewrite to $redirect
                const modifierName = modifierNode.modifier.value === ABP_REWRITE_MODIFIER
                    ? REDIRECT_MODIFIER
                    : modifierNode.modifier.value;
                // Try to convert the redirect resource name to ADG format
                // This function returns undefined if the resource name is unknown
                const convertedRedirectResource = redirects.convertRedirectNameToAdg(redirectResource);
                // Check if the modifier name or the redirect resource name is different from the original modifier
                // If so, add the converted modifier to the list
                if (modifierName !== modifierNode.modifier.value
                    || (convertedRedirectResource !== undefined && convertedRedirectResource !== redirectResource)) {
                    conversionMap.add(index, createModifierNode(modifierName, 
                    // If the redirect resource name is unknown, fall back to the original one
                    // Later, the validator will throw an error if the resource name is invalid
                    convertedRedirectResource || redirectResource, modifierNode.exception));
                }
            }
        });
        // Prepare the result if there are any converted modifiers or $csp modifiers
        if (conversionMap.size || cspCount) {
            const modifierListClone = cloneModifierListNode(modifierList);
            // Replace the original modifiers with the converted ones
            // One modifier may be replaced with multiple modifiers, so we need to flatten the array
            modifierListClone.children = modifierListClone.children.map((modifierNode, index) => {
                const conversionRecord = conversionMap.get(index);
                if (conversionRecord) {
                    return conversionRecord;
                }
                return modifierNode;
            }).flat();
            // Special case: $csp modifier: merge multiple $csp modifiers into one
            // and put it at the end of the modifier list
            if (cspCount) {
                const cspValues = [];
                modifierListClone.children = modifierListClone.children.filter((modifierNode) => {
                    if (modifierNode.modifier.value === CSP_MODIFIER) {
                        if (!modifierNode.value?.value) {
                            throw new RuleConversionError('$csp modifier value is missing');
                        }
                        cspValues.push(modifierNode.value?.value);
                        return false;
                    }
                    return true;
                });
                modifierListClone.children.push(createModifierNode(CSP_MODIFIER, cspValues.join(CSP_SEPARATOR)));
            }
            // Before returning the result, remove duplicated modifiers
            modifierListClone.children = modifierListClone.children.filter((modifierNode, index, self) => self.findIndex((m) => m.modifier.value === modifierNode.modifier.value
                && m.exception === modifierNode.exception
                && m.value?.value === modifierNode.value?.value) === index);
            return createConversionResult(modifierListClone, true);
        }
        return createConversionResult(modifierList, false);
    }
}

/**
 * @file Network rule converter
 */
/**
 * Network rule converter class (also known as "basic rule converter")
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 */
class NetworkRuleConverter extends RuleConverterBase {
    /**
     * Converts a network rule to AdGuard format, if possible.
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToAdg(rule) {
        if (rule.modifiers) {
            const modifiers = NetworkRuleModifierListConverter.convertToAdg(rule.modifiers);
            // If the object reference is different, it means that the modifiers were converted
            // In this case, we should clone the entire rule and replace the modifiers with the converted ones
            if (modifiers.isConverted) {
                return {
                    result: [{
                            category: RuleCategory.Network,
                            type: 'NetworkRule',
                            syntax: rule.syntax,
                            exception: rule.exception,
                            pattern: {
                                type: 'Value',
                                value: rule.pattern.value,
                            },
                            modifiers: modifiers.result,
                        }],
                    isConverted: true,
                };
            }
        }
        // If the modifiers were not converted, return the original rule
        return createNodeConversionResult([rule], false);
    }
}

/**
 * @file Adblock rule converter
 *
 * This file is the entry point for all rule converters
 * which automatically detects the rule type and calls
 * the corresponding "sub-converter".
 */
/**
 * Adblock filtering rule converter class
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 */
class RuleConverter extends RuleConverterBase {
    /**
     * Converts an adblock filtering rule to AdGuard format, if possible.
     *
     * @param rule Rule node to convert
     * @returns An object which follows the {@link NodeConversionResult} interface. Its `result` property contains
     * the array of converted rule nodes, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the result array will contain the original node with the same object reference
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToAdg(rule) {
        // Delegate conversion to the corresponding sub-converter
        // based on the rule category
        switch (rule.category) {
            case RuleCategory.Comment:
                return CommentRuleConverter.convertToAdg(rule);
            case RuleCategory.Cosmetic:
                return CosmeticRuleConverter.convertToAdg(rule);
            case RuleCategory.Network:
                return NetworkRuleConverter.convertToAdg(rule);
            default:
                throw new RuleConversionError(`Unknown rule category: ${rule.category}`);
        }
    }
}

/**
 * @file Adblock filter list converter
 */
/**
 * Adblock filter list converter class
 *
 * This class just provides an extra layer on top of the {@link RuleConverter}
 * and can be used to convert entire filter lists.
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 * @todo Implement tolerant mode, which will allow to convert a filter list
 * even if some of its rules are invalid
 */
class FilterListConverter extends ConverterBase {
    /**
     * Converts an adblock filter list to AdGuard format, if possible.
     *
     * @param filterListNode Filter list node to convert
     * @param tolerant Indicates whether the converter should be tolerant to invalid rules. If enabled and a rule is
     * invalid, it will be left as is. If disabled and a rule is invalid, the whole filter list will be failed.
     * Defaults to `true`.
     * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
     * the converted node, and its `isConverted` flag indicates whether the original node was converted.
     * If the node was not converted, the result will contain the original node with the same object reference
     * @throws If the filter list is invalid or cannot be converted (if the tolerant mode is disabled)
     */
    static convertToAdg(filterListNode, tolerant = true) {
        // Prepare a map to store the converted rules by their index in the filter list
        const conversionMap = new MultiValueMap();
        // Iterate over the filtering rules and convert them one by one, then add them to the result (one conversion may
        // result in multiple rules)
        for (let i = 0; i < filterListNode.children.length; i += 1) {
            try {
                const convertedRules = RuleConverter.convertToAdg(filterListNode.children[i]);
                // Add the converted rules to the map if they were converted
                if (convertedRules.isConverted) {
                    conversionMap.add(i, ...convertedRules.result);
                }
            }
            catch (error) {
                // If the tolerant mode is disabled, we should throw an error, this will fail the whole filter list
                // conversion.
                // Otherwise, we just ignore the error and leave the rule as is
                if (!tolerant) {
                    throw error;
                }
            }
        }
        // If the conversion map is empty, it means that no rules were converted, so we can return the original filter
        // list
        if (conversionMap.size === 0) {
            return createConversionResult(filterListNode, false);
        }
        // Otherwise, create a new filter list node with the converted rules
        const convertedFilterList = {
            type: 'FilterList',
            children: [],
        };
        // Iterate over the original rules again and add them to the converted filter list, replacing the converted
        // rules with the new ones at the specified indexes
        for (let i = 0; i < filterListNode.children.length; i += 1) {
            const rules = conversionMap.get(i);
            if (rules) {
                convertedFilterList.children.push(...rules);
            }
            else {
                // We clone the unconverted rules to avoid mutating the original filter list if we return the converted
                // one
                convertedFilterList.children.push(clone(filterListNode.children[i]));
            }
        }
        return createConversionResult(convertedFilterList, true);
    }
}

/**
 * @file Filter list converter for raw filter lists
 *
 * Technically, this is a wrapper around `FilterListConverter` that works with nodes instead of strings.
 */
/**
 * Adblock filter list converter class.
 *
 * You can use this class to convert string-based filter lists, since most of the converters work with nodes.
 * This class just provides an extra layer on top of the {@link FilterListConverter} and calls the parser/serializer
 * before/after the conversion internally.
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 */
class RawFilterListConverter extends ConverterBase {
    /**
     * Converts an adblock filter list text to AdGuard format, if possible.
     *
     * @param rawFilterList Raw filter list text to convert
     * @param tolerant Indicates whether the converter should be tolerant to invalid rules. If enabled and a rule is
     * invalid, it will be left as is. If disabled and a rule is invalid, the whole filter list will be failed.
     * Defaults to `true`.
     * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
     * the array of converted filter list text, and its `isConverted` flag indicates whether the original rule was
     * converted. If the rule was not converted, the original filter list text will be returned
     * @throws If the filter list is invalid or cannot be converted (if the tolerant mode is disabled)
     */
    static convertToAdg(rawFilterList, tolerant = true) {
        const conversionResult = FilterListConverter.convertToAdg(FilterListParser.parse(rawFilterList, tolerant), tolerant);
        // If the filter list was not converted, return the original text
        if (!conversionResult.isConverted) {
            return createConversionResult(rawFilterList, false);
        }
        // Otherwise, serialize the filter list and return the result
        return createConversionResult(FilterListParser.generate(conversionResult.result), true);
    }
}

/**
 * @file Rule converter for raw rules
 *
 * Technically, this is a wrapper around `RuleConverter` that works with nodes instead of strings.
 */
/**
 * Adblock filtering rule converter class.
 *
 * You can use this class to convert string-based adblock rules, since most of the converters work with nodes.
 * This class just provides an extra layer on top of the {@link RuleConverter} and calls the parser/serializer
 * before/after the conversion internally.
 *
 * @todo Implement `convertToUbo` and `convertToAbp`
 */
class RawRuleConverter extends ConverterBase {
    /**
     * Converts an adblock filtering rule to AdGuard format, if possible.
     *
     * @param rawRule Raw rule text to convert
     * @returns An object which follows the {@link ConversionResult} interface. Its `result` property contains
     * the array of converted rule texts, and its `isConverted` flag indicates whether the original rule was converted.
     * If the rule was not converted, the original rule text will be returned
     * @throws If the rule is invalid or cannot be converted
     */
    static convertToAdg(rawRule) {
        const conversionResult = RuleConverter.convertToAdg(RuleParser.parse(rawRule));
        // If the rule was not converted, return the original rule text
        if (!conversionResult.isConverted) {
            return createConversionResult([rawRule], false);
        }
        // Otherwise, serialize the converted rule nodes
        return createConversionResult(conversionResult.result.map(RuleParser.generate), true);
    }
}

/**
 * @file Utility functions for logical expression AST.
 */
/**
 * Utility functions for logical expression AST.
 */
class LogicalExpressionUtils {
    /**
     * Get all variables in the expression.
     *
     * @param ast Logical expression AST
     * @returns List of variables in the expression (nodes)
     * @example
     * If the expression is `a && b || c`, the returned list will be
     * nodes for `a`, `b`, and `c`.
     */
    static getVariables(ast) {
        if (ast.type === 'Variable') {
            return [ast];
        }
        if (ast.type === 'Operator') {
            const leftVars = LogicalExpressionUtils.getVariables(ast.left);
            const rightVars = ast.right ? LogicalExpressionUtils.getVariables(ast.right) : [];
            return [...leftVars, ...rightVars];
        }
        if (ast.type === 'Parenthesis') {
            return LogicalExpressionUtils.getVariables(ast.expression);
        }
        throw new Error('Unexpected node type');
    }
    /**
     * Evaluate the parsed logical expression. You'll need to provide a
     * variable table.
     *
     * @param ast Logical expression AST
     * @param table Variable table (key: variable name, value: boolean)
     * @returns Evaluation result
     * @example
     * If the expression is `a && b`, and the variable table is
     * `{ a: true, b: false }`, the result will be `false`.
     *
     * Example code:
     * ```js
     * LogicalExpressionUtils.evaluate(
     *     LogicalExpressionParser.parse('a && b'),
     *     { a: true, b: false }
     * );
     * ```
     */
    static evaluate(ast, table) {
        if (ast.type === 'Variable') {
            return !!table[ast.name];
        }
        if (ast.type === 'Operator') {
            if (ast.operator === '&&' || ast.operator === '||') {
                if (!ast.right) {
                    throw new Error('Unexpected right operand');
                }
                if (ast.operator === '&&') {
                    // eslint-disable-next-line max-len
                    return LogicalExpressionUtils.evaluate(ast.left, table) && LogicalExpressionUtils.evaluate(ast.right, table);
                }
                if (ast.operator === '||') {
                    // eslint-disable-next-line max-len
                    return LogicalExpressionUtils.evaluate(ast.left, table) || LogicalExpressionUtils.evaluate(ast.right, table);
                }
            }
            else if (ast.operator === '!') {
                return !LogicalExpressionUtils.evaluate(ast.left, table);
            }
        }
        else if (ast.type === 'Parenthesis') {
            return LogicalExpressionUtils.evaluate(ast.expression, table);
        }
        throw new Error(`Unexpected AST node type '${ast.type}'`);
    }
}

const version$1 = "1.1.8";

/**
 * @file AGTree version
 */
// ! Notice:
// Don't export version from package.json directly, because if you run
// `tsc` in the root directory, it will generate `dist/types/src/version.d.ts`
// with wrong relative path to `package.json`. So we need this little "hack"
const version = version$1;

export { ADBLOCK_URL_SEPARATOR, ADBLOCK_URL_SEPARATOR_REGEX, ADBLOCK_URL_START, ADBLOCK_URL_START_REGEX, ADBLOCK_WILDCARD, ADBLOCK_WILDCARD_REGEX, ADG_SCRIPTLET_MASK, AGLINT_COMMAND_PREFIX, AdblockSyntax, AdblockSyntaxError, AgentCommentRuleParser, AgentParser, AppListParser, COMMA_DOMAIN_LIST_SEPARATOR, CommentMarker, CommentRuleParser, CommentRuleType, ConfigCommentRuleParser, CosmeticRuleParser, CosmeticRuleSeparator, CosmeticRuleSeparatorUtils, CosmeticRuleType, CssTree, CssTreeNodeType, CssTreeParserContext, DomainListParser, DomainUtils, EXT_CSS_LEGACY_ATTRIBUTES, EXT_CSS_PSEUDO_CLASSES, FORBIDDEN_CSS_FUNCTIONS, FilterListConverter, FilterListParser, HINT_MARKER, HintCommentRuleParser, HintParser, IF, INCLUDE, LogicalExpressionParser, LogicalExpressionUtils, METADATA_HEADERS, MODIFIERS_SEPARATOR, MODIFIER_ASSIGN_OPERATOR, MetadataCommentRuleParser, MethodListParser, ModifierListParser, ModifierParser, NEGATION_MARKER, NETWORK_RULE_EXCEPTION_MARKER, NETWORK_RULE_SEPARATOR, NetworkRuleParser, NotImplementedError, PIPE_MODIFIER_SEPARATOR, PREPROCESSOR_MARKER, ParameterListParser, PreProcessorCommentRuleParser, QuoteType, QuoteUtils, RawFilterListConverter, RawRuleConverter, RegExpUtils, RuleCategory, RuleConversionError, RuleConverter, RuleParser, SAFARI_CB_AFFINITY, SPECIAL_REGEX_SYMBOLS, StealthOptionListParser, UBO_SCRIPTLET_MASK, locRange, modifierValidator, shiftLoc, version };
