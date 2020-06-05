import Layout from '@/layout'
const crmRouter = {
  path: '/crm',
  component: Layout,
  redirect: '/crm/customer',
  name: 'crm',
  meta: {
    title: '合作',
    icon: 'list',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'clue',
      component: () => import('@/views/crm/clue/index'),
      meta: { title: '线索信息', icon: 'example' },
      name: 'CrmClue',
      children: [
      ]
    },
    {
      path: 'clue/show/:id(\\d+)',
      component: () => import('@/views/crm/clue/show'),
      name: 'CrmShowClue',
      meta: { title: '线索信息详情', noCache: true, activeMenu: '/crm/clue' },
      hidden: true
    },
    {
      path: 'customer',
      component: () => import('@/views/crm/customer/index'),
      meta: { title: '客户信息', icon: 'example' },
      name: 'CrmCustomer'
    },
    {
      path: 'customer/show/:id(\\d+)',
      component: () => import('@/views/crm/customer/show'),
      name: 'CrmShowCustomer',
      meta: { title: '客户信息详情', noCache: true, activeMenu: '/crm/customer' },
      hidden: true
    },
    {
      path: 'supply',
      component: () => import('@/views/crm/supplier/index'),
      meta: { title: '供应商信息', icon: 'example' },
      name: 'CrmSupply'
    },
    {
      path: 'supply/show/:id(\\d+)',
      component: () => import('@/views/crm/supplier/show'),
      meta: { title: '供应商信息详情', noCache: true, icon: 'example', activeMenu: '/crm/supply' },
      hidden: true,
      name: 'CrmShowSupply'
    },
    {
      path: 'user',
      component: () => import('@/views/crm/user/index'),
      meta: { title: '联系人信息', icon: 'example' },
      name: 'CrmContact'
    },
    {
      path: 'account',
      component: () => import('@/views/crm/amount/index'),
      meta: { title: '银行账户信息', icon: 'example' },
      name: 'CrmAccount'
    },
    {
      path: 'invoice',
      component: () => import('@/views/crm/invoice/index'),
      meta: { title: '发票信息', icon: 'example' },
      name: 'CrmInvoice'
    },
    {
      path: 'address',
      component: () => import('@/views/crm/address/index'),
      meta: { title: '邮寄地址', icon: 'example' },
      name: 'CrmAddress'
    }
  ]
}
export default crmRouter
