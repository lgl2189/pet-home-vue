import { useWebSocket } from '@vueuse/core'
import { watch } from 'vue'

let dataProcessor = (data) => {
  return
}

/**
 * 创建一个WebSocket连接，监听数据变化，并调用自定义的dataProcessor进行数据处理
 * @param {*} webSocketUrl WebSocket连接地址
 * @param {*} customDataProcessor 自定义的dataProcessor，该参数可选，默认使用全局的dataProcessor，不对接收到的消息进行任何处理
 * @returns {data, send, open, close, readyState}
 */
export const getWebSocket = (webSocketUrl, customDataProcessor) => {
  const { data, send, open, close, readyState } = useWebSocket(webSocketUrl, {
    autoReconnect: {
      retries: 5,
      delay: 1000,
      onFailed() {
        console.error('WebSocket重连失败')
      }
    },
    // 添加连接关闭处理
    onDisconnected(_ws, event) {
      // 1003 是后端返回的 CANNOT_ACCEPT 错误码
      if (event.code === 1003) {
        console.error('WebSocket认证失败，停止重连')
        close()
      }
    }
    // ,heartbeat: {
    //   enabled: false,
    //   message: 'ping',
    //   interval: 2000,
    //   pingTimeout: 5000
    // }
  })

  if (
    customDataProcessor !== undefined &&
    customDataProcessor !== null &&
    Object.prototype.toString.call(customDataProcessor) === '[object Function]'
  ) {
    dataProcessor = customDataProcessor
  } else {
    console.warn('自定义的dataProcessor参数不合法（undefined、null、非函数），将使用全局的dataProcessor')
  }

  watch(
    () => data,
    (newData) => {
      dataProcessor(newData)
    }
  )

  return {
    data,
    send,
    open,
    close,
    readyState
  }
}
