/*
 * Automatically exported CSSTree type definitions. Since ECSSTree uses
 * the exact same API as CSSTree, we can use the same type definitions.
 *
 * However, we can't use the @types/css-tree directly, because of a naming
 * conflict with the actual CSSTree package. Our package is called '@adguard/ecss-tree',
 * but the type definitions are written for 'css-tree'. Therefore, we need to
 * export type definitions from @types/css-tree to this file at build time.
 *
 * Source: https://www.npmjs.com/package/@types/css-tree
 */
 
// Type definitions for css-tree 2.3
// Project: https://github.com/csstree/csstree
// Definitions by: Erik Källén <https://github.com/erik-kallen>
//                 Jason Kratzer <https://github.com/pyoor>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.7

interface CssLocation {
    source: string;
    start: {
        offset: number;
        line: number;
        column: number
    };
    end: {
        offset: number;
        line: number;
        column: number
    };
}

interface ListItem<TData> {
    prev: ListItem<TData> | null;
    next: ListItem<TData> | null;
    data: TData;
}

type IteratorFn<TData, TResult, TContext = List<TData>> = (this: TContext, item: TData, node: ListItem<TData>, list: List<TData>) => TResult;
type FilterFn<TData, TResult extends TData, TContext = List<TData>> = (this: TContext, item: TData, node: ListItem<TData>, list: List<TData>) => item is TResult;
type ReduceFn<TData, TValue, TContext = List<TData>> = (this: TContext, accum: TValue, data: TData) => TValue;

declare class List<TData> {
    constructor();
    get size(): number;
    get isEmpty(): boolean;
    get first(): TData|null;
    get last(): TData|null;
    [Symbol.iterator](): IterableIterator<TData>;
    fromArray(array: TData[]): List<TData>;
    createItem(data: TData): ListItem<TData>;
    toArray(): TData[];
    toJSON(): TData[];
    forEach<TContext>(fn: IteratorFn<TData, void, TContext>, context: TContext): void;
    forEach(fn: IteratorFn<TData, void>): void;
    forEachRight<TContext>(fn: IteratorFn<TData, void, TContext>, context: TContext): void;
    forEachRight(fn: IteratorFn<TData, void>): void;
    nextUntil<TContext>(start: ListItem<TData>, fn: IteratorFn<TData, boolean, TContext>, context: TContext): void;
    nextUntil(start: ListItem<TData>, fn: IteratorFn<TData, boolean>): void;
    prevUntil<TContext>(start: ListItem<TData>, fn: IteratorFn<TData, boolean, TContext>, context: TContext): void;
    prevUntil(start: ListItem<TData>, fn: IteratorFn<TData, boolean>): void;
    reduce<TValue, TContext>(fn: ReduceFn<TData, TValue, TContext>, initialValue: TValue, context: TContext): TValue;
    reduce<TValue>(fn: ReduceFn<TData, TValue>, initialValue: TValue): TValue;
    reduceRight<TValue, TContext>(fn: ReduceFn<TData, TValue, TContext>, initialValue: TValue, context: TContext): TValue;
    reduceRight<TValue>(fn: ReduceFn<TData, TValue>, initialValue: TValue): TValue;
    some<TContext>(fn: IteratorFn<TData, boolean, TContext>, context: TContext): boolean;
    some(fn: IteratorFn<TData, boolean>): boolean;
    map<TContext, TResult>(fn: IteratorFn<TData, TResult, TContext>, context: TContext): List<TResult>;
    map<TResult>(fn: IteratorFn<TData, TResult>): List<TResult>;
    filter<TContext, TResult extends TData>(fn: FilterFn<TData, TResult, TContext>, context: TContext): List<TResult>;
    filter<TResult extends TData>(fn: FilterFn<TData, TResult>): List<TResult>;
    filter<TContext>(fn: IteratorFn<TData, boolean, TContext>, context: TContext): List<TData>;
    filter(fn: IteratorFn<TData, boolean>): List<TData>;
    clear(): void;
    copy(): List<TData>;
    prepend(item: ListItem<TData>): List<TData>;
    prependData(data: TData): List<TData>;
    append(item: ListItem<TData>): List<TData>;
    appendData(data: TData): List<TData>;
    insert(item: ListItem<TData>, before: ListItem<TData>): List<TData>;
    insertData(data: TData, before: ListItem<TData>): List<TData>;
    remove(item: ListItem<TData>): ListItem<TData>;
    push(item: TData): void;
    pop(): ListItem<TData> | undefined;
    unshift(data: TData): void;
    shift(): ListItem<TData> | undefined;
    prependList(list: List<TData>): List<TData>;
    appendList(list: List<TData>): List<TData>;
    insertList(list: List<TData>, before: ListItem<TData>): List<TData>;
    replace(oldItem: ListItem<TData>, newItemOrList: List<TData> | ListItem<TData>): List<TData>;
}

interface CssNodeCommon {
    type: string;
    loc?: CssLocation | undefined;
}

interface AnPlusB extends CssNodeCommon {
    type: 'AnPlusB';
    a: string | null;
    b: string | null;
}

interface Atrule extends CssNodeCommon {
    type: 'Atrule';
    name: string;
    prelude: AtrulePrelude | Raw | null;
    block: Block | null;
}

interface AtrulePlain extends CssNodeCommon {
    type: 'Atrule';
    name: string;
    prelude: AtrulePreludePlain | Raw | null;
    block: BlockPlain | null;
}

interface AtrulePrelude extends CssNodeCommon {
    type: 'AtrulePrelude';
    children: List<CssNode>;
}

interface AtrulePreludePlain extends CssNodeCommon {
    type: 'AtrulePrelude';
    children: CssNodePlain[];
}

interface AttributeSelector extends CssNodeCommon {
    type: 'AttributeSelector';
    name: Identifier;
    matcher: string | null;
    value: StringNode | Identifier | null;
    flags: string | null;
}

interface Block extends CssNodeCommon {
    type: 'Block';
    children: List<CssNode>;
}

interface BlockPlain extends CssNodeCommon {
    type: 'Block';
    children: CssNodePlain[];
}

interface Brackets extends CssNodeCommon {
    type: 'Brackets';
    children: List<CssNode>;
}

interface BracketsPlain extends CssNodeCommon {
    type: 'Brackets';
    children: CssNodePlain[];
}

interface CDC extends CssNodeCommon {
    type: 'CDC';
}

interface CDO extends CssNodeCommon {
    type: 'CDO';
}

interface ClassSelector extends CssNodeCommon {
    type: 'ClassSelector';
    name: string;
}

interface Combinator extends CssNodeCommon {
    type: 'Combinator';
    name: string;
}

interface Comment extends CssNodeCommon {
    type: 'Comment';
    value: string;
}

interface Declaration extends CssNodeCommon {
    type: 'Declaration';
    important: boolean | string;
    property: string;
    value: Value | Raw;
}

interface DeclarationPlain extends CssNodeCommon {
    type: 'Declaration';
    important: boolean | string;
    property: string;
    value: ValuePlain | Raw;
}

interface DeclarationList extends CssNodeCommon {
    type: 'DeclarationList';
    children: List<CssNode>;
}

interface DeclarationListPlain extends CssNodeCommon {
    type: 'DeclarationList';
    children: CssNodePlain[];
}

interface Dimension extends CssNodeCommon {
    type: 'Dimension';
    value: string;
    unit: string;
}

interface FunctionNode extends CssNodeCommon {
    type: 'Function';
    name: string;
    children: List<CssNode>;
}

interface FunctionNodePlain extends CssNodeCommon {
    type: 'Function';
    name: string;
    children: CssNodePlain[];
}

interface Hash extends CssNodeCommon {
    type: 'Hash';
    value: string;
}

interface IdSelector extends CssNodeCommon {
    type: 'IdSelector';
    name: string;
}

interface Identifier extends CssNodeCommon {
    type: 'Identifier';
    name: string;
}

interface MediaFeature extends CssNodeCommon {
    type: 'MediaFeature';
    name: string;
    value: Identifier | NumberNode | Dimension | Ratio | null;
}

interface MediaQuery extends CssNodeCommon {
    type: 'MediaQuery';
    children: List<CssNode>;
}

interface MediaQueryPlain extends CssNodeCommon {
    type: 'MediaQuery';
    children: CssNodePlain[];
}

interface MediaQueryList extends CssNodeCommon {
    type: 'MediaQueryList';
    children: List<CssNode>;
}

interface MediaQueryListPlain extends CssNodeCommon {
    type: 'MediaQueryList';
    children: CssNodePlain[];
}

interface Nth extends CssNodeCommon {
    type: 'Nth';
    nth: AnPlusB | Identifier;
    selector: SelectorList | null;
}

interface NthPlain extends CssNodeCommon {
    type: 'Nth';
    nth: AnPlusB | Identifier;
    selector: SelectorListPlain | null;
}

interface NumberNode extends CssNodeCommon {
    type: 'Number';
    value: string;
}

interface Operator extends CssNodeCommon {
    type: 'Operator';
    value: string;
}

interface Parentheses extends CssNodeCommon {
    type: 'Parentheses';
    children: List<CssNode>;
}

interface ParenthesesPlain extends CssNodeCommon {
    type: 'Parentheses';
    children: CssNodePlain[];
}

interface Percentage extends CssNodeCommon {
    type: 'Percentage';
    value: string;
}

interface PseudoClassSelector extends CssNodeCommon {
    type: 'PseudoClassSelector';
    name: string;
    children: List<CssNode> | null;
}

interface PseudoClassSelectorPlain extends CssNodeCommon {
    type: 'PseudoClassSelector';
    name: string;
    children: CssNodePlain[] | null;
}

interface PseudoElementSelector extends CssNodeCommon {
    type: 'PseudoElementSelector';
    name: string;
    children: List<CssNode> | null;
}

interface PseudoElementSelectorPlain extends CssNodeCommon {
    type: 'PseudoElementSelector';
    name: string;
    children: CssNodePlain[] | null;
}

interface Ratio extends CssNodeCommon {
    type: 'Ratio';
    left: string;
    right: string;
}

interface Raw extends CssNodeCommon {
    type: 'Raw';
    value: string;
}

interface Rule extends CssNodeCommon {
    type: 'Rule';
    prelude: SelectorList | Raw;
    block: Block;
}

interface RulePlain extends CssNodeCommon {
    type: 'Rule';
    prelude: SelectorListPlain | Raw;
    block: BlockPlain;
}

interface Selector extends CssNodeCommon {
    type: 'Selector';
    children: List<CssNode>;
}

interface SelectorPlain extends CssNodeCommon {
    type: 'Selector';
    children: CssNodePlain[];
}

interface SelectorList extends CssNodeCommon {
    type: 'SelectorList';
    children: List<CssNode>;
}

interface SelectorListPlain extends CssNodeCommon {
    type: 'SelectorList';
    children: CssNodePlain[];
}

interface StringNode extends CssNodeCommon {
    type: 'String';
    value: string;
}

interface StyleSheet extends CssNodeCommon {
    type: 'StyleSheet';
    children: List<CssNode>;
}

interface StyleSheetPlain extends CssNodeCommon {
    type: 'StyleSheet';
    children: CssNodePlain[];
}

interface TypeSelector extends CssNodeCommon {
    type: 'TypeSelector';
    name: string;
}

interface UnicodeRange extends CssNodeCommon {
    type: 'UnicodeRange';
    value: string;
}

interface Url extends CssNodeCommon {
    type: 'Url';
    value: string;
}

interface Value extends CssNodeCommon {
    type: 'Value';
    children: List<CssNode>;
}

interface ValuePlain extends CssNodeCommon {
    type: 'Value';
    children: CssNodePlain[];
}

interface WhiteSpace extends CssNodeCommon {
    type: 'WhiteSpace';
    value: string;
}

type CssNode =
    AnPlusB
    | Atrule
    | AtrulePrelude
    | AttributeSelector
    | Block
    | Brackets
    | CDC
    | CDO
    | ClassSelector
    | Combinator
    | Comment
    | Declaration
    | DeclarationList
    | Dimension
    | FunctionNode
    | Hash
    | IdSelector
    | Identifier
    | MediaFeature
    | MediaQuery
    | MediaQueryList
    | Nth
    | NumberNode
    | Operator
    | Parentheses
    | Percentage
    | PseudoClassSelector
    | PseudoElementSelector
    | Ratio
    | Raw
    | Rule
    | Selector
    | SelectorList
    | StringNode
    | StyleSheet
    | TypeSelector
    | UnicodeRange
    | Url
    | Value
    | WhiteSpace;

type CssNodePlain =
    AnPlusB
    | AtrulePlain
    | AtrulePreludePlain
    | AttributeSelector
    | BlockPlain
    | BracketsPlain
    | CDC
    | CDO
    | ClassSelector
    | Combinator
    | Comment
    | DeclarationPlain
    | DeclarationListPlain
    | Dimension
    | FunctionNodePlain
    | Hash
    | IdSelector
    | Identifier
    | MediaFeature
    | MediaQueryPlain
    | MediaQueryListPlain
    | NthPlain
    | NumberNode
    | Operator
    | ParenthesesPlain
    | Percentage
    | PseudoClassSelectorPlain
    | PseudoElementSelectorPlain
    | Ratio
    | Raw
    | RulePlain
    | SelectorPlain
    | SelectorListPlain
    | StringNode
    | StyleSheetPlain
    | TypeSelector
    | UnicodeRange
    | Url
    | ValuePlain
    | WhiteSpace;

interface SyntaxParseError extends SyntaxError {
    input: string;
    offset: number;
    rawMessage: string;
}

interface ParseOptions {
    context?: string | undefined;
    atrule?: string | undefined;
    positions?: boolean | undefined;
    onComment?: (value: string, loc: CssLocation) => void;
    onParseError?: ((error: SyntaxParseError, fallbackNode: CssNode) => void) | undefined;
    filename?: string | undefined;
    offset?: number | undefined;
    line?: number | undefined;
    column?: number | undefined;
    parseAtrulePrelude?: boolean | undefined;
    parseRulePrelude?: boolean | undefined;
    parseValue?: boolean | undefined;
    parseCustomProperty?: boolean | undefined;
}

declare function parse(text: string, options?: ParseOptions): CssNode;

interface GenerateHandlers {
    children: (node: CssNode, delimiter?: (node: CssNode) => void) => void;
    node: (node: CssNode) => void;
    chunk: (chunk: string) => void;
    result: () => string;
}

interface GenerateOptions {
    sourceMap?: boolean | undefined;
    decorator?: ((handlers: GenerateHandlers) => GenerateHandlers) | undefined;
}

declare function generate(ast: CssNode, options?: GenerateOptions): string;

interface WalkContext {
    root: CssNode;
    stylesheet: StyleSheet | null;
    atrule: Atrule | null;
    atrulePrelude: AtrulePrelude | null;
    rule: Rule | null;
    selector: SelectorList | null;
    block: Block | null;
    declaration: Declaration | null;
    function: FunctionNode | PseudoClassSelector | PseudoElementSelector | null;
}

type EnterOrLeaveFn<NodeType = CssNode> = (this: WalkContext, node: NodeType, item: ListItem<CssNode>, list: List<CssNode>) => void;

interface WalkOptionsNoVisit {
    enter?: EnterOrLeaveFn | undefined;
    leave?: EnterOrLeaveFn | undefined;
    reverse?: boolean | undefined;
}

interface WalkOptionsVisit<NodeType extends CssNode = CssNode> {
    visit: NodeType['type'];
    enter?: EnterOrLeaveFn<NodeType> | undefined;
    leave?: EnterOrLeaveFn<NodeType> | undefined;
    reverse?: boolean | undefined;
}

type WalkOptions =
    WalkOptionsVisit<AnPlusB>
    | WalkOptionsVisit<Atrule>
    | WalkOptionsVisit<AtrulePrelude>
    | WalkOptionsVisit<AttributeSelector>
    | WalkOptionsVisit<Block>
    | WalkOptionsVisit<Brackets>
    | WalkOptionsVisit<CDC>
    | WalkOptionsVisit<CDO>
    | WalkOptionsVisit<ClassSelector>
    | WalkOptionsVisit<Combinator>
    | WalkOptionsVisit<Comment>
    | WalkOptionsVisit<Declaration>
    | WalkOptionsVisit<DeclarationList>
    | WalkOptionsVisit<Dimension>
    | WalkOptionsVisit<FunctionNode>
    | WalkOptionsVisit<Hash>
    | WalkOptionsVisit<IdSelector>
    | WalkOptionsVisit<Identifier>
    | WalkOptionsVisit<MediaFeature>
    | WalkOptionsVisit<MediaQuery>
    | WalkOptionsVisit<MediaQueryList>
    | WalkOptionsVisit<Nth>
    | WalkOptionsVisit<NumberNode>
    | WalkOptionsVisit<Operator>
    | WalkOptionsVisit<Parentheses>
    | WalkOptionsVisit<Percentage>
    | WalkOptionsVisit<PseudoClassSelector>
    | WalkOptionsVisit<PseudoElementSelector>
    | WalkOptionsVisit<Ratio>
    | WalkOptionsVisit<Raw>
    | WalkOptionsVisit<Rule>
    | WalkOptionsVisit<Selector>
    | WalkOptionsVisit<SelectorList>
    | WalkOptionsVisit<StringNode>
    | WalkOptionsVisit<StyleSheet>
    | WalkOptionsVisit<TypeSelector>
    | WalkOptionsVisit<UnicodeRange>
    | WalkOptionsVisit<Url>
    | WalkOptionsVisit<Value>
    | WalkOptionsVisit<WhiteSpace>
    | WalkOptionsNoVisit;

declare function walk(ast: CssNode, options: EnterOrLeaveFn | WalkOptions): void;

type FindFn = (this: WalkContext, node: CssNode, item: ListItem<CssNode>, list: List<CssNode>) => boolean;

declare function find(ast: CssNode, fn: FindFn): CssNode | null;
declare function findLast(ast: CssNode, fn: FindFn): CssNode | null;
declare function findAll(ast: CssNode, fn: FindFn): CssNode[];

interface Property {
    readonly basename: string;
    readonly name: string;
    readonly hack: string;
    readonly vendor: string;
    readonly prefix: string;
    readonly custom: boolean;
}

declare function property(value: string): Property;

interface Keyword {
    readonly basename: string;
    readonly name: string;
    readonly vendor: string;
    readonly prefix: string;
    readonly custom: boolean;
}

declare function keyword(value: string): Keyword;

declare function clone(node: CssNode): CssNode;

declare function fromPlainObject(node: CssNodePlain): CssNode;
declare function toPlainObject(node: CssNode): CssNodePlain;

/**
 * Definition syntax AtWord node
 */
interface DSNodeAtWord {
    type: 'AtKeyword';
    name: string;
}

/**
 * Definition syntax Comma node
 */
interface DSNodeComma {
    type: 'Comma';
}

/**
 * Definition syntax Function node
 */
interface DSNodeFunction {
    type: 'Function';
    name: string;
}

type DSNodeCombinator = '|' | '||' | '&&' | ' ';

/**
 * Definition syntax Group node
 */
interface DSNodeGroup {
    type: 'Group';
    terms: DSNode[];
    combinator: DSNodeCombinator;
    disallowEmpty: boolean;
    explicit: boolean;
}

/**
 * Definition syntax Keyword node
 */
interface DSNodeKeyword {
    type: 'Keyword';
    name: string;
}

/**
 * Definition syntax Multiplier node
 */
interface DSNodeMultiplier {
    type: 'Multiplier';
    comma: boolean;
    min: number;
    max: number;
    term: DSNodeMultiplied;
}

/**
 * Definition syntax Property node
 */
interface DSNodeProperty {
    type: 'Property';
    name: string;
}

/**
 * Definition syntax String node
 */
interface DSNodeString {
    type: 'String';
    value: string;
}

/**
 * Definition syntax Token node
 */
interface DSNodeToken {
    type: 'Token';
    value: string;
}

/**
 * Definition syntax Type node options
 */
interface DSNodeTypeOpts {
    type: 'Range';
    min: number | null;
    max: number | null;
}

/**
 * Definition syntax Type node
 */
interface DSNodeType {
    type: 'Type';
    name: string;
    opts: DSNodeTypeOpts | null;
}

/**
 * Definition syntax node
 */
type DSNode =
    DSNodeAtWord
    | DSNodeComma
    | DSNodeFunction
    | DSNodeGroup
    | DSNodeKeyword
    | DSNodeMultiplier
    | DSNodeProperty
    | DSNodeString
    | DSNodeToken
    | DSNodeType;

/**
 * Definition syntax node compatible with a multiplier
 */
type DSNodeMultiplied =
    DSNodeFunction
    | DSNodeGroup
    | DSNodeKeyword
    | DSNodeProperty
    | DSNodeString
    | DSNodeType;

/**
 * Definition syntax generate options
 */
interface DSGenerateOptions {
    forceBraces?: boolean | undefined;
    compact?: boolean | undefined;
    decorate?: ((result: string, node: DSNode) => void) | undefined;
}

/**
 * Definition syntax walk options
 */
interface DSWalkOptions {
    enter?: DSWalkEnterOrLeaveFn | undefined;
    leave?: DSWalkEnterOrLeaveFn | undefined;
}

/**
 * Definition syntax walk callback
 */
type DSWalkEnterOrLeaveFn = (node: DSNode) => void;

/**
 * DefinitionSyntax
 */
interface DefinitionSyntax {
    /**
     * Generates CSS value definition syntax from an AST
     *
     * @param node - The AST
     * @param options - Options that affect generation
     *
     * @example
     *  generate({type: 'Keyword', name: 'foo'}) => 'foo'
     */
    generate(node: DSNode, options?: DSGenerateOptions): string;

    /**
     * Generates an AST from a CSS value syntax
     *
     * @param source - The CSS value syntax to parse
     *
     * @example
     *  parse('foo | bar') =>
     *    {
     *      type: 'Group',
     *      terms: [
     *        { type: 'Keyword', name: 'foo' },
     *        { type: 'Keyword', name: 'bar' }
     *      ],
     *      combinator: '|',
     *      disallowEmpty: false,
     *      explicit: false
     *    }
     */
    parse(source: string): DSNodeGroup;

    /**
     * Walks definition syntax AST
     */
    walk(node: DSNode, options: DSWalkEnterOrLeaveFn | DSWalkOptions, context?: any): void;

    /**
     * Wrapper for syntax errors
     */
    syntaxError: SyntaxError;
}

declare const definitionSyntax: DefinitionSyntax;

declare const ident: {
    decode(input: string): string;
    encode(input: string): string;
};

declare const string: {
    encode(input: string, apostrophe?: boolean): string;
    decode(input: string): string;
};

declare const url: {
    decode(input: string): string;
    encode(input: string): string;
};

declare class SyntaxMatchError extends SyntaxError {
    rawMessage: string;
    syntax: string;
    css: string;
    mismatchOffset: number;
    mismatchLength: number;
    offset: number;
    line: number;
    column: number;
    loc: {
        source: string;
        start: { offset: number; line: number; column: number };
        end: { offset: number; line: number; column: number };
    };
}

declare class SyntaxReferenceError extends SyntaxError {
    reference: string;
}

interface LexerMatchResult {
    error: Error | SyntaxMatchError | SyntaxReferenceError | null;
}

declare class Lexer {
    matchProperty(propertyName: string, value: CssNode | string): LexerMatchResult;
}

declare function fork(extension: {
    atrules?: Record<string, string> | undefined,
    properties?: Record<string, string> | undefined,
    types?: Record<string, string> | undefined,
}): { lexer: Lexer };

export { AnPlusB, Atrule, AtrulePlain, AtrulePrelude, AtrulePreludePlain, AttributeSelector, Block, BlockPlain, Brackets, BracketsPlain, CDC, CDO, ClassSelector, Combinator, Comment, CssLocation, CssNode, CssNodeCommon, CssNodePlain, DSGenerateOptions, DSNode, DSNodeAtWord, DSNodeCombinator, DSNodeComma, DSNodeFunction, DSNodeGroup, DSNodeKeyword, DSNodeMultiplied, DSNodeMultiplier, DSNodeProperty, DSNodeString, DSNodeToken, DSNodeType, DSNodeTypeOpts, DSWalkEnterOrLeaveFn, DSWalkOptions, Declaration, DeclarationList, DeclarationListPlain, DeclarationPlain, DefinitionSyntax, Dimension, EnterOrLeaveFn, FilterFn, FindFn, FunctionNode, FunctionNodePlain, GenerateHandlers, GenerateOptions, Hash, IdSelector, Identifier, IteratorFn, Keyword, Lexer, LexerMatchResult, List, ListItem, MediaFeature, MediaQuery, MediaQueryList, MediaQueryListPlain, MediaQueryPlain, Nth, NthPlain, NumberNode, Operator, Parentheses, ParenthesesPlain, ParseOptions, Percentage, Property, PseudoClassSelector, PseudoClassSelectorPlain, PseudoElementSelector, PseudoElementSelectorPlain, Ratio, Raw, ReduceFn, Rule, RulePlain, Selector, SelectorList, SelectorListPlain, SelectorPlain, StringNode, StyleSheet, StyleSheetPlain, SyntaxMatchError, SyntaxParseError, SyntaxReferenceError, TypeSelector, UnicodeRange, Url, Value, ValuePlain, WalkContext, WalkOptions, WalkOptionsNoVisit, WalkOptionsVisit, WhiteSpace, clone, definitionSyntax, find, findAll, findLast, fork, fromPlainObject, generate, ident, keyword, parse, property, string, toPlainObject, url, walk };
