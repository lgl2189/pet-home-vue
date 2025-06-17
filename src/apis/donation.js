import request from '@/utils/request'

export const getDonationList = (pageNum, pageSize) => {
  return request.get(`/donation/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const addDonation = (donation) => {
  return request.post('/donation/add', { ...donation })
}

export const updateQrCode = (stationId, fileList) => {
  const formData = new FormData()
  fileList.forEach((file) => formData.append('qrcode_list', file.raw))
  return request.put(`/station/${stationId}/qrcode`, formData)
}
