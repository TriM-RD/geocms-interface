<template>
  <div class="container">
    <PermissionTreeComponent />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import PermissionTreeComponent from '@/components/PermissionTreeComponent.vue'

@Component({
  components: {
    PermissionTreeComponent
  }
})
export default class PermissionTree extends Vue {}
</script>

<style scoped>
</style>