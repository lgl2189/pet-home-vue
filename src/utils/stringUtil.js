/**
 * 判断字符串是否为空（null，undefined，''），如果参数str不为字符串，如果为null、undefined、''，则返回true，否则均返回false
 * @param {String} str 待判断的字符串
 * @returns {Boolean} true:空字符串 false:非空字符串
 */
export const isEmpty = (str) => {
  return str === null || str === undefined || str === ''
}
/**
 * 判断数组是否为空（null，undefined，[]），如果参数strArray不为数组，如果为null、undefined、[]，则返回true，否则均返回false
 * @param {Array} strArray
 * @returns {Boolean} true:空数组 false:非空数组
 */
export const isEmptyArray = (strArray) => {
  return strArray === null || strArray === undefined || strArray.length === 0
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
/**
 * 将url查询参数中的特殊字符编码为%xx格式，暂时未使用，设置query参数时会自动转换
 * @param {String} str 原字符串
 * @returns 编码后的字符串
 */
export const encodeSpecialChars = (str) => {
  // 正则匹配需要编码的特殊字符（可自行增减）
  const specialCharsRegex = /[&=+?#%\/:;]/g

  return str.replace(specialCharsRegex, (char) => {
    return '%' + char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()
  })
}
/**
 * 将url查询参数中的%xx格式的字符解码为特殊字符
 * @param {String} str 原字符串
 * @returns 解码后的字符串
 */
export const decodeSpecialChars = (str) => {
  // 正则匹配所有 % 后跟两位十六进制字符的模式
  const encodedCharsRegex = /%[0-9A-Fa-f]{2}/g

  return str.replace(encodedCharsRegex, (match) => {
    // 提取十六进制部分并转换为对应的字符
    const hexCode = match.substring(1)
    return String.fromCharCode(parseInt(hexCode, 16))
  })
}
