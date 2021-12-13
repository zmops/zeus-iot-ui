import Layout from '@/layout'
/* 协议管理的路由 */
const authRouter = {
  path: '/agreement',
  component: Layout,
  name: 'agreement',
  alwaysShow: true,
  meta: {
    title: '协议管理',
    icon: 'menu_agreement',
    active_icon: 'menu_agreement_ac'
  },
  children: [
    {
      path: '/agreement/module',
      component: () => import('@/views/agreement/module'),
      name: '/agreement/module',
      meta: {
        title: '协议组件',
        icon24: 'module24',
        icon48: 'module48'
      }
    },
    {
      path: '/agreement/communication',
      component: () => import('@/views/agreement/communication'),
      name: '/agreement/communication',
      meta: {
        title: '通信服务',
        icon24: 'communication24',
        icon48: 'communication48'
      }
    },
    {
      path: '/agreement/gateway',
      component: () => import('@/views/agreement/gateway'),
      name: '/agreement/gateway',
      meta: {
        title: '协议网关',
        icon24: 'gateway24',
        icon48: 'gateway48'
      }
    }
  ]
}
export default authRouter
