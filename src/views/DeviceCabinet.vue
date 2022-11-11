<template>
    <DeviceAddCabinetComponent />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import DeviceAddCabinetComponent from '@/components/DeviceAddCabinetComponent.vue'

@Options({
  components: {
    DeviceAddCabinetComponent
  }
})
export default class DeviceCabinet extends Vue {}
</script>
<style scoped>
</style>
