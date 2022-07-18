<template>
  <div>

    <a-row>
      <a-col :span="24">
        <div>
          <div class="mb-3">
            <a-space>

              <a-button type="dashed" @click="add">添加属性</a-button>

              <template v-if="dataSource.length">
                <a-popconfirm title="清空所有属性？" @confirm="deleteAll">
                  <a-button type="dashed" danger>清空属性</a-button>
                </a-popconfirm>

                <a-divider type="vertical" />

                <a-tooltip placement="top">
                  <template #title>
                    <span>保存对象</span>
                  </template>
                  <a-button type="primary" shape="circle" @click="saveInputTableVisible = true">
                    <template #icon>
                      <save-filled />
                    </template>
                  </a-button>
                </a-tooltip>
              </template>

            </a-space>
          </div>

          <a-table :columns="columns" :data-source="dataSource" bordered :pagination="false" size="small">
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
              <template v-else-if="['optional', 'readonly', 'frontend'].includes(column.dataIndex)">
                <div>
                  <a-radio-group v-if="editableData[record.key]"
                    v-model:value="editableData[record.key][column.dataIndex]" style="margin: -5px 0">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                  </a-radio-group>
                  <template v-else>
                    {{ !!text ? '是' : '否' }}
                  </template>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'types'">
                <div>
                  <a-checkbox-group v-if="editableData[record.key]"
                    v-model:value="editableData[record.key][column.dataIndex]" name="checkboxgroup"
                    :options="typeOptions" style="margin: -5px 0" />
                  <template v-else>
                    {{ text.join(',') }}
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

    <save-input-table-drawer :visible="saveInputTableVisible" :data-source="dataSource" @close="saveInputTableVisible = false" />

  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { SaveFilled } from '@ant-design/icons-vue'
import { defineComponent, ref, reactive, PropType, watch } from 'vue'
import type { UnwrapRef } from 'vue'
import SaveInputTableDrawer from './SaveInputTableDrawer.vue'
import { InputParamType } from '@/types'

const columns = [
  {
    title: '属性名',
    dataIndex: 'name',
  },
  {
    title: '类型(TypeScript)',
    dataIndex: 'types',
    // width: '15%',
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
    title: '默认值',
    dataIndex: 'defaultValue',
  },
  {
    title: '描述',
    dataIndex: 'description',
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

const typeOptions = [
  { label: 'string', value: 'string' },
  { label: 'number', value: 'number' },
  { label: 'boolean', value: 'boolean' },
  { label: 'string[]', value: 'string[]' },
  { label: 'number[]', value: 'number[]' },
  { label: 'boolean[]', value: 'boolean[]' },
  { label: 'any[]', value: 'any[]' },
  { label: 'object', value: 'object' },
  { label: 'undefined', value: 'undefined' },
  { label: 'null', value: 'null' },
  { label: 'any', value: 'any' },
  { label: 'void', value: 'void' },
  { label: 'never', value: 'never' },
  { label: 'unknown', value: 'unknown' },
]

export default defineComponent({
  components: {
    SaveFilled,
    SaveInputTableDrawer
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
      dataSource.value = props.raw

      emit('update', _.cloneDeep(dataSource.value))
    })

    let dataSource = ref([] as InputParamType[])

    let editableData: UnwrapRef<Record<string, InputParamType>> = reactive({})

    const add = () => {
      const key = dataSource.value.length.toString()

      dataSource.value.push({
        key,
        name: '',
        types: [],
        optional: 0,
        readonly: 0,
        defaultValue: null,
        description: '',
        frontend: 0,
      })

      edit(key)
    }

    const edit = (key: string) => {
      editableData[key] = _.cloneDeep(dataSource.value.filter(item => key === item.key)[0])
    }

    const save = (key: string) => {
      Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key])
      delete editableData[key]

      emit('update', _.cloneDeep(dataSource.value))
    }

    const cancel = (key: string) => {
      delete editableData[key]

      emit('update', _.cloneDeep(dataSource.value))
    }

    const deleteItem = (key: string) => {
      for (let i = 0; i < dataSource.value.length; i++) {
        if (dataSource.value[i].key === key) {
          dataSource.value.splice(i, 1)
          break
        }
      }

      emit('update', _.cloneDeep(dataSource.value))
    }

    const deleteAll = () => {
      dataSource.value = []

      emit('update', [])
    }

    let saveInputTableVisible = ref(false)

    return {
      dataSource,
      columns,
      editingKey: '',
      editableData,
      add,
      edit,
      save,
      cancel,
      deleteItem,
      deleteAll,

      typeOptions,

      saveInputTableVisible,
    }
  }
})
</script>