import Layout from '@/layout'
/* 设备管理的路由 */
const deviceMgrRouter = {
  path: '/deviceMgr',
  component: Layout,
  name: 'deviceMgr',
  redirect: '/deviceMgr/device',
  meta: {
    title: '设备管理',
    icon: 'menu_device',
    active_icon: 'menu_device_ac'
  },
  children: [
    {
      path: '/deviceMgr/device',
      component: () => import('@/views/deviceMgr/device'),
      name: '/deviceMgr/device',
      meta: {
        title: '设备',
        icon24: 'device24',
        icon48: 'device48'
      }
    },
    {
      path: '/deviceMgr/device/detail',
      component: () => import('@/views/deviceMgr/device/detail'),
      name: '/deviceMgr/device/detail',
      hidden: true,
      meta: {
        title: '设备详情',
        hiddenMenu: true
      }
    },
    {
      path: '/deviceMgr/deviceGroup',
      component: () => import('@/views/deviceMgr/deviceGroup'),
      name: '/deviceMgr/deviceGroup',
      meta: {
        title: '设备组',
        icon24: 'device24',
        icon48: 'device48'
      }
    },
    {
      path: '/deviceMgr/debug',
      component: () => import('@/views/deviceMgr/debug'),
      name: '/deviceMgr/debug',
      meta: {
        title: '设备调试',
        icon24: 'device24',
        icon48: 'device48'
      }
    }
  ]
}
export default deviceMgrRouter
