<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import EventBus from '@/utils/event-bus'

export default {
  name: 'App',
  sockets: {
    // 链接成功
    connect() {
      console.log('连接成功')
    },
    // 链接失败
    disconnect() {
      console.log('连接失败')
    },
    // 重新连接
    reconnect() {
      console.log('重新连接')
    },
    // 监听、接收消息方法
    broadcast(data) {
      this.msg = data.message
      console.log(data)
    }
  },
  data() {
    return {
      msg: '',
      msgObj: {},
      socket: null
    }
  },
  watch: {
    msg: {
      handler(val) {
        const self = this
        let show = 0
        let obj = {}
        if (val && val.indexOf('}') !== -1) {
          obj = JSON.parse(val)
          show = 1
        } else {
          obj = {}
        }
        self.msgObj = obj
        if (show && obj.msg) {
          self.$notify.closeAll()
          self.$notify({
            title: '设备告警提醒',
            iconClass: 'el-icon-warning-outline',
            customClass: 'msg-pop',
            duration: 20000,
            type: 'warning',
            dangerouslyUseHTMLString: true,
            message: `<div>${obj.msg}</div>`,
            onClose() {

            },
            onClick() {
              // if (self.$route.path !== '/alarmMgr/alarmCurrent') {
              //   self.$router.push({
              //     path: '/alarmMgr/alarmCurrent'
              //   })
              // }
              self.$notify.closeAll()
            }
          })
        }
      }
    }
  },
  async created() {
    // console.log(location)
    // console.log(this.$route)
    if (location.hash !== '#/login') {
      this.$store.dispatch('user/getMember').then(() => {
      })
    }
    EventBus.$on('openSocket', 'app', () => {
      this.$socket.emit('connect')
    })
    EventBus.$on('closeSocket', 'app', () => {
      this.$socket.emit('disconnect')
    })
    EventBus.$emit('openSocket', 'app')
  },
  mounted() {
    this.$socket.on('broadcast', (data) => {
      console.log(data)
    })
    const singleRequest = {
      fromUid: 'token',
      toUid: 'toUserId',
      message: 'xiaoyao'
    };
    this.$socket.emit('chat', singleRequest)
    // this.$socket.connect(`http://${process.env.VUE_APP_API_HOST}:9080?token=user002&userId=1`)
  },
  beforeDestroy() {
    EventBus.$emit('closeSocket', 'app')
  }
}
</script>
