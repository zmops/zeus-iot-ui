import Layout from '@/layout'
/* 可视观测的路由 */
const visualizationRouter = {
  path: '/visualization',
  component: Layout,
  name: 'visualization',
  redirect: '/visualization/distributed',
  meta: {
    title: '可视化',
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
    },
    {
      path: '/visualization/grafana',
      component: () => import('@/views/analyse/grafana'),
      name: '/visualization/grafana',
      meta: {
        title: 'Grafana[示例]'
      }
    },
    {
      path: '/visualization/building',
      component: () => import('@/views/visualization/building'),
      name: '/visualization/building',
      meta: {
        title: '楼宇场景[示例]'
      }
    }
  ]
}
export default visualizationRouter
