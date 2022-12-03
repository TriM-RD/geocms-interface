import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
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
    path: '/device',
    name: 'Device',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Show
  },
  {
    path: '/division',
    name: 'Division',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Show
  },
  {
    path: '/map',
    name: 'Map',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Map
  },
  {
    path: '/group',
    name: 'Group',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Groups
  },
  {
    path: '/permission',
    name: 'Permission',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: PermissionsTree
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
    path: '/device/add',
    name: 'DeviceAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DeviceAdd
  },
  {
    path: '/group/add',
    name: 'GroupAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: GroupAdd
  },
  {
    path: '/attribute/add',
    name: 'AttributeAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AttributeAdd
  },
  {
    path: '/division/add',
    name: 'DivisionAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DivisionAdd
  },
  {
    path: '/device/append',
    name: 'DeviceAppend',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DeviceAppend
  },
  {
    path: '/device/cabinet',
    name: 'DeviceCabinet',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DeviceCabinet
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
