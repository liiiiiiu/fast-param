<template>
  <div>
    <a-card title="Laravel Migration" bordered hoverable size="small">
      <template v-if="code" #extra>
        <a-tooltip placement="top">
          <template #title>
            <span>复制</span>
          </template>
          <a-button type="dashed" shape="circle" @click="copyCode">
            <template #icon>
              <copy-outlined />
            </template>
          </a-button>
        </a-tooltip>
      </template>

      <prism-editor v-model="code" :highlight="highlighter" line-numbers :tabSize="tabSize" />
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from 'vue'
import { CopyOutlined } from '@ant-design/icons-vue'
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'

import { typeOptions } from '@/config/settings'
import OutputMixin from './Mixins/Output'
import { InputParamType } from '../types'

export default defineComponent({
  components: {
    PrismEditor,
    CopyOutlined,
  },

  props: {
    raw: {
      type: Array as PropType<Array<InputParamType>>,
      default: []
    },
    tabSize: {
      type: Number,
      default: 2
    },
    objName: String,
    showComments: Boolean,
    doubleQuote: Boolean,
    needUpdate: Boolean
  },

  setup(props) {
    watch(() => props.needUpdate, (n, o) => {
      if (n !== o) {
        genCode()
      }
    })

    const { code, QUOTES, NEWLINE, highlighter, copyCode } = OutputMixin(props)

    const BLUEPRINT = '$table'
    const ARROW = '->'
    const SEMI = ';'

    function genCode() {
      let table = ''

      const { indexNames, schema } = genSchemaCode()

      table += schema

      if (indexNames && indexNames.length) {
        table += NEWLINE
        table += NEWLINE

        Array.from(indexNames, (name, index) => {
          table += (BLUEPRINT + ARROW + `index(${QUOTES(name, props.doubleQuote)})` + SEMI)
          if (index !== indexNames.length - 1) table += NEWLINE
        })
      }

      code.value = table
    }

    function genSchemaCode() {
      const indexNames: string[] = []

      let schema = ''

      schema += (BLUEPRINT + ARROW + 'id()' + SEMI)
      schema += NEWLINE
      schema += NEWLINE

      Array.from(props.raw, param => {
        const { name, types, max, defaultValue, description, frontend } = param

        if (!frontend) {
          const type = (types && types.length) ? types[0] : 'string'
          const laravelType = typeOptions.filter(option => option.value === type)[0]

          const { laravelTypeName, laravelTypeDefaultValue, indexName } = transformLaravelType(name, laravelType?.laravel ?? 'string', laravelType?.larevel_default_value ?? '')

          schema += BLUEPRINT
          schema += `${ARROW}${laravelTypeName}(${QUOTES(name, props.doubleQuote)}${max ? (', ' + max) : ''})`
          schema += `${ARROW}default(${defaultValueMap[laravelTypeName](defaultValue || laravelTypeDefaultValue)})`
          schema += `${ARROW}comment(${QUOTES(description || '', props.doubleQuote)})`
          schema += SEMI

          schema += NEWLINE

          indexName && indexNames.push(indexName)
        }
      })

      schema += NEWLINE
      schema += (BLUEPRINT + ARROW + 'softDeletes()' + SEMI)
      schema += NEWLINE
      schema += (BLUEPRINT + ARROW + 'timestamps()' + SEMI)

      return { indexNames, schema }
    }

    const defaultValueMap = {
      'string': (value = '') => QUOTES(typeof value === 'string' ? value : '', props.doubleQuote),
      'integer': (value = 0) => +value,
      'unsignedTinyInteger': (value = 0) => +value,
      'unsignedBigInteger': (value = 0) => +value,
      'json': (value = '') => QUOTES(typeof value === 'string' ? value : '', props.doubleQuote),
      'dateTime': (value = '') => QUOTES(typeof value === 'string' ? value : '', props.doubleQuote)
    }

    // 转换 id 时间等字段的类型名称
    function transformLaravelType(name: string, type: string, defaultValue: any) {
      let laravelTypeName = type
      let laravelTypeDefaultValue = defaultValue
      let indexName = ''

      if (name.indexOf('_id') > -1) {
        laravelTypeName = 'unsignedBigInteger'
        laravelTypeDefaultValue = 0

        indexName = name
      }

      if (name.indexOf('_at') > -1 || name.indexOf('date') > -1) {
        laravelTypeName = 'dateTime'
        laravelTypeDefaultValue = ''
      }

      return { laravelTypeName, laravelTypeDefaultValue, indexName }
    }

    return {
      code,
      highlighter,

      genCode,

      copyCode,
    }
  }
})
</script>