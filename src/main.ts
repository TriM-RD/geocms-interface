import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import VueBlocksTree from 'vue3-blocks-tree'
import 'vue3-blocks-tree/dist/vue3-blocks-tree.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FlashMessage, { FlashMessagePlugin } from '@smartweb/vue-flash-message'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $flashMessage: FlashMessagePlugin
  }
}
const defaultoptions = { treeName: 'blocks-tree' }

createApp(App)
  .use(store)
  .use(router)
  .use(VueBlocksTree, defaultoptions)
  .use(FlashMessage)
  .mount('#app')
