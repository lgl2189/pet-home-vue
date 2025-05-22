import { defineStore } from 'pinia'

const userTokenName = 'token'
const userIdName = 'usedId'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: localStorage.getItem(userTokenName) || '',
      userId: localStorage.getItem(userIdName) || '',
      isLogin: false
    }
  },
  actions: {
    autoSave() {
      this.saveToken()
      this.saveUserId()
    },
    saveToken() {
      localStorage.setItem(userTokenName, this.token)
    },
    saveUserId() {
      localStorage.setItem(userIdName, this.userId)
    },
    removeToken() {
      this.token = ''
      localStorage.removeItem(userTokenName)
    },
    removeUserId() {
      this.userId = ''
      localStorage.removeItem(userIdName)
    }
  }
})
