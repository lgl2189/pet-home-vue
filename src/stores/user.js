import { defineStore } from "pinia"

const userTokenName = 'token'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: localStorage.getItem(userTokenName) || '',
      isLogin: false
    }
  },
  actions: {
    autoSave(){
      this.saveToken()
    },
    saveToken(){
      localStorage.setItem(userTokenName,this.token)
    },
    removeToken(){
      this.token = ''
      localStorage.removeItem(userTokenName)
    }
  }
})