<template>
  <div>
    <a-card title="Mock" bordered hoverable size="small">
      <template v-if="code" #extra>
        <a-space>
          <a-tooltip placement="top">
            <template #title>
              <span>刷新</span>
            </template>
            <a-button type="dashed" shape="circle" @click="refreshMockCode">
              <template #icon>
                <reload-outlined />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip placement="top">
            <template #title>
              <span>转为{{ codeOrArrayTypeCode ? '对象' : '数组' }}</span>
            </template>
            <a-button type="dashed" shape="circle" @click="toggleMockCode">
              <template #icon>
                <template v-if="codeOrArrayTypeCode">
                  <tags-outlined />
                </template>
                <template v-else>
                  <tag-outlined />
                </template>
              </template>
            </a-button>
          </a-tooltip>
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
        </a-space>
      </template>

      <prism-editor v-model="code" :highlight="highlighter" line-numbers :tabSize="tabSize" />
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from 'vue'
import { ReloadOutlined, CopyOutlined, TagOutlined, TagsOutlined } from '@ant-design/icons-vue'
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'

import OutputMixin from './Mixins/Output'
import { InputParamType } from '../types'

export default defineComponent({
  components: {
    PrismEditor,
    ReloadOutlined,
    CopyOutlined,
    TagOutlined,
    TagsOutlined
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
        !codeOrArrayTypeCode.value ? genCode(props.raw, props.showComments, false, true) : genArrayTypeCode(props.raw, props.showComments, false, true)
      }
    })

    const { code, highlighter, genCode, genArrayTypeCode, copyCode, codeOrArrayTypeCode } = OutputMixin(props)

    const toggleMockCode = () => {
      const flag = codeOrArrayTypeCode.value

      !flag ? genArrayTypeCode(props.raw, props.showComments, false, true) : genCode(props.raw, props.showComments, false, true)

      codeOrArrayTypeCode.value = !flag
    }

    const refreshMockCode = () => {
      !codeOrArrayTypeCode.value ? genCode(props.raw, props.showComments, false, true) : genArrayTypeCode(props.raw, props.showComments, false, true)
    }

    return {
      code,

      highlighter,

      genCode,

      copyCode,

      codeOrArrayTypeCode,
      toggleMockCode,

      refreshMockCode,
    }
  }
})
</script>