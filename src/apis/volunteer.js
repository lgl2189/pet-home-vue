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
