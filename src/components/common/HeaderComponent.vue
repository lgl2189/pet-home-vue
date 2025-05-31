<script setup>
  import { getPublicUserInfo, userLogout } from '@/apis/user'
  import { useUserStore } from '@/stores/user'
  import { onBeforeMount, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  // 响应式对象
  const router = useRouter()
  const userStore = useUserStore()
  const userInfo = ref({
    user_name: ''
  })

  // 函数
  const handleClickLogout = async () => {
    const res = await userLogout(userStore.token)
    if (res.status !== '200') {
      console.log('logout failed')
    }
    router.push('/')
    location.reload()
  }

  const handleGetPublicUserInfo = async () => {
    if (userStore.isLogin === false) {
      return
    }
    if (userStore.userId === '') {
      console.error('用户id为空')
      return
    }
    const res = await getPublicUserInfo(userStore.userId)
    if (res.status === '200') {
      userInfo.value = res.data
    }
  }
  // 监听器
  watch(
    () => userStore.isLogin,
    async () => {
      await handleGetPublicUserInfo()
    }
  )
  // 生命周期
  onBeforeMount(async () => {
    await handleGetPublicUserInfo()
  })
</script>
<template>
  <div class="header">
    <div class="title">
      <router-link :to="{ name: 'HomeView' }">宠物之家</router-link>
    </div>
    <div class="navigator">
      <el-menu
        class="navigator-menu"
        mode="horizontal"
        :ellipsis="true"
        :router="true"
        :default-active="$route.meta.activePath || $route.path">
        <el-sub-menu index="1">
          <template #title>救助</template>
          <el-menu-item index="/rescue/regist" :route="{ name: 'RescueRegistView' }">救助登记</el-menu-item>
          <el-menu-item index="/rescue/search" :route="{ name: 'AnimalSearchView' }">搜索动物信息</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>领养</template>
          <el-menu-item index="2-1">可领养动物</el-menu-item>
          <el-menu-item index="2-2">领养申请</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>志愿者</template>
          <el-menu-item index="3-1">志愿者招募</el-menu-item>
          <el-menu-item index="3-2">志愿者活动</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>捐赠</template>
          <el-menu-item index="4-1">捐赠方式</el-menu-item>
          <el-menu-item index="4-2">捐赠记录</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="5">
          <template #title>展示</template>
          <el-menu-item index="5-1">图片展示</el-menu-item>
          <el-menu-item index="5-2">视频展示</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="6">
          <template #title>数据</template>
          <el-menu-item index="6-1">统计数据</el-menu-item>
          <el-menu-item index="6-2">数据报表</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="user">
      <div class="user-avatar">
        <el-icon :size="30">
          <User />
        </el-icon>
      </div>
      <!-- 已登录 -->
      <div v-if="userStore.isLogin" class="user-login-wrap">
        <el-menu
          mode="horizontal"
          class="user-login-menu"
          :ellipsis="false"
          :router="true"
          :default-active="$route.meta.activePath || $route.path">
          <el-sub-menu index="1" :teleported="false">
            <div class="user-login-menu-title">
              <span>欢迎，</span>
              <span>{{ userInfo.user_name }}</span>
            </div>
            <template #title>{{ userInfo.user_name }}</template>
            <el-menu-item index="/user/center">用户中心</el-menu-item>
            <el-menu-item index="/user/logout" @click="handleClickLogout">退出登录</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <!-- 未登录 -->
      <div v-else>
        <router-link :to="{ name: 'UserRegistView' }">
          <el-button size="large" :round="true">注册</el-button>
        </router-link>
        <span>/</span>
        <router-link :to="{ name: 'UserLoginView' }">
          <el-button size="large" :round="true">登录</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .header {
    height: 80px;
    width: 100%;
    background-color: #ffffff;
    color: #000000;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 10px;
    box-shadow: inset 0px -1px 0px #d0d0d0;

    .title {
      font-size: 24px;
      color: #00aeec;
      margin-left: 40px;
      margin-right: 20px;
      flex-shrink: 0;
    }

    .navigator {
      height: 100%;
      flex-grow: 1;
      flex-shrink: 1;

      .navigator-menu {
        height: 100%;
      }
    }

    .user {
      height: 100%;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 30px;
      color: #00aeec;
      margin-right: 20px;

      .user-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 40px;
        margin-right: 10px;
      }

      .user-login-wrap {
        display: inline-flex;
        flex-grow: 1;
        height: 100%;

        .user-login-menu {
          height: 100%;

          .user-login-menu-title {
            box-sizing: border-box;
            padding: 10px;
            height: 40px;
            font-size: 17px;
          }
        }
      }
    }
  }
</style>
