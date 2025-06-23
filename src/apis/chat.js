import { useUserStore } from '@/stores/user'
import request from '@/utils/request'
import { getWebSocket } from '@/utils/webSocket'
import dayjs from 'dayjs'

// WebSocket 连接
const userStore = useUserStore()
const chatWebSocketRecallFuncationList = []
const handlerReceiverMsg = (data) => {
  chatWebSocketRecallFuncationList.forEach((func) => {
    func(data)
  })
}
const chatWebSocket = getWebSocket(`ws://localhost:8080/ws/chat?token=${userStore.token}`, handlerReceiverMsg)

export const addWebSocketRecallFuncation = (func) => {
  if (func !== undefined && func !== null && Object.prototype.toString.call(func) === '[object Function]') {
    chatWebSocketRecallFuncationList.push(func)
  } else {
    console.warn('提供的WebSocket回调函数不合法（undefined、null、非函数）')
  }
}

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
// 获取聊天用户列表
export const getChatList = async (userId) => {
  return request.get(`/chat/user/${userId}/recent-chat-list`)
}

// 获取消息列表
export const getMessageList = async (userId1, userId2) => {
  return request.get(`/chat/message/list/${userId1}/${userId2}`)
}

// 发送消息
export const sendMessage = async (senderId, receiverId, content, messageDatetime) => {
  // WebSocket方式发送消息
  chatWebSocket.send(
    JSON.stringify({
      sender_id: senderId,
      receiver_id: receiverId,
      message_content: content,
      message_datetime: dayjs(messageDatetime).format('YYYY-MM-DDTHH:mm:ss')
    })
  )
  // Http方式发送消息
  // return request.post('/chat/message', {
  //   sender_id: senderId,
  //   receiver_id: receiverId,
  //   message_content: content,
  //   message_datetime: dayjs(messageDatetime).format('YYYY-MM-DDTHH:mm:ss')
  // })
}
