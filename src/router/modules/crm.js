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
      path: 'cooperator',
      component: () => import('@/views/crm/cooperator/index'),
      meta: { title: '客户信息', icon: 'example' }
    },
    {
      path: 'cooperator/show/:id(\\d+)',
      component: () => import('@/views/crm/cooperator/show'),
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
    }
  ]
}
export default crmRouter
