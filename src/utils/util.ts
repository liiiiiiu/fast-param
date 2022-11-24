export const objProto = Object.prototype

export const fnToString = objProto.toString

export function getTag(value: any): string {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return fnToString.call(value)
}

export function isPlainObject(value: any): boolean {
  return getTag(value) === '[object Object]'
}