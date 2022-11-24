<template>
  <div>
    <a-config-provider :locale="locale">

      <navbar @update="runInput" />

      <input-table :raw="raw.list" :update-trigger="updateInputTrigger" @update="runOutput" />

      <a-divider style="height: 2px;" />

      <output-cards :raw="raw.list" :update-trigger="updateOutputTrigger" />

      <a-back-top />

    </a-config-provider>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import _ from 'lodash'

import { Navbar, InputTable, OutputCards } from '@/components'

import { InputParamType } from '@/types'

export default defineComponent({
  components: {
    Navbar,
    InputTable,
    OutputCards
  },

  setup() {
    const updateInputTrigger = ref(false)
    const updateOutputTrigger = ref(false)

    const raw = reactive({
      list: [] as InputParamType[]
    })

    const runInput = value => {
      raw.list = _.cloneDeep(value)
      updateInputTrigger.value = !updateInputTrigger.value
    }

    const runOutput = value => {
      raw.list = _.cloneDeep(value)
      updateOutputTrigger.value = !updateOutputTrigger.value
    }

    return {
      locale: zhCN,

      updateInputTrigger,
      updateOutputTrigger,

      raw,

      runInput,

      runOutput
    }
  }
})
</script>