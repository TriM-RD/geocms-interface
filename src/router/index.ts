import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Edit from '../views/Edit.vue'
import About from '../views/About.vue'
import Show from '../views/Show.vue'
import Tree from '../views/Tree.vue'
import PermissionsTree from '../views/PermissionsTree.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/:id',
    name: 'Edit',
    component: Edit
  },
  {
    path: '/show',
    name: 'All',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: About
  },
  {
    path: '/show/:id',
    name: 'Show',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Show
  },

  {
    path: '/stablo',
    name: 'Tree',
    component: Tree
  },

  {
    path: '/permissionsTree',
    name: 'MyComponent',
    component: PermissionsTree
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
