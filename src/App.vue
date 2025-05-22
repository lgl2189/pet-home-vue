<script setup>
  import { useDark } from '@vueuse/core'
  import { ElConfigProvider } from 'element-plus'
  const zIndex = 3000
  const size = 'small'
</script>

<template>
  <ElConfigProvider :size="size" :z-index="zIndex">
    <div id="app">
      <div class="header-wrap">
        <HeaderComponent />
      </div>
      <router-view></router-view>
      <div class="footer-wrap">
        <FooterComponent />
      </div>
    </div>
  </ElConfigProvider>
</template>
<style scoped></style>
