<template>
  <div>
    <a-card title="Postman Bulk Edit" bordered hoverable size="small">
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

      <prism-editor v-model="code" :highlight="highlighter" line-numbers :tabSize="0" />
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

    doubleQuotation: Boolean,

    needUpdate: Boolean
  },

  setup(props) {
    watch(() => props.needUpdate, (n, o) => {
      if (n !== o) {
        genApiCode(props.raw.filter(item => !item.frontend))
      }
    })

    const { code, highlighter, genApiCode, copyCode } = OutputMixin(props)



    return {
      code,
      highlighter,

      genApiCode,

      copyCode,
    }
  }
})
</script>