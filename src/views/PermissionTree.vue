<template>
  <div class="container">
    <PermissionTreeComponent />
  </div>
  <FooterComponent />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PermissionTreeComponent from '@/components/PermissionTreeComponent.vue'
import FooterComponent from '@/components/showComponents/FooterComponent.vue'

@Options({
  components: {
    PermissionTreeComponent,
    FooterComponent
  }
})
export default class PermissionTree extends Vue {}
</script>
<style scoped>
</style>
