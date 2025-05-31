import request from '@/utils/request'

export const getRescueStationList = () => {
  return request.get('/rescue/station/public/info/list')
}

export const addRescueRecord = (record) => {
  return request.post('/rescue/record', record)
}

export const updateRescueRecord = (recordId, record) => {
  return request.put(`/rescue/record/${recordId}`, record)
}
