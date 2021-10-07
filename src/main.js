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
import App from './App'
import router from './router'
import store from './store'

Vue.use(ElementUI)
Vue.use(new VueSocketIO({
  // debug: true,
  connection: `http://${process.env.VUE_APP_SOCKET_PATH}:9080?token=user002&userId=1`,
  options: {
    transports: ['websocket']
  }
}))
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
