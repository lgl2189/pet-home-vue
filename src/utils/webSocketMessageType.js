/**
 * WebSocket消息类型常量定义
 * 与后端保持一致，用于标识不同类型的消息
 */
export const MESSAGE_TYPE = {
  // 认证相关 (100-199)
  AUTH_REQUEST: 100, // 认证请求
  AUTH_RESPONSE: 101, // 认证响应

  // 消息相关 (200-299)
  PRIVATE_MESSAGE: 200, // 单聊消息
  GROUP_MESSAGE: 201, // 群聊消息
  MESSAGE_BROADCAST: 202, // 消息广播
  MESSAGE_ACK: 203, // 消息确认
  MESSAGE_RECALL: 204, // 消息撤回
  RECALL_NOTIFICATION: 205, // 撤回通知

  // 用户状态相关 (300-399)
  USER_ONLINE: 300, // 用户上线通知
  USER_OFFLINE: 301, // 用户下线通知
  TYPING_INDICATOR: 302, // 正在输入提示
  TYPING_BROADCAST: 303, // 输入状态广播

  // 消息状态相关 (400-499)
  READ_RECEIPT: 400, // 已读回执
  READ_NOTIFICATION: 401, // 已读通知

  // 系统通知相关 (500-599)
  SYSTEM_NOTICE: 500, // 系统通知
  ERROR_NOTIFICATION: 501, // 错误通知

  // 连接管理相关 (600-699)
  HEARTBEAT_REQUEST: 600, // 心跳请求
  HEARTBEAT_RESPONSE: 601, // 心跳响应

  // 历史数据相关 (700-799)
  HISTORY_REQUEST: 700, // 历史消息请求
  HISTORY_RESPONSE: 701, // 历史消息响应

  // 用户列表相关 (800-899)
  ONLINE_USERS_REQUEST: 800, // 在线用户列表请求
  ONLINE_USERS_RESPONSE: 801 // 在线用户列表响应
}

/**
 * 消息方向常量定义
 */
export const MESSAGE_DIRECTION = {
  CLIENT_TO_SERVER: 'client_to_server', // 客户端到服务器
  SERVER_TO_CLIENT: 'server_to_client', // 服务器到客户端
  BIDIRECTIONAL: 'bidirectional' // 双向
}

/**
 * 获取消息类型的描述文本
 * @param {number} type - 消息类型常量
 * @returns {string} - 对应的描述文本
 */
export function getMessageTypeDescription(type) {
  const descriptions = {
    [MESSAGE_TYPE.AUTH_REQUEST]: '认证请求',
    [MESSAGE_TYPE.AUTH_RESPONSE]: '认证响应',
    [MESSAGE_TYPE.PRIVATE_MESSAGE]: '单聊消息',
    [MESSAGE_TYPE.GROUP_MESSAGE]: '群聊消息',
    [MESSAGE_TYPE.MESSAGE_BROADCAST]: '消息广播',
    [MESSAGE_TYPE.MESSAGE_ACK]: '消息确认',
    [MESSAGE_TYPE.MESSAGE_RECALL]: '消息撤回',
    [MESSAGE_TYPE.RECALL_NOTIFICATION]: '撤回通知',
    [MESSAGE_TYPE.USER_ONLINE]: '用户上线通知',
    [MESSAGE_TYPE.USER_OFFLINE]: '用户下线通知',
    [MESSAGE_TYPE.TYPING_INDICATOR]: '正在输入提示',
    [MESSAGE_TYPE.TYPING_BROADCAST]: '输入状态广播',
    [MESSAGE_TYPE.READ_RECEIPT]: '已读回执',
    [MESSAGE_TYPE.READ_NOTIFICATION]: '已读通知',
    [MESSAGE_TYPE.SYSTEM_NOTICE]: '系统通知',
    [MESSAGE_TYPE.ERROR_NOTIFICATION]: '错误通知',
    [MESSAGE_TYPE.HEARTBEAT_REQUEST]: '心跳请求',
    [MESSAGE_TYPE.HEARTBEAT_RESPONSE]: '心跳响应',
    [MESSAGE_TYPE.HISTORY_REQUEST]: '历史消息请求',
    [MESSAGE_TYPE.HISTORY_RESPONSE]: '历史消息响应',
    [MESSAGE_TYPE.ONLINE_USERS_REQUEST]: '在线用户列表请求',
    [MESSAGE_TYPE.ONLINE_USERS_RESPONSE]: '在线用户列表响应'
  }

  return descriptions[type] || '未知消息类型'
}

/**
 * 获取消息方向的描述文本
 * @param {string} direction - 消息方向常量
 * @returns {string} - 对应的描述文本
 */
export function getMessageDirectionDescription(direction) {
  const descriptions = {
    [MESSAGE_DIRECTION.CLIENT_TO_SERVER]: '客户端→服务器',
    [MESSAGE_DIRECTION.SERVER_TO_CLIENT]: '服务器→客户端',
    [MESSAGE_DIRECTION.BIDIRECTIONAL]: '双向'
  }

  return descriptions[direction] || '未知消息方向'
}
