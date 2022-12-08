<template>
      <div class="container">
    <TableComponent />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import TableComponent from '@/components/TableComponent.vue'

  @Options({
    components: {
      TableComponent
    }
  })
export default class Divisions extends Vue {}
</script>
<style scoped>
</style>
