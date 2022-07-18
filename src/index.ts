import type { Flag } from './core/flags'
import { Input, exactly } from './core/inputs'

const MagicRegExpSymbol = Symbol('MagicRegExp')

export type MagicRegExp<Value extends string, T = never> = RegExp & {
  [MagicRegExpSymbol]: T & Value
}

export const createRegExp = <Value extends string, NamedGroups extends string = never>(
  raw: Input<Value, NamedGroups> | Value,
  flags?: Flag[]
) => new RegExp(exactly(raw).toString(), flags?.join('')) as MagicRegExp<`/${Value}/`, NamedGroups>

export * from './core/flags'
export * from './core/inputs'

type ExtractNamedGroups<T extends MagicRegExp<string, string>> = T extends MagicRegExp<
  string,
  infer V
>
  ? V
  : never

export type MagicRegExpMatchArray<T extends MagicRegExp<string, string>> = Omit<
  RegExpMatchArray,
  'groups'
> & {
  groups: Record<ExtractNamedGroups<T>, string | undefined>
}

// Add additional overload to global String object types to allow for typed capturing groups
declare global {
  interface String {
    match<T extends string, Regexp extends MagicRegExp<any, T>>(
      regexp: Regexp
    ): MagicRegExpMatchArray<Regexp> | null

    matchAll<T extends string, Regexp extends MagicRegExp<any, T>>(
      regexp: Regexp
    ): IterableIterator<MagicRegExpMatchArray<Regexp>>
  }
}
