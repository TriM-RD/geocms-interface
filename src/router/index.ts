import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Show from '../views/Show.vue'
import DeviceAppend from '../views/DeviceAppend.vue'
import DeviceCabinet from '../views/DeviceCabinet.vue'
import PermissionsTree from '@/views/PermissionsTree.vue'
import Form from '@/views/Form.vue'
import AccountProfile from '@/views/AccountProfile.vue'

type MyRouteRecord = RouteRecordRaw & {
  beforeRouteLeave: string;
}
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
    path: '/group',
    name: 'Group',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Show
  },
  {
    path: '/group/add',
    name: 'GroupAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Form
  },
  {
    path: '/group/add/:id',
    name: 'GroupEdit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Form
  },
  {
    path: '/permission',
    name: 'Permission',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: PermissionsTree,
    beforeRouteLeave: 'beforeRouteLeave'
  } as MyRouteRecord,
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
    path: '/division/add',
    name: 'DivisionAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Form
  },
  {
    path: '/division/add/:id',
    name: 'DivisionEdit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Form
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
    path: '/attribute',
    name: 'Attribute',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Show
  },
  {
    path: '/attribute/add/:parentId',
    name: 'AttributeAdd',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Form
  },
  {
    path: '/attribute/add/:parentId/:id',
    name: 'AttributeEdit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Form
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
  },
  {
    path: '/account',
    name: 'AccountProfile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AccountProfile
  },
  {
    path: '/administration',
    name: 'Administration',
    component: Show
  },
  {
    path: '/administration/edit/:id',
    name: 'AdministrationEdit',
    component: Form
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
