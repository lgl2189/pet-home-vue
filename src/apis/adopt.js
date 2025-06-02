import request from '@/utils/request'

export const addAdoptionApplication = (adoptionApplication) => {
  return request.post('/adoption/application', { ...adoptionApplication })
}
