'use strict';

var cssTree = require('css-tree');

const OPENING_PARENTHESIS = '(';
const CLOSING_PARENTHESIS = ')';
const SPACE = ' ';
const ESCAPE = '\\';
const DOUBLE_QUOTE = '"';

/**
 * CSSTree syntax extension fork for "Adblock Extended CSS" syntax.
 *
 * ! DURING DEVELOPMENT, PLEASE DO NOT DIFFER FROM THE ORIGINAL CSSTREE API
 * ! IN ANY WAY!
 * ! OUR PRIMARY GOAL IS TO KEEP THE API AS CLOSE AS POSSIBLE TO THE ORIGINAL
 * ! CSSTREE API, SO CSSTREE EASILY CAN BE REPLACED WITH ECSSTREE EVERYWHERE
 * ! ANY TIME.
 *
 * This library supports various Extended CSS language elements from
 * - AdGuard,
 * - uBlock Origin and
 * - Adblock Plus.
 *
 * @see {@link https://github.com/AdguardTeam/ExtendedCss}
 * @see {@link https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters}
 * @see {@link https://help.adblockplus.org/hc/en-us/articles/360062733293#elemhide-emulation}
 */

const selector = {
    /**
     * CSSTree logic for parsing a selector from the token stream.
     * Via "this" we can access the parser's internal context, eg.
     * methods, token stream, etc.
     *
     * Idea comes from CSSTree source code
     *
     * @returns Doubly linked list which contains the parsed selector node
     * @throws If parsing not possible
     * @see {@link https://github.com/csstree/csstree/blob/master/lib/syntax/pseudo/index.js}
     */
    parse() {
        return this.createSingleNodeList(this.Selector());
    },
};

const selectorList = {
    /**
     * CSSTree logic for parsing a selector list from the token stream.
     * Via "this" we can access the parser's internal context, eg.
     * methods, token stream, etc.
     *
     * Idea comes from CSSTree source code
     *
     * @returns Doubly linked list which contains the parsed selector list node
     * @throws If parsing not possible
     * @see {@link https://github.com/csstree/csstree/blob/master/lib/syntax/pseudo/index.js}
     */
    parse() {
        return this.createSingleNodeList(this.SelectorList());
    },
};

const mediaQueryList = {
    /**
     * CSSTree logic for parsing a media query list from the token stream.
     * Via "this" we can access the parser's internal context, eg.
     * methods, token stream, etc.
     *
     * Idea comes from CSSTree source code
     *
     * @returns Doubly linked list which contains the parsed media query list node
     * @throws If parsing not possible
     * @see {@link https://github.com/csstree/csstree/blob/master/lib/syntax/pseudo/index.js}
     */
    parse() {
        return this.createSingleNodeList(this.MediaQueryList());
    },
};

const numberOrSelector = {
    /**
     * CSSTree logic for parsing a number or a selector from the token
     * stream.
     * Via "this" we can access the parser's internal context, eg.
     * methods, token stream, etc.
     *
     * Idea comes from CSSTree source code
     *
     * @returns Doubly linked list which contains the parsed number or selector node
     * @throws If parsing not possible
     * @see {@link https://github.com/csstree/csstree/blob/master/lib/syntax/pseudo/index.js}
     */
    parse() {
        // Save the current token index
        const startToken = this.tokenIndex;

        // Don't use "parseWithFallback" here, because we don't want to
        // throw parsing error, if just the number parsing fails.
        try {
            // Try to parse :upward()'s argument as a number, but if it fails,
            // that's not a problem, because we can try to parse it as a selector.
            return this.createSingleNodeList(this.Number.call(this));
        } catch (error) {
            // If the number parsing fails, then we try to parse a selector.
            // If the selector parsing fails, then an error will be thrown,
            // because the argument is invalid.
            return this.createSingleNodeList(this.Selector.call(this, startToken));
        }
    },
};

const number = {
    /**
     * CSSTree logic for parsing a number from the token stream.
     * Via "this" we can access the parser's internal context, eg.
     * methods, token stream, etc.
     *
     * Idea comes from CSSTree source code
     *
     * @returns Doubly linked list which contains the parsed number node
     * @throws If parsing not possible
     * @see {@link https://github.com/csstree/csstree/blob/master/lib/syntax/pseudo/index.js}
     */
    parse() {
        return this.createSingleNodeList(this.Number());
    },
};

const style = {
    /**
     * ECSSTree logic for parsing uBO's style from the token stream.
     * Via "this" we can access the parser's internal context, eg.
     * methods, token stream, etc.
     *
     * @returns Doubly linked list which contains the parsed declaration list node
     * @throws If parsing not possible
     */
    parse() {
        // Throw an error if the current token is not a left parenthesis,
        // which means that the style is not specified at all.
        if (this.tokenType === cssTree.tokenTypes.RightParenthesis) {
            this.error('No style specified');
        }

        // Prepare a doubly linked list for children
        const children = this.createList();

        // Get the current token's balance from the token stream. Balance pair map
        // lets us to determine when the current function ends.
        const balance = this.balance[this.tokenIndex];

        // In order to avoid infinite loop we also need to track the current token index
        while (this.balance[this.tokenIndex] === balance && this.tokenIndex < this.tokenCount) {
            switch (this.tokenType) {
                // Skip whitespaces, comments and semicolons, which are actually not needed
                // here
                case cssTree.tokenTypes.WhiteSpace:
                case cssTree.tokenTypes.Comment:
                case cssTree.tokenTypes.Semicolon:
                    // Jump to the next token
                    this.next();
                    break;

                // At this point we can assume that we have a declaration, so it's time to parse it
                default:
                    children.push(
                        // Parse declaration with fallback to Raw node
                        // We need arrow function here, because we need to use the current parser
                        // context via "this" keyword, but regular functions will have their own
                        // context, that breaks the logic.

                        // eslint-disable-next-line arrow-body-style
                        this.parseWithFallback(this.Declaration, (startToken) => {
                            // Parse until the next semicolon (this handles if we have multiple declarations in
                            // the same style, so we not parse all of them as a single Raw rule because of this)
                            return this.Raw(startToken, this.consumeUntilSemicolonIncluded, true);
                        }),
                    );
            }
        }

        // Create a DeclarationList node and pass the children to it
        // You can find the structure of the node in the CSSTree documentation:
        // https://github.com/csstree/csstree/blob/master/docs/ast.md#declarationlist
        const declarationList = {
            type: 'DeclarationList',
            // CSSTree will handle position calculation for us
            loc: this.getLocationFromList(children),
            children,
        };

        // Return the previously created CSSTree-compatible node
        return this.createSingleNodeList(declarationList);
    },
};

const genericExtCssPseudo = {
    /**
     * ECSSTree logic for parsing :contains(), :has-text(), :-abp-contains(), :matches-css(),
     * :matches-css-after(), :matches-css-before() and similar pseudo-classes from the token stream.
     *
     * Via "this" we can access the parser's internal context, eg. methods, token stream, etc.
     *
     * Adblock Extended CSS allows using quote marks,  parentheses as unquoted argument in
     * :contains() and similar pseudo-classes, and the default CSSTree logic may not work
     * correctly in some cases, because it is a bit tricky to parse such pseudo-classes.
     *
     * Here is an example. Let's assume that the input is
     * ```css
     * :contains(aaa'bbb)
     * ```
     *
     * The tokenizer will tokenize it as
     *  :               colon-token
     *  contains(       function-token
     *  aaa             ident-token
     *  'bbb)           string-token
     *
     * At quote mark (') tokenizer will think that a string is starting, and it tokenizes
     * the rest of the input as a string. This is the normal behavior for the tokenizer, but
     * it is wrong for us, since the parser will fail with an ")" is expected error, because
     * it cannot find the closing balance pair for the opening parenthesis. So, we need to
     * fix the token stream here to avoid this error.
     *
     * @returns Doubly linked list which contains the parsed :contains() argument as a Raw node
     * @throws If parsing not possible
     */
    parse() {
        // Get the current token stream from the parser's context
        const tokens = this.dump();

        // Note: CSSTree removes the whitespace token after the function name before calling this function
        // So if we have :contains(  something), our tokenIndex here points to "something" and not to the
        // whitespace token.
        // eslint-disable-next-line max-len
        // See: https://github.com/csstree/csstree/blob/612cc5f2922b2304869497d165a0cc65257f7a8b/lib/syntax/node/PseudoClassSelector.js#L31-L34

        // In the case of :contains(), these whitespaces are matter.

        // :contains() case, but not :contains( ) or :contains( something) case, so we check if the previous token is
        // not a whitespace
        if (this.tokenType === cssTree.tokenTypes.RightParenthesis && tokens[this.tokenIndex - 1].type !== 'whitespace-token') {
            this.error('Empty parameter specified');
        }

        // Find the "real" start position of the :contains() function's argument which is includes
        // possible whitespace tokens
        let startPosition = -1;

        // Save the current position within the token stream (we will need to restore it later,
        // after re-tokenizing the input, to restore the parser's state)
        let prevTokenIndex = this.tokenIndex;

        // Iterate over the token stream from the current position to the beginning
        for (let i = this.tokenIndex - 1; i >= 0; i -= 1) {
            // Since this parsing function will be called, we definitely have a function token before
            if (tokens[i].type === 'function-token') {
                // Find the first token of the :contains() function's argument, which
                // is the next token after the function token (i + 1)
                startPosition = this.getTokenStart(i + 1);
                prevTokenIndex = i + 1;
                break;
            }
        }

        // Theoretically, this should never happen, because CSSTree only calls this function
        // if it finds a :contains() function, but we check it just in case...
        if (startPosition === -1) {
            this.error("Cannot find the start position of the contains() function's argument");
        }

        // Prepare a doubly linked list for children nodes, but actually we only
        // parse a single raw node
        const children = this.createList();

        // Get the whole source code from the parser's context
        const sourceCode = this.source;

        // Find the real end index of the :contains() function's argument
        let endPosition = -1;

        // Parenthesis balance
        let balance = 0;

        // :contains()'s argument can contain any character, such as parentheses, quotes...
        // so a bit tricky to find the end position of this pseudo-class
        for (let i = startPosition; i < sourceCode.length; i += 1) {
            const char = sourceCode[i];

            if (char === OPENING_PARENTHESIS && sourceCode[i - 1] !== ESCAPE) {
                // If we find an unescaped opening parenthesis, we increase the balance
                balance += 1;
            } else if (char === CLOSING_PARENTHESIS && sourceCode[i - 1] !== ESCAPE) {
                // If we find an unescaped closing parenthesis, we decrease the balance
                balance -= 1;

                // If the balance is -1, it means that we found the closing parenthesis of the
                // :contains() function's argument, because it breaks the balance
                if (balance === -1) {
                    endPosition = i;
                    break;
                }
            }
        }

        // If we cannot find the closing parenthesis, we cannot fix the token stream, so we
        // just return the children list as is. In this case, the parser will fail with an
        // error about the missing closing parenthesis, which is correct behavior in this case.
        if (endPosition === -1) {
            return children;
        }

        // Empty parameter
        if (endPosition === startPosition) {
            this.error('No parameter specified for "contains()" pseudo-class');
        }

        // Create a raw node with the :contains() function's argument (get it from the source code)
        // See https://github.com/csstree/csstree/blob/master/docs/ast.md#raw
        children.push({
            type: 'Raw',
            // CSSTree will store positions, if "positions" option is enabled in the parser options
            // (it is disabled by default)
            loc: this.getLocation(startPosition, endPosition),
            value: sourceCode.substring(startPosition, endPosition),
        });

        // Create a new source code, where fill the :contains() function's argument with whitespaces,
        // but keep the length of the source code the same. This will "fixes" the token stream, so the
        // parser will not fail with an error, and positions also remain the same.
        // So, if we have this input:
        //
        //  div:contains(aa'bb) + a[href^="https://example.com/"]
        //
        // then at this point this transformation will be done as follows:
        //
        //  div:contains(     ) + a[href^="https://example.com/"]
        //
        // In the second source code there are no quote marks that can break the token stream in the
        // first :contains() function's argument, which is necessary to proper re-tokenization.
        const newSourceCode = sourceCode.substring(0, startPosition)
            + new Array(endPosition - startPosition + 1).join(SPACE)
            + sourceCode.substring(endPosition);

        // Modify the parsed source code within the parser's context. This means a re-tokenization,
        // which will "fix" the token stream.
        // Theoretically this "trick" doesn't cause problems, because we parsed the argument of the
        // :contains() function as a Raw node, so we don't need to parse it again, but the parser will
        // continue its work from this point correctly.
        this.setSource(newSourceCode, cssTree.tokenize);

        // Restore the position within the token stream.
        while (this.tokenIndex < prevTokenIndex) {
            this.next();
        }

        // CSSTree will skip inserted whitespaces automatically, so we don't need to do it manually. See:
        // eslint-disable-next-line max-len
        // https://github.com/csstree/csstree/blob/612cc5f2922b2304869497d165a0cc65257f7a8b/lib/syntax/node/PseudoClassSelector.js#L31-L34

        // Return the children list which contains the :contains() function's argument as a Raw node
        return children;
    },
};

const xpath = {
    /**
     * ECSSTree logic for parsing :xpath() pseudo-classes from the token stream. In this case, we
     * should ignore parentheses, if they are inside strings.
     *
     * Via "this" we can access the parser's internal context, eg. methods, token stream, etc.
     *
     * @returns Doubly linked list which contains the parsed :xpath() function's argument as a Raw node
     * @throws If parsing not possible
     */
    parse() {
        // No parameter specified for the pseudo-class, so we throw an error and stop the parsing
        if (this.tokenType === cssTree.tokenTypes.RightParenthesis) {
            this.error('Empty parameter specified');
        }

        // Prepare a doubly linked list for children nodes, but actually we only
        // parse a single raw node
        const children = this.createList();

        // Save the current position within the token stream (we will need to restore it later,
        // after re-tokenizing the input, to restore the parser's state)
        const prevTokenIndex = this.tokenIndex;

        // Get the whole source code from the parser's context
        const sourceCode = this.source;

        // Start position of the argument is the position of the current token
        // (CSSTree drops whitespace before this token, but this is not a problem here)
        const startPosition = this.getTokenStart(this.tokenIndex);

        // Find the index of the pseudo-class's closing parenthesis
        let endPosition = -1;

        // Parentheses balance
        let balance = 0;

        // Whether we are inside a string
        let inString = false;

        // Iterate over the corresponding part of the source code
        for (let i = startPosition; i < sourceCode.length; i += 1) {
            // If we find an unescaped quote mark, we toggle the "inString" flag
            // It is important, because we should omit parentheses inside strings.
            if (sourceCode[i] === DOUBLE_QUOTE && sourceCode[i - 1] !== ESCAPE) {
                inString = !inString;
            }

            // If we are not inside a string, we should check parentheses balance
            if (!inString) {
                if (sourceCode[i] === OPENING_PARENTHESIS && sourceCode[i - 1] !== ESCAPE) {
                    // If we find an unescaped opening parenthesis, we increase the balance
                    balance += 1;
                } else if (sourceCode[i] === CLOSING_PARENTHESIS && sourceCode[i - 1] !== ESCAPE) {
                    // If we find an unescaped closing parenthesis, we decrease the balance
                    balance -= 1;

                    // If the balance is -1, it means that we found the closing parenthesis of the
                    // pseudo-class
                    if (balance === -1) {
                        endPosition = i;
                        break;
                    }
                }
            }
        }

        // If we cannot find the closing parenthesis, we cannot fix the token stream, so we
        // just return the children list as is. In this case, the parser will fail with an
        // error about the missing closing parenthesis, which is correct behavior in this case.
        if (endPosition === -1) {
            return children;
        }

        // Create a raw node with the argument of the pseudo-class (get it from the source code)
        // See https://github.com/csstree/csstree/blob/master/docs/ast.md#raw
        children.push({
            type: 'Raw',
            // CSSTree will store positions, if "positions" option is enabled in the parser options
            // (it is disabled by default)
            loc: this.getLocation(startPosition, endPosition),
            value: sourceCode.substring(startPosition, endPosition),
        });

        // Create a new source code, where fill the argument of the pseudo-class with whitespaces,
        // but keep the length of the source code the same. This will "fixes" the token stream, so the
        // parser will not fail with an error, and positions also remain the same.
        // So, if we have this input:
        //
        //  div:pseudo-class(aa'bb) + a[href^="https://example.com/"]
        //
        // then at this point this transformation will be done as follows:
        //
        //  div:pseudo-class(     ) + a[href^="https://example.com/"]
        //
        // In the second source code there are no quote marks that can break the token stream in the
        // first :pseudo-class() function's argument, which is necessary to proper re-tokenization.
        const newSourceCode = sourceCode.substring(0, startPosition)
            + new Array(endPosition - startPosition + 1).join(SPACE)
            + sourceCode.substring(endPosition);

        // Modify the parsed source code within the parser's context. This means a re-tokenization,
        // which will "fix" the token stream.
        // Theoretically this "trick" doesn't cause problems, because we parsed the argument of the
        // pseudo-class as a Raw node, so we don't need to parse it again, but the parser will
        // continue its work from this point correctly.
        this.setSource(newSourceCode, cssTree.tokenize);

        // Restore the position within the token stream.
        while (this.tokenIndex < prevTokenIndex) {
            this.next();
        }

        // CSSTree will skip inserted whitespaces
        // eslint-disable-next-line max-len
        // https://github.com/csstree/csstree/blob/612cc5f2922b2304869497d165a0cc65257f7a8b/lib/syntax/node/PseudoClassSelector.js#L31-L34

        // Return the children list which contains the pseudo-class's argument as a Raw node
        return children;
    },
};

/**
 * Extended CSS syntax via CSSTree fork API. Thanks for the idea to @lahmatiy!
 *
 * @see {@link https://github.com/csstree/csstree/issues/211#issuecomment-1349732115}
 * @see {@link https://github.com/csstree/csstree/blob/master/lib/syntax/create.js}
 */
const extendedCssSyntax = cssTree.fork({
    pseudo: {
        '-abp-contains': genericExtCssPseudo,
        '-abp-has': selectorList,
        'has-text': genericExtCssPseudo,
        'if-not': selector,
        'matches-css': genericExtCssPseudo,
        'matches-css-after': genericExtCssPseudo,
        'matches-css-before': genericExtCssPseudo,
        'matches-media': mediaQueryList,
        'min-text-length': number,
        'nth-ancestor': number,
        contains: genericExtCssPseudo,
        style,
        upward: numberOrSelector,
        xpath,
    },
});

var name = "@adguard/ecss-tree";
var version$1 = "1.0.8";
var description = "Adblock Extended CSS fork for CSSTree";
var author = "AdGuard Software Ltd. <https://adguard.com>";
var license = "MIT";
var type = "module";
var keywords = [
	"css",
	"ecss",
	"extendedcss",
	"ast",
	"tokenizer",
	"parser",
	"walker",
	"lexer",
	"generator",
	"utils",
	"syntax",
	"validation",
	"adblock",
	"ublock",
	"adguard"
];
var repository = {
	type: "git",
	url: "git+https://github.com/AdguardTeam/ecsstree.git"
};
var bugs = {
	url: "https://github.com/AdguardTeam/ecsstree/issues"
};
var homepage = "https://github.com/AdguardTeam/ecsstree#readme";
var main = "dist/ecsstree.cjs";
var module$1 = "dist/ecsstree.esm.js";
var browser = "dist/ecsstree.iife.js";
var types = "dist/ecsstree.d.ts";
var dependencies = {
	"css-tree": "^2.3.1"
};
var devDependencies = {
	"@babel/core": "^7.20.7",
	"@babel/preset-env": "^7.20.2",
	"@rollup/plugin-alias": "^4.0.2",
	"@rollup/plugin-babel": "^6.0.3",
	"@rollup/plugin-commonjs": "^24.0.0",
	"@rollup/plugin-json": "^6.0.0",
	"@rollup/plugin-node-resolve": "^15.0.1",
	"@rollup/plugin-terser": "^0.2.1",
	"@types/css-tree": "^2.3.0",
	eslint: "^8.34.0",
	"eslint-config-airbnb-base": "^15.0.0",
	"eslint-plugin-import": "^2.27.5",
	husky: "^8.0.0",
	jest: "^29.3.1",
	rollup: "^3.8.1",
	"rollup-plugin-dts": "^5.2.0",
	"rollup-plugin-node-externals": "^5.0.3",
	typescript: "^4.9.5"
};
var scripts = {
	prepare: "husky install",
	lint: "eslint . --cache",
	test: "node --no-warnings --experimental-vm-modules node_modules/jest/bin/jest.js",
	build: "rollup --config rollup.config.js"
};
var pkg = {
	name: name,
	version: version$1,
	description: description,
	author: author,
	license: license,
	type: type,
	keywords: keywords,
	repository: repository,
	bugs: bugs,
	homepage: homepage,
	main: main,
	module: module$1,
	browser: browser,
	types: types,
	dependencies: dependencies,
	devDependencies: devDependencies,
	scripts: scripts
};

var version = pkg.version;

// Export the forked syntax (comes from the Fork API)
const {
    tokenize,
    parse,
    generate,
    lexer,
    createLexer,

    walk,
    find,
    findLast,
    findAll,

    toPlainObject,
    fromPlainObject,

    fork,
} = extendedCssSyntax;

Object.defineProperty(exports, 'Lexer', {
    enumerable: true,
    get: function () { return cssTree.Lexer; }
});
Object.defineProperty(exports, 'List', {
    enumerable: true,
    get: function () { return cssTree.List; }
});
Object.defineProperty(exports, 'TokenStream', {
    enumerable: true,
    get: function () { return cssTree.TokenStream; }
});
Object.defineProperty(exports, 'clone', {
    enumerable: true,
    get: function () { return cssTree.clone; }
});
Object.defineProperty(exports, 'createSyntax', {
    enumerable: true,
    get: function () { return cssTree.createSyntax; }
});
Object.defineProperty(exports, 'definitionSyntax', {
    enumerable: true,
    get: function () { return cssTree.definitionSyntax; }
});
Object.defineProperty(exports, 'ident', {
    enumerable: true,
    get: function () { return cssTree.ident; }
});
Object.defineProperty(exports, 'string', {
    enumerable: true,
    get: function () { return cssTree.string; }
});
Object.defineProperty(exports, 'tokenNames', {
    enumerable: true,
    get: function () { return cssTree.tokenNames; }
});
Object.defineProperty(exports, 'tokenTypes', {
    enumerable: true,
    get: function () { return cssTree.tokenTypes; }
});
Object.defineProperty(exports, 'url', {
    enumerable: true,
    get: function () { return cssTree.url; }
});
exports.createLexer = createLexer;
exports.find = find;
exports.findAll = findAll;
exports.findLast = findLast;
exports.fork = fork;
exports.fromPlainObject = fromPlainObject;
exports.generate = generate;
exports.lexer = lexer;
exports.parse = parse;
exports.toPlainObject = toPlainObject;
exports.tokenize = tokenize;
exports.version = version;
exports.walk = walk;
