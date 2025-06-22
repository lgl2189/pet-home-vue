import { useWebSocket } from '@vueuse/core'

export default useWebSocket = () => {
  const { data, send, open, close, readyState } = useWebSocket('ws://localhost:8080', {
    autoReconnect: {
      retries: 5,
      delay: 1000,
      onFailed() {
        console.error('WebSocket重连失败')
      }
    },
    heartbeat: {
      message: 'ping',
      interval: 10000,
      pingTimeout: 5000
    }
  })

  return {
    data,
    send,
    open,
    close,
    readyState
  }
}
