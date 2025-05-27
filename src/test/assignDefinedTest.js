const assignDefined = (origin, source, isCopyEmptyArray = false, isCopyNullValue = false) => {
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

// 辅助函数：断言测试结果
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
  console.log(`✓ ${message}`)
}
// 测试用例 1：基本合并功能
;(() => {
  const origin = { a: 1, b: 2 }
  const source = { b: 3, c: 4, d: undefined }
  const result = assignDefined(origin, source)
  assert(result.a === 1, '保留 origin 中未被覆盖的属性')
  assert(result.b === 3, '覆盖 origin 中已存在的属性')
  assert(result.c === 4, '添加 source 中新增的属性')
  assert(!result.hasOwnProperty('d'), '忽略 source 中值为 undefined 的属性')
})()

// 测试用例 2：空数组处理（isCopyEmptyArray = false）
;(() => {
  const origin = { arr: [1, 2] }
  const source = { arr: [] }
  const result = assignDefined(origin, source)
  assert(result.arr.length === 2, '保留 origin 中的非空数组')
})()

// 测试用例 3：空数组处理（isCopyEmptyArray = true）
;(() => {
  const origin = { arr: [1, 2] }
  const source = { arr: [] }
  const result = assignDefined(origin, source, true)
  assert(result.arr.length === 0, '复制 source 中的空数组')
})()

// 测试用例 4：null 值处理（isCopyNullValue = false）
;(() => {
  const origin = { a: 1, b: 2 }
  const source = { a: null, c: null }
  const result = assignDefined(origin, source)
  assert(result.a === 1, '保留 origin 中已存在的属性，不复制 source 中的 null')
  assert(result.c === null, '添加 source 中新增的 null 属性')
})()

// 测试用例 5：null 值处理（isCopyNullValue = true）
;(() => {
  const origin = { a: 1 }
  const source = { a: null }
  const result = assignDefined(origin, source, false, true)
  assert(result.a === null, '复制 source 中的 null 值')
})()

// 测试用例 6：特殊对象处理（Date）
;(() => {
  const origin = { date: new Date('2023-01-01') }
  const source = { date: new Date('2024-01-01') }
  const result = assignDefined(origin, source)
  assert(result.date instanceof Date, '保留 Date 对象类型')
  assert(result.date.getFullYear() === 2024, '更新 Date 对象的值')
})()

// 测试用例 7：特殊对象处理（RegExp）
;(() => {
  const origin = { regex: /abc/i }
  const source = { regex: /def/g }
  const result = assignDefined(origin, source)
  assert(result.regex instanceof RegExp, '保留 RegExp 对象类型')
  assert(result.regex.source === 'def', '更新 RegExp 对象的值')
  assert(result.regex.flags === 'g', '保留 RegExp 对象的标志')
})()

// 测试用例 8：特殊对象处理（Set）
;(() => {
  const origin = { set: new Set([1, 2]) }
  const source = { set: new Set([3, 4]) }
  const result = assignDefined(origin, source)
  assert(result.set instanceof Set, '保留 Set 对象类型')
  assert(result.set.has(1) && result.set.has(2) && result.set.has(3) && result.set.has(4), '合并 Set 元素')
})()

// 测试用例 9：特殊对象处理（Map）
;(() => {
  const origin = { map: new Map([['a', 1]]) }
  const source = { map: new Map([['b', 2]]) }
  const result = assignDefined(origin, source)
  assert(result.map instanceof Map, '保留 Map 对象类型')
  assert(result.map.get('a') === 1 && result.map.get('b') === 2, '合并 Map 键值对')
})()

// 测试用例 10：origin循环引用处理, source没有循环引用
;(() => {
  const obj = { name: 'root' }
  obj.self = obj // 循环引用
  const origin = { data: obj }
  const source = { data: { name: 'updated' } }
  const result = assignDefined(origin, source)
  assert(result.data.name === 'updated', '更新属性值')
  assert(result.data.self === result.data, 'origin保留循环引用')
})()
// 测试用例 11：source有循环引用，origin没有
;(() => {
  const origin = { a: 1 }
  const sourceObj = { name: 'source' }
  sourceObj.self = sourceObj // source 循环引用
  const source = { data: sourceObj }
  const result = assignDefined(origin, source)
  assert(result.data.name === 'source', '更新属性值')
  assert(result.data.self === result.data, 'source保留循环引用')
})()
// 测试用例 12：source和origin都有循环引用
;(() => {
  const originObj = { name: 'origin' }
  originObj.self = originObj // origin 循环引用
  const origin = { data: originObj }
  const sourceObj = { name: 'source' }
  sourceObj.self = sourceObj // source 循环引用
  const source = { data: sourceObj }
  const result = assignDefined(origin, source)
  assert(result.data.name === 'source', '更新属性值')
  assert(result.data.self === result.data, 'source和origin保留循环引用')
})()

// 测试用例 13：嵌套对象合并
;(() => {
  const origin = { nested: { a: 1, b: 2 } }
  const source = { nested: { b: 3, c: 4 } }
  const result = assignDefined(origin, source)
  assert(result.nested.a === 1, '保留嵌套对象中未被覆盖的属性')
  assert(result.nested.b === 3, '更新嵌套对象中的属性')
  assert(result.nested.c === 4, '添加嵌套对象中的新属性')
})()

// 测试用例 14：递归合并数组中的对象
;(() => {
  const origin = { arr: [{ x: 1 }] }
  const source = { arr: [{ y: 2 }] }
  const result = assignDefined(origin, source)
  assert(result.arr[0].x === 1, '保留数组中对象的原有属性')
  assert(result.arr[0].y === 2, '合并数组中对象的新属性')
})()

// 测试用例 15：source和origin均含三级循环引用链的合并
;(() => {
  // 创建origin的循环链：A → B → C → A
  const originA = { name: 'O-A', ref: null, data: {} }
  const originB = { name: 'O-B', ref: null, data: {} }
  const originC = { name: 'O-C', ref: null, data: {} }
  originA.ref = originB
  originB.ref = originC
  originC.ref = originA

  // 创建source的循环链：SA → SB → SC → SA
  const sourceA = { name: 'S-A', ref: null, data: { value: 100 } }
  const sourceB = { name: 'S-B', ref: null, data: { value: 200 } }
  const sourceC = { name: 'S-C', ref: null, data: { value: 300 } }
  sourceA.ref = sourceB
  sourceB.ref = sourceC
  sourceC.ref = sourceA

  // 执行合并
  const result = assignDefined(originA, sourceA, true, true)
  console.log('result:', result)
  // 验证循环链完整性
  assert(result.name === 'S-A', '合并后顶级对象属性正确')
  assert(result.ref.name === 'S-B', 'A→B引用正确')
  assert(result.ref.ref.name === 'S-C', 'B→C引用正确')
  assert(result.ref.ref.ref === result, 'C→A引用正确')

  // 验证嵌套数据合并
  assert(result.data.value === 100, 'source数据属性正确继承')
  assert(sourceC.ref.data.value === 300, '循环链末端数据正确')

  // 验证原始对象未被修改
  assert(originA.name === 'O-A', 'origin原始属性未被覆盖')
  assert(originA.ref === originB, 'origin循环链保持独立')
})()

console.log('所有测试用例通过！')
