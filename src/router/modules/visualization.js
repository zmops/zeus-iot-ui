import Layout from '@/layout'
/* 可视观测的路由 */
const visualizationRouter = {
  path: '/visualization',
  component: Layout,
  name: 'visualization',
  redirect: '/visualization/distributed',
  meta: {
    title: '可视观测',
    icon: 'menu_visualization',
    active_icon: 'menu_visualization_ac'
  },
  alwaysShow: true,
  children: [
    {
      path: '/visualization/distributed',
      component: () => import('@/views/deviceMgr/distributed'),
      name: '/visualization/distributed',
      meta: {
        title: '设备分布',
        icon24: 'device24',
        icon48: 'device48'
      }
    }
  ]
}
export default visualizationRouter
