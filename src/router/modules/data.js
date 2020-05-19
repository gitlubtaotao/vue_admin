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
    }
  ]
}
export default dataRouter
