import Vue from 'vue'
import Router from 'vue-router'

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location)
}

/* 不设权限的路由 */
import constantRouter from '@/router/modules/constant'
/* 统计分析 */
import analyseRouter from '@/router/modules/analyse'
/* 设备管理 */
import deviceMgrRouter from '@/router/modules/deviceMgr'
/* 产品管理 */
import productMgrRouter from '@/router/modules/productMgr'
/* 规则引擎 */
import ruleRouter from '@/router/modules/rule'
/* 告警管理 */
import alarmRouter from '@/router/modules/alarm'
/* 日志查询 */
import logRouter from '@/router/modules/log'
/* 系统管理 */
import systemRouter from '@/router/modules/system'

import Layout from '@/layout/index'

Vue.use(Router)
window.axiosCancel = []

export const constantRouters = constantRouter
export const asyncRoutes = [
  analyseRouter,
  deviceMgrRouter,
  productMgrRouter,
  ruleRouter,
  alarmRouter,
  logRouter,
  systemRouter
]
export const errorRouters = [
  {
    path: '/404',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/404',
        name: '404',
        meta: {
          hiddenMenu: true
        },
        component: () => import('@/views/404')
      },
      {
        path: '/401',
        name: '401',
        meta: {
          hiddenMenu: true
        },
        component: () => import('@/views/401')
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouters
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
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

export default router
