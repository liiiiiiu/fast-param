<template>
  <div class="flex items-center cursor-pointer">
    <img :src="appInfo.getLogo" :alt="appInfo.getAppTitle" :title="appInfo.getAppTitle" class="w-14 h-auto">
    <div class="ml-3">
      <h2 class="mb-0">{{ appInfo.getAppTitle }}</h2>
      <p class="mb-0 text-xs text-gray-600 underline italic">{{ appInfo.getAppSlogan }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { appInfoStore } from '@/store'

export default defineComponent({
  setup() {
    const appInfo = appInfoStore()

    return {
      appInfo
    }
  }
})
</script>