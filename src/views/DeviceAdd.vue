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
export default class DeviceAdd extends Vue {}
</script>
<style scoped>
</style>
