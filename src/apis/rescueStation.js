import request from '@/utils/request'

export const getRescueStationList = () => {
  return request.get('/rescueStation/public/info/list')
}
