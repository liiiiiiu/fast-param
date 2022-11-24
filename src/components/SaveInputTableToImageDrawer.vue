<template>
  <a-drawer :visible="show" placement="bottom" title="右键图片保存" :closable="false" forceRender @close="close">
    <div id="canvas" />
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    visible: Boolean,
    canvas: HTMLCanvasElement
  },

  emits: ['success', 'close'],

  setup(props, { emit }) {
    watch(() => props.visible, (n) => {
      show.value = n

      if (n) {
        renderCanvas()
      }
    })

    const show = ref<boolean>(false)

    const canvas = ref(null)

    function renderCanvas() {
      setTimeout(() => {
        const canvas = document.getElementById('canvas')
        canvas && canvas.appendChild(props.canvas)
      }, 80)
    }

    function clearCanvas() {
      const canvas = document.getElementById('canvas')
      try {
        canvas && canvas.removeChild(props.canvas)
      } catch (error) {}
    }

    const close = () => {
      clearCanvas()

      emit('close')
    }

    return {
      show,

      canvas,

      close,
    }
  }
})
</script>