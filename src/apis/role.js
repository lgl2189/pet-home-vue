import request from '@/utils/request'

export const getRoleList = () => {
  return request.get('/role/list')
}
