<template>
  <div>
    <a-card title="TypeScript接口" bordered hoverable size="small">
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
        genCode(props.raw, props.showComments, true)
      }
    })

    const { code, highlighter, genCode, copyCode } = OutputMixin(props)

    return {
      code,
      highlighter,

      genCode,

      copyCode,
    }
  }
})
</script>