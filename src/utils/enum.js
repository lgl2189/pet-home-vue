/**
 * 根据状态值查找状态映射对象中对应的标签
 * @param {Object} statusMap - 状态映射对象，格式为 { [key]: { value: string, label: string } }
 * @param {string} value - 需要查找的状态值（如：'available', 'assigned' 等）
 * @returns {string} - 对应的标签文本，如果未找到则返回原始值
 */
export function getStatusLabel(statusMap, value) {
  // 遍历状态映射对象的所有属性值
  const matchedItem = Object.values(statusMap).find((item) => item.value === value)
  // 返回匹配项的 label 或原始值
  return matchedItem?.label || value
}
