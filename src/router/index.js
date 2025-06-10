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
          meta: { requiresAuth: true, activePath: '/user/center' },
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
      path: '/rescue',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'regist',
          name: 'RescueRegistView',
          redirect: {
            name: 'AnimalUploadView'
          },
          component: () => import('@/views/rescue/regist/RescueRegistView.vue'),
          children: [
            {
              path: 'animal',
              name: 'AnimalUploadView',
              component: () => import('@/views/rescue/regist/AnimalUploadView.vue')
            },
            {
              path: 'record',
              name: 'RecordUploadView',
              component: () => import('@/views/rescue/regist/RecordUploadView.vue')
            },
            {
              path: 'success',
              name: 'RescueSuccessView',
              component: () => import('@/views/rescue/regist/RescueSuccessView.vue')
            }
          ]
        },
        {
          path: 'search',
          name: 'AnimalSearchView',
          component: () => import('@/views/rescue/AnimalSearchView.vue')
        },
        {
          path: 'detail/:id',
          name: 'AnimalDetailView',
          component: () => import('@/views/rescue/AnimalDetailView.vue')
        }
      ]
    },
    {
      path: '/station',
      redirect: {
        name: 'StationSelectView'
      },
      children: [
        {
          path: 'select',
          name: 'StationSelectView',
          component: () => import('@/views/station/StationSelectView.vue')
        },
        {
          path: ':stationId',
          name: 'RescueStationView',
          component: () => import('@/views/station/RescueStationView.vue'),
          children: [
            {
              path: 'adopt',
              children: [
                {
                  path: 'review',
                  name: 'StationAdoptReviewView',
                  component: () => import('@/views/station/StationAdoptReviewView.vue'),
                  meta: { activePath: '/station/adopt/review' }
                },
                {
                  path: 'blacklist',
                  name: 'StationAdoptBlacklistView',
                  component: () => import('@/views/station/StationAdoptBlacklistView.vue'),
                  meta: { activePath: '/station/adopt/blacklist' }
                }
              ]
            },
            {
              path: 'volunteer',
              children: [
                {
                  path: 'task/publish',
                  name: 'VolunteerTaskPublishView',
                  component: () => import('@/views/volunteer/VolunteerTaskPublishView.vue'),
                  meta: { activePath: '/station/volunteer/task/publish' }
                },
                {
                  path: 'task/list',
                  name: 'VolunteerTaskListView',
                  component: () => import('@/views/volunteer/VolunteerTaskListView.vue'),
                  meta: { activePath: '/station/volunteer/task/list' }
                },
                {
                  path: 'task/review',
                  name: 'VolunteerTaskReviewView',
                  component: () => import('@/views/volunteer/VolunteerTaskReviewView.vue'),
                  meta: { activePath: '/station/volunteer/task/review' }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/adopt',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'list',
          name: 'AdoptListView',
          component: () => import('@/views/adpot/AdoptListView.vue')
        },
        {
          path: 'apply',
          name: 'AdoptApplyView',
          component: () => import('@/views/adpot/AdoptApplyView.vue')
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
