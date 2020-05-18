import Layout from '@/layout'
const crmRouter = {
  path: '/crm',
  component: Layout,
  redirect: '/crm/cooperator',
  name: 'crm',
  meta: {
    title: '合作',
    icon: 'nested',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'clue',
      component: () => import('@/views/crm/clue/index'),
      meta: { title: '线索信息', icon: 'example' },
      children: [
      ]
    },
    {
      path: 'clue/show/:id(\\d+)',
      component: () => import('@/views/crm/clue/show'),
      name: 'ShowClue',
      meta: { title: '线索信息详情', noCache: true, activeMenu: '/crm/clue' },
      hidden: true
    },
    {
      path: 'customer',
      component: () => import('@/views/crm/customer/index'),
      meta: { title: '客户信息', icon: 'example' }
    },
    {
      path: 'customer/show/:id(\\d+)',
      component: () => import('@/views/crm/customer/show'),
      name: 'ShowCooperator',
      meta: { title: '客户信息详情', noCache: true, activeMenu: '/crm/clue' },
      hidden: true
    },
    {
      path: 'supply',
      component: () => import('@/views/crm/supplier/index'),
      meta: { title: '供应商信息', icon: 'example' }
    },
    {
      path: 'supply/show/:id(\\d+)',
      component: () => import('@/views/crm/supplier/show'),
      meta: { title: '供应商信息详情', icon: 'example' },
      hidden: true
    },
    {
      path: 'user',
      component: () => import('@/views/crm/user/index'),
      meta: { title: '联系人信息', icon: 'example' }
    },
    {
      path: 'account',
      component: () => import('@/views/crm/amount/index'),
      meta: { title: '银行账户信息', icon: 'example' }
    },
    {
      path: 'invoice',
      component: () => import('@/views/crm/invoice/index'),
      meta: { title: '发票信息', icon: 'example' }
    },
    {
      path: 'address',
      component: () => import('@/views/crm/address/index'),
      meta: { title: '邮寄地址', icon: 'example' }
    }
  ]
}
export default crmRouter
