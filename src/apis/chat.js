import request from '@/utils/request'
import dayjs from 'dayjs'

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
  return request.post('/chat/message', {
    sender_id: senderId,
    receiver_id: receiverId,
    message_content: content,
    message_datetime: dayjs(messageDatetime).format('YYYY-MM-DDTHH:mm:ss')
  })
}
