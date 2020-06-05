import Layout from '@/layout'
const oaRoute = {
  path: '/oa',
  component: Layout,
  redirect: '/oa/company',
  name: 'oa',
  meta: {
    title: '管理',
    icon: 'list',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'company',
      component: () => import('@/views/oa/company/index'),
      meta: { title: '公司信息', icon: 'example' },
      name: 'OaCompany'
    },
    {
      path: 'company/show/:id(\\d+)',
      component: () => import('@/views/oa/company/show'),
      name: 'ShowCompany',
      meta: { title: '公司信息详情', noCache: true, activeMenu: '/oa/company' },
      hidden: true
    },
    {
      path: 'department',
      component: () => import('@/views/oa/department/index'),
      meta: { title: '部门信息', icon: 'example' },
      name: 'OaDepartment'
    },
    {
      path: 'employee',
      component: () => import('@/views/oa/employee/index'),
      meta: { title: '员工信息', icon: 'example' },
      name: 'OaEmployee'
    },
    {
      path: 'account',
      component: () => import('@/views/oa/account/index'),
      meta: { title: '公司银行账户', icon: 'example' },
      name: 'OaAccount'
    },
    {
      path: 'system_setting',
      component: () => import('@/views/oa/system_setting/index'),
      meta: { title: '系统设置', icon: 'example' },
      name: 'SystemSetting'
    },
    {
      path: 'number_setting',
      component: () => import('@/views/oa/number_setting/index'),
      meta: { title: '流水号规则设置', icon: 'example' },
      name: 'NumberSetting'
    }
  ]
}
export default oaRoute
