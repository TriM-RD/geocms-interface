<template>
    <MapComponent />
    <FooterComponent />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import MapComponent from '@/components/MapComponent.vue' // @ is an alias to /src
import FooterComponent from '@/components/showComponents/FooterComponent.vue'

  @Options({
    components: {
      MapComponent,
      FooterComponent
    }
  })
export default class Map extends Vue {}
</script>
<style scoped>
</style>
