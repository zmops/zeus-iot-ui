import Layout from '@/layout'
/* 告警管理的路由 */
const alarmRouter = {
  path: '/alarm',
  component: Layout,
  name: 'alarm',
  redirect: '/alarm/alarmList',
  alwaysShow: true,
  meta: {
    title: '告警管理',
    icon: 'undevice',
    active_icon: 'device'
  },
  children: [
    {
      path: '/alarm/alarmList',
      component: () => import('@/views/401'),
      name: '/alarm/alarmList',
      meta: {
        title: '告警记录',
        icon24: 'device24',
        icon48: 'device48'
      }
    }
  ]
}
export default alarmRouter
