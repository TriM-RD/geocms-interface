import { createRouter, createWebHistory } from 'vue-router'
import { useStoreHistory } from '@/stores/storeHistory'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/searchdev',
      name: 'searchdev',
      component: () => import('../views/Search.vue')
    },
    {
      path: '/:propertyCode/unit/:id/share',
      name: 'share',
      component: () => import('../views/Share.vue')
    },
    {
      path: '/captcha',
      name: 'captcha',
      component: () => import('../views/Captcha.vue')
    },
    {
      path: '/:propertyCode/unit/:id/payment',
      name: 'payment',
      component: () => import('../views/Payment.vue')
    },
    {
      path: '/:propertyCode',
      name: 'home',
      component: () => import('../views/Main.vue'),
      children: [
        {
          path: '',
          name: 'map',
          components: {
            header: () => import('../views/Header.vue'),
            navigationButtons: () => import('../components/MainButtonsComponent.vue'),
            legend: () => import('../views/Legend.vue')
          }
        },
        {
          path: 'gallery',
          name: 'gallery',
          component: () => import('../views/Gallery.vue')
        },
        /*{
          path: 'header',
          name: 'header',
          component: () => import('../views/Header.vue')
        },*/
        {
          path: 'unit/:id/navigation/preview',
          name: 'navigationPreview',
          components: {
            header: () => import('../components/NavigationHeaderComponent.vue'),
            default: () => import('../components/NavigationPreview.vue'),
            navigationButtons: () => import('../components/NavigationButtonsComponent.vue')
          }
        },
        {
          path: 'unit/:id/navigation/run',
          name: 'navigationRun',
          components: {
            header: () => import('../components/NavigationHeaderComponent.vue'),
            default: () => import('../components/NavigationRun.vue'),
            navigationButtons: () => import('../components/NavigationButtonsComponent.vue')
          }
        },
        {
          path: 'poi/:id/navigation/preview',
          name: 'poiNavigationPreview',
          components: {
            header: () => import('../components/NavigationHeaderComponent.vue'),
            default: () => import('../components/NavigationPreview.vue'),
            navigationButtons: () => import('../components/NavigationButtonsComponent.vue')
          }
        },
        {
          path: 'poi/:id/navigation/run',
          name: 'poiNavigationRun',
          components: {
            header: () => import('../components/NavigationHeaderComponent.vue'),
            default: () => import('../components/NavigationRun.vue'),
            navigationButtons: () => import('../components/NavigationButtonsComponent.vue')
          }
        },
        {
          path: 'bookNow',
          name: 'bookNow',
          components: {
            header: () => import('../views/Header.vue'),
            default: () => import('../views/BookNow.vue'),
            navigationButtons: () => import('../components/MainButtonsComponent.vue')
          }
        },
        {
          path: 'search',
          name: 'search',
          components: {
            header: () => import('../views/Header.vue'),
            default: () => import('../views/Modal.vue'),
            navigationButtons: () => import('../components/MainButtonsComponent.vue')
          }
        },
        {
          path: 'unit',
          name: 'unit',
          components: {
            header: () => import('../views/Header.vue'),
            default: () => import('../views/Modal.vue'),
            navigationButtons: () => import('../components/MainButtonsComponent.vue')
          }
        },
        {
          path: 'unit/:id',
          name: 'unitId',
          components: {
            header: () => import('../views/Header.vue'),
            default: () => import('../views/Modal.vue'),
            navigationButtons: () => import('../components/MainButtonsComponent.vue')
          }
        },
        {
          path: 'poi/:id',
          name: 'poiId',
          components: {
            header: () => import('../views/Header.vue'),
            navigationButtons: () => import('../components/MainButtonsComponent.vue'),
            legend: () => import('../views/Legend.vue')
          }
        },
        {
          path: 'filter',
          name: 'filter',
          components: {
            header: () => import('../views/Header.vue'),
            default: () => import('../views/Modal.vue'),
            navigationButtons: () => import('../components/MainButtonsComponent.vue')
          }
        },
        {
          path: 'dialog',
          name: 'dialog',
          components: {
            header: () => import('../views/Header.vue'),
            default: () => import('../components/MessageBoxComponent.vue'),
            navigationButtons: () => import('../components/MainButtonsComponent.vue')
          }
        }
      ]
    }
  ]
})

let HistoryStore: any = null
router.beforeEach((to, from, next) => {
  if (!HistoryStore) HistoryStore = useStoreHistory()

  if (from.path == to.path) HistoryStore.replace(to.fullPath)
  else HistoryStore.push(to.fullPath)

  next()
})

// Transfer noGps value from url to localStorage
router.beforeEach((to, from, next) => {
  // Check if the specific query parameters exist
  if (to.query.noGps === undefined && to.query.dev === undefined) return next()

  // Create a new query object without the specific parameters
  const { noGps, dev, ...newQuery } = to.query

  // Handle 'noGps' parameter
  if (['true', '1', 'null'].includes(String(noGps).toLocaleLowerCase())) {
    window.localStorage.setItem('noGps', 'true')
  }

  // Handle 'dev' parameter
  if (['true', '1', 'null'].includes(String(dev).toLocaleLowerCase())) {
    window.localStorage.setItem('dev', 'true')
  }

  // Replace the current route with the new query parameters
  next({ path: to.path, query: newQuery })
})

export default router
