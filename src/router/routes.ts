import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('pages/Index.vue')
  },
  {
    path: '/chat/:id',
    component: () => import('pages/Chat.vue'),
    props: true
  },
  {
    path: '/settings',
    component: () => import('pages/Settings.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
