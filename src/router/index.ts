import { createRouter, createWebHistory } from 'vue-router';
import { Definitions } from '@/definitions/appDefinitions';
import { FirmSelectionComponent } from '@/@geocms';
import { useStoreHistory } from '@/stores/storeHistory';

// Define your routes with dynamic imports
const routes = [
  {
    path: '/',
    name: Definitions.Other.Home,
    component: () => import('../views/Home.vue')
  },
  {
    path: '/dashboard',
    name: Definitions.Other.Dashboard,
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/entity',
    name: Definitions.Entity.Def,
    component: () => import('../views/Show.vue')
  },
  {
    path: '/entity/add',
    name: Definitions.Entity.Add,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/entity/add/:id',
    name: Definitions.Entity.Edit,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/device/add',
    name: Definitions.Entity.Add,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/device/add/:id',
    name: Definitions.Entity.Edit,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/entity/replace/:parentId',
    name: Definitions.Entity.Replace,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/group',
    name: Definitions.Group.Def,
    component: () => import('../views/Show.vue')
  },
  {
    path: '/group/add',
    name: Definitions.Group.Add,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/group/add/:id',
    name: Definitions.Group.Edit,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/permission',
    name: 'Permission',
    component: () => import('@/views/PermissionTree.vue')
  },
  {
    path: '/division',
    name: Definitions.Division.Def,
    component: () => import('../views/Show.vue')
  },
  {
    path: '/division/add',
    name: Definitions.Division.Add,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/division/add/:id',
    name: Definitions.Division.Edit,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/show/:id',
    name: 'Show',
    component: () => import('../views/Show.vue')
  },
  {
    path: '/attribute',
    name: Definitions.Attribute.Def,
    component: () => import('../views/Show.vue')
  },
  {
    path: '/attribute/add/:parentId',
    name: Definitions.Attribute.Add,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/attribute/add/:parentId/:id',
    name: Definitions.Attribute.Edit,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/account',
    name: Definitions.Administration.AccountProfile,
    component: () => import('../views/AccountProfile.vue')
  },
  {
    path: '/administration',
    name: Definitions.Administration.Def,
    component: () => import('../views/Show.vue')
  },
  {
    path: '/administration/add',
    name: Definitions.Administration.Add,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/administration/add/:id',
    name: Definitions.Administration.Edit,
    component: () => import('../views/Form.vue')
  },
  {
    path: '/firm-selection',
    name: 'FirmSelectionComponent',
    component: FirmSelectionComponent
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Use a store to manage history (assuming you're using Pinia)
let HistoryStore: any = null;
router.beforeEach((to, from, next) => {
  if (!HistoryStore) HistoryStore = useStoreHistory();

  if (from.path === to.path) {
    HistoryStore.replace(to.fullPath);
  } else {
    HistoryStore.push(to.fullPath);
  }

  next();
});

// Transfer specific query parameters to localStorage
router.beforeEach((to, from, next) => {
  // Check if the specific query parameters exist
  if (to.query.noGps === undefined && to.query.dev === undefined) {
    return next();
  }

  // Create a new query object without the specific parameters
  const { noGps, dev, ...newQuery } = to.query;

  // Handle 'noGps' parameter
  if (['true', '1', 'null'].includes(String(noGps).toLowerCase())) {
    window.localStorage.setItem('noGps', 'true');
  }

  // Handle 'dev' parameter
  if (['true', '1', 'null'].includes(String(dev).toLowerCase())) {
    window.localStorage.setItem('dev', 'true');
  }

  // Replace the current route with the new query parameters
  next({ path: to.path, query: newQuery });
});

export default router;