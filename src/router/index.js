import Vue from 'vue'
import Router from 'vue-router'

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location)
}

/* 不设权限的路由 */
import constantRouter from '@/router/modules/constant'
/* 设备管理 */
import deviceMgrRouter from '@/router/modules/deviceMgr'
/* 产品管理 */
import productMgrRouter from '@/router/modules/productMgr'
/* 系统管理 */
import systemRouter from '@/router/modules/system'
/* 日志查询 */
import logRouter from '@/router/modules/log'
import Layout from '@/layout/index'

Vue.use(Router)
window.axiosCancel = []

export const constantRouters = constantRouter
export const asyncRoutes = [
  deviceMgrRouter,
  productMgrRouter,
  systemRouter,
  logRouter
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
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouters
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
