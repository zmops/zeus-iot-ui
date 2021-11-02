import Layout from '@/layout'
/* 平台日志的路由 */
const platformLogRouter = {
  path: '/platformLog',
  component: Layout,
  name: 'platformLog',
  redirect: '/platformLog/event',
  meta: {
    title: '平台日志',
    icon: 'menu_platformLog',
    active_icon: 'menu_platformLog_ac'
  },
  alwaysShow: true,
  children: [
    // {
    //   path: '/platformLog/alert',
    //   component: () => import('@/views/analyse/devLog'),
    //   name: '/platformLog/alert',
    //   meta: {
    //     title: '告警日志',
    //     icon24: 'log24',
    //     icon48: 'log48'
    //   }
    // },
    {
      path: '/platformLog/linkage',
      component: () => import('@/views/analyse/devLog'),
      name: '/platformLog/linkage',
      meta: {
        title: '联动日志',
        icon24: 'log24',
        icon48: 'log48'
      }
    },
    {
      path: '/platformLog/service',
      component: () => import('@/views/analyse/devLog'),
      name: '/platformLog/service',
      meta: {
        title: '服务日志',
        icon24: 'log24',
        icon48: 'log48'
      }
    },
    {
      path: '/platformLog/event',
      component: () => import('@/views/analyse/devLog'),
      name: '/platformLog/event',
      meta: {
        title: '事件日志',
        icon24: 'log24',
        icon48: 'log48'
      }
    }
  ]
}
export default platformLogRouter
