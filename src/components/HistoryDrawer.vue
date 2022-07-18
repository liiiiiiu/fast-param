<template>
  <a-drawer title="历史记录" placement="right" :visible="vis" :closable="false" @close="close">
    <div v-if="history.lists.length" class="mb-3">
      <a-space>
        <a-popconfirm title="清空所有记录？" @confirm="deleteAll">
          <a-button type="dashed" danger>清空记录</a-button>
        </a-popconfirm>
      </a-space>
    </div>

    <div v-if="history.lists.length">
      <div v-for="(item, index) in history.lists" :key="index" class="mb-5">
        <a-card size="small" :title="item.obj_name" bordered hoverable>
          <template #extra>
            <a-tooltip placement="top">
              <template #title>
                <span>删除</span>
              </template>
              <a-button type="dashed" shape="circle" danger size="small" @click="deleteItem(index)">
                <template #icon>
                  <delete-outlined />
                </template>
              </a-button>
            </a-tooltip>
          </template>

          <div @click="select(index)">
            <a-table :data-source="item.obj_value" size="small" :pagination="false">
              <a-table-column key="name" title="属性名" data-index="name" />
              <a-table-column key="description" title="描述" data-index="description" />
            </a-table>
          </div>
        </a-card>
      </div>
    </div>
    <a-empty v-else />
  </a-drawer>
</template>

<script lang="ts">
import _ from 'lodash'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref, watch } from 'vue'
import { appInfoStore } from '@/store'
import { getLocalStorageOfObj, setLocalStorageOfObj, removeLocalStorageOfObj } from '@/storage/localStorage'

export default defineComponent({
  components: {
    DeleteOutlined
  },

  props: {
    visible: Boolean
  },

  emits: ['select', 'close'],

  setup(props, { emit }) {
    watch(() => props.visible, (n) => {
      vis.value = n

      if (n) {
        getHistoryData()
      } else {
        history.lists = []
      }
    })

    const appInfo = appInfoStore()

    let vis = ref<boolean>(false)

    let history = reactive({
      lists: []
    })
    function getHistoryData() {
      history.lists = JSON.parse(getLocalStorageOfObj() || JSON.stringify([]))
      // console.log('getHistoryData', history.lists)
    }

    const deleteItem = (index: number) => {
      history.lists.splice(index, 1)

      setLocalStorageOfObj(_.cloneDeep(history.lists))
    }

    const deleteAll = () => {
      history.lists = []

      removeLocalStorageOfObj()
    }

    const select = (index) => {
      emit('select', history.lists[index].obj_value)

      emit('close')
    }

    const close = () => {
      emit('close')
    }

    return {
      appInfo,

      vis,

      history,

      deleteItem,

      deleteAll,

      select,

      close,
    }
  }
})
</script>