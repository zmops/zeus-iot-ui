import Layout from '@/layout'
/* 可视化的路由 */
const viewRouter = {
  path: '/view',
  component: Layout,
  name: 'view',
  redirect: '/view/grafana',
  alwaysShow: true,
  meta: {
    title: '可视化',
    icon: 'undevice',
    active_icon: 'device'
  },
  children: [
    {
      path: '/view/grafana',
      component: () => import('@/views/401'),
      name: '/view/grafana',
      meta: {
        title: 'Grafana配置',
        icon24: 'device24',
        icon48: 'device48'
      }
    }
  ]
}
export default viewRouter
