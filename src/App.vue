<script setup>
import { ElConfigProvider } from "element-plus"
import { onMounted } from "vue"
import { userTokenVerify } from "./apis/user"
import { useUserStore } from "./stores/user"
const zIndex = 3000
const size = "small"

const userStore = useUserStore()
onMounted(async () => {
  const res = await userTokenVerify(userStore.token)
  if (res.status === '200') {
    userStore.isLogin = true
  }
  else {
    userStore.isLogin = false
  }
})
</script>

<template>
  <ElConfigProvider :size="size" :z-index="zIndex">
    <div id="app">
      <div class="header-wrap">
        <HeaderComponent></HeaderComponent>
      </div>
      <router-view></router-view>
    </div>
  </ElConfigProvider>
</template>

<style scoped></style>
