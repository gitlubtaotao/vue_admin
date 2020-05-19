import Layout from '@/layout'
const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/master',
  name: 'order',
  meta: {
    title: '操作',
    icon: 'nested',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'master',
      component: () => import('@/views/order/master/index'),
      meta: { title: '订单', icon: 'example' },
      children: [
      ]
    }
  ]
}
export default orderRouter
