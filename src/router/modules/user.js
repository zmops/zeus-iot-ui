import Layout from '@/layout'
/* 用户管理的路由 */
const userRouter = {
  path: '/userMgr',
  component: Layout,
  name: 'userMgr',
  redirect: '/userMgr/user',
  meta: {
    title: '用户管理',
    icon: 'menu_user',
    active_icon: 'menu_user_ac'
  },
  children: [
    {
      path: '/userMgr/user',
      component: () => import('@/views/userManage/user'),
      name: '/userMgr/user',
      meta: {
        title: '用户',
        icon24: 'user24',
        icon48: 'user48'
      }
    },
    {
      path: '/userMgr/userGroup',
      component: () => import('@/views/userManage/userGroup'),
      name: '/userMgr/userGroup',
      meta: {
        title: '用户组',
        icon24: 'userGroup24',
        icon48: 'userGroup48'
      }
    }
  ]
}
export default userRouter
