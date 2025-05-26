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

/**
 * 搜索动物信息
 * @param {Array} keyArray - 搜索关键字数组
 * @returns {Promise<AxiosResponse>} - 包含搜索结果动物信息的Promise
 */
export const searchAnimal = (keyArray, pageNum, pageSize) => {
  return request.get('/animal/info/search', {
    params: {
      key: keyArray.join(','),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}
/**
 * 获取动物详情信息
 * @param {Number} animalId - 动物id
 * @returns {Promise<AxiosResponse>} - 包含动物详情信息的Promise
 */
export const getAnimalInfoById = (animalId) => {
  return request.get(`/animal/info/${animalId}`)
}
