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
import '@/permission' // permission control

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$getRsaCode = function(str) {
  // 公钥
  const pubKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwgmYk5tASrKzbjPwYffD9eAt1WRjBL2oN8x0FSff0YBrwdaozUFX0uU6z/gkfcjHwdvEJ7PJAt3ELNZ2xyOcUyeLbS0ds7Yx4pMT7kOYGod4IQDRqjXx0NZIe+f8cijYp9Myg37gL1ptXKV7mWX5cOUfP0g9qI0XLqf3dPSJ77wIDAQAB`
  const encryptStr = new JsEncrypt()
  encryptStr.setPublicKey(pubKey) // 设置 加密公钥
  return encryptStr.encrypt(str.toString()) // 进行加密
}
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
