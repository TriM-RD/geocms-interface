import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Show from '../views/Show.vue'
import PermissionTree from '@/views/PermissionTree.vue'
import Form from '@/views/Form.vue'
import AccountProfile from '@/views/AccountProfile.vue'
import { Definitions } from '@/definitions/appDefinitions'

/* type MyRouteRecord = RouteRecordRaw & {
  beforeRouteLeave: string;
} */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/device',
    name: Definitions.Device.Def,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Show
  },
  {
    path: '/device/add',
    name: Definitions.Device.Add,
    component: Form
  },
  {
    path: '/device/add/:id',
    name: Definitions.Device.Edit,
    component: Form
  },
  {
    path: '/device/replace/:parentId',
    name: Definitions.Device.Replace,
    component: Form
  },
  {
    path: '/group',
    name: Definitions.Group.Def,
    component: Show
  },
  {
    path: '/group/add',
    name: Definitions.Group.Add,
    component: Form
  },
  {
    path: '/group/add/:id',
    name: Definitions.Group.Edit,
    component: Form
  },
  {
    path: '/permission',
    name: 'Permission',
    component: PermissionTree
    // beforeRouteLeave: 'beforeRouteLeave'
  }, // as MyRouteRecord,
  {
    path: '/division',
    name: Definitions.Division.Def,
    component: Show
  },
  {
    path: '/division/add',
    name: Definitions.Division.Add,
    component: Form
  },
  {
    path: '/division/add/:id',
    name: Definitions.Division.Edit,
    component: Form
  },
  {
    path: '/show/:id',
    name: 'Show',
    component: Show
  },
  {
    path: '/attribute',
    name: Definitions.Attribute.Def,
    component: Show
  },
  {
    path: '/attribute/add/:parentId',
    name: Definitions.Attribute.Add,
    component: Form
  },
  {
    path: '/attribute/add/:parentId/:id',
    name: Definitions.Attribute.Edit,
    component: Form
  },
  {
    path: '/account',
    name: Definitions.Administration.AccountProfile,
    component: AccountProfile
  },
  {
    path: '/administration',
    name: Definitions.Administration.Administration,
    component: Show
  },
  {
    path: '/administration/edit/:id',
    name: Definitions.Administration.AdministrationEdit,
    component: Form
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
