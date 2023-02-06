<template>
  <MapPickerComponent></MapPickerComponent>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import MapPickerComponent from '@/components/MapPickerComponent.vue'

@Options({
  components: {
    MapPickerComponent
  }
})
export default class Map extends Vue {}
</script>
