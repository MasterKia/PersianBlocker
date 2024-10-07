/**
 * @file Utility functions for string manipulation.
 */

import {
    CAPITAL_LETTER_A,
    CAPITAL_LETTER_Z,
    CR,
    CRLF,
    EMPTY,
    ESCAPE_CHARACTER,
    FF,
    LF,
    NUMBER_0,
    NUMBER_9,
    SMALL_LETTER_A,
    SMALL_LETTER_Z,
    SPACE,
    TAB,
} from '../common/constants';

export const SINGLE_QUOTE_MARKER = "'";
export const DOUBLE_QUOTE_MARKER = '"';
export const REGEX_MARKER = '/';

export type NewLineType = 'lf' | 'crlf' | 'cr';
export type NewLineSplit = [string, NewLineType | null][];

export class StringUtils {
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
    public static findNextUnescapedCharacter(
        pattern: string,
        searchedCharacter: string,
        start = 0,
        escapeCharacter: string = ESCAPE_CHARACTER,
    ): number {
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
    public static findLastUnescapedCharacter(
        pattern: string,
        searchedCharacter: string,
        escapeCharacter: string = ESCAPE_CHARACTER,
    ): number {
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
    public static findNextUnescapedCharacterThatNotFollowedBy(
        pattern: string,
        start: number,
        searchedCharacter: string,
        notFollowedBy: string,
        escapeCharacter: string = ESCAPE_CHARACTER,
    ): number {
        for (let i = start; i < pattern.length; i += 1) {
            // The searched character cannot be preceded by an escape
            if (
                pattern[i] === searchedCharacter
                && pattern[i + 1] !== notFollowedBy
                && pattern[i - 1] !== escapeCharacter
            ) {
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
    public static findLastUnescapedCharacterThatNotFollowedBy(
        pattern: string,
        searchedCharacter: string,
        notFollowedBy: string,
        escapeCharacter: string = ESCAPE_CHARACTER,
    ): number {
        for (let i = pattern.length - 1; i >= 0; i -= 1) {
            // The searched character cannot be preceded by an escape
            if (
                pattern[i] === searchedCharacter
                && pattern[i + 1] !== notFollowedBy
                && pattern[i - 1] !== escapeCharacter
            ) {
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
    public static findUnescapedNonStringNonRegexChar(pattern: string, searchedCharacter: string, start = 0) {
        let open: string | null = null;

        for (let i = start; i < pattern.length; i += 1) {
            if (
                (pattern[i] === SINGLE_QUOTE_MARKER
                    || pattern[i] === DOUBLE_QUOTE_MARKER
                    || pattern[i] === REGEX_MARKER)
                && pattern[i - 1] !== ESCAPE_CHARACTER
            ) {
                if (open === pattern[i]) {
                    open = null;
                } else if (open === null) {
                    open = pattern[i];
                }
            } else if (open === null && pattern[i] === searchedCharacter && pattern[i - 1] !== ESCAPE_CHARACTER) {
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
    public static findNextUnquotedUnescapedCharacter(
        pattern: string,
        searchedCharacter: string,
        start = 0,
        escapeCharacter = ESCAPE_CHARACTER,
    ) {
        let openQuote: string | null = null;

        for (let i = start; i < pattern.length; i += 1) {
            // Unescaped ' or "
            if (
                (pattern[i] === SINGLE_QUOTE_MARKER || pattern[i] === DOUBLE_QUOTE_MARKER)
                && pattern[i - 1] !== escapeCharacter
            ) {
                if (!openQuote) openQuote = pattern[i];
                else if (openQuote === pattern[i]) openQuote = null;
            } else if (pattern[i] === searchedCharacter && pattern[i - 1] !== escapeCharacter) {
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
    public static findNextNotBracketedUnescapedCharacter(
        pattern: string,
        searchedCharacter: string,
        start = 0,
        escapeCharacter = ESCAPE_CHARACTER,
        openBracket = '(',
        closeBracket = ')',
    ): number {
        if (openBracket === closeBracket) {
            throw new Error('Open and close bracket cannot be the same');
        }

        let depth = 0;

        for (let i = start; i < pattern.length; i += 1) {
            if (pattern[i] === openBracket) {
                depth += 1;
            } else if (pattern[i] === closeBracket) {
                depth -= 1;
            } else if (depth < 1 && pattern[i] === searchedCharacter && pattern[i - 1] !== escapeCharacter) {
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
    public static splitStringByUnquotedUnescapedCharacter(pattern: string, delimeterCharacter: string): string[] {
        const parts: string[] = [];
        let delimeterIndex = -1;
        do {
            const prevDelimeterIndex = delimeterIndex;
            delimeterIndex = StringUtils.findNextUnquotedUnescapedCharacter(
                pattern,
                delimeterCharacter,
                delimeterIndex + 1,
            );
            if (delimeterIndex !== -1) {
                parts.push(pattern.substring(prevDelimeterIndex + 1, delimeterIndex));
            } else {
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
    public static splitStringByUnescapedNonStringNonRegexChar(pattern: string, delimeterCharacter: string): string[] {
        const parts: string[] = [];
        let delimeterIndex = -1;
        do {
            const prevDelimeterIndex = delimeterIndex;
            delimeterIndex = StringUtils.findUnescapedNonStringNonRegexChar(
                pattern,
                delimeterCharacter,
                delimeterIndex + 1,
            );
            if (delimeterIndex !== -1) {
                parts.push(pattern.substring(prevDelimeterIndex + 1, delimeterIndex));
            } else {
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
    public static splitStringByUnescapedCharacter(pattern: string, delimeterCharacter: string): string[] {
        const parts: string[] = [];
        let delimeterIndex = -1;
        do {
            const prevDelimeterIndex = delimeterIndex;
            delimeterIndex = StringUtils.findNextUnescapedCharacter(pattern, delimeterCharacter, delimeterIndex + 1);
            if (delimeterIndex !== -1) {
                parts.push(pattern.substring(prevDelimeterIndex + 1, delimeterIndex));
            } else {
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
    public static isWhitespace(char: string): boolean {
        return char === SPACE || char === TAB;
    }

    /**
     * Checks if the given character is a digit.
     *
     * @param char The character to check.
     * @returns `true` if the given character is a digit, `false` otherwise.
     */
    public static isDigit(char: string): boolean {
        return char >= NUMBER_0 && char <= NUMBER_9;
    }

    /**
     * Checks if the given character is a small letter.
     *
     * @param char The character to check.
     * @returns `true` if the given character is a small letter, `false` otherwise.
     */
    public static isSmallLetter(char: string): boolean {
        return char >= SMALL_LETTER_A && char <= SMALL_LETTER_Z;
    }

    /**
     * Checks if the given character is a capital letter.
     *
     * @param char The character to check.
     * @returns `true` if the given character is a capital letter, `false` otherwise.
     */
    public static isCapitalLetter(char: string): boolean {
        return char >= CAPITAL_LETTER_A && char <= CAPITAL_LETTER_Z;
    }

    /**
     * Checks if the given character is a letter (small or capital).
     *
     * @param char The character to check.
     * @returns `true` if the given character is a letter, `false` otherwise.
     */
    public static isLetter(char: string): boolean {
        return StringUtils.isSmallLetter(char) || StringUtils.isCapitalLetter(char);
    }

    /**
     * Checks if the given character is a letter or a digit.
     *
     * @param char Character to check
     * @returns `true` if the given character is a letter or a digit, `false` otherwise.
     */
    public static isAlphaNumeric(char: string): boolean {
        return StringUtils.isLetter(char) || StringUtils.isDigit(char);
    }

    /**
     * Searches for the first non-whitespace character in the source pattern.
     *
     * @param pattern - Source pattern
     * @param start - Start index
     * @returns Index or -1 if the character not found
     */
    public static findFirstNonWhitespaceCharacter(pattern: string, start = 0): number {
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
    public static findLastNonWhitespaceCharacter(pattern: string): number {
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
    public static findNextWhitespaceCharacter(pattern: string, start = 0): number {
        for (let i = start; i < pattern.length; i += 1) {
            if (StringUtils.isWhitespace(pattern[i])) {
                return i;
            }
        }

        return pattern.length;
    }

    /**
     * Checks whether a string is a RegExp pattern.
     *
     * @param pattern - Pattern to check
     * @returns `true` if the string is a RegExp pattern, `false` otherwise
     */
    public static isRegexPattern(pattern: string): boolean {
        const trimmedPattern = pattern.trim();
        const lastIndex = trimmedPattern.length - 1;
        if (trimmedPattern.length > 2 && trimmedPattern[0] === REGEX_MARKER) {
            const last = StringUtils.findNextUnescapedCharacter(trimmedPattern, REGEX_MARKER, 1);
            return last === lastIndex;
        }
        return false;
    }

    /**
     * Escapes a specified character in the string.
     *
     * @param pattern - Input string
     * @param character - Character to escape
     * @param escapeCharacter - Escape character (optional)
     * @returns Escaped string
     */
    public static escapeCharacter(pattern: string, character: string, escapeCharacter = ESCAPE_CHARACTER): string {
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
    public static skipWS(pattern: string, start = 0): number {
        let i = start;

        while (i < pattern.length && StringUtils.isWhitespace(pattern[i])) {
            i += 1;
        }

        return i;
    }

    /**
     * Searches for the previous non-whitespace character in the source pattern.
     *
     * @param pattern Pattern to search
     * @param start Start index
     * @returns Index of the previous non-whitespace character or -1
     */
    public static skipWSBack(pattern: string, start = pattern.length - 1): number {
        let i = start;

        while (i >= 0 && StringUtils.isWhitespace(pattern[i])) {
            i -= 1;
        }

        return i;
    }

    /**
     * Finds the next EOL character in the pattern (CR, LF, FF) or the end of the pattern.
     *
     * @param pattern Pattern to search
     * @param start Start index
     * @returns Index of the next EOL character or the length of the pattern
     */
    public static findNextEOL(pattern: string, start = 0): number {
        for (let i = start; i < pattern.length; i += 1) {
            if (StringUtils.isEOL(pattern[i])) {
                return i;
            }
        }

        return pattern.length;
    }

    /**
     * Checks if the given character is a new line character.
     *
     * @param char Character to check
     * @returns `true` if the given character is a new line character, `false` otherwise.
     */
    public static isEOL(char: string): boolean {
        return char === CR || char === LF || char === FF;
    }

    /**
     * Splits a string along newline characters.
     *
     * @param input - Input string
     * @returns Splitted string
     */
    public static splitStringByNewLines(input: string): string[] {
        return input.split(/\r?\n/);
    }

    /**
     * Splits a string by new lines and stores the new line type for each line
     *
     * @param input The input string to be split
     * @returns An array of tuples, where each tuple contains a line of the input string and its
     * corresponding new line type ("lf", "crlf", or "cr")
     */
    public static splitStringByNewLinesEx(input: string): NewLineSplit {
        // Array to store the tuples of line and new line type
        const result: NewLineSplit = [];
        let currentLine = EMPTY;
        let newLineType: NewLineType | null = null;

        // Iterate over each character in the input string
        for (let i = 0; i < input.length; i += 1) {
            const char = input[i];

            if (char === CR) {
                if (input[i + 1] === LF) {
                    newLineType = 'crlf';
                    i += 1;
                } else {
                    newLineType = 'cr';
                }

                result.push([currentLine, newLineType]);
                currentLine = EMPTY;
                newLineType = null;
            } else if (char === LF) {
                newLineType = 'lf';
                result.push([currentLine, newLineType]);
                currentLine = EMPTY;
                newLineType = null;
            } else {
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
    public static mergeStringByNewLines(input: NewLineSplit): string {
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
                } else if (newLineType === 'cr') {
                    result += CR;
                } else {
                    result += LF;
                }
            }
        }

        return result;
    }
}
