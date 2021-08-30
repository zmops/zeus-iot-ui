const SocketClient = {
  Socket: null
}

/** 建立连接 */
SocketClient.createSocket = (url, userId) => {
  const WSS_URL = `${url}/${userId}`
  if (!SocketClient.Socket) {
    SocketClient.Socket = new WebSocket(WSS_URL)
    SocketClient.Socket.onopen = () => {
      SocketClient.Socket.send('{ping: "ping"}')
    }
    /** WS数据接收统一处理 */
    SocketClient.Socket.onmessage = (e) => {
      console.log(e)
    }
    /** 连接失败重连 */
    SocketClient.Socket.onerror = () => {
      SocketClient.Socket.close()
      // SocketClient.createSocket() //重连
    }
    /** 关闭WS */
    SocketClient.Socket.onclose = () => {
    }
  }
}

export default SocketClient
