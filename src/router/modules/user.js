import Layout from '@/layout'
/* 用户管理的路由 */
const userRouter = {
  path: '/system/userMgr',
  component: Layout,
  name: 'userMgr',
  redirect: '/system/user',
  meta: {
    title: '用户管理',
    icon: 'menu_system',
    active_icon: 'menu_system_ac'
  },
  children: [
    {
      path: '/system/user',
      component: () => import('@/views/userManage/user'),
      name: '/system/user',
      meta: {
        title: '用户',
        icon24: 'user24',
        icon48: 'user48'
      }
    },
    {
      path: '/system/userGroup',
      component: () => import('@/views/userManage/userGroup'),
      name: '/system/userGroup',
      meta: {
        title: '用户组',
        icon24: 'userGroup24',
        icon48: 'userGroup48'
      }
    }
  ]
}
export default userRouter
