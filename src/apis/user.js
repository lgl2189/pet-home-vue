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

export const userLogout = async () => {
  const res = await request.post('/user/logout')
  const userStore = useUserStore()
  userStore.removeToken()
  return res;
}

export const userTokenVerify = () => {
  return request.get('/user/tokenVerify')
}

export const userRegist = (userInfo) =>{
  return request.post('/user/regist',{
    userName: userInfo.username,
    userPassword: userInfo.password,
    chinaId: userInfo.chinaId,
    realName: userInfo.realName,
    birthDate: userInfo.birthday,
    phone: userInfo.phone,
    email: userInfo.email,
  })
}