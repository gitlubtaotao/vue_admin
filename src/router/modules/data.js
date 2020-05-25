import Layout from '@/layout'
const dataRouter = {
  path: '/data',
  component: Layout,
  redirect: '/data/code',
  name: 'data',
  meta: {
    title: '数据',
    icon: 'nested',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'code',
      component: () => import('@/views/data/code/index'),
      meta: { title: '基础代码', icon: 'example' },
      children: [
      ]
    },
    {
      path: 'port',
      component: () => import('@/views/data/port/index'),
      meta: { title: '港口信息', icon: 'example' },
      children: [
      ]
    },
    {
      path: 'carrier',
      component: () => import('@/views/data/carrier/index'),
      meta: { title: '承运方', icon: 'example' },
      children: [
      ]
    },
    {
      path: 'warehouse',
      component: () => import('@/views/data/warehouse/index'),
      meta: { title: '仓库信息', icon: 'example' },
      children: [
      ]
    }
  ]
}
export default dataRouter
