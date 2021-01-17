import Vue from 'vue'
import Router from 'vue-router'
import Playground from './Playground.vue'
import NewFeat from './NewFeat.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/page1',
      name: 'Page 1',
      component: Playground,
    },
    {
      path: '/page2',
      name: 'Page 2',
      component: NewFeat,
    },
    { path: '*', redirect: '/page1' },
  ],
})

export default router
