# ECSSTree Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.8] - 2022-02-27

### Added

- Support for `:matches-css-after(raw)` pseudo class [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectmatches-css-afterarg)
- Support for `:matches-css-before(raw)` pseudo class [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectmatches-css-beforearg)
- Support for `:matches-css(raw)` pseudo class [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-matches-css), [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectmatches-cssarg)

### Fixed

- Readme typos

## [1.0.7] - 2022-02-22

### Fixed

- False positive parsing errors when using `:upward` pseudo class: https://github.com/AdguardTeam/ecsstree/pull/8

## [1.0.6] - 2022-02-21

### Added
- Import types from `@types/css-tree`
- Small example project in TypeScript
- Integrate ESLint, some code style improvements

### Fixed
- Remove Node warnings when running tests

### Changed
- Exclude some unnecessary files from NPM release
- Move package under `AdguardTeam` organization

## [1.0.4] - 2022-02-19

### Changed
- Browser builds now ends with `.min.js`
- README improvements

## [1.0.3] - 2022-02-19

### Fixed
- Minor optimizations, README improvements

## [1.0.2] - 2022-02-18

### Fixed
- Change `:-abp-has` to selector list instead of selector

## [1.0.1] - 2022-02-18

### Fixed
- Improved `:contains` (and `:-abp-contains` & `:has-text`) pseudo class parsing, handle parenthesis / function calls in the parameter

## [1.0.0] - 2022-02-18

### Added
- Initial version of the library
- Support for `:-abp-contains(text / regexp)` pseudo class [[ABP reference]](https://help.adblockplus.org/hc/en-us/articles/360062733293#elemhide_css)
- Support for `:-abp-has(selector)` pseudo class [[ABP reference]](https://help.adblockplus.org/hc/en-us/articles/360062733293#elemhide_css)
- Support for `:contains(text / regexp)` pseudo class [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-contains)
- Support for `:has-text(text / regexp)` pseudo class [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjecthas-textneedle)
- Support for `:if-not(selector)` pseudo class [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-if-not)
- Support for `:matches-media(media query list)` pseudo class [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectmatches-mediaarg)
- Support for `:min-text-length(number)` pseudo class [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectmin-text-lengthn)
- Support for `:nth-ancestor(number)` pseudo class [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-nth-ancestor)
- Support for `:style(style declaration list)` pseudo class [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#subjectstylearg)
- Support for `:upward(selector / number)` pseudo class [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#extended-css-upward), [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectupwardarg)
- Support for `:xpath(xpath expression)` pseudo class [[ADG reference]](https://github.com/AdguardTeam/ExtendedCss#-pseudo-class-xpath), [[uBO reference]](https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters#subjectxpatharg)
