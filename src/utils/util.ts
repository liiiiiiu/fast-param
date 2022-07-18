export let objProto = Object.prototype

export let fnToString = objProto.toString

export function getTag(value: any): string {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return fnToString.call(value)
}

/**
 * 是否为 Object 类型
 * @param value 待检测的值
 * @returns 检测结果
 */
export function isPlainObject(value: any): boolean {
  return getTag(value) === '[object Object]'
}