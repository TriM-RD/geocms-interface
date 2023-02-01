<template>
  <div class="container" v-if="($store.state.requiresAuth === 2)">
    <MapComponent/>
  </div>
  <div v-if="($store.state.requiresAuth === 1)">
    <WelcomeComponent />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import FormComponent from '@/components/FormComponent.vue'
import WelcomeComponent from '@/components/WelcomeComponent.vue' // @ is an alias to /src
import http from '@/http-common' // @ is an alias to /src
import createStore from '@/store/index'
import MapComponent from '@/components/MapComponent.vue'

@Options({
  components: {
    MapComponent,
    WelcomeComponent,
    FormComponent
  }
})
export default class Home extends Vue {}
</script>
