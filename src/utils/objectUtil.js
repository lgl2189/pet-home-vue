/**
 * 判断对象是否为空对象（null，undefined）
 * @param {Object} obj 待判断对象
 * @returns {Boolean} 是否为空对象，true：为空对象，false：非空对象
 */
export const isEmptyObject = (obj) => {
  return obj === null || obj === undefined
}
/**
 * 将 source 对象中定义的属性值复制到 origin 对象中，如果 source 对象中某个属性值是 undefined，则不复制，保留 origin 对象中原有的值。
 * 与assignDefined不同，如果 source[key] 是空数组，而 origin[key] 是非空数组，则保留 origin[key]
 * 注意：本函数只支持origin和source中存在自引用，但不支持参数内部属性之间循环引用
 * @param {Object} origin 源对象
 * @param {Object} source 待复制对象
 * @param {Boolean} isCopyEmptyArray 只有两个对象都定义了某个属性时，且两个属性值都为数组，是否复制source对象中为空数组的属性值，默认 false。
 * 注意：当origin中属性值为undefined或null时，不管isCopyEmptyArray是否为true，都会复制source对象中为空数组的属性值。
 * @param {Boolean} isCopyNullValue 当origin中的属性值不为undefined时，是否复制source对象中为 null 的属性值，默认 false。
 * 注意：当orgin中的属性值为undefined时，不管isCopyNullValue是否为true，都会复制source对象中为null的属性值。
 * @returns {Object} 修改后的 origin 对象
 */
export const assignDefined = (origin, source, isCopyEmptyArray = false, isCopyNullValue = false) => {
  // 用于记录已处理的对象，避免循环引用
  const visited = new WeakMap()

  // 递归处理对象，target为待处理对象，src为值来源对象
  const recursiveAssign = (target, src) => {
    // 检查 target 和 src 是否已经处理过
    if (typeof target === 'object' && target !== null && visited.has(target)) {
      return visited.get(target)
    }
    if (typeof src === 'object' && src !== null && visited.has(src)) {
      return visited.get(src)
    }

    // 处理非对象类型或 null
    if (typeof src !== 'object' || src === null) {
      return src
    }

    // 创建目标对象（保持数组/对象类型）
    let targetObj
    if (Array.isArray(src)) {
      // 源是数组，保持目标为数组
      if (Array.isArray(target)) {
        targetObj = [...target] // 复制原数组元素
      } else {
        targetObj = [] // 创建新数组
      }
    } else {
      // 源是普通对象
      if (typeof target === 'object' && target !== null) {
        targetObj = { ...target } // 复制原对象属性
      } else {
        targetObj = {} // 创建新对象
      }
    }

    // 记录源对象和目标对象的映射关系
    if (typeof target === 'object' && target !== null) {
      visited.set(target, targetObj)
    }
    if (typeof src === 'object' && src !== null) {
      visited.set(src, targetObj)
    }

    // 处理 target（origin）自身的属性
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        const targetValue = target[key]
        if (typeof targetValue === 'object' && targetValue !== null) {
          if (targetValue instanceof Date) {
            targetObj[key] = new Date(targetValue.getTime())
          } else if (targetValue instanceof RegExp) {
            targetObj[key] = new RegExp(targetValue.source, targetValue.flags)
          } else if (targetValue instanceof Set) {
            targetObj[key] = new Set(targetValue)
          } else if (targetValue instanceof Map) {
            targetObj[key] = new Map(targetValue)
          } else {
            targetObj[key] = recursiveAssign(targetValue, targetValue)
          }
        } else {
          targetObj[key] = targetValue
        }
      }
    }

    // 处理 src（source）的属性
    for (const key in src) {
      if (src.hasOwnProperty(key)) {
        const sourceValue = src[key]
        const originValue = targetObj[key] // 目标对象当前属性值

        // 处理 undefined
        if (sourceValue === undefined) {
          continue
        }

        // 处理 null 值
        if (!isCopyNullValue && originValue !== undefined && sourceValue === null) {
          continue
        }

        // 处理空数组
        if (
          isCopyEmptyArray &&
          Array.isArray(sourceValue) &&
          sourceValue.length === 0 &&
          Array.isArray(originValue) &&
          originValue.length > 0
        ) {
          targetObj[key] = [] // 当 isCopyEmptyArray 为 true 时，将目标属性设为空数组
          continue
        }

        // 处理特殊对象类型
        if (typeof sourceValue === 'object' && sourceValue !== null) {
          if (sourceValue instanceof Date) {
            targetObj[key] = new Date(sourceValue.getTime())
          } else if (sourceValue instanceof RegExp) {
            targetObj[key] = new RegExp(sourceValue.source, sourceValue.flags)
          } else if (sourceValue instanceof Set) {
            targetObj[key] = new Set(originValue || new Set())
            sourceValue.forEach((item) => targetObj[key].add(item))
          } else if (sourceValue instanceof Map) {
            targetObj[key] = new Map(originValue || new Map())
            sourceValue.forEach((value, mapKey) => targetObj[key].set(mapKey, value))
          } else {
            // 递归处理普通对象/数组
            targetObj[key] = recursiveAssign(originValue, sourceValue)
          }
        } else {
          // 基本类型或 null 直接赋值
          targetObj[key] = sourceValue
        }
      }
    }

    return targetObj
  }

  // 入口处理：确保 origin 是对象（非 null）
  const finalOrigin = origin || (typeof source === 'object' && source !== null ? {} : source)
  return recursiveAssign(finalOrigin, source)
}
