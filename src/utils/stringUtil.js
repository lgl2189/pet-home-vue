/**
 * 判断字符串是否为空（null，undefined，''）
 * @param {String} str 待判断的字符串
 * @returns {Boolean} true:空字符串 false:非空字符串
 */
export const isEmpty = (str) => {
  return str === null || str === undefined || str === ''
}
/**
 * 判断字符串是否为空白，即只包含空格或者为空（null，undefined，''）
 * @param {String} str 待判断的字符串
 * @returns {Boolean} true:空白字符串 false:非空白字符串
 */
export const isSpaceStr = (str) => {
  return isEmpty(str) || str.trim().length === 0
}
/**
 * 从字符串中获取关键词数组，剔除首尾空格，删除关键词之间多余的空格
 * @param {String} keyString 待提取关键词的字符串
 * @returns {Array} 关键词数组
 */
export const getKeyArrayFromKeyString = (keyString) => {
  if (keyString === null || keyString === undefined || keyString === '') {
    return []
  }
  keyString = keyString.trim()
  keyString = keyString.replace(/\s+/g, ' ')
  return keyString.split(' ')
}
