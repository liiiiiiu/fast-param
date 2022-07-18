<template>
  <div>
    <a-card title="默认值" bordered hoverable size="small">
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
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'
import { CopyOutlined } from '@ant-design/icons-vue'
import { defineComponent, PropType, watch } from 'vue'
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

    doubleQuotation: Boolean,

    needUpdate: Boolean
  },

  setup(props) {
    watch(() => props.needUpdate, (n, o) => {
      if (n !== o) {
        genCode(props.raw, props.showComments)
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