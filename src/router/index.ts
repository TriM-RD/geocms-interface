import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Show from '../views/Show.vue'
import PermissionTree from '@/views/PermissionTree.vue'
import Form from '@/views/Form.vue'
import AccountProfile from '@/views/AccountProfile.vue'
import { Definitions } from '@/definitions/appDefinitions'
import { FirmSelectionComponent } from '@geocms/components'

/* type MyRouteRecord = RouteRecordRaw & {
  beforeRouteLeave: string;
} */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: Definitions.Other.Home,
    component: Home
  },
  {
    path: '/entity',
    name: Definitions.Entity.Def,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Show
  },
  {
    path: '/entity/add',
    name: Definitions.Entity.Add,
    component: Form
  },
  {
    path: '/entity/add/:id',
    name: Definitions.Entity.Edit,
    component: Form
  },
  {
    path: '/device/add',
    name: Definitions.Entity.Add,
    component: Form
  },
  {
    path: '/device/add/:id',
    name: Definitions.Entity.Edit,
    component: Form
  },
  {
    path: '/entity/replace/:parentId',
    name: Definitions.Entity.Replace,
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
    name: Definitions.Administration.Def,
    component: Show
  },
  {
    path: '/administration/add',
    name: Definitions.Administration.Add,
    component: Form
  },
  {
    path: '/administration/add/:id',
    name: Definitions.Administration.Edit,
    component: Form
  },
  {
    path: '/firm-selection',
    name: 'FirmSelectionComponent',
    component: FirmSelectionComponent
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
