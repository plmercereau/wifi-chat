import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '',
    component: () => import('pages/Index.vue')
  },
  {
    path: '/chat/:id',
    component: () => import('pages/Chat.vue'),
    props: true
  },
  {
    path: '/call/:id',
    component: () => import('pages/Call.vue'),
    props: true
  },
  {
    path: '/settings',
    component: () => import('pages/Settings.vue')
  },
  {
    path: '/settings/device',
    component: () => import('pages/Devices.vue')
  },
  {
    path: '/start',
    component: () => import('pages/Start.vue')
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
