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
import WelcomeComponent from '@/components/WelcomeComponent.vue' // @ is an alias to /src
import MapComponent from '@/components/MapComponent.vue'

@Options({
  components: {
    MapComponent,
    WelcomeComponent
  }
})
export default class Home extends Vue {}
</script>
