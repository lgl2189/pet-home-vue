import { APPLICATION_STATUIS } from './constant'

export const transRescueRecordStatusToName = (status) => {
  switch (status) {
    case 'wait_rescue':
      return '等待救助'
    case 'under_treatment':
      return '在治疗中'
    case 'wait_adopted':
      return '等待领养'
    case 'adopted':
      return '已领养'
    default:
      return '未知状态'
  }
}

export const transApplicationStatusToName = (status) => {
  switch (status) {
    case APPLICATION_STATUIS.PREPEND_REVIEW:
      return '等待审核'
    case APPLICATION_STATUIS.REVIEWING:
      return '审核中'
    case APPLICATION_STATUIS.APPROVED:
      return '审核通过'
    case APPLICATION_STATUIS.REFUSED:
      return '已拒绝'
    default:
      return '未知状态'
  }
}
