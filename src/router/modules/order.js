import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/master',
  name: 'order',
  meta: {
    title: '操作',
    icon: 'list',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'master',
      component: () => import('@/views/order/master/index'),
      meta: { title: '订单', icon: 'example' },
      name: 'OrderMaster',
      children: []
    },
    {
      path: 'master/operation/:id(\\d+)',
      component: () => import('@/views/order/master/operation'),
      name: 'OrderOperation',
      meta: { title: '操作盘', noCache: true, activeMenu: '/order/master' },
      hidden: true
    }
  ]
}
export default orderRouter
