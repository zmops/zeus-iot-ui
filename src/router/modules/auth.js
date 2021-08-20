import Layout from '@/layout'
/* 平台授权的路由 */
const authRouter = {
  path: '/auth',
  component: Layout,
  name: 'auth',
  alwaysShow: true,
  meta: {
    title: '平台授权',
    icon: 'undevice',
    active_icon: 'device'
  },
  children: [
    {
      path: '/auth',
      component: () => import('@/views/401'),
      name: '/auth',
      meta: {
        title: '平台授权',
        icon24: 'device24',
        icon48: 'device48'
      }
    }
  ]
}
export default authRouter
