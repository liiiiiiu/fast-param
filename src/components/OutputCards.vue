<template>
  <div>
    <div v-if="raw.length" class="mb-3">
      <a-space>
        <a-button type="dashed" @click="(tabSize = tabSize === 2 ? 4 : 2), needUpdate = !needUpdate">空格：{{
        tabSize
        }}</a-button>
        <a-button type="dashed" @click="(doubleQuotation = !doubleQuotation), needUpdate = !needUpdate">{{
        !doubleQuotation ? '单' : '双'
        }}引号</a-button>
        <a-button type="dashed" @click="(showComments = !showComments), needUpdate = !needUpdate">{{
        showComments ? '隐藏' : '显示'
        }}注释</a-button>
      </a-space>
    </div>

    <a-row :gutter="24">
      <a-col :span="8" :xs="24" :md="12" style="margin-bottom: 24px;">
        <output-default :raw="raw" :tab-size="tabSize" :obj-name="output.getObjName" :showComments="showComments" :double-quotation="doubleQuotation" :need-update="needUpdate" />
      </a-col>

      <a-col :span="8" :xs="24" :md="12" style="margin-bottom: 24px;">
        <output-typescript :raw="raw" :tab-size="tabSize" :obj-name="output.getObjName" :showComments="showComments" :double-quotation="doubleQuotation" :need-update="needUpdate" />
      </a-col>

      <a-col :span="8" :xs="24" :md="12" style="margin-bottom: 24px;">
        <output-null :raw="raw" :tab-size="tabSize" :obj-name="output.getObjName" :showComments="showComments" :double-quotation="doubleQuotation" :need-update="needUpdate" />
      </a-col>

      <a-col :span="8" :xs="24" :md="12" style="margin-bottom: 24px;">
        <output-postman :raw="raw" :double-quotation="doubleQuotation" :need-update="needUpdate" />
      </a-col>

      <a-col :span="8" :xs="24" :md="12" style="margin-bottom: 24px;">
        <output-mock :raw="raw" :tab-size="tabSize" :obj-name="output.getObjName" :showComments="showComments" :double-quotation="doubleQuotation" :need-update="needUpdate" />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
import OutputDefault from './OutputDefault.vue'
import OutputTypescript from './OutputTypeScript.vue'
import OutputMock from './OutputMock.vue'
import OutputNull from './OutputNull.vue'
import OutputPostman from './OutputPostman.vue'
import { outputStore } from '@/store'
import { InputParamType } from '../types'

export default defineComponent({
  components: {
    OutputDefault,
    OutputTypescript,
    OutputMock,
    OutputNull,
    OutputPostman
  },

  props: {
    raw: {
      type: Array as PropType<Array<InputParamType>>,
      default: []
    },

    updateTrigger: Boolean
  },

  setup(props) {
    watch(() => props.updateTrigger, (n, _o) => {
      needUpdate.value = n
    })

    const output = outputStore()

    watch(() => output.objName, (n, o) => {
      if (n !== o) {
        needUpdate.value = !needUpdate.value
      }
    })

    let needUpdate = ref(false)

    let tabSize = ref(2)

    let showComments = ref(true)

    let doubleQuotation = ref(false)

    return {
      output,

      needUpdate,

      tabSize,

      showComments,

      doubleQuotation
    }
  }
})
</script>