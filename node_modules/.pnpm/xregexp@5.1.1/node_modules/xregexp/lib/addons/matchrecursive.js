"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

/*!
 * XRegExp.matchRecursive 5.1.1
 * <xregexp.com>
 * Steven Levithan (c) 2009-present MIT License
 */
var _default = function _default(XRegExp) {
  /**
   * Returns a match detail object composed of the provided values.
   *
   * @private
   */
  function row(name, value, start, end) {
    return {
      name: name,
      value: value,
      start: start,
      end: end
    };
  }
  /**
   * Returns an array of match strings between outermost left and right delimiters, or an array of
   * objects with detailed match parts and position data. By default, an error is thrown if
   * delimiters are unbalanced within the subject string.
   *
   * @memberOf XRegExp
   * @param {String} str String to search.
   * @param {String} left Left delimiter as an XRegExp pattern.
   * @param {String} right Right delimiter as an XRegExp pattern.
   * @param {String} [flags] Any combination of XRegExp flags, used for the left and right delimiters.
   * @param {Object} [options] Options object with optional properties:
   *   - `valueNames` {Array} Providing `valueNames` changes the return value from an array of
   *     matched strings to an array of objects that provide the value and start/end positions
   *     for the matched strings as well as the matched delimiters and unmatched string segments.
   *     To use this extended information mode, provide an array of 4 strings that name the parts
   *     to be returned:
   *     1. String segments outside of (before, between, and after) matches.
   *     2. Matched outermost left delimiters.
   *     3. Matched text between the outermost left and right delimiters.
   *     4. Matched outermost right delimiters.
   *     Taken together, these parts include the entire subject string if used with flag g.
   *     Use `null` for any of these values to omit unneeded parts from the returned results.
   *   - `escapeChar` {String} Single char used to escape delimiters within the subject string.
   *   - `unbalanced` {String} Handling mode for unbalanced delimiters. Options are:
   *     - 'error' - throw (default)
   *     - 'skip' - unbalanced delimiters are treated as part of the text between delimiters, and
   *       searches continue at the end of the unbalanced delimiter.
   *     - 'skip-lazy' - unbalanced delimiters are treated as part of the text between delimiters,
   *       and searches continue one character after the start of the unbalanced delimiter.
   * @returns {Array} Array of matches, or an empty array.
   * @example
   *
   * // Basic usage
   * const str1 = '(t((e))s)t()(ing)';
   * XRegExp.matchRecursive(str1, '\\(', '\\)', 'g');
   * // -> ['t((e))s', '', 'ing']
   *
   * // Extended information mode with valueNames
   * const str2 = 'Here is <div> <div>an</div></div> example';
   * XRegExp.matchRecursive(str2, '<div\\s*>', '</div>', 'gi', {
   *   valueNames: ['between', 'left', 'match', 'right']
   * });
   * // -> [
   * // {name: 'between', value: 'Here is ',       start: 0,  end: 8},
   * // {name: 'left',    value: '<div>',          start: 8,  end: 13},
   * // {name: 'match',   value: ' <div>an</div>', start: 13, end: 27},
   * // {name: 'right',   value: '</div>',         start: 27, end: 33},
   * // {name: 'between', value: ' example',       start: 33, end: 41}
   * // ]
   *
   * // Omitting unneeded parts with null valueNames, and using escapeChar
   * const str3 = '...{1}.\\{{function(x,y){return {y:x}}}';
   * XRegExp.matchRecursive(str3, '{', '}', 'g', {
   *   valueNames: ['literal', null, 'value', null],
   *   escapeChar: '\\'
   * });
   * // -> [
   * // {name: 'literal', value: '...',  start: 0, end: 3},
   * // {name: 'value',   value: '1',    start: 4, end: 5},
   * // {name: 'literal', value: '.\\{', start: 6, end: 9},
   * // {name: 'value',   value: 'function(x,y){return {y:x}}', start: 10, end: 37}
   * // ]
   *
   * // Sticky mode via flag y
   * const str4 = '<1><<<2>>><3>4<5>';
   * XRegExp.matchRecursive(str4, '<', '>', 'gy');
   * // -> ['1', '<<2>>', '3']
   *
   * // Skipping unbalanced delimiters instead of erroring
   * const str5 = 'Here is <div> <div>an</div> unbalanced example';
   * XRegExp.matchRecursive(str5, '<div\\s*>', '</div>', 'gi', {
   *     unbalanced: 'skip'
   * });
   * // -> ['an']
   */


  XRegExp.matchRecursive = function (str, left, right, flags, options) {
    flags = flags || '';
    options = options || {};
    var global = (0, _indexOf["default"])(flags).call(flags, 'g') !== -1;
    var sticky = (0, _indexOf["default"])(flags).call(flags, 'y') !== -1; // Flag `y` is handled manually

    var basicFlags = flags.replace(/y/g, '');
    left = XRegExp(left, basicFlags);
    right = XRegExp(right, basicFlags);
    var esc;
    var _options = options,
        escapeChar = _options.escapeChar;

    if (escapeChar) {
      var _context, _context2;

      if (escapeChar.length > 1) {
        throw new Error('Cannot use more than one escape character');
      }

      escapeChar = XRegExp.escape(escapeChar); // Example of concatenated `esc` regex:
      // `escapeChar`: '%'
      // `left`: '<'
      // `right`: '>'
      // Regex is: /(?:%[\S\s]|(?:(?!<|>)[^%])+)+/

      esc = new RegExp((0, _concat["default"])(_context = (0, _concat["default"])(_context2 = "(?:".concat(escapeChar, "[\\S\\s]|(?:(?!")).call(_context2, // Using `XRegExp.union` safely rewrites backreferences in `left` and `right`.
      // Intentionally not passing `basicFlags` to `XRegExp.union` since any syntax
      // transformation resulting from those flags was already applied to `left` and
      // `right` when they were passed through the XRegExp constructor above.
      XRegExp.union([left, right], '', {
        conjunction: 'or'
      }).source, ")[^")).call(_context, escapeChar, "])+)+"), // Flags `dgy` not needed here
      flags.replace(XRegExp._hasNativeFlag('s') ? /[^imsu]/g : /[^imu]/g, ''));
    }

    var openTokens = 0;
    var delimStart = 0;
    var delimEnd = 0;
    var lastOuterEnd = 0;
    var outerStart;
    var innerStart;
    var leftMatch;
    var rightMatch;
    var vN = options.valueNames;
    var output = [];

    while (true) {
      // If using an escape character, advance to the delimiter's next starting position,
      // skipping any escaped characters in between
      if (escapeChar) {
        delimEnd += (XRegExp.exec(str, esc, delimEnd, 'sticky') || [''])[0].length;
      }

      leftMatch = XRegExp.exec(str, left, delimEnd);
      rightMatch = XRegExp.exec(str, right, delimEnd); // Keep the leftmost match only

      if (leftMatch && rightMatch) {
        if (leftMatch.index <= rightMatch.index) {
          rightMatch = null;
        } else {
          leftMatch = null;
        }
      } // Paths (LM: leftMatch, RM: rightMatch, OT: openTokens):
      // LM | RM | OT | Result
      // 1  | 0  | 1  | loop
      // 1  | 0  | 0  | loop
      // 0  | 1  | 1  | loop
      // 0  | 1  | 0  | throw
      // 0  | 0  | 1  | throw
      // 0  | 0  | 0  | break
      // The paths above don't include the sticky mode special case. The loop ends after the
      // first completed match if not `global`.


      if (leftMatch || rightMatch) {
        delimStart = (leftMatch || rightMatch).index;
        delimEnd = delimStart + (leftMatch || rightMatch)[0].length;
      } else if (!openTokens) {
        break;
      }

      if (sticky && !openTokens && delimStart > lastOuterEnd) {
        break;
      }

      if (leftMatch) {
        if (!openTokens) {
          outerStart = delimStart;
          innerStart = delimEnd;
        }

        openTokens += 1;
      } else if (rightMatch && openTokens) {
        openTokens -= 1;

        if (!openTokens) {
          if (vN) {
            if (vN[0] && outerStart > lastOuterEnd) {
              output.push(row(vN[0], (0, _slice["default"])(str).call(str, lastOuterEnd, outerStart), lastOuterEnd, outerStart));
            }

            if (vN[1]) {
              output.push(row(vN[1], (0, _slice["default"])(str).call(str, outerStart, innerStart), outerStart, innerStart));
            }

            if (vN[2]) {
              output.push(row(vN[2], (0, _slice["default"])(str).call(str, innerStart, delimStart), innerStart, delimStart));
            }

            if (vN[3]) {
              output.push(row(vN[3], (0, _slice["default"])(str).call(str, delimStart, delimEnd), delimStart, delimEnd));
            }
          } else {
            output.push((0, _slice["default"])(str).call(str, innerStart, delimStart));
          }

          lastOuterEnd = delimEnd;

          if (!global) {
            break;
          }
        } // Found unbalanced delimiter

      } else {
        var unbalanced = options.unbalanced || 'error';

        if (unbalanced === 'skip' || unbalanced === 'skip-lazy') {
          if (rightMatch) {
            rightMatch = null; // No `leftMatch` for unbalanced left delimiter because we've reached the string end
          } else {
            if (unbalanced === 'skip') {
              var outerStartDelimLength = XRegExp.exec(str, left, outerStart, 'sticky')[0].length;
              delimEnd = outerStart + (outerStartDelimLength || 1);
            } else {
              delimEnd = outerStart + 1;
            }

            openTokens = 0;
          }
        } else if (unbalanced === 'error') {
          var _context3;

          var delimSide = rightMatch ? 'right' : 'left';
          var errorPos = rightMatch ? delimStart : outerStart;
          throw new Error((0, _concat["default"])(_context3 = "Unbalanced ".concat(delimSide, " delimiter found in string at position ")).call(_context3, errorPos));
        } else {
          throw new Error("Unsupported value for unbalanced: ".concat(unbalanced));
        }
      } // If the delimiter matched an empty string, avoid an infinite loop


      if (delimStart === delimEnd) {
        delimEnd += 1;
      }
    }

    if (global && output.length > 0 && !sticky && vN && vN[0] && str.length > lastOuterEnd) {
      output.push(row(vN[0], (0, _slice["default"])(str).call(str, lastOuterEnd), lastOuterEnd, str.length));
    }

    return output;
  };
};

exports["default"] = _default;
module.exports = exports.default;