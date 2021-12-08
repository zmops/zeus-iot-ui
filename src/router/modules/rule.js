import Layout from '@/layout'
/* 规则引擎的路由 */
const ruleRouter = {
  path: '/rule',
  component: Layout,
  name: 'rule',
  alwaysShow: true,
  redirect: '/rule/scene',
  meta: {
    title: '规则引擎',
    icon: 'menu_rule',
    active_icon: 'menu_rule_ac'
  },
  children: [
    {
      path: '/rule/scene',
      component: () => import('@/views/rule/scene'),
      name: '/rule/scene',
      meta: {
        title: '场景联动',
        icon24: 'scene24',
        icon48: 'scene48'
      }
    },
    {
      path: '/rule/process',
      component: () => import('@/views/rule/process'),
      name: '/rule/process',
      meta: {
        title: '流程配置',
        icon24: 'scene24',
        icon48: 'scene48'
      }
    }
  ]
}
export default ruleRouter
