import Layout from '@/layout/index'

/**
 *
 * 无需权限的页面
 *
 * */

const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   name: 'home',
  //   meta: {
  //     title: '首页',
  //     icon: 'dashboard',
  //     active_icon: 'dashboard'
  //   },
  //   children: [
  //     {
  //       path: '/',
  //       component: () => import('@/views/home/index'),
  //       name: 'home1',
  //       meta: {
  //         title: '首页1'
  //       }
  //     }
  //   ]
  // }
]
export default constantRoutes
