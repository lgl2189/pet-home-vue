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
