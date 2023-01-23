import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Show from '../views/Show.vue'
import PermissionsTree from '@/views/PermissionsTree.vue'
import Form from '@/views/Form.vue'
import AccountProfile from '@/views/AccountProfile.vue'
import ECabinetComponent from '@/components/ECabinetComponent.vue'

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
    path: '/ecabinet',
    name: 'Ecabinet',
    component: ECabinetComponent
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
    component: Show
  },
  {
    path: '/group/add',
    name: 'GroupAdd',
    component: Form
  },
  {
    path: '/group/add/:id',
    name: 'GroupEdit',
    component: Form
  },
  {
    path: '/permission',
    name: 'Permission',
    component: PermissionsTree,
    beforeRouteLeave: 'beforeRouteLeave'
  } as MyRouteRecord,
  {
    path: '/division',
    name: 'Division',
    component: Show
  },
  {
    path: '/division/add',
    name: 'DivisionAdd',
    component: Form
  },
  {
    path: '/division/add/:id',
    name: 'DivisionEdit',
    component: Form
  },
  {
    path: '/show/:id',
    name: 'Show',
    component: Show
  },
  {
    path: '/attribute',
    name: 'Attribute',
    component: Show
  },
  {
    path: '/attribute/add/:parentId',
    name: 'AttributeAdd',
    component: Form
  },
  {
    path: '/attribute/add/:parentId/:id',
    name: 'AttributeEdit',
    component: Form
  },
  {
    path: '/account',
    name: 'AccountProfile',
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
