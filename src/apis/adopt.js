import request from '@/utils/request'

export const getAdoptionApplication = () => {
  return request.get('/adoption/application')
}

export const getAdoptionAppllicationByStationId = (rescueStationId) => {
  return request.get(`/adoption/application/list/${rescueStationId}`)
}

export const getAllAdoptionApplication = () => {
  return request.get('/adoption/application/all')
}

export const addAdoptionApplication = (adoptionApplication) => {
  return request.post('/adoption/application', { ...adoptionApplication })
}

export const updateAdoptionApplicationStatus = (applicationId, applicationStatus) => {
  return request.put(`/adoption/application/${applicationId}/status`, { application_status: applicationStatus })
}

export const getBlackListByStationId = (rescueStationId) => {
  return request.get(`/adoption/black/list/station/${rescueStationId}`)
}

export const addBlackUser = (blackUser) => {
  return request.post('/adoption/black', { ...blackUser })
}

export const deleteBlackUser = (blackUserId) => {
  return request.delete(`/adoption/black/${blackUserId}`)
}
