import Layout from '@/layout'
/* 平台授权的路由 */
const authRouter = {
  path: '/auth',
  component: Layout,
  name: 'auth',
  alwaysShow: true,
  meta: {
    title: '平台授权',
    icon: 'menu_auth',
    active_icon: 'menu_auth_ac'
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
