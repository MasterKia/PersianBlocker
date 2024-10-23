<!-- markdownlint-disable -->
&nbsp;
<p align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://cdn.adtidy.org/website/github.com/AGTree/agtree_darkmode.svg" />
        <img alt="AGTree" src="https://cdn.adtidy.org/website/github.com/AGTree/agtree_lightmode.svg" width="350px" />
    </picture>
</p>
<h3 align="center">Universal adblock filter list parser</h3>
<p align="center">Supported syntaxes:</p>
<p align="center">
    <a href="https://adguard.com">
        <img src="https://cdn.adguard.com/website/github.com/AGLint/adg_logo.svg" width="14px" />
        AdGuard
    </a>
    |
    <a href="https://github.com/gorhill/uBlock">
        <img src="https://cdn.adguard.com/website/github.com/AGLint/ubo_logo.svg" width="14px" />
        uBlock Origin
    </a>
    |
    <a href="https://getadblock.com">
        <img src="https://cdn.adguard.com/website/github.com/AGLint/ab_logo.svg" width="14px" />
        AdBlock
    </a>
    |
    <a href="https://adblockplus.org">
        <img src="https://cdn.adguard.com/website/github.com/AGLint/abp_logo.svg" width="14px" />
        Adblock Plus
    </a>
</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@adguard/agtree">
        <img src="https://img.shields.io/npm/v/@adguard/agtree" alt="NPM version" />
    </a>
    <a href="https://www.npmjs.com/package/@adguard/agtree">
        <img src="https://img.shields.io/npm/dm/@adguard/agtree" alt="NPM Downloads" />
    </a>
    <a href="https://github.com/AdguardTeam/tsurlfilter/blob/master/packages/agtree/LICENSE">
        <img src="https://img.shields.io/npm/l/@adguard/agtree" alt="License" />
    </a>
</p>
<!-- markdownlint-restore -->

Table of Contents:

- [Introduction](#introduction)
- [Development \& Contribution](#development--contribution)
- [Ideas \& Questions](#ideas--questions)
- [License](#license)
- [References](#references)

## Introduction

AGTree is a universal tool for working with adblock filter lists. It contains the following modules:

- [Adblock rule converter][converter-url]
- [Adblock rule parser][parser-url]
- [Adblock rule validator][validator-url]
- [Compatibility tables][compatibility-tables-url]

AGTree supports all syntaxes currently in use:

- <img src="https://cdn.adguard.com/website/github.com/AGLint/adg_logo.svg" width="14px"> [AdGuard][adg-url]
- <img src="https://cdn.adguard.com/website/github.com/AGLint/ubo_logo.svg" width="14px"> [uBlock Origin][ubo-url]
- <img src="https://cdn.adguard.com/website/github.com/AGLint/abp_logo.svg" width="14px"> [Adblock Plus][abp-url]
- <img src="https://cdn.adguard.com/website/github.com/AGLint/ab_logo.svg" width="14px"> [AdBlock][ab-url]

## Development & Contribution

Please read the [CONTRIBUTING.md][contributing-url] file for details on how to contribute to this project.

## Ideas & Questions

If you have any questions or ideas for new features, please [open an issue][new-issue-url] or a
[discussion][discussions-url]. We will be happy to discuss it with you.

## License

AGTree is licensed under the MIT License. See the [LICENSE][license-url] file for details.

## References

Here are some useful links to help you write adblock rules. This list is not exhaustive, so if you know any other useful
resources, please let us know.

<!--markdownlint-disable MD013-->
- Syntax documentation:
    - <img src="https://cdn.adguard.com/website/github.com/AGLint/adg_logo.svg" width="14px"> [AdGuard: *How to create your own ad filters*][adg-filters]
    - <img src="https://cdn.adguard.com/website/github.com/AGLint/ubo_logo.svg" width="14px"> [uBlock Origin: *Static filter syntax*][ubo-filters]
    - <img src="https://cdn.adguard.com/website/github.com/AGLint/abp_logo.svg" width="14px"> [Adblock Plus: *How to write filters*][abp-filters]
- Extended CSS documentation:
    - [MDN: *CSS selectors*][mdn-css-selectors]
    - <img src="https://cdn.adguard.com/website/github.com/AGLint/adg_logo.svg" width="14px"> [AdGuard: *Extended CSS capabilities*][adg-ext-css]
    - <img src="https://cdn.adguard.com/website/github.com/AGLint/ubo_logo.svg" width="14px"> [uBlock Origin: *Procedural cosmetic filters*][ubo-procedural]
    - <img src="https://cdn.adguard.com/website/github.com/AGLint/abp_logo.svg" width="14px"> [Adblock Plus: *Extended CSS selectors*][abp-ext-css]
- Scriptlets:
    - <img src="https://cdn.adguard.com/website/github.com/AGLint/adg_logo.svg" width="14px"> [AdGuard scriptlets][adg-scriptlets]
    - <img src="https://cdn.adguard.com/website/github.com/AGLint/ubo_logo.svg" width="14px"> [uBlock Origin scriptlets][ubo-scriptlets]
    - <img src="https://cdn.adguard.com/website/github.com/AGLint/abp_logo.svg" width="14px"> [Adblock Plus snippets][abp-snippets]
- Third party libraries:
    - <img src="https://raw.githubusercontent.com/csstree/csstree/master/assets/csstree-logo-rounded.svg" width="14px"> [CSSTree docs][css-tree-docs]
- <img src="https://cdn.adguard.com/website/github.com/AGLint/adg_logo.svg" width="14px"> [AdGuard's compatibility table][adg-compatibility-table]
<!--markdownlint-enable MD013-->

[ab-url]: https://getadblock.com
[abp-ext-css]: https://help.eyeo.com/adblockplus/how-to-write-filters#elemhide-emulation
[abp-filters]: https://help.eyeo.com/adblockplus/how-to-write-filters
[abp-snippets]: https://help.eyeo.com/adblockplus/snippet-filters-tutorial#snippets-ref
[abp-url]: https://adblockplus.org
[adg-compatibility-table]: https://github.com/AdguardTeam/Scriptlets/blob/master/wiki/compatibility-table.md
[adg-ext-css]: https://github.com/AdguardTeam/ExtendedCss/blob/master/README.md
[adg-filters]: https://kb.adguard.com/en/general/how-to-create-your-own-ad-filters
[adg-scriptlets]: https://github.com/AdguardTeam/Scriptlets/blob/master/wiki/about-scriptlets.md#scriptlets
[adg-url]: https://adguard.com
[compatibility-tables-url]: https://github.com/AdguardTeam/tsurlfilter/tree/master/packages/agtree/src/compatibility-tables
[contributing-url]: https://github.com/AdguardTeam/tsurlfilter/tree/master/packages/agtree/CONTRIBUTING.md
[converter-url]: https://github.com/AdguardTeam/tsurlfilter/tree/master/packages/agtree/src/converter
[css-tree-docs]: https://github.com/csstree/csstree/tree/master/docs
[discussions-url]: https://github.com/AdguardTeam/tsurlfilter/discussions
[license-url]: https://github.com/AdguardTeam/tsurlfilter/blob/master/packages/agtree/LICENSE
[mdn-css-selectors]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
[new-issue-url]: https://github.com/AdguardTeam/tsurlfilter/issues/new
[parser-url]: https://github.com/AdguardTeam/tsurlfilter/tree/master/packages/agtree/src/parser
[validator-url]: https://github.com/AdguardTeam/tsurlfilter/tree/master/packages/agtree/src/validator
[ubo-filters]: https://github.com/gorhill/uBlock/wiki/Static-filter-syntax
[ubo-procedural]: https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters
[ubo-scriptlets]: https://github.com/gorhill/uBlock/wiki/Resources-Library#available-general-purpose-scriptlets
[ubo-url]: https://github.com/gorhill/uBlock
