import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Edit from '../views/Edit.vue'
import Show from '../views/Show.vue'
import Map from '../views/Map.vue'
import Groups from '../views/Groups.vue'
import TypesAdd from '../views/TypesAdd.vue'
import AttributeAdd from '../views/AttributeAdd.vue'
import CategoriesAdd from '../views/CategoriesAdd.vue'
import DeviceAppend from '../views/DeviceAppend.vue'
import DeviceCabinet from '../views/DeviceCabinet.vue'
import PermissionsTree from '@/views/PermissionsTree.vue'
import Form from '@/views/Form.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    path: '/device/add',
    name: 'DeviceAdd',
    component: Form
  },
  {
    path: '/device/add/:id',
    name: 'DeviceEdit',
    component: Form
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
    component: Show
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
    path: '/types/add',
    name: 'TypesAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: TypesAdd
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
    path: '/categories/add',
    name: 'CategoriesAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: CategoriesAdd
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
