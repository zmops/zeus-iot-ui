import Layout from '@/layout'
/* 日志查询的路由 */
const logRouter = {
  path: '/log',
  component: Layout,
  name: 'log',
  redirect: '/log/businessLog',
  meta: {
    title: '系统日志',
    icon: 'menu_log',
    active_icon: 'menu_log_ac'
  },
  children: [
    {
      path: '/log/businessLog',
      component: () => import('@/views/log/businessLog'),
      name: '/log/businessLog',
      meta: {
        title: '业务日志',
        icon24: 'log24',
        icon48: 'log48'
      }
    },
    {
      path: '/log/loginLog',
      component: () => import('@/views/log/loginLog'),
      name: '/log/loginLog',
      meta: {
        title: '登录日志',
        icon24: 'log24',
        icon48: 'log48'
      }
    }
  ]
}
export default logRouter
