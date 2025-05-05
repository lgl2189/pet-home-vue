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
      children:[
        {
          path: 'login',
          name: 'UserLoginView',
          component: () => import('@/views/user/LoginView.vue')
        },
        {
          path: 'regist',
          name: 'UserRegistView',
          component: () => import('@/views/user/RegistView.vue')
        }
      ]
    }
  ]
})

export default router