import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ConfigProvider, Table, Input, Popconfirm, Row, Col, Divider, Card, Button, Space, Radio, Checkbox, Tooltip, Drawer, BackTop, Empty } from 'ant-design-vue'
import App from './App.vue'

import 'ant-design-vue/dist/antd.css'

import './styles/app.scss'

const app = createApp(App)
app.use(createPinia())

app.use(ConfigProvider)
app.use(Table)
app.use(Input)
app.use(Popconfirm)
app.use(Row)
app.use(Col)
app.use(Divider)
app.use(Card)
app.use(Button)
app.use(Space)
app.use(Radio)
app.use(Checkbox)
app.use(Tooltip)
app.use(Drawer)
app.use(BackTop)
app.use(Empty)

app.mount('#app')
