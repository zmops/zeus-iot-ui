import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/styles/common.scss'
import '@/styles/element-variables.scss'
import '@/icons' // icon
import './utils/directives.js'
import '@/permission' // permission control
import VueSocketIO from 'vue-socket.io'
import moment from 'dayjs'
import App from './App'
import router from './router'
import store from './store'
import VueClipboard from 'vue-clipboard2'

Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.use(new VueSocketIO({
  // debug: true,
  connection: `http://${process.env.VUE_APP_SOCKET_PATH}:9080?token=user&userId=` + localStorage.getItem('userid'),
  // options: {
  //   transports: ['websocket']
  // }
}))
Vue.prototype.moment = moment
Vue.config.productionTip = false
Vue.prototype.$stringToHex = function (str) {
  const arr = []
  for (let i = 0; i < str.length; i++) {
    arr.push((str.charCodeAt(i)).toString(16))
  }
  return arr.join('')
}
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
