import Layout from '@/layout'
/* 统计分析的路由 */
const analyseRouter = {
  path: '/analyse',
  component: Layout,
  name: 'analyse',
  redirect: '/analyse/device',
  meta: {
    title: '统计分析',
    icon: 'menu_analyse',
    active_icon: 'menu_analyse_ac'
  },
  children: [
    {
      path: '/analyse/globalOverview',
      component: () => import('@/views/analyse/globalOverview'),
      name: '/analyse/globalOverview',
      meta: {
        title: '全局概览'
      }
    },
    {
      path: '/analyse/latest',
      component: () => import('@/views/401'),
      name: '/analyse/latest',
      meta: {
        title: '最新数据',
        icon24: 'device24',
        icon48: 'device48'
      }
    },
    {
      path: '/analyse/devLog',
      component: () => import('@/views/analyse/devLog'),
      name: '/analyse/devLog',
      meta: {
        title: '设备日志',
        icon24: 'log24',
        icon48: 'log48'
      }
    }
  ]
}
export default analyseRouter
