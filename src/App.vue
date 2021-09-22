<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import EventBus from '@/utils/event-bus'
import SocketClient from '@/utils/websocket'

export default {
  name: 'App',
  data() {
    return {
      msg: '',
      msgObj: {}
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
    if (location.href.indexOf('/#/login') === -1) {
      this.$store.dispatch('user/getMember').then(() => {
      })
    }
    EventBus.$on('openSocket', 'app', () => {
      const url = process.env.NODE_ENV === 'production' ? window.location.host + '/api' : process.env.VUE_APP_API_HOST + ':' + process.env.VUE_APP_API_PORT
      const infoId = localStorage.getItem('userid')
      if (infoId) {
        /* 连接socket */
        SocketClient.createSocket(`ws://${url}/websocket/alarm`, infoId)
        SocketClient.Socket.onmessage = (e) => {
          this.msg = e.data
        }
      }
    })
    EventBus.$on('closeSocket', 'app', () => {
      if (SocketClient.Socket) {
        SocketClient.Socket.close()
      }
      SocketClient.Socket = null
    })
    EventBus.$emit('openSocket', 'app')
  },
  beforeDestroy() {
    EventBus.$emit('closeSocket', 'app')
  }
}
</script>
