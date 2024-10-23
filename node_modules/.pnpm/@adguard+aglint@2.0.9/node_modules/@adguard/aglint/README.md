<!-- markdownlint-disable -->
&nbsp;
<p align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://cdn.adguard.com/website/github.com/AGLint/aglint_logo_darkmode.svg">
        <img alt="AGLint" src="https://cdn.adguard.com/website/github.com/AGLint/aglint_logo_lightmode.svg" width="350px">
    </picture>
</p>
<h3 align="center">Universal adblock filter list linter.</h3>
<p align="center">
    Supported syntaxes:
</p>
<p align="center">
    <a href="https://adguard.com"><img src="https://cdn.adguard.com/website/github.com/AGLint/adg_logo.svg" width="14px"> AdGuard</a> |
    <a href="https://github.com/gorhill/uBlock"><img src="https://cdn.adguard.com/website/github.com/AGLint/ubo_logo.svg" width="14px"> uBlock Origin</a> |
    <a href="https://getadblock.com"><img src="https://cdn.adguard.com/website/github.com/AGLint/ab_logo.svg" width="14px"> AdBlock</a> |
    <a href="https://adblockplus.org"><img src="https://cdn.adguard.com/website/github.com/AGLint/abp_logo.svg" width="14px"> Adblock Plus</a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@adguard/aglint"><img src="https://img.shields.io/npm/v/@adguard/aglint" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/@adguard/aglint"><img src="https://img.shields.io/npm/dm/@adguard/aglint" alt="NPM Downloads" /></a>
    <a href="https://github.com/AdguardTeam/AGLint/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@adguard/aglint" alt="License" /></a>
</p>
<!-- markdownlint-restore -->

Table of Contents:

- [Introduction](#introduction)
- [Features](#features)
- [Getting started](#getting-started)
    - [Pre-requisites](#pre-requisites)
    - [Installation \& Usage](#installation--usage)
    - [Integrate AGLint into your project](#integrate-aglint-into-your-project)
- [VSCode extension](#vscode-extension)
- [Special comments (inline configuration)](#special-comments-inline-configuration)
    - [Ignore adblock rules](#ignore-adblock-rules)
        - [Ignore single adblock rule](#ignore-single-adblock-rule)
        - [Ignore multiple adblock rules](#ignore-multiple-adblock-rules)
        - [Disable some linter rules](#disable-some-linter-rules)
        - [Change linter rules configuration](#change-linter-rules-configuration)
- [Ignoring files or folders](#ignoring-files-or-folders)
    - [Default ignores](#default-ignores)
- [Configuration](#configuration)
    - [Create a configuration file](#create-a-configuration-file)
    - [Configuration file name and format](#configuration-file-name-and-format)
    - [Configuration file structure](#configuration-file-structure)
    - [Configuration presets](#configuration-presets)
    - [Default configuration file](#default-configuration-file)
    - [Configuration cascading and hierarchy](#configuration-cascading-and-hierarchy)
        - [Why the `root` option is important](#why-the-root-option-is-important)
- [Linter rules](#linter-rules)
    <!-- TODO: maybe should be sorted alphabetically ? -->
    - [`if-closed`](#if-closed)
    - [`single-selector`](#single-selector)
    - [`duplicated-modifiers`](#duplicated-modifiers)
    - [`unknown-preprocessor-directives`](#unknown-preprocessor-directives)
    - [`duplicated-hint-platforms`](#duplicated-hint-platforms)
    - [`duplicated-hints`](#duplicated-hints)
    - [`unknown-hints-and-platforms`](#unknown-hints-and-platforms)
    - [`invalid-domain-list`](#invalid-domain-list)
    - [`invalid-modifiers`](#invalid-modifiers)
    - [`inconsistent-hint-platforms`](#inconsistent-hint-platforms)
    - [`no-short-rules`](#no-short-rules)
- [Compatibility](#compatibility)
- [Use programmatically](#use-programmatically)
- [Development \& Contribution](#development--contribution)
- [Ideas \& Questions](#ideas--questions)
- [License](#license)
- [References](#references)

## Introduction

AGLint is a universal adblock filter list linter. It supports all popular syntaxes currently in use:

- <img src="https://cdn.adguard.com/website/github.com/AGLint/adg_logo.svg" width="14px"> [AdGuard][adg-url]
- <img src="https://cdn.adguard.com/website/github.com/AGLint/ubo_logo.svg" width="14px"> [uBlock Origin][ubo-url]
- <img src="https://cdn.adguard.com/website/github.com/AGLint/abp_logo.svg" width="14px"> [Adblock Plus][abp-url]
- <img src="https://cdn.adguard.com/website/github.com/AGLint/ab_logo.svg" width="14px"> [AdBlock][ab-url]

AGLint can be used as a command-line tool or as a TS/JS library in the Node.js or browser environment.

Our goal is to provide a tool that can be used by everyone who is interested in adblock filters. We want to make it easy
to create and maintain filter lists.

Generally the philosophy of AGLint are inspired by [ESLint][eslint]. If you are familiar with ESLint, you will find
it easy to use AGLint as well.

## Features

- :earth_americas: **Universal**: supports all syntaxes currently in use: AdGuard, uBlock Origin and
  AdBlock / Adblock Plus.
- :zap: **Fast**: made with performance in mind.
- :thumbsup: **Easy to use**: it can be used as a CLI tool or programmatically.
- :art: **Customizable**: you can customize the default configuration by creating a file named `.aglintrc` in the root
  of your repo.
- :gear: **Extensible**: you can add your own rules to the linter.
- :globe_with_meridians: **Cross-platform**: it works on Windows, Linux and macOS.
- :globe_with_meridians: **Open-source**: the source code is available here on GitHub.
- :free: **Free**: it is free to use and free to modify.
- :rocket: **Latest technologies**: it is written in TypeScript and can be used in Node.js and browsers as well.

## Getting started

Mainly AGLint is a CLI tool, but it can also be used programmatically. Here is a very short instruction on how to use
it as a CLI tool with the default configuration.

### Pre-requisites

- Node.js 14 or higher: [nodejs.org][nodejs] (we recommend using the latest LTS version)
- NPM or Yarn. NPM is installed with Node.js, so you don't need to install it separately. If you want to use `yarn`
  instead of `npm`, you can install it from [here][yarn].

### Installation & Usage

1. Install AGLint to your project:
   - NPM: `npm install -D @adguard/aglint`
   - Yarn: `yarn add -D @adguard/aglint`
2. Initialize the configuration file for AGLint:
   - NPM: `npx aglint init`
   - Yarn: `yarn aglint init`
3. Run AGLint:
   - NPM: `npx aglint`
   - Yarn: `yarn aglint`

That's all! :hugs: The linter will check all filter lists in your project and print the results to the console.

> [!NOTE]
> You can also install AGLint globally, so you can use it without `npx` or `yarn`, but we recommend to install
> it locally to your project.

> [!NOTE]
> If you want to lint just some specific files, you can pass them as arguments:
> `aglint path/to/file.txt path/to/another/file.txt`

> [!NOTE]
> To see all available options, run `aglint --help`.

*To customize the default configuration, see [Configuration](#configuration) for more info. If you want to use AGLint
programmatically, see [Use programmatically](#use-programmatically).*

### Integrate AGLint into your project

If you would like to integrate AGLint into your project / filter list, please read our detailed
[Integration guide][integration-guide] for more info.

## VSCode extension

We have created a VSCode extension that fully covers adblock filter list syntax. It is available
[here][vscode-extension].

This extension enables syntax highlighting, and it's compatible with AGLint. Typically, it means that this extension
will detect all syntax errors and show them in the editor, and on top of that, it will also show some warnings and
hints, because it also runs AGLint under the hood.

GitHub Linguist [also uses][linguist-pr] this extension to highlight adblock filter lists.

**We strongly recommend using this extension if you are working with adblock filter lists.**

## Special comments (inline configuration)

You may not want to lint some adblock rules, so you can add special inline comments to disable linting for a single
adblock rule or for the rest of the file. To do that, you need to add special comments to your adblock filter list,
which can be used to change the linter's behavior. Generally these "control comments" begins with the `! aglint` prefix.

In the following sections you can find more info about these comments.

### Ignore adblock rules

#### Ignore single adblock rule

You can completely disable linting for an adblock rule by adding `! aglint-disable-next-line` comment before the adblock
rule. For example, `example.com##.ad` will be ignored in the following case:

```adblock
! aglint-disable-next-line
example.com##.ad
example.net##.ad
```

This lets you disable linting for a single adblock rule, but it doesn't disable linting for the rest of the file. If you
want to disable linting for the rest of the file, you can add `! aglint-disable` comment before the first adblock rule
or add the file path to the ignore list (`.aglintignore` file). See
[Ignoring files or folders](#ignoring-files-or-folders) for more info.

#### Ignore multiple adblock rules

If you want to ignore multiple adblock rules, you can add `! aglint-disable` comment before the first adblock rule and
`! aglint-enable` comment after the last adblock rule. For example, `example.com##.ad` and `example.net##.ad` will be
ignored in the following case:

```adblock
! aglint-disable
example.com##.ad
example.net##.ad
! aglint-enable
example.org##.ad
```

#### Disable some linter rules

In some cases, you may want to disable some linter rules for a single adblock rule or for multiple adblock rules. Here
is how you can do it:

- For a single adblock rule: for example, `rule1` linter rule will be ignored for `example.com##.ad` in the following
  case (but it will be enabled for
  `example.net##.ad`):
  ```adblock
  ! aglint-disable-next-line rule1
  example.com##.ad
  example.net##.ad
  ```
- For multiple adblock rules: for example, `rule1, rule2` linter rules will be ignored for `example.com##.ad` and
  `example.net##.ad` in the following case (but they will be enabled for `example.org##.ad`):
  ```adblock
  ! aglint-disable rule1, rule2
  example.com##.ad
  example.net##.ad
  ! aglint-enable rule1, rule2
  example.org##.ad
  ```

#### Change linter rules configuration

In some cases, you may want to change the configuration of some linter rules during linting. Here is how you can do it:

```adblock
! aglint "rule-1": ["warn", { "option1": "value1" }], "rule-2": "off"
example.com##.ad
example.net##.ad
```

After the `! aglint` comment, you should specify the list of the rules that you want to change. It will applied to all
lines after the comment until the end of the file or until the next `! aglint` comment. The syntax is the same as in the
[configuration file](#configuration).

## Ignoring files or folders

You can ignore files or folders by creating an "ignore file" named `.aglintignore` in any directory. The syntax and
behavior of this file is the same as `.gitignore` file. Learn more about `.gitignore` [here][gitignore-docs] if you are
not familiar with it.

If you have a config file in an ignored folder, it will be ignored as well.

### Default ignores

Some "problematic" paths are ignored by default in order to avoid linting files that are not related to adblock filter
lists. These paths are:

- `node_modules` - Vendor files for Node.js, usually contains a lot of files - this can slow down the linter
  significantly
- `.DS_Store` - macOS system file
- `.git` - Git files
- `.hg` - Mercurial files
- `.svn` - Subversion files
- `Thumbs.db` - Windows system file

## Configuration

AGLint requires a configuration file to work. If you don't have a configuration file, the CLI will throw an error and
ask you to create one.

### Create a configuration file

If you don't have a configuration file, you can create it by running `aglint init` **in the root directory of your
project.** This command will create a `.aglintrc.yaml` file in the current directory.

You can also create a configuration file manually, please check the section below for more info.

> [!NOTE]
> We are planning to add a configuration wizard in the future, so you will be able to create a configuration
> file by answering a few questions.

### Configuration file name and format

Configuration file is a JSON or YAML file that contains the configuration for the linter and should be named as one of
the following:

- `.aglintrc` (JSON) *- not recommended*
- `.aglintrc.json` (JSON)
- `.aglintrc.yaml` (YAML)
- `.aglintrc.yml` (YAML)

We also plan to support `.aglintrc.js` (JavaScript) in the future.

We recommend using `.aglintrc.yaml` or `.aglintrc.yml` because YAML is more compact and easier to read, and it supports
comments.

> [!WARNING]
> If you have multiple configuration files in the same directory, the CLI will throw an error and ask you
> to fix it.

> [!WARNING]
> If your configuration file is syntactically invalid or contains unknown / invalid options, the CLI will
> throw an error and ask you to fix it.

> [!WARNING]
> If your configuration file is not named in one of the ways listed above, the CLI will ignore it (since it
> cannot recognize it as a configuration file).

### Configuration file structure

The configuration file should be a valid JSON or YAML file. The following options are available:

- `root` — defaults to `false`, flag that indicates
  whether the current configuration is the main config configuration which can be enabled by `true` value;
  otherwise the linter will search for the configuration in parent directories.
- `syntax` — array of strings, specifies the syntax of the filter lists.
  If there is an `Agent` type comment in a filter list, the linter will use the syntax specified in the comment.
  If not set, parsed by AGTree `syntax` value will be used.
  Possible values:
    - `Common` — Common filter list syntax (default);
    - `AdGuard` — AdGuard filter list syntax;
    - `UblockOrigin` — uBlock filter list syntax;
    - `AdblockPlus` — Adblock Plus filter list syntax.
- `allowInlineConfig` — enable or disable inline config comments, e.g. `! aglint-disable-next-line`;
  defaults to `true`.
- `extends` — an array of configuration presets to extend, e.g. `["preset-1", "preset-2"]`.
  See [Configuration presets](#configuration-presets) for more info.
  Defaults to `[]`, i.e. no presets.
  Preset's syntax and rules can be overridden by the user config.
- `rules` — an object with configured [linter rules](#linter-rules)
  due to [configuration rule structure](#configuration-rule-structure).

#### <a name="configuration-rule-structure"></a> Configuration rule structure

A rule basically has the following structure:

<!-- TODO: use real rules as an examples -->
- the key is the name of the rule, e.g. `rule-1`;
- the value is the severity and the configuration of the rule,
  e.g. `"error"` or `["error", { "option-1": "value-1" }]`.
    - The severity always must be specified.
      If the rule doesn't have any configuration, you can use a string with the severity, e.g. `"error"`.
      Severity codes may also be used instead of severity names.
      Default rule severity depends on the rule and may differ from rule to rule.
      Possible values:
        - `off` or `0` — nothing will be reported;
          the linter rule does not runs its checks which means less resource usage;
        - `warn` or `1` — throws a warning (deprecated syntax, formatting issues, redundant rules, etc.);
        - `error` or `2` — throws an error (unknown scriptlets, unknown modifiers, etc.);
        - `fatal` or `3` — throws a fatal error (syntax error during parsing).
    - If the rule has configuration, you must use an array with two elements.
      The first element is the severity and the rest of the elements are the configuration,
      e.g. `["error", { "option-1": "value-1" }]`.

##### Examples

You can disable the `rule-1` rule by adding the following configuration:

```json
{
    "rules": {
        "rule-1": "off"
    }
}
```

but an array also can be used as well:

```json
{
    "rules": {
        "rule-1": ["off"]
    }
}
```

You can change the severity of the `rule-2` rule to `warn`:

```json
{
    "rules": {
        "rule-2": ["warn"]
    }
}
```

or change the severity of the `rule-3` rule to `error` and add a configuration for it:

```json
{
    "rules": {
        "rule-3": ["error", { "option-3": "value-3" }]
    }
}
```

### Configuration presets

Configuration presets are basically configuration files that you can use to extend in your configuration.
Currently, there are two built-in presets available (click on the name to see the source code):

- [`aglint:recommended`][aglint-recommended] — a set of recommended rules that are enabled by default.
  It is enough to use this preset in most cases.
- [`aglint:all`][aglint-all] — a set of **all** rules that are available in the linter.
  This option maybe too strict for most projects.

> [!NOTE]
> Presets contain `syntax` and `rules` which shall be overridden if they are specified in the config.

> [!NOTE]
> All presets have `syntax` property set to `Common` a default value.
> You may need to specify it in your [configuration file](#configuration-file-structure)
> for better linting, e.g. modifiers validation.

> [!NOTE]
> We are planning to add more presets in the future,
> and also allow users to create their own presets but currently it is not possible.

### Default configuration file

This configuration file is the same as created by `aglint init` command.
It simply extends the `aglint:recommended` preset and specifies the `root` option.

- YAML syntax — `.aglintrc.yaml`:

    ```yaml
    # Default configuration file for AGLint
    root: true
    allowInlineConfig: true
    extends:
        - aglint:recommended
    syntax:
        - Common
    ```

- JSON syntax — `.aglintrc.json`:

    ```json
    {
        "root": true,
        "allowInlineConfig": true,
        "extends": [
            "aglint:recommended"
        ],
        "syntax": ["Common"]
    }
    ```

> [!NOTE]
> JavaScript configuration files aren't supported at the moment
> but we plan to add support for them in the future (CJS and ESM syntaxes).

### Configuration cascading and hierarchy

AGLint follows the same configuration file search algorithm as ESLint ([learn more][eslint-config-hierarchy]), so if you
are familiar with ESLint, this section will be easy to understand.

If you call AGLint in a directory (lets call it current directory / current working directory), it will search for a
configuration file in this directory and all parent directories until it finds one configuration file with the `root`
option set to `true` or reaches the root directory (the most top directory, which doesn't have a parent directory). If
the linter doesn't find any configuration file at all, it will throw an error and ask you to fix it, because it cannot
work without a configuration file.

If the linter finds multiple configuration files in the same directory, it will also throw an error and ask you to fix
it, because it is an inconsistent state, since the linter doesn't know which configuration file to use. ESLint uses a
[name-based priority system][eslint-config-file-formats] to resolve this issue, but AGLint throws an error instead, to
keep things simple and clear.

#### Why the `root` option is important

Suppose you store your projects in the `my-projects` directory, and you have the following directory structure:

```txt
my-projects
├── .aglintrc.yaml
├── project-1
│   ├── dir1
│   │   ├── list1.txt
│   │   ├── list2.txt
│   ├── dir2
│   │   ├── .aglintrc.yaml
│   │   ├── dir3
│   │   │   ├── list3.txt
│   │   │   ├── list4.txt
│   ├── list5.txt
│   ├── .aglintrc.yaml
├── project-2
│   ├── ...
├── ...
```

As you can see, the `my-projects` directory contains a configuration file, and the `project-1` directory also contains
some configuration files.

Let's assume that `my-projects/project-1/.aglintrc.yaml` doesn't have the `root` option set to `true`.

If you call AGLint in the `project-1` directory, it finds the configuration file in the `project-1`, but since it
doesn't specify the `root` property, therefore the linter will continue to search for a configuration file in the parent
directories. As a result, it will find the configuration file in the `my-projects` directory and merge these two
configuration files into one configuration. This is a bad practice, since if you move your project to another directory,
linting results may change, because `my-projects/.aglintrc` loses its effect. Projects should be handled as a single
unit, and the `root` option is designed to solve this problem. If you set the `root` option to `true` in the
configuration file from the `project-1` directory, the linter will stop searching for configuration files right after it
finds the configuration file from the `project-1` directory, and will ignore the configuration file from the
`my-projects` directory. This is how the `root` option works and why it is important.

However, merging configurations is useful within a single project, so if you specify the main configuration in your
project's root directory, but if you want to override some rules in some subdirectories, you can do it by creating a
configuration file in this subdirectory. For example, if you want to disable the `rule-1` rule in the `dir2` directory,
you can create the following configuration file in the `dir2` directory:

```yaml
# project-1/dir2/.aglintrc.yaml
rules:
  rule-1: "off"
```

And of course, at the top of this hierarchy, you can specify inlined configuration comments
in your adblock filter list files, which will override the configuration from the configuration files
but only if `allowInlineConfig` option is enabled.

## <a name="linter-rules"></a> Linter rules

The linter parses your filter list files with the [AGTree][agtree-pkg] parser,
then it checks them against the linter rules. If a linter rule is violated, the linter will report an error or warning.
If an adblock rule is syntactically incorrect (aka it cannot be parsed), the linter will report a fatal error
and didn't run any other linter rules for that adblock rule, since it is not possible to check it without AST.
The rest of the file (valid rules) will be checked with the linting rules.

The linter rules documentation is written in the following schema:

- *Short description of the rule in the first paragraph.*
- **Severity:** Severity of the rule, it can be `warn` (1), `error` (2), `fatal` (3).
- **Options:** Configuration options for the rule (if any).
- **Options schema:** Validation schema for the rule options (if any).
- **Fixable:** Describes if the rule can fix the detected problem automatically.
- **Example:** A simple example of the rule violation and how it will be reported.
- **Example for fixing:** A simple example of the rule violation and how it will be fixed (if the problem is fixable).

Currently, the following linter rules are available (we will add more rules in the future):

### `if-closed`

Checks if the `if` statement is closed and no unclosed `endif` or unopened `else` statements are present.
It also checks whether `else` and `endif` statements are used correctly
since they can only be used alone without other parameters or statements.

- **Severity:** `error` (2)
- **Options:** none
- **Fixable:** no
- **Example:**
  ```adblock
  !#endif
  !#if (adguard_app_android)
  example.com##.ad
  !#endif
  !#if (adguard_ext_firefox)
  example.org##.something
  !#else if (adguard_ext_opera)
  example.org##.operaBanner
  ```
  will be reported as error:
  ```txt
    1:0  error  Using an "endif" directive without an opening "if" directive
    5:0  error  Unclosed "if" directive
    7:0  error  Invalid usage of preprocessor directive: "else"
  ```
  since the first `endif` are unnecessary, and the last `if` statement is not closed.

### `single-selector`

Checks element hiding rules to make sure that they contain only one selector.

- **Severity:** `warn` (1)
- **Options:** none
- **Fixable:** yes, the rule will be split into multiple rules, each with a single selector
- **Example:**
  ```adblock
  example.com##.ad, .something
  ```
  will be reported as warning:
  ```txt
    1:0  warn  An element hiding rule should contain only one selector
  ```
  since the rule contains two selectors.
- **Example for fixing:**
  ```adblock
  example.com##.ad, .something
  ```
  will be fixed to:
  ```adblock
  example.com##.ad
  example.com##.something
  ```
  (two separate rules with a single selector each).

### `duplicated-modifiers`

Checks if the same modifier is used multiple times in a single network rule.

- **Severity:** `error` (2)
- **Options:** none
- **Fixable:** planned
- **Example:**
  ```adblock
  example.com$important,important
  ```
  will be reported as error:
  ```txt
    1:0  error  The "important" modifier is used multiple times
  ```
  since the `important` modifier is used twice.

### `unknown-preprocessor-directives`

Checks if the used preprocessor directives are known.

> [!IMPORTANT]
> Preprocessor directives are case-sensitive, so `!#IF` is to be considered as invalid.

- **Severity:** `error` (2)
- **Options:** none
- **Fixable:** no
- **Example:**
  ```adblock
  !#unknown
  ```
  will be reported as error:
  ```txt
    1:0  error  Unknown preprocessor directive: "unknown"
  ```
  since `unknown` is not a known preprocessor directive.
- **Additional information:**
    - Currently, the following preprocessor directives are supported:
        - `if`: [reference][if-kb]
        - `else`: [reference][if-kb]
        - `endif`: [reference][if-kb]
        - `include`: [reference][include-kb]
        - `safari_cb_affinity`: [reference][safari-cb-kb]
    - For more information about preprocessor directives, please visit [AdGuard Knowledge Base][ag-preprocessor-kb] or
      [uBlock Origin Wiki][ubo-pre-parsing-directives].

### `duplicated-hint-platforms`

Checks if the same platform is used multiple times in a single hint.

- **Severity:** `warn` (1)
- **Options:** none
- **Fixable:** planned
- **Example:**
  ```adblock
  !+ PLATFORM(ios, android, ios)
  ```
  will be reported as warning:
  ```txt
    1:0  warn  The "ios" platform is used multiple times
  ```
  since the `ios` platform is used twice. In this case, you'll need to remove the unnecessary `ios` platform.

### `duplicated-hints`

Checks if the same hint is used multiple times within a single comment.

- **Severity:** `warn` (1)
- **Options:** none
- **Fixable:** planned
- **Example:**
  ```adblock
  !+ PLATFORM(ios, ext_android_cb) PLATFORM(ext_ff) NOT_OPTIMIZED
  ```
  will be reported as warning:
  ```txt
    1:0  warn  The "PLATFORM" hint is used multiple times
  ```
  since the `PLATFORM` hint is used twice in the same comment. In this case, you'll need to concatenate the platforms
  into a single `PLATFORM` hint.

### `unknown-hints-and-platforms`

Checks if the hints and platforms are known.

- **Severity:** `error` (2)
- **Options:** none
- **Fixable:** no
- **Example:**
  ```adblock
  !+ HINT
  !+ HINT(param)
  !+ PLATFORM(something)
  ```
  will be reported as error:
  ```txt
    1:0  error  Unknown hint: "HINT"
    2:0  error  Unknown hint: "HINT"
    3:0  error  Unknown platform: "something"
  ```
  since `HINT` are an unknown hint, and `something` is an unknown platform.
- **Additional information:**
    - Currently, the following hints are supported:
        - `NOT_OPTIMIZED`: [documentation][not-optimized-kb]
        - `PLATFORM` / `NOT_PLATFORM`: [documentation][platform-kb]
    - Currently, the following platforms are supported:
        - `windows`
        - `mac`
        - `android`
        - `ios`
        - `ext_chromium`
        - `ext_ff`
        - `ext_edge`
        - `ext_opera`
        - `ext_safari`
        - `ext_android_cb`
        - `ext_ublock`

### `invalid-domain-list`

Checks for invalid domains in cosmetic rules.

- **Severity:** `error` (2)
- **Options:** none
- **Fixable:** no
- **Example:**
  ```adblock
  example.##.ad
  ```
  will be reported as error:
  ```txt
    1:0  error  Invalid domain: "example."
  ```
  since `example.` is not a valid domain, because it's TLD is empty. In this case, you'll need to specify TLD for the
  domain, for example, `example.com`, or use a wildcard as TLD: `example.*`.
- **Additional information:**
    - Accepted values are:
        - Regular domains: `example.com`, `example.org`, `example.net`, etc.
        - Domains with wildcards: `*.example.com`, `*.example.org`,
          `*.example.net`, etc.
        - Wildcard-only domain: `*`
        - IDN domains: `xn--e1afmkfd.xn--p1ai`, etc.
        - Unicode domains: `пример.рф`, etc.
        - Hostnames: `example`, `example-2`, `example-3`, etc.
        - IP addresses: `127.0.0.1`


### `invalid-modifiers`

Checks for invalid modifiers in [basic (network) rules][basic-rules-kb].

- **Severity:** `error` (2) for invalid modifiers, `warn` (1) for deprecated modifiers
- **Options:** none
- **Fixable:** no
- **Example:**
    ```adblock
    ||example.org^$elemhide
    ```
    will be reported as error:
    ```txt
    1:15  error  Only exception rules may contain the modifier: 'elemhide'
    ```
    since this modifier is not allowed for blocking rules.

### `inconsistent-hint-platforms`

Check if the hint platforms are targeted inconsistently. This means that the same platform is targeted in the `PLATFORM`
hint, but excluded in the `NOT_PLATFORM` hint at the same time (or vice versa).

- **Severity:** `error` (2)
- **Options:** none
- **Fixable:** no
- **Example:**
  ```adblock
  !+ PLATFORM(ios, ext_android_cb) NOT_PLATFORM(ext_android_cb)
  example.com##.ad
  ```
  will be reported as error:
  ```txt
    1:0  error  The "ext_android_cb" platform is targeted inconsistently
  ```
  since the `ext_android_cb` platform is targeted in the `PLATFORM` hint, but excluded in the `NOT_PLATFORM` hint at the
  same time. In this case, you'll need to remove the `ext_android_cb` platform from some of the hints to make it's
  targeting consistent.

### `no-short-rules`

Check if the rule length is less than the specified minimum threshold value, i.e. if the rule is too short.

- **Severity:** `error` (2)
- **Options:** none
- **Fixable:** no
- **Options:**
    - `minLength` — minimum rule length (default: `4`)
- **Example:**
  ```adblock
  ! Short rule
  a
  ```
  will be reported as error:
  ```txt
    2:0  error  Too short rule: 'a'
  ```
  since the rule length is less than the default value (`4`).
  If you want to change the minimum rule length, you can do it by specifying the `minLength` option in your
  configuration file:
  ```yaml
  rules:
    no-short-rules: ["error", { "minLength": 3 }]
  ```
  or via inline configuration comments:
  ```adblock
  ! This rule is too short because it's length is less than 10 characters
  ! aglint "no-short-rules": ["error", { minLength: 10 }]
  a$script
  ```

## Compatibility

The linter is compatible with all modern browsers and Node.js versions. Minimum required versions are:

| Name              | Minimum version |
| ----------------- | :-------------- |
| Node.js           | ✅ 14           |
| Chrome            | ✅ 88           |
| Firefox           | ✅ 84           |
| Edge              | ✅ 88           |
| Opera             | ✅ 80           |
| Safari            | ✅ 14           |
| Internet Explorer | ❌              |

Minimum required versions are determined by the [Node.js LTS schedule][nodejs-schedule] and the
[ES6 compatibility table][es6-compat-table].

Maybe the linter will work in older browsers and Node.js versions, but it's not guaranteed we don't recommend using such
old versions.

## Use programmatically

You can use several parts of AGLint programmatically, but it is only recommended for advanced users who are familiar
with Node.js, JavaScript, TypeScript and the basics of software development. Generally, the API are well documented with
a lot of examples, but you can open a discussion if you have any questions, we will be happy to help you.

The linter is a tool that checks the rules for errors and bad practices. It is based on the parser, so it can parse all
ADG, uBO and ABP rules currently in use. The linter API has two main parts:

- Linter: checks rules (string &#8594; AST &#8594; problem report)
- CLI: a Node.js command-line interface for the linter

Please keep in mind that the CLI only can be used in Node.js (because it uses the `fs` module for file management), but
the linter can be used in both Node.js and browsers.

Example usage:

```typescript
import { Linter } from "@adguard/aglint";

// Create a new linter instance and add default rules (make first parameter true
// to add default rules)
const linter = new Linter(true);

// Add custom rules (optional). Rules are following LinterRule interface.
// linter.addRule("name", { data });

// Lint a content (file content - you can pass new lines as well)
// If you want to enable the fixer, pass true as the second parameter
const report = linter.lint("example.com##.ad, #ad");

// Do something with the report
```

The `LinterRule` interface has the following structure:

- `meta`: Metadata for the rule
    - `severity`: warning, error or fatal
    - `config`: configuration for the rule (optional)
        - `default`: default value for the configuration
        - `schema`: [Superstruct][superstruct-pkg] schema for the configuration
- `events`:
    - `onStartFilterList`: called before analyzing a file
    - `onRule`: Called to analyze a single rule
    - `onEndFilterList`: called after analyzing a file

Every event has a `context` parameter, which makes it possible to get the current filter list content, the current rule,
report, etc.

You can check the [`src/linter/rules`][linter-rules-src] directory for detailed examples.

You can find the detailed linter rule documentation [here][linter-rules-docs].

## Development & Contribution

Please read the [CONTRIBUTING.md][contributing-url] file for details on how to contribute to this project.

## Ideas & Questions

If you have any questions or ideas for new features, please open an issue or a discussion. We will be happy to discuss
it with you.

## License

AGLint is licensed under the MIT License. See the [LICENSE][aglint-license] file for details.

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
[ag-preprocessor-kb]: https://adguard.com/kb/general/ad-filtering/create-own-filters/#preprocessor-directives
[aglint-all]: https://github.com/AdguardTeam/AGLint/blob/master/src/linter/config-presets/aglint-all.ts
[aglint-license]: https://github.com/AdguardTeam/AGLint/blob/master/LICENSE
[aglint-recommended]: https://github.com/AdguardTeam/AGLint/blob/master/src/linter/config-presets/aglint-recommended.ts
[agtree-pkg]: https://www.npmjs.com/package/@adguard/agtree
[basic-rules-kb]: https://adguard.com/kb/general/ad-filtering/create-own-filters/#basic-rules
[contributing-url]: https://github.com/AdguardTeam/AGLint/tree/master/CONTRIBUTING.md
[css-tree-docs]: https://github.com/csstree/csstree/tree/master/docs
[es6-compat-table]: https://kangax.github.io/compat-table/es6/
[eslint-config-file-formats]: https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-formats
[eslint-config-hierarchy]: https://eslint.org/docs/latest/use/configure/configuration-files#cascading-and-hierarchy
[eslint]: https://eslint.org/
[gitignore-docs]: https://git-scm.com/docs/gitignore
[if-kb]: https://adguard.com/kb/general/ad-filtering/create-own-filters/#conditions-directive
[include-kb]: https://adguard.com/kb/general/ad-filtering/create-own-filters/#include-directive
[integration-guide]: https://github.com/AdguardTeam/AGLint/blob/master/docs/repo-integration.md
[linguist-pr]: https://github.com/github/linguist/pull/5968
[linter-rules-docs]: https://github.com/AdguardTeam/AGLint/blob/master/src/linter/rules/README.md
[linter-rules-src]: https://github.com/AdguardTeam/AGLint/tree/master/src/linter/rules
[mdn-css-selectors]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
[nodejs-schedule]: https://nodejs.org/en/about/releases/
[nodejs]: https://nodejs.org/en/download/
[not-optimized-kb]: https://adguard.com/kb/general/ad-filtering/create-own-filters/#not_optimized-hint
[platform-kb]: https://adguard.com/kb/general/ad-filtering/create-own-filters/#platform-and-not_platform-hints
[safari-cb-kb]: https://adguard.com/kb/general/ad-filtering/create-own-filters/#safari-affinity-directive
[superstruct-pkg]: https://www.npmjs.com/package/superstruct
[ubo-filters]: https://github.com/gorhill/uBlock/wiki/Static-filter-syntax
[ubo-pre-parsing-directives]: https://github.com/gorhill/uBlock/wiki/Static-filter-syntax#pre-parsing-directives
[ubo-procedural]: https://github.com/gorhill/uBlock/wiki/Procedural-cosmetic-filters
[ubo-scriptlets]: https://github.com/gorhill/uBlock/wiki/Resources-Library#available-general-purpose-scriptlets
[ubo-url]: https://github.com/gorhill/uBlock
[vscode-extension]: https://marketplace.visualstudio.com/items?itemName=adguard.adblock
[yarn]: https://yarnpkg.com/getting-started/install
