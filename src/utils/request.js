import { useUserStore } from '@/stores/user'
import axios from 'axios'

// 创建axios实例，将来对创建出来的axios实例进行自定义配置
// 优点：不会污染原始的axios实例
const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 自定义配置 请求/响应的拦截器
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前设置token，而不是在实例创建时
  // 避免pinia创建前使用pinia，同时避免token改变时，hedaer设置为初始值
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  const res = response
  if (res.status !== 200) {
    return Promise.reject(res.message)
  }
  return res.data
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  return Promise.reject(error)
})
// 导出
export default instance