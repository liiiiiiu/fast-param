<template>
  <div class="flex flex-row items-center">
    <a-space>
      <div class="p-1.5 cursor-pointer">
        <a href="mailto:1578600238@qq.com">
          <mail-outlined class="text-2xl" />
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
import { MailOutlined, BarsOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    MailOutlined,
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