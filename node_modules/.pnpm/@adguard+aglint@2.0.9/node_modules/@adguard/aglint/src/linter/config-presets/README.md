# Configuration presets for AGLint

Table of Contents:

- [Configuration presets for AGLint](#configuration-presets-for-aglint)
    - [About configuration presets](#about-configuration-presets)
    - [Configuration presets](#configuration-presets)
        - [`aglint:recommended`](#aglintrecommended)
        - [`aglint:all`](#aglintall)

## About configuration presets

Configuration presets are a way to share common configurations. They contain a set of linter rules and their
configuration. You can extend a preset in your `.aglintrc.yml` file by adding the `extends` section like this:

```yml
# Extends the recommended preset
extends:
  - aglint:recommended
```

or this way, if you are using JSON format:

```json
{
  "extends": ["aglint:recommended"]
}
```

If needed, you can override some of the rules in the preset by adding the `rules` section like this:

```yml
# Extends the recommended preset
extends:
  - aglint:recommended
# Override configuration for some linter rules
rules:
  linter-rule-name: off
  another-linter-rule-name: warn
```

## Configuration presets

Currently, these are the available configuration presets:

### `aglint:recommended`

Suitable for most projects. It includes and configures all linter rules that are considered to be safe and useful.

### `aglint:all`

Includes all linter rules, which may be useful for some projects. It is not recommended to use this preset in most
cases.
