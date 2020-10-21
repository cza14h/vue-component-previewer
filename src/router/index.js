import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    { path: '/previewer', component: () => import('@/views/previewer/previewer.vue') },
    { path: '/editor', component: () => import('@/views/editor/codeEditor') },
  ]
})

export default router