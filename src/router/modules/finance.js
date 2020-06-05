import Layout from '@/layout'
const financeRouter = {
  path: '/finance',
  component: Layout,
  redirect: '/finance/review',
  name: 'finance',
  meta: {
    title: '财务',
    icon: 'list',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'review',
      component: () => import('@/views/finance/review/index'),
      meta: { title: '复核', icon: 'example' },
      children: [
      ]
    },
    {
      path: 'rate',
      component: () => import('@/views/finance/rate/index'),
      meta: { title: '汇率设置', icon: 'example' },
      name: 'FinanceRate',
      children: [
      ]
    },
    {
      path: 'fee_type',
      component: () => import('@/views/finance/fee_type/index'),
      meta: { title: '费用项目', icon: 'example' },
      name: 'FinanceFeeType',
      children: [
      ]
    }
  ]
}
export default financeRouter
