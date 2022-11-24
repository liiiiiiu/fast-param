<template>
  <a-drawer :visible="show" placement="right" title="保存对象" :closable="false" @close="close">
    <a-input v-model:value="name" allowClear placeholder="输入对象名称" />
    <a-button type="primary" block class="mt-8" @click="save">保存</a-button>
    <p class="mt-4 text-center text-xs text-gray-500">保存完成后可前往历史记录中查看</p>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue'

import { outputStore } from '@/store'
import { InputParamType } from '../types'
import { getLocalObjects, setLocalObjects } from '@/utils/storage'

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
      show.value = n
    })

    const output = outputStore()

    const show = ref<boolean>(false)

    const name = ref('')

    const save = async () => {
      const objName = name.value || output.getObjName
      const objValue = props.dataSource

      output.setObjName(objName)

      const localObjects: any[] = await getLocalObjects()

      localObjects.unshift({
        obj_name: objName,
        obj_value: objValue
      })

      if (localObjects.length > 200) {
        localObjects.pop()
      }

      setLocalObjects(localObjects)

      close()
    }

    const close = () => {
      name.value = ''

      emit('close')
    }

    return {
      show,

      name,

      save,

      close,
    }
  }
})
</script>