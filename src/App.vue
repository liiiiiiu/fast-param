<template>
  <div>
    <a-config-provider :locale="locale">

      <navbar @update="runInput" />

      <input-table :raw="raw.lists" :update-trigger="updateInputTrigger" @update="runOutput" />

      <a-divider style="height: 2px; background-color: #d6d6d6" />

      <output-cards :raw="raw.lists" :update-trigger="updateOutputTrigger" />

      <a-back-top />

    </a-config-provider>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { defineComponent, reactive, ref } from 'vue'
import { Navbar, InputTable, OutputCards } from '@/components'
import { InputParamType } from '@/types'

export default defineComponent({
  components: {
    Navbar,
    InputTable,
    OutputCards
  },

  setup() {
    let updateInputTrigger = ref(false)
    let updateOutputTrigger = ref(false)

    let raw = reactive({
      lists: [] as InputParamType[]
    })

    const runInput = value => {
      raw.lists = _.cloneDeep(value)
      updateInputTrigger.value = !updateInputTrigger.value
    }

    const runOutput = value => {
      raw.lists = _.cloneDeep(value)
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