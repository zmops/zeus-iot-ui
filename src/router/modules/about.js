import Layout from '@/layout'
/* 关于我们的路由 */
const aboutRouter = {
  path: '/about',
  component: Layout,
  children: [
    {
      path: '/about',
      name: '/about',
      component: () => import('@/views/401'),
      meta: { title: '关于我们' }
    }
  ]
}
export default aboutRouter
