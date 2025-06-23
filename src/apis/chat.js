import { StringWebSocketMessage } from '@/class/dto/webSocket'
import { useUserStore } from '@/stores/user'
import { getTimeStampId } from '@/utils/idUtil'
import { getWebSocket } from '@/utils/webSocket'
import request from '@/utils/request'
import dayjs from 'dayjs'
import { MESSAGE_TYPE } from '@/utils/webSocketMessageType'

// WebSocket 连接
const userStore = useUserStore()
const chatWebSocketRecallFuncationList = []
const handlerReceiverMsg = (data) => {
  chatWebSocketRecallFuncationList.forEach((func) => {
    if (func !== undefined || func !== null || Object.prototype.toString.call(func) === '[object Function]') {
      func(data)
    }
  })
}
const chatWebSocket = getWebSocket(`ws://localhost:8080/ws/chat?token=${userStore.token}`, handlerReceiverMsg)

/**
 * 添加WebSocket接收消息回调函数
 * @param {Function} func 要添加的回调函数
 */
export const addWebSocketRecallFuncation = (func) => {
  if (func !== undefined && func !== null && Object.prototype.toString.call(func) === '[object Function]') {
    chatWebSocketRecallFuncationList.push(func)
  } else {
    console.warn('提供的WebSocket回调函数不合法（undefined、null、非函数）')
  }
}

/**
 * 移除WebSocket接收消息回调函数
 * @param {Function} func 要移除的回调函数
 */
export const removeWebSocketRecallFuncation = (func) => {
  if (func === undefined || func === null || Object.prototype.toString.call(func) !== '[object Function]') {
    console.warn('提供的WebSocket回调函数不合法（undefined、null、非函数）')
    return
  }
  const index = chatWebSocketRecallFuncationList.indexOf(func)
  if (index !== -1) {
    chatWebSocketRecallFuncationList.splice(index, 1)
  } else {
    console.warn('提供的WebSocket回调函数不存在于回调函数列表中')
  }
}
/**
 * 获取聊天用户列表
 * @param {String} userId 用户id
 * @returns {Promise} Promise对象
 */
export const getChatList = async (userId) => {
  return request.get(`/chat/user/${userId}/recent-chat-list`)
}

/**
 *获取消息列表
 * @param {String} userId1 用户id1
 * @param {String} userId2 用户id2
 * @returns {Promise} Promise对象
 */
export const getMessageList = async (userId1, userId2) => {
  return request.get(`/chat/message/list/${userId1}/${userId2}`)
}

/**
 * 发送消息
 * @param {String} senderId 发送者id
 * @param {String} receiverId 接收者id
 * @param {String} messageContent 消息内容
 * @param {String} messageDatetime 消息时间
 */
export const sendMessage = async (senderId, receiverId, messageContent, messageDatetime) => {
  // WebSocket方式发送消息
  const data = JSON.stringify({
    senderId,
    receiverId,
    messageContent,
    messageDatetime: dayjs(messageDatetime).format('YYYY-MM-DDTHH:mm:ss')
  })
  const message = new StringWebSocketMessage()
  message.type = MESSAGE_TYPE.PRIVATE_MESSAGE
  message.timestamp = Date.now()
  message.tempId = getTimeStampId()
  message.data = data
  chatWebSocket.send(JSON.stringify(message))
}
