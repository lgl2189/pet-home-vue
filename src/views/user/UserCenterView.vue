<script setup>
  import { computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  // 获取当前路由路径
  const currentPath = computed(() => route.fullPath)

  // 导航处理
  const handleNavigate = (path) => {
    router.push(path)
  }
</script>
<template>
  <div class="user-center-container">
    <!-- 导航菜单 -->
    <div class="menu-wrapper">
      <div
        :class="['menu-item', { active: currentPath === '/user/center/info' }]"
        @click="handleNavigate('/user/center/info')">
        个人信息
      </div>
      <div
        :class="['menu-item', { active: currentPath === '/user/center/authority' }]"
        @click="handleNavigate('/user/center/authority')">
        权限管理
      </div>
      <div
        :class="['menu-item', { active: currentPath === '/user/center/volunteer' }]"
        @click="handleNavigate('/user/center/volunteer')">
        志愿者信息
      </div>
    </div>
    <!-- 子路由视图 -->
    <router-view class="content-wrapper" />
  </div>
</template>
<style lang="less" scoped>
  .user-center-container {
    display: flex;
  }

  .menu-wrapper {
    width: 200px;
    background: #f5f7fa;
    padding: 20px;
    border-right: 1px solid #e4e7ed;

    .menu-item {
      padding: 12px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      color: #666;

      &:hover {
        background: #ecf0f5;
      }

      &.active {
        color: #409eff;
        background: #ecf5ff;
        font-weight: 500;
        border-left: 2px solid #409eff;
      }
    }
  }

  .content-wrapper {
    flex: 1;
    padding: 24px;
    background: #fff;
  }
</style>
