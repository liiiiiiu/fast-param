import { ref } from 'vue'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'
import useClipboard from 'vue-clipboard3'
import Mock from 'mockjs'
import { message } from 'ant-design-vue'

import { InputParamType } from '@/types'
import { ravatar, rimage, rurl, rnickName, rtitle, rid, rphone, rdate, rdateInt, rcreatedAt, rcreatedAtInt, remail, rprovince, rcity, raddress, rdistrict, rip } from '@/utils/re'

export default function (props) {
  const code = ref(undefined)

  const DEFAULT_VALUE = 'null'

  const SPACE = ' '

  const INDENT = (num = 1) => {
    if (typeof num !== 'number') num = 1

    if (num === 0) return SPACE

    return SPACE.repeat(+num || 1)
  }

  const NEWLINE = '\n'

  const GET_DECLARATION = isTS => !isTS ? 'const' : 'interface'

  const QUOTES = (value = '', isDouble: boolean = false) => {
    const quotation = isDouble ? '"' : "'"

    return `${quotation + value + quotation}`
  }

  // 代码高亮
  const highlighter = code => highlight(code, languages.js)

  // 根据默认值给属性赋值
  function setDefault(defaultValue: any, types: string[], isDouble: boolean = false) {
    if (!types || !types.length) return defaultValue

    return types[0] === 'string' ? QUOTES(defaultValue, isDouble) : defaultValue
  }

  // 根据类型给属性赋对应的空值
  function setDefaultByType(types: string[], isDouble: boolean = false) {
    for (let type of types) {
      if (['string[]', 'number[]', 'boolean[]', 'any[]'].includes(type)) {
        type = 'array'
      }

      switch (type) {
        case 'string':
          return QUOTES('', isDouble)
        case 'number':
          return 0
        case 'boolean':
          return 'false'
        case 'array':
          return '[]'
        case 'object':
          return '{}'
        case 'undefined':
          return 'undefined'
        default:
          return 'null'
      }
    }
  }

  // 内置mock规则
  // 输入的字段命中内置规则后使用
  // 参考 Apifox
  // https://www.apifox.cn/help/app/introduce/
  const _internalMockRules: any = {
    'avatar': {
      rule: "@image('100x100')",
      re: ravatar,
    },
    'image': {
      rule: "@image('400x400')",
      re: rimage,
    },
    'url': {
      rule: "@url('http')",
      re: rurl,
    },
    'nickName': {
      rule: "@cname",
      re: rnickName,
    },
    'title': {
      rule: "@ctitle",
      re: rtitle,
    },
    'id': {
      rule: "@natural(1,100)",
      re: rid,
    },
    'phone': {
      rule: "@natural(18800000000, 18899999999)",
      re: rphone,
    },
    'date': {
      rule: "@date('yyyy-MM-dd')",
      re: rdate,
    },
    'date_int': {
      rule: "@date('yyyyMMdd')",
      re: rdateInt,
    },
    'created_at': {
      rule: "@datetime('yyyy-MM-dd HH:mm:ss')",
      re: rcreatedAt,
    },
    'created_at_int': {
      rule: "@datetime('T')",
      re: rcreatedAtInt,
    },
    'email': {
      rule: "@email('qq.com')",
      re: remail,
    },
    'province': {
      rule: "@province",
      re: rprovince,
    },
    'city': {
      rule: "@city",
      re: rcity,
    },
    'address': {
      rule: "@address",
      test: raddress,
    },
    'district': {
      rule: "@county",
      re: rdistrict,
    },
    'ip': {
      rule: "@ip",
      re: rip,
    },
    '*': {
      rule: "@natural(1, 100)",
      re: null,
    },
  }
  // 使用 Mock 给属性赋值
  function setMock(name: string, type: string, isDouble: boolean = false, param: InputParamType) {
    // console.log('name', name, type)

    if (!type) return DEFAULT_VALUE

    if (type.indexOf('object') > -1) {
      return '{}'
    }

    if (type.indexOf('[]') > -1) {
      // string[] any[]
      if (type.indexOf('string') > -1 || type.indexOf('any') > -1) {
        return `[${Array.from({ length: 5 }, () => `${QUOTES(Mock.mock('@ctitle'), isDouble)}`)}]`
      }
      // number[]
      else if (type.indexOf('number') > -1) {
        return `[${Array.from({ length: 5 }, () => Mock.mock('@integer(0, 100)'))}]`
      }
      // boolean[]
      else if (type.indexOf('boolean') > -1) {
        return `[${Array.from({ length: 5 }, () => Mock.mock('@boolean'))}]`
      }
    }

    let final: any;

    const mockString = () => {
      let res = '@ctitle'
      if (param.min || param.max) {
        res = `@ctitle(${param.min || 1}, ${param.max || 50})`
      }
      return res
    }

    for (let key in _internalMockRules) {
      let value = _internalMockRules[key]
      if (value.re && value.re.test(name + '')) {
        final = value.rule !== '@ctitle' ? value.rule : mockString()
        break
      }
    }

    if (!final) {
      switch(type) {
        case 'string':
          final = mockString()
          break
        case 'number':
          final = '@integer(0, 100)'
          break
        case 'boolean':
          final = '@boolean'
          break
        case 'undefined':
          final = undefined
          break
        default:
          final = null
          break
      }
    }

    if (!final) return final

    try {
      let result = Mock.mock(final)
      return result && type === 'string' ? QUOTES(result, isDouble) : result
    } catch (error: any) {
      throw Error(error)
    }
  }

  // 生成对象名
  function genObjName(isTS: boolean = false) {
    return `${GET_DECLARATION(isTS)}${SPACE}${!isTS ? props.objName : (props.objName.length > 1 ? props.objName[0].toUpperCase() + props.objName.slice(1).toLowerCase() : props.objName.toUpperCase())}${SPACE}${!isTS ? `=${SPACE}` : ''}`
  }

  // 生成对象主体代码
  // extraSpace 生成数组格式时，需要对象根据 tabSize 再次进行缩进
  function genObjMajor(params: InputParamType[], showComments: boolean, extraSpace: number = 0, isTS: boolean = false, isMock: boolean = false, isNull: boolean = false, isPostman: boolean = false) {
    const tabSize = props.tabSize || 0
    let strParams = !isPostman ? NEWLINE : ''

    let index = 0
    let paramsLen = params.length
    for (; index < paramsLen; index++) {
      let param = params[index]

      if (isPostman && !!param.frontend) continue

      // 拼接注释
      if (showComments && param.description) {
        // 缩进
        strParams += INDENT(tabSize + extraSpace)
        // 描述
        strParams += `// ${param.description}`
        // 换行
        strParams += NEWLINE
      }

      // 拼接内容
      // 缩进
      strParams += INDENT(tabSize + extraSpace)

      // 属性：属性值
      if (!param.name) {
        param.name = `['empty_${index}']`
      }
      let readonly = (isTS && !!param.readonly) ? 'readonly ' : ''
      let optional = ((isTS && !!param.optional) ? '?:' : ':') + (!isPostman ? SPACE : '')
      let valueOrType = !isTS
                          ? !isMock
                              ? (!isNull && param.defaultValue)
                                ? setDefault(param.defaultValue, param.types, props.doubleQuote)
                                :(param.types && param.types.length ? setDefaultByType(param.types, props.doubleQuote) : DEFAULT_VALUE)
                              : ((param.types && param.types.length) ? setMock(param.name, param.types[0], props.doubleQuote, param) : DEFAULT_VALUE)
                          : (param.types && param.types.length) ? param.types.join(' | ') : DEFAULT_VALUE
      strParams += `${readonly}${param.name}${optional}${valueOrType}`

      // 逗号
      strParams += ((!isTS && !isPostman) ? ',' : '')
      // 换行
      strParams += ((!isPostman || (isPostman && index !== paramsLen - 1)) ? NEWLINE : '')
    }

    return !isPostman ? INDENT(extraSpace) + `{`
                        + strParams
                        + (extraSpace ? INDENT(extraSpace) : '') + '}'
                      : strParams
  }

  // 生成代码底部广告
  function genBottomAdv(isMock: boolean = false) {
    let bottomAdv = ''
    if (isMock) {
      bottomAdv += NEWLINE
      bottomAdv += `// 支持 Apifox 内置 Mock 规则：`
      bottomAdv += NEWLINE
      bottomAdv += '// https://www.apifox.cn/help/app/introduce/'
    }
    return bottomAdv
  }

  function rawException(raw) {
    return !raw || !Array.isArray(raw) || !raw.length
  }

  /**
   * 生成代码！
   * @param raw 原始数据
   * @param showComments 是否显示注释
   * @param isTS 是否为 TypeScript 输出
   * @param isMock 是否为 Mock 输出
   * @param isNull 是否为 空值 输出
   * @returns
   */
  const genCode = (raw: InputParamType[], showComments: boolean = false, isTS: boolean = false, isMock: boolean = false, isNull: boolean = false) => {
    if (rawException(raw)) {
      code.value = ''
      return ''
    }

    let objName = genObjName(isTS)
    let objMajor = genObjMajor(raw, showComments, 0, isTS, isMock, isNull)
    let bottomAdv = showComments ? genBottomAdv(isMock) : ''
    let finalCode = objName + objMajor + bottomAdv
    // console.log('genCode', finalCode)

    code.value = finalCode

    return finalCode
  }

  // 生成数组类型的代码
  const genArrayTypeCode = (raw: InputParamType[], showComments: boolean = false, isTS: boolean = false, isMock: boolean = false, isNull: boolean = false) => {
    if (rawException(raw)) {
      code.value = ''
      return ''
    }

    let objName = genObjName(isTS)
    let objMajor = NEWLINE

    for (let i = 0; i < 5; i++) {
      objMajor += genObjMajor(raw, showComments, props.tabSize, isTS, isMock, isNull)
      objMajor += ','
      objMajor += NEWLINE
    }

    const finalCode = objName
                      + '['
                      + objMajor
                      + ']'
    // console.log('genArrayTypeCode', finalCode)

    code.value = finalCode

    return finalCode
  }

  const genApiCode = (raw: InputParamType[]) => {
    if (rawException(raw)) {
      code.value = ''
      return ''
    }

    const objMajor = genObjMajor(raw, false, 0, false, false, false, true)

    code.value = objMajor

    // console.log('genApiCode', objMajor)

    return objMajor
  }

  // 复制代码
  const copyCode = async () => {
    try {
      const { toClipboard } = useClipboard()
      await toClipboard(code.value)
      message.success('已复制！')
    } catch (e) {
      console.error(e)
    }
  }

  // 用于对象转为数组格式
  const codeOrArrayTypeCode = ref(false)

  return {
    code,

    SPACE,

    INDENT,

    NEWLINE,

    QUOTES,

    highlighter,

    genCode,

    genArrayTypeCode,

    genApiCode,

    copyCode,

    codeOrArrayTypeCode,
  }
}