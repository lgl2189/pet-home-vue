import { useUserStore } from '@/stores/user'
import request from '@/utils/request'

export const userLogin = async (username, password) => {
  const formData = new FormData()
  formData.append('username', username)
  formData.append('password', password)
  const res = await request.post('/user/public/login', formData)
  if (res.status === '200') {
    const userStore = useUserStore()
    userStore.token = res.data.token
    userStore.userId = username
    userStore.isLogin = true
  }
  return Promise.resolve(res)
}

export const userLogout = async () => {
  const res = await request.post('/user/logout')
  const userStore = useUserStore()
  userStore.removeToken()
  return res
}

export const userLoginByToken = () => {
  return request.post('/user/public/login/token')
}

export const userRegist = (userInfo) => {
  return request.post('/user/public/regist', {
    user_name: userInfo.username,
    user_password: userInfo.password,
    china_id: userInfo.chinaId,
    real_name: userInfo.realName,
    birth_date: userInfo.birthday,
    phone: userInfo.phone,
    email: userInfo.email
  })
}

export const getPublicUserInfo = (user_id) => {
  return request.get(`/user/public/info/${user_id}`)
}

export const getUserInfo = (userId) => {
  return request.get(`/user/info/${userId}`)
}

export const updateUserInfo = (userId, userInfo) => {
  return request.put(`/user/info/${userId}`, {
    user_name: userInfo.user_name,
    birth_date: userInfo.birth_date,
    phone: userInfo.phone,
    email: userInfo.email
  })
}

export const getUserRoleList = (userId) => {
  return request.get(`/user/${userId}/role`)
}

export const updateUserRoleList = (userId, roleList) => {
  const roleArray = Array.of(...roleList)
  return request.post(`/user/${userId}/role`, roleArray)
}

export const getVolunteerInfo = (userId) => {
  return request.get(`/user/${userId}/volunteer`)
}
