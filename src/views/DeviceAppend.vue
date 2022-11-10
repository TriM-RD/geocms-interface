<template>
    <DeviceAppendComponent />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import DeviceAppendComponent from '@/components/DeviceAppendComponent.vue'

@Options({
  components: {
    DeviceAppendComponent
  }
})
export default class DeviceAppend extends Vue {}
</script>
<style scoped>
</style>
