import Layout from '@/layout'
/* 产品管理的路由 */
const productMgrRouter = {
  path: '/productMgr',
  component: Layout,
  name: 'productMgr',
  redirect: '/productMgr/product',
  meta: {
    title: '产品管理',
    icon: 'menu_product',
    active_icon: 'menu_product_ac'
  },
  children: [
    {
      path: '/productMgr/product',
      component: () => import('@/views/productMgr/product'),
      name: '/productMgr/product',
      meta: {
        title: '产品',
        icon24: 'product24',
        icon48: 'product48'
      }
    },
    {
      path: '/productMgr/product/detail',
      component: () => import('@/views/productMgr/product/detail'),
      name: '/productMgr/product/detail',
      hidden: true,
      meta: {
        title: '产品详情',
        hiddenMenu: true
      }
    },
    {
      path: '/productMgr/productType',
      component: () => import('@/views/productMgr/productType'),
      name: '/productMgr/productType',
      meta: {
        title: '产品分类',
        icon24: 'product24',
        icon48: 'product48'
      }
    }
  ]
}
export default productMgrRouter
