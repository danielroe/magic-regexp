import { Input } from './internal'
import { StripEscapes } from './types/escape'

export type IfSingle<T extends string, Yes, No> = StripEscapes<T> extends `${infer A}${infer B}`
  ? A extends ''
    ? Yes
    : B extends ''
    ? Yes
    : No
  : never

export const wrap = (s: string | Input<any>) => {
  const v = s.toString()
  return v.replace(/^\\/, '').length === 1 ? v : `(${v})`
}
