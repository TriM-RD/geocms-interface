<template>
    <DeviceAddComponent />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import DeviceAddComponent from '@/components/DeviceAddComponent.vue'

@Options({
  components: {
    DeviceAddComponent
  }
})
export default class DeviceAddOld extends Vue {}
</script>
<style scoped>
</style>
