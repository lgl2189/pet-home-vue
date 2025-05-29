import { useUserStore } from '@/stores/user'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: () => import('@/views/home/HomeView.vue')
    },
    {
      path: '/user',
      children: [
        {
          path: 'login',
          name: 'UserLoginView',
          meta: { notLogin: true },
          component: () => import('@/views/user/LoginView.vue')
        },
        {
          path: 'regist',
          name: 'UserRegistView',
          component: () => import('@/views/user/RegistView.vue')
        },
        {
          path: 'center',
          name: 'UserCenterView',
          component: () => import('@/views/user/UserCenterView.vue'),
          meta: { requiresAuth: true },
          redirect: { name: 'UserInfoView' },
          children: [
            {
              path: 'info',
              name: 'UserInfoView',
              component: () => import('@/views/user/UserInfoView.vue')
            },
            {
              path: 'authority',
              name: 'UserAuthorityView',
              component: () => import('@/views/user/UserAuthorityView.vue')
            },
            {
              path: 'volunteer',
              name: 'UserVolunteerView',
              component: () => import('@/views/user/UserVolunteerView.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/animal',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'upload',
          name: 'AnimalUploadView',
          component: () => import('@/views/animal/AnimalUploadView.vue')
        },
        {
          path: 'search',
          name: 'AnimalSearchView',
          component: () => import('@/views/animal/AnimalSearchView.vue')
        },
        {
          path: 'detail/:id',
          name: 'AnimalDetailView',
          component: () => import('@/views/animal/AnimalDetailView.vue')
        }
      ]
    }
  ]
})

// 全局前置守卫，检查路由访问权限
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  // 检查是否为未登录才可访问页面
  if (to.meta?.notLogin && userStore.isLogin) {
    next({ name: 'HomeView' })
    return
  }
  // 检查路由是否需要身份验证
  if (to.meta?.requiresAuth) {
    // 检查用户是否已登录
    if (userStore.isLogin) {
      // 已登录，允许访问
      next()
    } else {
      // 未登录，重定向到登录页面
      next({ name: 'UserLoginView', query: { redirect: to.fullPath } })
    }
  } else {
    // 不需要身份验证，直接访问
    next()
  }
})

export default router
