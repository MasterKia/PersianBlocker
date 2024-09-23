<img align="right" width="111" height="111"
     alt="CSSTree logo"
     src="https://raw.githubusercontent.com/csstree/csstree/master/assets/csstree-logo-rounded.svg"/>
     
# ECSSTree

[![NPM version](https://img.shields.io/npm/v/@adguard/ecss-tree.svg)](https://www.npmjs.com/package/@adguard/ecss-tree)
[![NPM Downloads](https://img.shields.io/npm/dm/@adguard/ecss-tree.svg)](https://www.npmjs.com/package/@adguard/ecss-tree)
[![LICENSE](https://img.shields.io/github/license/AdguardTeam/ecsstree)](https://github.com/AdguardTeam/ecsstree/blob/main/LICENSE)

Adblock Extended CSS supplement for [CSSTree](https://github.com/csstree/csstree). Our primary goal is to change the internal behavior of the CSSTree parser to support Extended CSS (ECSS) language elements, but we don't change the API or the AST structure. Therefore ECSSTree fully backwards compatible with CSSTree, so you can pass our AST to CSSTree functions and vice versa without any problems.

> :warning: **Note:** If you are looking for a library that can parse CSS, but you don't know what is Adblock or Extended CSS, you should probably use [CSSTree](https://github.com/csstree/csstree) instead of this library :)

## Table of contents

- [ECSSTree](#ecsstree)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Supported Extended CSS elements](#supported-extended-css-elements)
  - [Motivation](#motivation)
    - [Advanced validation](#advanced-validation)
  - [Handle problematic cases](#handle-problematic-cases)
  - [Examples](#examples)
  - [Using in browser](#using-in-browser)
  - [Reporting problems / Requesting features](#reporting-problems--requesting-features)
  - [Development \& Contributing](#development--contributing)
    - [Development commands](#development-commands)
    - [Releasing a new version](#releasing-a-new-version)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)
  - [References](#references)

## Installation

You can install the library using one of the following methods:

- Using NPM:
  ```bash
  npm install @adguard/ecss-tree
  ```
- Using Yarn:
  ```bash
  yarn add @adguard/ecss-tree
  ```

Links:
- NPM package: https://www.npmjs.com/package/@adguard/ecss-tree
- JSDelivr CDN: https://www.jsdelivr.com/package/npm/@adguard/ecss-tree

## Supported Extended CSS elements

Currently, the following Extended CSS pseudo classes are supported:

- `:-abp-contains(raw)`: [[ABP reference]](https://help.adblockplus.org/hc/en-us/articles/360062733293#elemhide_css)
- `:-abp-has(selector list)`: [[ABP reference]](https://help.adblockplus.org/hc/en-us/articles/360062733293#elemhide_css)
- `:contains(raw)`: [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-contains)
- `:has-text(raw)`: [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjecthas-textneedle)
- `:if-not(selector)`: [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-if-not)
- `:matches-css-after(raw)`: [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectmatches-css-afterarg)
- `:matches-css-before(raw)`: [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectmatches-css-beforearg)
- `:matches-css(raw)`: [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-matches-css), [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectmatches-cssarg)
- `:matches-media(media query list)`: [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectmatches-mediaarg)
- `:min-text-length(number)`: [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectmin-text-lengthn)
- `:nth-ancestor(number)`: [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-nth-ancestor)
- `:style(declaration list)`: [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#subjectstylearg)
- `:upward(selector / number)`: [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-upward), [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectupwardarg)
- `:xpath(raw)`: [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#-pseudo-class-xpath), [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectxpatharg)

In addition, CSSTree supports the following pseudo classes [by default](https://github.com/csstree/csstree/blob/master/lib/syntax/pseudo/index.js):
- `:has(selector list)`: [[W3C reference]](https://drafts.csswg.org/selectors-4/#has-pseudo), [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-has), [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjecthasarg)
- `:not(selector list)`: [[W3C reference]](https://drafts.csswg.org/selectors-4/#negation-pseudo), [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-not), [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectnotarg)
- `:is(selector list)`: [[W3C reference]](https://drafts.csswg.org/selectors-4/#is-pseudo), [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-is)

Also, CSSTree supports legacy Extended CSS elements by default (attribute selectors): `[-ext-name="value"]`, where `name` is the name of the Extended CSS element and `value` is its value. For example, the following selector can be parsed by CSSTree:
```css
[-ext-has="selector list"]
```

If a pseudo class is unknown to CSSTree, it tries to parse it as a `Raw` element (if possible - see [problematic cases](https://github.com/AdguardTeam/ecsstree#handle-problematic-cases)).

The CSSTree library itself is quite flexible and error-tolerant, so it basically manages well the Extended CSS elements that are not (yet) included here.

## Motivation

For example, the following selector
```css
div:-abp-has(> section)
```
will be parsed by the default CSSTree as follows
```json
{
    "type": "Selector",
    "loc": null,
    "children": [
        {
            "type": "PseudoClassSelector",
            "loc": null,
            "name": "-abp-has",
            "children": [
                {
                    "type": "Raw",
                    "loc": null,
                    "value": "> section"
                }
            ]
        }
    ]
}
```

The problem with this is that the `-abp-has` parameter is parsed as `Raw`, not as a `Selector`, since `-abp-has` is an unknown pseudo class in CSS / CSSTree.

This is where the ECSSTree library comes into play. It detects that `-abp-has` expects a selector as a parameter, i.e. it parses the passed parameter as a `Selector`. This means that the selector above will be parsed as follows:
```json
{
    "type": "Selector",
    "loc": null,
    "children": [
        {
            "type": "PseudoClassSelector",
            "loc": null,
            "name": "-abp-has",
            "children": [
                {
                    "type": "Selector",
                    "loc": null,
                    "children": [
                        {
                            "type": "Combinator",
                            "loc": null,
                            "name": ">"
                        },
                        {
                            "type": "TypeSelector",
                            "loc": null,
                            "name": "section"
                        }
                    ]
                }
            ]
        }
    ]
}
```

`Combinator` and similar Nodes are part of CSSTree, this fork simply specifies that the `-abp-has` parameter should be parsed as a selector. The nodes themselves are part of the CSSTree.

### Advanced validation

In addition, this approach enables a more advanced validation. For example, the default CSSTree does not throw an error when parsing the following selector:
```css
div:-abp-has(42)
```
since it doesn't know what `-abp-has` is, it simply parses 42 as `Raw`. ECSSTree parses the parameter as a selector, which will throw an error, since 42 is simply an invalid selector.

## Handle problematic cases

The library also handles problematic selectors, such as the following:
```css
div:contains(aaa'bbb)
```

This selector doesn't fully meet with CSS standards, so even if CSSTree is flexible, it will not be able to parse it properly, because it will tokenize it as follows:

| Token type | Start index | End index | Source part |
| --- | --- | --- | --- |
| ident-token | 0 | 3 | div
| colon-token | 3 | 4 | :
| function-token | 4 | 13 | contains(
| ident-token | 13 | 16 | aaa
| string-token | 16 | 21 | 'bbb)

At quote mark (`'`) tokenizer will think that a string is starting, and it tokenizes the rest of the input as a string. This is the normal behavior for the tokenizer, but it is wrong for us, since the parser will fail with an `")" is expected` error, as it doesn't found the closing parenthesis, since it thinks that the string is still open.

ECSSTree will handle this case by a special re-tokenization algorithm during the parsing process, when parser reaches this problematic point. This way, ECSSTree's parser will be able to parse this selector properly. It is also true for `xpath`.

*Note:* ECSSTree parses `:contains` and `:xpath` parameters as `Raw`. The main goal of this library is changing the internal behavior of the CSSTree's parser to make it able to parse the Extended CSS selectors properly, not to change the AST itself. The AST should be the same as in CSSTree, so that the library can be used as a drop-in replacement for CSSTree. Parsing `:xpath` expressions or regular expressions in detail would be a huge task, and requires new AST nodes, which would be a breaking change. But it always parses the correct raw expression for you, so you can parse/validate these expressions yourself if you want. There are many libraries for this, such as [xpath](https://www.npmjs.com/package/xpath) or [regexpp](https://www.npmjs.com/package/regexpp). See [example codes](/examples) for more details.

## Examples

Here are a very simple example to show how to use ECSSTree:

```javascript
const { parse, generate, toPlainObject, fromPlainObject } = require("@adguard/ecss-tree");
const { inspect } = require("util");

// Some inputs to test
const inputs = [
    // Valid selectors
    `div:-abp-has(> .some-class > a[href^="https://example.com"])`,
    `body:style(padding-top: 0 !important;):matches-media((min-width: 500px) and (max-width: 1000px))`,
    `section:upward(2):contains(aaa'bbb):xpath(//*[contains(text(),"()(cc")])`,

    // Missing closing bracket at the end
    `div:-abp-has(> .some-class > a[href^="https://example.com"]`,
];

// Iterate over inputs
for (const input of inputs) {
    try {
        // Parse raw input to AST. This will throw an error if the input is not valid.
        // Don't forget to set context to 'selector', because CSSTree will try to parse
        // 'stylesheet' by default.
        const ast = parse(input, { context: "selector" });

        // By default, AST uses a doubly linked list. To convert it to plain object, you can
        // use toPlainObject() function.
        // If you want to convert AST back to doubly linked list version, you can use
        // fromPlainObject() function.
        const astPlain = toPlainObject(ast);
        const astAgain = fromPlainObject(astPlain);

        // Print AST to console
        console.log(inspect(astPlain, { colors: true, depth: null }));

        // You can also generate string from AST (don't use plain object here)
        console.log(generate(astAgain));
    } catch (e) {
        // Mark invalid selector
        console.log(`Invalid selector: ${input}`);

        // Show CSSTree's formatted error message
        console.log(e.formattedMessage);
    }
}
```

The API is the same as in CSSTree, so you can use the [CSSTree documentation](https://github.com/csstree/csstree/tree/master/docs) as a reference.

You can find more examples in the [examples](/examples) folder.

## Using in browser

Our build process generates a browser-friendly version of the library, which can be used in the browser. You can insert it into your HTML page like this:

```html
<script src="https://cdn.jsdelivr.net/npm/@adguard/ecss-tree/dist/ecsstree.iife.min.js"></script>
```

or

```html
<script src="https://unpkg.com/@adguard/ecss-tree@latest/dist/ecsstree.iife.min.js"></script>
```

Example usage:

```html
<script>
    // Selector to parse
    const selector = `div[title="Hello world!"]`;

    // Double linked list version of AST
    const ast = ECSSTree.parse(selector, { context: "selector" });

    // Plain object version of AST
    const plain = ECSSTree.toPlainObject(ast);

    // Print AST object to console
    console.log(plain);
</script>
```

## Reporting problems / Requesting features

If you find a bug or want to request a new feature, please open an issue or a discussion on GitHub. Please provide a detailed description of the problem or the feature you want to request, and if possible, a code example that demonstrates the problem or the feature.

## Development & Contributing

You can contribute to the project by opening a pull request. People who contribute to AdGuard projects can receive various rewards, see [this page](https://adguard.com/contribute.html) for details.

Here is a short guide on how to set up the development environment and how to submit your changes:

- Pre-requisites: [Node.js](https://nodejs.org/en/) (v14 or higher), [Yarn](https://yarnpkg.com/) (v2 or higher), [Git](https://git-scm.com/), [VSCode](https://code.visualstudio.com/) (optional)
- Clone the repository with `git clone`
- Install dependencies with `yarn` (this will also initialize the Git hooks via Husky)
- Create a new branch with `git checkout -b <branch-name>`. Example: `git checkout -b feature/add-some-feature`. Please add `feature/` or `fix/` prefix to your branch name, and refer to the issue number if there is one. Example: `fix/42`.
- Make your changes in the `src` folder and make suitable tests for them in the `test` folder
- **Please do NOT differ from the original CSSTree API!** Our primary goal is to keep the API as close as possible to the original CSSTree, so that it is easy to switch between the two libraries, if needed. We only improve the "internal logic" of the library to make it able to parse Extended CSS selectors, but the API should be the same!
- Check code by running `yarn lint` and `yarn test` commands (during development, you can run only a specific test with `yarn test <test-name>`)
- Build the library with `yarn build` and check the `dist` folder to make sure that the build is successful, then install the library locally with `yarn add <path-to-local-library>` and test it in your project
- If everything is OK, commit your changes and push them to your forked repository. If Husky is set up correctly, it don't allow you to commit if the linter or tests fail.
- Create a pull request to the main repository from your forked repository's branch.

We would be happy to review your pull request and merge it if it is suitable for the project.

*Note:* you can find CSSTree API map here: https://github.com/csstree/csstree#top-level-api

### Development commands

During development, you can use the following commands (listed in `package.json`):

- `yarn lint` - lint the code with [ESLint](https://eslint.org/)
- `yarn test` - run tests with [Jest](https://jestjs.io/) (you can also run a specific test with `yarn test <test-name>`)
- `yarn build` - build the library to the `dist` folder by using [Rollup](https://rollupjs.org/)

### Releasing a new version

This section describes the release process for the new versions of the ECSSTree library. This process needs to be performed by maintainers only.

1. Create a new branch for the release (e.g. `release/v1.0.0`) from the `main` branch.
2. Fill the `CHANGELOG.md` file with the changes made since the last release by following the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) rules, then commit changes as `Update changelog`.
3. Update the version number in the `package.json` file regarding the [semver](https://semver.org/) rules, then commit changes as `Bump version to v1.0.0`.
4. Create a new pull request to the `main` branch from the release branch, and merge it after the review.
5. Create a new tag with the version number (e.g. `v1.0.0`) to trigger the [release workflow](https://github.com/AdguardTeam/ecsstree/blob/main/.github/workflows/publish.yml).
6. The release workflow will automatically publish the new version to the [npm registry](https://www.npmjs.com/package/@adguard/ecss-tree).

## License

This library is licensed under the MIT license. See the [LICENSE](https://github.com/AdguardTeam/ecsstree/blob/main/LICENSE) file for more info.

## Acknowledgements

In this section, we would like to thank the following people for their work:

- Roman Dvornov ([lahmatiy](https://github.com/lahmatiy)) for creating and maintaining the [CSSTree](https://github.com/csstree/csstree) library

## References

Here are some useful links to learn more about Extended CSS selectors:

- CSSTree docs: https://github.com/csstree/csstree/tree/master/docs
- AdGuard *ExtendedCSS*: https://github.com/AdguardTeam/ExtendedCss
- uBlock *"Procedural cosmetic filters"*: https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters
- Adblock Plus *ExtendedCSS*: https://help.adblockplus.org/hc/en-us/articles/360062733293#elemhide-emulation
