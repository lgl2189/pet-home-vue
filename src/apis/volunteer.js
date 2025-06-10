import request from '@/utils/request'

export const getVolunteerTasksByRescueStationId = (rescueStationId, pageNum, pageSize) => {
  return request.get(`/volunteer/task/station/${rescueStationId}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const addVolunteerTask = (volunteerTask) => {
  return request.post('/volunteer/task', { ...volunteerTask })
}

export const updateVolunteerTaskStatus = (taskId, taskStatus) => {
  return request.put(`/volunteer/task/${taskId}`, {
    task_status: taskStatus
  })
}

// 获取志愿者任务记录列表
export const getVolunteerTaskRecordList = (pageNum, pageSize) => {
  return request.get(`/volunteer/task/record?pageNum=${pageNum}&pageSize=${pageSize}`)
}
// 获取一个救助站的志愿者任务记录列表
export const getVolunteerTaskRecordListByStationId = (stationId, pageNum, pageSize) => {
  return request.get(`/volunteer/task/record/station/${stationId}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

// 更新志愿者任务记录状态
export const updateVolunteerTaskRecordStatus = (recordId, status) => {
  return request.put(`/volunteer/task/record/${recordId}`, {
    task_record_status: status
  })
}
