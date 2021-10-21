import Layout from '@/layout'
/* 统计分析的路由 */
const analyseRouter = {
  path: '/analyse',
  component: Layout,
  name: 'analyse',
  redirect: '/analyse/device',
  alwaysShow: true,
  meta: {
    title: '统计分析',
    icon: 'menu_analyse',
    active_icon: 'menu_analyse_ac'
  },
  children: [
    {
      path: '/analyse/home',
      component: () => import('@/views/analyse/globalOverview'),
      name: '/analyse/home',
      meta: {
        title: '全局概览'
      }
    },
    // {
    //   path: '/analyse/latest',
    //   component: () => import('@/views/analyse/latest'),
    //   name: '/analyse/latest',
    //   meta: {
    //     title: '最新数据',
    //     icon24: 'device24',
    //     icon48: 'device48'
    //   }
    // },
  ]
}
export default analyseRouter
