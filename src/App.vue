<template>
    <NavBarComponent />
    <NavComponent />
    <!-- Contect></Contect-->
    <FooterComponent />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import NavBarComponent from '@/components/showComponents/NavBarComponent.vue'
import NavComponent from '@/components/showComponents/NavComponent.vue'
import FooterComponent from '@/components/showComponents/FooterComponent.vue'
import http from '@/http-common'

@Options({
  components: {
    NavBarComponent,
    NavComponent,
    FooterComponent
  }
})
export default class App extends Vue {}
</script>
