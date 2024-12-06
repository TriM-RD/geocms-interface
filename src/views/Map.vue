<template>
  <MapDemoComponent></MapDemoComponent>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import MapDemoComponent from '@/components/MapDemoComponent.vue'

@Component({
  components: { MapDemoComponent }
})
export default class Map extends Vue {}
</script>

<style scoped></style>
