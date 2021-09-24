import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import '@/styles/common.scss'
import '@/styles/element-variables.scss'
import App from './App'
import store from './store'
import router from './router'
import JsEncrypt from 'jsencrypt'

import '@/icons' // icon
import './utils/directives.js'
import '@/permission' // permission control

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$stringToHex = function(str) {
  const arr = []
  for (let i = 0; i < str.length; i++) {
    arr.push((str.charCodeAt(i)).toString(16))
  }
  return arr.join('')
}
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (isChunkLoadFailed) {
    window.location.reload()
    // router.replace(router.history.pending.fullPath);
  } else {
    console.log(error)
  }
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
