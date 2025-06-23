<script setup>
  import { ref, onBeforeMount, computed, nextTick, watch } from 'vue'
  import { useUserStore } from '@/stores/user'
  import { getChatList, getMessageList, sendMessage } from '@/apis/chat'
  import { getPublicUserInfo } from '@/apis/user'
  import dayjs from 'dayjs'

  // 响应式对象
  const userStore = useUserStore()
  const recentChatList = ref([])
  const messageListInfo = ref(null)
  // 当前登录用户信息
  const currentUser = ref(null)
  // 当前聊天的人的Id和信息对象
  const selectedUser = ref(null)
  const inputMessage = ref('')

  const messageScrollSwitch = ref(true)
  const messageScrollbarRef = ref(null)

  // 计算属性
  const messageList = computed(() => {
    return messageListInfo.value?.message_list || []
  })

  // 函数
  // 初始化当前用户信息
  const initCurrentUser = async () => {
    const res = await getPublicUserInfo(userStore.userId)
    if (res.status === '200') {
      currentUser.value = {
        userId: userStore.userId,
        userName: res.data.user_name,
        avatar: 'http://localhost:8080/resource/image/f4613d9c-7367-4128-8a2f-327c55be44d5.jpeg'
      }
    }
  }
  // 获取用户列表
  const fetchUserList = async () => {
    try {
      const res = await getChatList(userStore.userId)
      if (res.status === '200') {
        recentChatList.value = res.data.recent_chat_list
        recentChatList.value.forEach((user) => {
          user.avatar = 'http://localhost:8080/resource/image/a83e1d8e-346c-446c-a12c-677018113d7b.jpeg'
        })
      } else {
        ElMessage.error('获取用户列表失败:' + res.message)
      }
    } catch (error) {
      ElMessage.error('获取用户列表失败:' + error)
    }
  }

  // 选择用户
  const selectUser = async (newselectUser) => {
    if (newselectUser.sender_id === selectedUser.value?.userId) {
      return
    }
    messageScrollSwitch.value = false
    selectedUser.value = {
      userId: newselectUser.sender_id,
      userName: newselectUser.sender_name,
      avatar: newselectUser.avatar
    }
    await fetchMessageList(newselectUser.sender_id)
    messageScrollSwitch.value = true
    nextTick(() => {
      scrollToBottom()
    })
  }

  // 获取消息记录
  const fetchMessageList = async (otherUserId) => {
    try {
      const res = await getMessageList(otherUserId, userStore.userId)
      if (res.status === '200') {
        messageListInfo.value = res.data.message_list_info
        messageListInfo.value.message_list.forEach((message) => {
          message.isMe = message.sender_id == userStore.userId
        })
      } else {
        ElMessage.error('获取消息记录失败:' + res.message)
      }
    } catch (error) {
      ElMessage.error('获取消息记录失败:' + error)
    }
  }

  // 发送消息
  const sendMessageAction = async () => {
    if (!inputMessage.value.trim() || !selectedUser.value.userId) return

    const nowDate = Date.now()
    const res = await sendMessage(currentUser.value.userId, selectedUser.value.userId, inputMessage.value, nowDate)

    if (res.status === '200') {
      // 添加到消息列表
      const newMessage = {
        ...res.data.message,
        isMe: true
      }
      messageListInfo.value.message_list.push(newMessage)

      // 更新用户列表中的最后一条消息
      const userIndex = recentChatList.value.findIndex((user) => user.sender_id === selectedUser.value.userId)
      if (userIndex !== -1) {
        recentChatList.value[userIndex].message_content = res.data.message.message_content
        recentChatList.value[userIndex].message_datetime = res.data.message.message_datetime
      }
      inputMessage.value = ''
      scrollToBottom()
    } else {
      ElMessage.error('发送消息失败:' + res.message)
    }
  }

  // 滚动到底部
  const scrollToBottom = () => {
    const wrapRef = messageScrollbarRef.value?.wrapRef
    if (wrapRef) {
      nextTick(() => {
        wrapRef.scrollTop = wrapRef.scrollHeight - wrapRef.clientHeight
      })
    }
  }

  // 监听消息列表变化，自动滚动到底部
  watch(messageList, () => {
    scrollToBottom()
  })

  // 生命周期函数
  onBeforeMount(async () => {
    await initCurrentUser()
    await fetchUserList()
  })
</script>
<template>
  <div class="user-chat-view-container">
    <!-- 左侧用户列表 -->
    <div class="left-sidebar">
      <div class="user-list">
        <el-scrollbar>
          <div
            v-for="user in recentChatList"
            :key="user.sender_id"
            :class="['user-item', user.sender_id === selectedUser?.userId ? 'active' : '']"
            @click="selectUser(user)">
            <div class="user-avatar">
              <img :src="user.avatar" :alt="user.sender_name" />
            </div>
            <div class="user-info">
              <div class="user-name">{{ user.sender_name }}</div>
              <div class="last-message">{{ user.message_content }}</div>
            </div>
            <div class="message-time">{{ dayjs(user.message_datetime).format('YY-MM-DD HH:mm:ss') }}</div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <!-- 右侧聊天区域 -->
    <div class="right-chat-area">
      <!-- 聊天头部 -->
      <div class="chat-header" v-if="selectedUser">
        <div class="current-user">
          <div class="user-avatar">
            <img :src="selectedUser?.avatar" :alt="selectedUser?.userName" />
          </div>
          <div class="user-name">{{ selectedUser?.userName || '请选择聊天对象' }}</div>
        </div>
      </div>

      <!-- 消息记录 -->
      <div class="message-list" v-if="messageScrollSwitch">
        <el-scrollbar ref="messageScrollbarRef">
          <div class="messages-container">
            <div
              v-for="message in messageList"
              :key="message.message_id"
              :class="['message-item', message.isMe ? 'right' : 'left']">
              <div class="message-avatar" v-if="!message.isMe">
                <img
                  :src="message.isMe ? currentUser?.avatar : selectedUser?.avatar"
                  :alt="message.isMe ? currentUser?.name : selectedUser?.name" />
              </div>
              <div class="message-content">
                <div class="message-text">{{ message.message_content }}</div>
              </div>
              <div class="message-avatar" v-if="message.isMe">
                <img
                  :src="message.isMe ? currentUser?.avatar : selectedUser?.avatar"
                  :alt="message.isMe ? currentUser?.name : selectedUser?.name" />
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <!-- 输入区域 -->
      <div class="input-area" v-if="selectedUser">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="5"
          placeholder="请输入消息..."
          @keyup.enter="sendMessageAction"
          @keydown.enter.prevent
          input-style="font-size:16px;"></el-input>
        <div class="button-group">
          <el-button size="default" @click="sendMessageAction">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .user-chat-view-container {
    box-sizing: border-box;
    display: flex;
    height: calc(100vh - 80px);
    background-color: #f5f7fa;
    padding-bottom: 10px;

    .left-sidebar {
      width: 300px;
      border-right: 1px solid #e6e6e6;
      display: flex;
      flex-direction: column;

      .user-list {
        flex: 1;
        overflow-y: auto;

        .user-item {
          display: flex;
          align-items: center;
          padding: 10px;
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background-color: #f0f2f5;
          }

          &.active {
            background-color: #e6f7ff;
          }

          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .user-info {
            flex: 1;
            overflow: hidden;

            .user-name {
              font-weight: 500;
              color: #333;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .last-message {
              font-size: 12px;
              color: #999;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .message-time {
            font-size: 12px;
            color: #999;
            margin-left: 10px;
          }
        }
      }
    }

    .right-chat-area {
      flex: 1;
      display: flex;
      flex-direction: column;

      .chat-header {
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        align-items: center;
        padding: 0 20px;

        .current-user {
          display: flex;
          align-items: center;

          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .user-name {
            font-weight: 500;
            color: #333;
          }
        }
      }

      .message-list {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        font-size: 14px;

        .messages-container {
          display: flex;
          flex-direction: column;
        }

        .message-item {
          display: flex;
          margin-bottom: 20px;

          &.left {
            justify-content: flex-start;
          }

          &.right {
            justify-content: flex-end;
          }

          .message-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .message-content {
            max-width: 70%;
            margin: 0 10px;
            border-radius: 10px;
            background-color: #8ac5ff;

            .message-text {
              padding: 10px 15px;
              border-radius: 6px;
              word-break: break-word;
            }

            &.left .message-text {
              background-color: #fff;
              border: 1px solid #e6e6e6;
            }

            &.right .message-text {
              background-color: #50bfff;
              color: #fff;
            }
          }
        }
      }

      .input-area {
        border-top: 1px solid #e6e6e6;
        padding: 10px;
        margin-bottom: 20px;

        .button-group {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>
