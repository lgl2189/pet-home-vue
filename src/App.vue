<script setup>
  import { useDark } from '@vueuse/core'
  import { ElConfigProvider } from 'element-plus'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  const zIndex = 3000
  const size = 'small'

  const route = useRoute()
  const isHideHeader = computed(() => {
    return route.meta.isHideHeader === true
  })
  const isHideFooter = computed(() => {
    return route.meta.isHideFooter === true
  })
</script>

<template>
  <ElConfigProvider :size="size" :z-index="zIndex">
    <div id="app">
      <div class="header-wrap" v-if="!isHideHeader">
        <HeaderComponent />
      </div>
      <router-view></router-view>
      <div class="footer-wrap" v-if="!isHideFooter">
        <FooterComponent />
      </div>
    </div>
  </ElConfigProvider>
</template>
<style scoped></style>
