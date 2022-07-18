export interface InputParamType {
  key: string
  name: string
  types: string[]
  optional: number
  readonly: number
  defaultValue: any
  description: string | null
  frontend: number
}