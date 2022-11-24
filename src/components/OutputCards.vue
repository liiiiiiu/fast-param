<template>
  <div>
    <div v-if="raw.length" class="mb-3">
      <a-space>
        <a-button type="dashed" @click="(tabSize = tabSize === 2 ? 4 : 2), needUpdate = !needUpdate">缩进：{{
        tabSize
        }}</a-button>
        <a-button type="dashed" @click="(doubleQuote = !doubleQuote), needUpdate = !needUpdate">{{
        !doubleQuote ? '单' : '双'
        }}引号</a-button>
        <a-button type="dashed" @click="(showComments = !showComments), needUpdate = !needUpdate">{{
        showComments ? '隐藏' : '显示'
        }}注释</a-button>
      </a-space>
    </div>

    <div style="column-gap: 24px; column-count: 2;">
      <div style="margin-bottom: 24px; break-inside: avoid;">
        <output-default :raw="raw" :tab-size="tabSize" :obj-name="output.getObjName" :showComments="showComments" :double-quote="doubleQuote" :need-update="needUpdate" />
      </div>
      <div style="margin-bottom: 24px; break-inside: avoid;">
        <output-null :raw="raw" :tab-size="tabSize" :obj-name="output.getObjName" :showComments="showComments" :double-quote="doubleQuote" :need-update="needUpdate" />
      </div>
      <div style="margin-bottom: 24px; break-inside: avoid;">
        <output-mock :raw="raw" :tab-size="tabSize" :obj-name="output.getObjName" :showComments="showComments" :double-quote="doubleQuote" :need-update="needUpdate" />
      </div>
      <div style="margin-bottom: 24px; break-inside: avoid;">
        <output-typescript :raw="raw" :tab-size="tabSize" :obj-name="output.getObjName" :showComments="showComments" :double-quote="doubleQuote" :need-update="needUpdate" />
      </div>
      <div style="margin-bottom: 24px; break-inside: avoid;">
        <output-postman :raw="raw" :double-quote="doubleQuote" :need-update="needUpdate" />
      </div>
      <div style="margin-bottom: 24px; break-inside: avoid;">
        <output-laravel :raw="raw" :tab-size="tabSize" :obj-name="output.getObjName" :showComments="showComments" :double-quote="doubleQuote" :need-update="needUpdate" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'

import OutputDefault from './OutputDefault.vue'
import OutputTypescript from './OutputTypescript.vue'
import OutputMock from './OutputMock.vue'
import OutputNull from './OutputNull.vue'
import OutputPostman from './OutputPostman.vue'
import OutputLaravel from './OutputLaravel.vue'

import { outputStore } from '@/store'
import { InputParamType } from '../types'

export default defineComponent({
  components: {
    OutputDefault,
    OutputTypescript,
    OutputMock,
    OutputNull,
    OutputPostman,
    OutputLaravel
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

    const needUpdate = ref(false)

    const tabSize = ref(2)

    const showComments = ref(true)

    const doubleQuote = ref(false)

    return {
      output,

      needUpdate,

      tabSize,

      showComments,

      doubleQuote
    }
  }
})
</script>