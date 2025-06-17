import request from '@/utils/request'

export const getRescueStationList = () => {
  return request.get('/station/public/list')
}

export const getRescueStationListByAdminId = (adminId) => {
  return request.get(`/station/list?adminId=${adminId}`)
}

export const getRescueStationInfoById = (stationId) => {
  return request.get(`/station/${stationId}`)
}

export const addRescueRecord = (record) => {
  return request.post('/rescue/record', record)
}

export const updateRescueRecord = (recordId, record) => {
  return request.put(`/rescue/record/${recordId}`, record)
}
