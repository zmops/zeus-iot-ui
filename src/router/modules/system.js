import Layout from '@/layout'
/* 系统管理的路由 */
const systemRouter = {
  path: '/system',
  component: Layout,
  name: 'system',
  redirect: '/system/role',
  meta: {
    title: '系统管理',
    icon: 'menu_system',
    active_icon: 'menu_system_ac'
  },
  children: [
    {
      path: '/system/role',
      component: () => import('@/views/system/role'),
      name: '/system/role',
      meta: {
        title: '角色管理',
        icon24: 'role24',
        icon48: 'role48'
      }
    },
    {
      path: '/system/tenant',
      component: () => import('@/views/system/tenant'),
      name: '/system/tenant',
      meta: {
        title: '租户管理',
        icon24: 'tenant24',
        icon48: 'tenant48'
      }
    },
    {
      path: '/system/tenant/detail',
      component: () => import('@/views/system/tenant/detail'),
      name: '/system/tenant/detail',
      hidden: true,
      meta: {
        title: '租户详情',
        hiddenMenu: true
      }
    },
    {
      path: '/system/dictType',
      component: () => import('@/views/system/dictType'),
      name: '/system/dictType',
      meta: {
        title: '系统字典',
        icon24: 'dictType24',
        icon48: 'dictType48'
      }
    },
    {
      path: '/system/sysParam',
      component: () => import('@/views/system/sysParam'),
      name: '/system/sysParam',
      meta: {
        title: '系统参数',
        icon24: 'sysParam24',
        icon48: 'sysParam48'
      }
    },
    {
      path: '/system/Holidays',
      component: () => import('@/views/system/Holidays'),
      name: '/system/Holidays',
      meta: {
        title: '节假日管理',
        icon24: 'sysParam24',
        icon48: 'sysParam48'
      }
    },
    // {
    //   path: '/system/transfer',
    //   component: () => import('@/views/system/transfer'),
    //   name: '/system/transfer',
    //   meta: {
    //     title: 'Transfer 采集器',
    //     icon24: 'sysParam24',
    //     icon48: 'sysParam48'
    //   }
    // },
    {
      path: '/system/thirdAuth',
      component: () => import('@/views/system/thirdAuth'),
      name: '/system/thirdAuth',
      meta: {
        title: '三方授权',
        icon24: 'sysParam24',
        icon48: 'sysParam48'
      }
    },
    {
      path: '/system/media',
      component: () => import('@/views/system/media'),
      name: '/system/media',
      meta: {
        title: '通知配置',
        icon24: 'media24',
        icon48: 'media48'
      }
    },
    {
      path: '/system/proxyInfo',
      component: () => import('@/views/system/proxyInfo'),
      name: '/system/proxyInfo',
      meta: {
        title: '代理配置',
        icon24: 'media24',
        icon48: 'media48'
      }
    },
    {
      path: '/system/auth',
      component: () => import('@/views/system/release'),
      name: '/system/auth',
      meta: {
        title: '平台授权',
        icon24: 'auth24',
        icon48: 'auth48'
      }
    }
  ]
}
export default systemRouter
