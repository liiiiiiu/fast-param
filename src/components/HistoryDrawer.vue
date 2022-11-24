<template>
  <a-drawer :visible="show" placement="right" title="历史记录" :closable="false" @close="close">
    <template #extra v-if="history.list.length">
      <a-popconfirm placement="rightTop" title="清空历史记录？" @confirm="deleteAll">
        <a-button type="dashed" shape="circle" danger>
          <template #icon>
            <delete-outlined />
          </template>
        </a-button>
      </a-popconfirm>
    </template>

    <div v-if="history.list.length">
      <div v-for="(item, index) in history.list" :key="index" class="mb-4">
        <a-card size="small" :title="item.obj_name" bordered hoverable>
          <template #extra>
            <a-button type="dashed" shape="circle" class="mr-4" @click="select(index)">
              <template #icon>
                <edit-outlined />
              </template>
            </a-button>

            <a-popconfirm placement="rightTop" title="删除记录？" @confirm="deleteItem(index)">
              <a-button type="dashed" shape="circle" danger>
                <template #icon>
                  <delete-outlined />
                </template>
              </a-button>
            </a-popconfirm>
          </template>

          <a-table :data-source="item.obj_value" size="small" :pagination="false">
            <a-table-column key="name" title="属性名" data-index="name" />
            <a-table-column key="description" title="描述" data-index="description" />
          </a-table>
        </a-card>
      </div>
    </div>
    <a-empty v-else />
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import _ from 'lodash'

import { outputStore } from '@/store'
import { getLocalObjects, setLocalObjects, removeLocalObjects } from '@/utils/storage'

export default defineComponent({
  components: {
    DeleteOutlined,
    EditOutlined
  },

  props: {
    visible: Boolean
  },

  emits: ['select', 'close'],

  setup(props, { emit }) {
    watch(() => props.visible, (n) => {
      show.value = n

      if (n) {
        getHistoryData()
      } else {
        history.list = []
      }
    })

    const show = ref<boolean>(false)

    const output = outputStore()

    const history = reactive({
      list: []
    })

    async function getHistoryData() {
      history.list = await getLocalObjects()
    }

    const deleteItem = (index: number) => {
      history.list.splice(index, 1)

      setLocalObjects(_.cloneDeep(history.list))
    }

    const deleteAll = () => {
      history.list = []

      removeLocalObjects()
    }

    const select = (index) => {
      output.setObjName(history.list[index].obj_name)

      emit('select', history.list[index].obj_value)

      emit('close')
    }

    const close = () => {
      emit('close')
    }

    return {
      show,

      history,

      deleteItem,

      deleteAll,

      select,

      close,
    }
  }
})
</script>