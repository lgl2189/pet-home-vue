/**
 * 判断对象是否为空对象（null，undefined）
 * @param {Object} obj 待判断对象
 * @returns {Boolean} 是否为空对象，true：为空对象，false：非空对象
 */
export const isEmptyObject = (obj) => {
  return obj === null || obj === undefined
}
