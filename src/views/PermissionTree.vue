<template>
  <div class="container">
    <PermissionTreeComponent />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PermissionTreeComponent from '@/components/PermissionTreeComponent.vue'

@Options({
  components: {
    PermissionTreeComponent
  }
})
export default class PermissionTree extends Vue {}
</script>
<style scoped>
</style>
