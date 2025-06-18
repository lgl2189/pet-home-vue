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

/**
 * 获取包含所有物资需求记录的列表
 * @param {*} pageNum 当前页码
 * @param {*} pageSize 每页条数
 * @returns {Promise}
 */
export const getAllSupplyDemandList = (pageNum, pageSize) => {
  return request.get(`/material/demand/list/all?pageNum=${pageNum}&pageSize=${pageSize}`)
}

/**
 * 更新物资需求状态
 * @param {*} pageNum 当前页码
 * @param {*} pageSize 每页条数
 * @returns {Promise}
 */
export const updateSupplyDemandStatus = (supplyDemandId, status) => {
  return request.put(`/supply_demand/${supplyDemandId}/status`, { status })
}

// 获取物资库存列表
export const getInventoryList = (stationId, pageNum, pageSize) => {
  return request.get(`/material/inventory/list/station/${stationId}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

// 添加物资库存
export const addInventory = (inventory) => {
  return request.post('/material/inventory', { ...inventory })
}

// 更新物资库存
export const updateInventory = (inventoryId, inventory) => {
  return request.put(`/material/inventory/${inventoryId}`, { ...inventory })
}

// 删除物资库存
export const deleteInventory = (inventoryId) => {
  return request.delete(`/material/inventory/${inventoryId}`)
}

// 获取物资需求记录列表
export const getSupplyDemandList = (stationId, pageNum, pageSize) => {
  return request.get(`/material/demand/list/station/${stationId}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

// 添加物资需求记录
export const addSupplyDemand = (supplyDemand) => {
  return request.post('/material/demand', { ...supplyDemand })
}

// 更新物资需求记录
export const updateSupplyDemand = (supplyDemandId, supplyDemand) => {
  return request.put(`/material/demand/${supplyDemandId}`, { ...supplyDemand })
}

// 删除物资需求记录
export const deleteSupplyDemand = (demandId) => {
  return request.delete(`/material/demand/${demandId}`)
}
