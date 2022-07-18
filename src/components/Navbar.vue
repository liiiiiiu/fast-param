<template>
  <div class="flex flex-row justify-between items-center mb-5">

    <logo @click="historyDrawerVisible = true" />

    <navbar-right @history="historyDrawerVisible = true" />

    <history-drawer :visible="historyDrawerVisible" @select="handleSelect" @close="historyDrawerVisible = false" />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Logo from './Logo.vue'
import NavbarRight from './NavbarRight.vue'
import HistoryDrawer from './HistoryDrawer.vue'

export default defineComponent({
  components: {
    Logo,
    NavbarRight,
    HistoryDrawer
  },

  setup(_props, { emit }) {
    let historyDrawerVisible = ref(false)

    const handleSelect = value => {
      emit('update', value)
    }

    return {
      historyDrawerVisible,

      handleSelect
    }
  }
})
</script>