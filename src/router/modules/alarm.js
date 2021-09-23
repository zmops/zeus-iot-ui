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
    icon: 'menu_alarm',
    active_icon: 'menu_alarm_ac'
  },
  children: [
    {
      path: '/alarm/alarmList',
      component: () => import('@/views/alarm/alarmList'),
      name: '/alarm/alarmList',
      meta: {
        title: '告警记录',
        icon24: 'alarmList24',
        icon48: 'alarmList48'
      }
    }
  ]
}
export default alarmRouter
