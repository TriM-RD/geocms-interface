<template>
    <MapComponent />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import MapComponent from '@/components/MapComponent.vue' // @ is an alias to /src

  @Options({
    components: {
      MapComponent
    }
  })
export default class Map extends Vue {}
</script>
<style scoped>
</style>
