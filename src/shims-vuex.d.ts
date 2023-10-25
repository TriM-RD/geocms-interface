// shims-vuex.d.ts
import { Store as VuexStore } from 'vuex'
import { State, Mutations } from '@/store/types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<State> & Mutations;
  }
}
