import request from '@/utils/request'

export const uploadAnimalInfo = (formData) => {
  return request.post('/animal/upload/info', formData)
}
