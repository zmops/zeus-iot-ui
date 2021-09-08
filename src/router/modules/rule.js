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
        icon24: 'device24',
        icon48: 'device48'
      }
    }
  ]
}
export default ruleRouter
