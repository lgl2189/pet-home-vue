import { useUserStore } from '@/stores/user'
import request from '@/utils/request'

export const userLogin = async (username,password) => {
  const formData = new FormData()
  formData.append('username',username)
  formData.append('password',password)
  const res = await request.post('/user/login', formData)
  if(res.status === '200'){
    const userStore = useUserStore()
    userStore.token = res.data.token
    userStore.isLogin = true
  }
  return Promise.resolve(res)
}

export const userLogout = (token) => {
  return request.post('/user/logout', { token })
}

export const userTokenVerify = () => {
  return request.get('/user/tokenVerify')
}