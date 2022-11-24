<template>
  <div>

    <a-row>
      <a-col :span="24">
        <div>
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center">
              <a-button type="dashed" class="mr-4" @click="add">添加属性</a-button>

              <a-popconfirm v-if="dataSource.list.length" title="清空所有属性？" @confirm="deleteAll">
                <a-button type="dashed" danger>清空属性</a-button>
              </a-popconfirm>
            </div>

            <div v-if="dataSource.list.length" class="flex items-center">
              <a-tooltip placement="top">
                <template #title>
                  <span>保存为图片</span>
                </template>
                <a-button shape="circle" @click="saveInputTable2Image" class="mr-4">
                  <template #icon>
                    <picture-outlined />
                  </template>
                </a-button>
              </a-tooltip>

              <a-tooltip placement="top">
                <template #title>
                  <span>保存对象</span>
                </template>
                <a-button shape="circle" @click="saveInputTableVisible = true">
                  <template #icon>
                    <save-outlined />
                  </template>
                </a-button>
              </a-tooltip>
            </div>
          </div>

          <a-table id="table" :columns="!isSaving ? columns.filter(col => col.colSpan !== 0) : columns.filter(col => (col.colSpan !== 0 && col.dataIndex !== 'operation'))" :data-source="dataSource.list" :loading="isSaving" bordered :pagination="false" :custom-row="handleCustomRow" size="small">
            <template #bodyCell="{ column, text, record }">
              <template v-if="['name', 'defaultValue', 'description'].includes(column.dataIndex)">
                <div>
                  <a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]"
                    :maxlength="column.dataIndex === 'description' ? 50 : 20" style="margin: -5px 0" />
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'types'">
                <div>
                  <a-checkbox-group v-if="editableData[record.key]"
                    v-model:value="editableData[record.key][column.dataIndex]" name="checkboxgroup"
                    :options="typeOptions" style="margin: -5px 0" />
                  <template v-else>
                    <span>{{ text.join(',') }}</span>
                    <span v-if="text.includes('string') && (record.min || record.max)" class="pl-2">
                      [{{ record.min }}, {{ record.max }}]
                    </span>
                  </template>

                  <div v-if="editableData[record.key] && editableData[record.key][column.dataIndex].includes('string')" class="flex item-center mt-4">
                    <a-input v-model:value="editableData[record.key]['min']" type="number" placeholder="min" class="mr-2" />

                    <a-input v-model:value="editableData[record.key]['max']" type="number" placeholder="max" />
                  </div>
                </div>
              </template>
              <template v-else-if="['optional', 'readonly', 'frontend'].includes(column.dataIndex)">
                <div>
                  <a-radio-group v-if="editableData[record.key]"
                    v-model:value="editableData[record.key][column.dataIndex]" style="margin: -5px 0">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                  </a-radio-group>
                  <template v-else>
                    <span v-if="column.dataIndex !== 'frontend'">
                      {{ !!text ? '是' : '否' }}
                    </span>
                    <span v-else :class="[!!text ? 'text-green-600': '']">
                      {{ !!text ? '是' : '否' }}
                    </span>
                  </template>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'operation'">
                <div class="editable-row-operations">
                  <span v-if="editableData[record.key]">
                    <a-space>
                      <a-button type="link" size="small" @click="save(record.key)">保存</a-button>
                      <a-button type="link" size="small" danger @click="cancel(record.key)">取消</a-button>
                    </a-space>
                  </span>
                  <span v-else>
                    <a-button type="link" size="small" @click="edit(record.key)">编辑</a-button>
                    <a-button type="link" size="small" danger @click="deleteItem(record.key)">删除</a-button>
                  </span>
                </div>
              </template>
            </template>
          </a-table>
        </div>
      </a-col>
    </a-row>

    <save-input-table-drawer :visible="saveInputTableVisible" :data-source="dataSource.list" @close="saveInputTableVisible = false" />

    <save-input-table-to-image-drawer :visible="saveInputTable2ImageVisible" :canvas="inputTableCanvas" @close="saveInputTable2ImageVisible = false" />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, PropType, watch } from 'vue'
import type { UnwrapRef } from 'vue'
import _ from 'lodash'
import { SaveOutlined, PictureOutlined } from '@ant-design/icons-vue'
import html2canvas from 'html2canvas'

import SaveInputTableDrawer from './SaveInputTableDrawer.vue'
import SaveInputTableToImageDrawer from './SaveInputTableToImageDrawer.vue'

import { typeOptions } from '@/config/settings'
import { outputStore } from '@/store'
import { InputParamType } from '@/types'

const columns = [
  {
    title: '属性名',
    dataIndex: 'name',
  },
  {
    title: '类型(TypeScript)',
    dataIndex: 'types',
  },
  {
    title: '',
    dataIndex: 'min',
    colSpan: 0
  },
  {
    title: '',
    dataIndex: 'max',
    colSpan: 0
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '可选(TypeScript)',
    dataIndex: 'optional',
  },
  {
    title: '只读(TypeScript)',
    dataIndex: 'readonly',
  },
  {
    title: '前端属性',
    dataIndex: 'frontend',
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
]

export default defineComponent({
  components: {
    SaveOutlined,
    PictureOutlined,
    SaveInputTableDrawer,
    SaveInputTableToImageDrawer
  },

  props: {
    raw: {
      type: Array as PropType<Array<InputParamType>>,
      default: []
    },
    updateTrigger: Boolean
  },

  emits: ['update'],

  setup(props, { emit }) {
    watch(() => props.updateTrigger, (n, _o) => {
      dataSource.list = props.raw

      emit('update', _.cloneDeep(dataSource.list))
    })

    const dataSource = reactive({
      list: [] as InputParamType[]
    })

    const editableData: UnwrapRef<Record<string, InputParamType>> = reactive({})

    const dragSourceObj = ref(null)
    const dragSourceIndex = ref(0)

    const saveInputTableVisible = ref(false)

    const isSaving = ref(false)

    const saveInputTable2ImageVisible = ref(false)
    const inputTableCanvas = ref(null)

    const output = outputStore()

    const handleCustomRow = (record, index) => {
      return {
        style: {
          cursor: 'pointer'
        },
        onmouseenter: event => {
          const ev = event || window.event
          ev.target.draggable = true
        },
        ondragstart: event => {
          const ev = event || window.event
          ev.stopPropagation()

          dragSourceObj.value = record
          dragSourceIndex.value = index
        },
        ondragover: event => {
          const ev = event || window.event
          ev.preventDefault()
        },
        ondrop: event => {
          const ev = event || window.event
          ev.stopPropagation()

          dataSource.list.splice(dragSourceIndex.value, 1)
          dataSource.list.splice(index, 0, dragSourceObj.value)

          ev.target.draggable = false

          emit('update', _.cloneDeep(dataSource.list))
        }
      }
    }

    const add = () => {
      const key = dataSource.list.length.toString()

      dataSource.list.push({
        key,
        name: '',
        types: [],
        optional: 0,
        readonly: 0,
        defaultValue: null,
        description: '',
        frontend: 0,
        min: null,
        max: null
      })

      edit(key)
    }

    const edit = (key: string) => {
      editableData[key] = _.cloneDeep(dataSource.list.filter(item => key === item.key)[0])
    }

    const save = (key: string) => {
      Object.assign(dataSource.list.filter(item => key === item.key)[0], editableData[key])
      delete editableData[key]

      emit('update', _.cloneDeep(dataSource.list))
    }

    const cancel = (key: string) => {
      delete editableData[key]

      emit('update', _.cloneDeep(dataSource.list))
    }

    const deleteItem = (key: string) => {
      for (let i = 0; i < dataSource.list.length; i++) {
        if (dataSource.list[i].key === key) {
          dataSource.list.splice(i, 1)
          break
        }
      }

      if (!dataSource.list.length) {
        deleteAll()

        return
      }

      emit('update', _.cloneDeep(dataSource.list))
    }

    const deleteAll = () => {
      output.setObjName()

      dataSource.list = []

      emit('update', [])
    }

    const saveInputTable2Image = () => {
      if (isSaving.value) return

      isSaving.value = true

      setTimeout(() => {
        html2canvas(document.getElementById('table')).then(canvas => {
          isSaving.value = false

          inputTableCanvas.value = canvas

          saveInputTable2ImageVisible.value = true
        }).catch(() => {
          isSaving.value = false

          inputTableCanvas.value = null
        })
      }, 100)
    }

    return {
      dataSource,
      columns,
      editingKey: '',
      editableData,
      handleCustomRow,
      add,
      edit,
      save,
      cancel,
      deleteItem,
      deleteAll,

      typeOptions,

      saveInputTableVisible,

      saveInputTable2Image,

      isSaving,

      saveInputTable2ImageVisible,
      inputTableCanvas
    }
  }
})
</script>