import { defineStore } from 'pinia'

import logo from '@/assets/logo.png'

export const appInfoStore = defineStore('appInfo', {
  state: () => {
    return {
      logo: logo,
      appTitle: 'Fast Param',
      appSlogan: '快速生成前端不同业务场景下的对象属性'
    }
  },
  getters: {
    getLogo(state) {
      return state.logo
    },

    getAppTitle(state) {
      return state.appTitle
    },

    getAppSlogan(state) {
      return state.appSlogan
    },
  }
})

export const outputStore = defineStore('output', {
  state: () => {
    return {
      objName: 'obj'
    }
  },
  getters: {
    getObjName(state) {
      return state.objName
    }
  },
  actions: {
    setObjName(name: string = 'obj') {
      this.objName = name
    }
  }
})