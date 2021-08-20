import Layout from '@/layout'
/* 统计分析的路由 */
const analyseRouter = {
  path: '/analyse',
  component: Layout,
  name: 'analyse',
  redirect: '/analyse/device',
  meta: {
    title: '统计分析',
    icon: 'undevice',
    active_icon: 'device'
  },
  children: [
    {
      path: '/analyse/latest',
      component: () => import('@/views/401'),
      name: '/analyse/latest',
      meta: {
        title: '最新数据'
      }
    },
    {
      path: '/analyse/devLog',
      component: () => import('@/views/401'),
      name: '/analyse/devLog',
      meta: {
        title: '设备日志'
      }
    },
    {
      path: '/analyse/home',
      component: () => import('@/views/401'),
      name: '/analyse/home',
      meta: {
        title: '全局概览'
      }
    }
  ]
}
export default analyseRouter
