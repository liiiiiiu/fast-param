<template>
  <a-drawer title="保存对象" placement="right" :visible="vis" :closable="false" @close="close">
    <a-input v-model:value="name" placeholder="输入对象名称" />
    <a-button type="primary" block class="mt-8" @click="save">保存</a-button>
    <p class="mt-4 text-center text-xs text-gray-500">保存完成后可前往历史记录中查看</p>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue'
import { appInfoStore, outputStore } from '@/store'
import { InputParamType } from '../types'
import { saveObj2LocalStorage } from '@/storage/localStorage'

export default defineComponent({
  props: {
    visible: Boolean,

    dataSource: {
      type: Array as PropType<Array<InputParamType>>,
      default: []
    }
  },

  emits: ['success', 'close'],

  setup(props, { emit }) {
    watch(() => props.visible, (n) => {
      vis.value = n
    })

    const appInfo = appInfoStore()
    const output = outputStore()

    let vis = ref<boolean>(false)

    let name = ref('')

    const save = () => {
      let objName = name.value || output.getObjName
      let objValue = props.dataSource
      let saveObj = {
        obj_name: objName,
        obj_value: objValue
      }

      // if (window.indexedDB) {
      //   await saveObj2IndexedDB(saveObj)
      // } else {
      //   saveObj2LocalStorage(saveObj)
      // }

      saveObj2LocalStorage(saveObj)

      output.setObjName(objName)

      // emit('success')

      close()
    }

    const close = () => {
      emit('close')
    }

    return {
      appInfo,

      vis,

      name,

      save,

      close,
    }
  }
})
</script>