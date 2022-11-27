import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import createStore from '@/store/index'
import Home from '../views/Home.vue'
import Edit from '../views/Edit.vue'
import About from '../views/About.vue'
import Show from '../views/Show.vue'
import Map from '../views/Map.vue'
import Groups from '../views/Groups.vue'
import Divisions from '../views/Divisions.vue'
import Permission from '../views/Permission.vue'
import DeviceAdd from '../views/DeviceAdd.vue'
import GroupAdd from '../views/GroupAdd.vue'
import AttributeAdd from '../views/AttributeAdd.vue'
import DivisionAdd from '../views/DivisionAdd.vue'
import DeviceAppend from '../views/DeviceAppend.vue'
import DeviceCabinet from '../views/DeviceCabinet.vue'
import PermissionsTree from '@/views/PermissionsTree.vue'
import WelcomePage from '@/views/WelcomePage.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/:id',
    name: 'Edit',
    component: Edit,
    meta: { requiresAuth: true }
  },
  {
    path: '/device',
    name: 'Device',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Show,
    meta: { requiresAuth: true }
  },
  {
    path: '/division',
    name: 'Division',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Show,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'Map',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Map,
    meta: { requiresAuth: true }
  },
  {
    path: '/group',
    name: 'Group',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Groups,
    meta: { requiresAuth: true }
  },
  {
    path: '/permission',
    name: 'Permission',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: PermissionsTree,
    meta: { requiresAuth: true }
  },
  {
    path: '/show/:id',
    name: 'Show',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Show,
    meta: { requiresAuth: true }
  },
  {
    path: '/device/add',
    name: 'DeviceAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DeviceAdd,
    meta: { requiresAuth: true }
  },
  {
    path: '/group/add',
    name: 'GroupAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: GroupAdd,
    meta: { requiresAuth: true }
  },
  {
    path: '/attribute/add',
    name: 'AttributeAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AttributeAdd,
    meta: { requiresAuth: true }
  },
  {
    path: '/division/add',
    name: 'DivisionAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DivisionAdd,
    meta: { requiresAuth: true }
  },
  {
    path: '/device/append',
    name: 'DeviceAppend',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DeviceAppend,
    meta: { requiresAuth: true }
  },
  {
    path: '/device/cabinet',
    name: 'DeviceCabinet',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DeviceCabinet,
    meta: { requiresAuth: true }
  },
  {
    path: '/welcome',
    name: 'WelcomePage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: WelcomePage,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
