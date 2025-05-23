import request from '@/utils/request'

export const uploadAnimalInfo = (formData) => {
  return request.post('/animal/upload/info', formData)
}
/**
 * 获取推荐动物列表
 * @param {number} num - 需要获取的动物数量
 * @returns {Promise<AxiosResponse>} - 包含推荐动物列表的Promise
 */
export const getRecommendAnimalList = (num) => {
  return request.get(`/animal/info/recommend?num=${num}`)
}
