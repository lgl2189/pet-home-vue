import './assets/main.less'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { pinia } from './stores/pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { userLoginByToken } from './apis/user'
import { useUserStore } from './stores/user'

const handleLoginByToken = async () => {
  const userStore = useUserStore()
  const res = await userLoginByToken(userStore.token)
  if (res.status === '200') {
    userStore.userId = res.data.user_id
    userStore.isLogin = true
  } else {
    userStore.isLogin = false
  }
}

const app = createApp(App)

app.use(pinia)

await handleLoginByToken()

app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
