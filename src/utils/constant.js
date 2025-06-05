//该文件中部分值仅作为参照，不直接在代码中使用
export const HEDAER_KEY = {
  USER_TOKEN: 'token'
}
export const SEARCH_CONSTANT = {
  DEFAUTL_PAGE_SIZE: 20,
  DEFAULT_PAGE_NUM_NOW: 1
}

export const APPLICATION_STATUIS = {
  PREPEND_REVIEW: 'pending_review',
  REVIEWING: 'reviewing',
  APPROVED: 'approved',
  REFUSED: 'refused'
}

export const VOLUNTEER_TASK_STATUS = {
  AVAILABLE: {
    value: 'available',
    label: '可接取'
  },
  ASSIGNED: {
    value: 'assigned',
    label: '已指派'
  },
  STARTED: {
    value: 'started',
    label: '已开始'
  },
  FINISH_REVIEWING: {
    value: 'finish_reviewing',
    label: '完成审核中'
  },
  COMPLETED: {
    value: 'completed',
    label: '已完成'
  }
}
