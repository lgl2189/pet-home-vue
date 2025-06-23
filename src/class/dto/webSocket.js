/**
 * 表示一个字符串类型的WebSocket消息。
 * 该类封装了WebSocket消息的基本属性和操作，包括消息类型、时间戳、临时ID、数据以及属性映射。
 */
export class StringWebSocketMessage {
  /**
   * 构造函数，初始化WebSocket消息的各个属性。
   */
  constructor() {
    // 消息类型，用于标识消息的类别
    this.type = null
    // 消息的时间戳，记录消息创建的时间
    this.timestamp = null
    // 消息的临时ID，用于唯一标识消息
    this.tempId = null
    // 消息携带的数据
    this.data = null
    // 消息的属性映射，用于存储额外的键值对属性
    this.attributeMap = new Map()
  }

  /**
   * 获取消息的类型。
   * @returns {null|*} 消息的类型。
   */
  getType() {
    return this.type
  }

  /**
   * 获取消息的时间戳。
   * @returns {null|*} 消息的时间戳。
   */
  getTimestamp() {
    return this.timestamp
  }

  /**
   * 获取消息的临时ID。
   * @returns {null|*} 消息的临时ID。
   */
  getTempId() {
    return this.tempId
  }

  /**
   * 获取消息携带的数据。
   * @returns {null|*} 消息携带的数据。
   */
  getData() {
    return this.data
  }

  /**
   * 获取消息的属性映射。
   * @returns {Map} 消息的属性映射。
   */
  getAttributeMap() {
    return this.attributeMap
  }

  /**
   * 设置消息的一个属性。
   * @param {string} name 属性的名称。
   * @param {*} value 属性的值。
   */
  setAttribute(name, value) {
    this.attributeMap.set(name, value)
  }

  /**
   * 获取消息的一个属性的值。
   * @param {string} name 属性的名称。
   * @returns {*} 属性的值，如果属性不存在则返回undefined。
   */
  getAttribute(name) {
    return this.attributeMap.get(name)
  }

  /**
   * 移除消息的一个属性。
   * @param {string} name 属性的名称。
   */
  removeAttribute(name) {
    this.attributeMap.delete(name)
  }
}
