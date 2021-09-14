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
      component: () => import('@/views/auth/release'),
      name: '/auth',
      meta: {
        title: '平台授权',
        icon24: 'auth24',
        icon48: 'auth48'
      }
    }
  ]
}
export default authRouter
