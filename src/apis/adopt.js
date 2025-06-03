import request from '@/utils/request'

export const getAdoptionApplication = () => {
  return request.get('/adoption/application')
}

export const addAdoptionApplication = (adoptionApplication) => {
  return request.post('/adoption/application', { ...adoptionApplication })
}

export const updateAdoptionApplication = (applicationStatus) => {
  return request.put('/adoption/application', { application_status: applicationStatus })
}
