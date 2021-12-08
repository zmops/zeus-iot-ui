import Layout from '@/layout'
/* 平台监控的路由 */
const realTimeRouter = {
  path: '/realTime',
  component: Layout,
  name: 'realTime',
  redirect: '/realTime/platform',
  meta: {
    title: '平台监控',
    icon: 'menu_realTime',
    active_icon: 'menu_realTime_ac'
  },
  children: [
    {
      path: '/realTime/platform',
      component: () => import('@/views/realTime/platform'),
      name: '/realTime/platform',
      meta: {
        title: '主服务监控',
        icon24: 'proxy24',
        icon48: 'proxy48'
      }
    },
    {
      path: '/realTime/proxy',
      component: () => import('@/views/realTime/proxy'),
      name: '/realTime/proxy',
      meta: {
        title: '代理监控',
        icon24: 'proxy24',
        icon48: 'proxy48'
      }
    },
    {
      path: '/realTime/proxy/detail',
      component: () => import('@/views/realTime/proxy/detail'),
      name: '/realTime/proxy/detail',
      hidden: true,
      meta: {
        title: '代理监控详情',
        hiddenMenu: true
      }
    }
  ]
}
export default realTimeRouter
