<template>
  <div class="flex flex-row items-center">
    <a-space>
      <div class="mr-0.5 p-1.5 cursor-pointer">
        <a href="https://github.com/liiiiiiu/fast-param" target="_blank">
          <github-outlined class="text-2xl" />
        </a>
      </div>
      <div class="p-1.5 cursor-pointer" @click="openHistory">
        <a-tooltip placement="top">
          <template #title>
            <span>历史记录</span>
          </template>
          <bars-outlined class="text-2xl" />
        </a-tooltip>
      </div>
    </a-space>
  </div>
</template>

<script lang="ts">
import { GithubOutlined, BarsOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    GithubOutlined,
    BarsOutlined
  },

  emits: ['history'],

  setup(_props, { emit }) {
    const openHistory = () => {
      emit('history')
    }

    return {
      openHistory
    }
  }
})
</script>