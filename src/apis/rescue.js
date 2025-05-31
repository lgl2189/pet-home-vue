import request from '@/utils/request'

export const getRescueStationList = () => {
  return request.get('/rescue/station/public/info/list')
}

export const uploadRescueRecord = (record) => {
  return request.post('/rescue/record', record)
}
