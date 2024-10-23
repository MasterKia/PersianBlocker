# AGLint rules

In this folder you can find the rules that AGLint uses to check the correctness of the filters.

Table of Contents:

- [AGLint rules](#aglint-rules)
    - [List of current rules](#list-of-current-rules)
    - [How to add a new rule](#how-to-add-a-new-rule)
    - [Creating a new rule](#creating-a-new-rule)
        - [Using rule storage](#using-rule-storage)
        - [Add config to the rule](#add-config-to-the-rule)
        - [Report problems](#report-problems)
            - [Suggest a fix](#suggest-a-fix)

## List of current rules

We collect the list of current rules in the main [README.md][main-readme] file.

## How to add a new rule

In this section we will explain how to add a new rule to AGLint. This chapter is intended for developers who want to
contribute to the project.

1. Create your rule, see details in [Creating a new rule](#creating-a-new-rule) section.
1. Add your rule to the `rules` array in the `src/linter/rules/index.ts` file.
1. Write comprehensive tests for your rule. You can find good examples in the `test/linter/rules` folder.
1. Add your rule to the list of current rules in the main [README.md][main-readme-linter-rules] file with a short
   description and examples.

## Creating a new rule

In order to create a new rule you need to create a new TypeScript file in this folder. For example `rule-name.ts`. The
file must export an object which implements the `LinterRule` interface. It means two main things: you need to define

- the `meta` property and
- the `events` property.

The `meta` property is used to define the name, severity and the default config of the rule. The `events` property is
used to define the events that the rule will listen to.

```typescript
import { RuleCategory } from '../../parser/common';
import { LinterRule } from '../common';
import { SEVERITY } from '../severity';

/**
 * Fill this description with a short description of the rule.
 */
export const ExampleRule: LinterRule = {
    // Define the metadata of the rule
    meta: {
        severity: SEVERITY.error,
    },
    // Define the events that the rule will listen to
    events: {
        // If you don't need to listen this event, you can remove it
        onStartFilterList: (context) => {
            // Do something in the event...
        },
        onRule: (context): void => {
            // Get actually iterated adblock rule
            const ast = context.getActualAdblockRuleAst();

            // Do something with the rule AST...
            // if (ast.category === RuleCategory.Cosmetic) { ... }
        },
        // If you don't need to listen this event, you can remove it
        onEndFilterList: (context) => {
            // Do something in the event...
        },
    },
};
```

### Using rule storage

Sometimes you need to store some data between events. In order to do that you can use the "rule storage" in the context
object. Each rule has its own storage object, so you can store data without worrying about other rules, `a` rule cannot
access the storage of `b` rule, so the collision is not possible.

To make the rule storage type safe you need to define a type for the storage object in your rule file:

```typescript
import { LinterRule } from '../common';
import { SEVERITY } from '../severity';

/**
 * Concreting the storage type definition (the linter only provides a
 * general form where the value type is unknown)
 */
interface Storage {
    n: number;
}

/**
 * Fill this description with a short description of the rule.
 */
export const ExampleRule: LinterRule<Storage> = {
    meta: {
        severity: SEVERITY.error,
    },
    events: {
        onStartFilterList: (context): void => {
            // Initialize the storage (currently it is undefined)
            // Of course, if you want, you can use more complex data
            // structures :)
            context.storage.n = 0;
        },
        onRule: (context) => {
            context.storage.n += 1;
            // context.storage.n is preserved between events, so it will be
            // incremented for each rule

            // Do something else in the event...
        },
        // ...
    },
};
```

### Add config to the rule

Sometimes you need to pass some configs to the rule. In order to do that you can use the `config` property of the
context object. Similar to the rule storage, its type is unknown for the core, so you need to define it in your rule
file:

```typescript
import ss from 'superstruct';
import { LinterRule, LinterRuleStorage } from '../common';
import { SEVERITY } from '../severity';

// Define rule config type (it is only relevant for the rule itself)
type RuleConfig = [number, string];

/**
 * Fill this description with a short description of the rule.
 */
export const ExampleRule: LinterRule<LinterRuleStorage<unknown>, RuleConfig> = {
    // Define the metadata of the rule
    meta: {
        severity: SEVERITY.error,

        config: {
            // Define the default config
            default: [1, 'foo'],

            // Define the schema of the config
            schema: ss.tuple([
                ss.number(),
                ss.string(),
            ]) as ss.Struct,
        },
    },
    // Define the events that the rule will listen to
    events: {
        onRule: (context): void => {
            // Get the first parameter (number)
            const firstParameter = context.config[0];

            // Get the second parameter (string)
            const secondParameter = context.config[1];

            // Do something else in the event with the parameters...
        },
    },
};
```

> [!NOTE]
> You can use both the rule storage and the parameters at the same time.

### Report problems

In order to report a problem you need to use the `report` method of the `context` object:

```typescript
import { LinterRule } from '../common';
import { SEVERITY } from '../severity';

/**
 * Fill this description with a short description of the rule.
 */
export const ExampleRule: LinterRule = {
    // Define the metadata of the rule
    meta: {
        severity: SEVERITY.error,
    },
    // Define the events that the rule will listen to
    events: {
        onRule: (context): void => {
            // Get actually iterated adblock rule
            const ast = context.getActualAdblockRuleAst();

            // Report problem for the whole rule
            // This will automatically detect the location of the rule
            context.report({
                node: ast,
                message: 'Bad rule',
            });

            // But if needed, you can also report problem for a specific
            // location. For example for the first 10 characters of the
            // rule in the first line:
            // context.report({
            //     position: {
            //         startLine: 1,
            //         startColumn: 0,
            //         endLine: 1,
            //         endColumn: 10,
            //     },
            //     message: 'Bad first 10 characters',
            // });
        },
    },
};
```

The problem severity automatically depends on the rule severity. If the rule severity is `error` then the problem
severity is `error`, if the rule severity is `warning` then the problem severity is `warning`.

#### Suggest a fix

If possible, you can suggest a fix for the problem. In order to do that you need to use the `fix` property of the
`report` method:

```typescript
import { CommentMarker, CommentRuleType, RuleCategory } from '../../index';
import { AdblockSyntax } from '../../utils/adblockers';
import { LinterRule, LinterProblemReport } from '../common';
import { SEVERITY } from '../severity';

// Export the rule
export const RuleName: LinterRule = {
    meta: {
        severity: SEVERITY.warn,
    },
    events: {
        onRule: (context) => {
            // Get currently iterated rule as AST (abstract syntax tree)
            const ast = context.getActualAdblockRuleAst();

            // Detect some problem, for example don't allow cosmetic rules
            if (ast.category === RuleCategory.Cosmetic) {
                // Prepare the common data for the problem report
                const report: LinterProblemReport = {
                    node: ast,
                    message: 'Cosmetic rules aren\'t allowed',
                };

                // If fixing is enabled, suggest a fix, otherwise just report
                // the problem
                if (context.fixingEnabled()) {
                    // Transform cosmetic rule AST to comment rule AST, and
                    // suggest this AST as a fix
                    report.fix = {
                        category: RuleCategory.Comment,
                        type: CommentRuleType.CommentRule,
                        syntax: AdblockSyntax.Common,
                        marker: {
                            type: 'Value',
                            value: CommentMarker.Hashmark,
                        },
                        text: {
                            type: 'Value',
                            value: context.getActualAdblockRuleRaw(),
                        },
                    };
                } else {
                    context.report(report);
                }
            }
        },
    },
    // ...
};
```

> [!NOTE]
> If multiple fixes are suggested for the same problem, then the linter will ignore all of them in order to
> avoid conflicts.

[main-readme-linter-rules]: ../../../README.md#linter-rules
[main-readme]: ../../../README.md#linter-rules
