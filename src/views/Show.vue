<template>
  <div class="container">
    <FilterComponent />
  <div class="tableComp">
    <TableComponent />
  </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import TableComponent from '@/components/TableComponent.vue' // @ is an alias to /src
import FilterComponent from '@/components/showComponents/FilterComponent.vue'

@Options({
  components: {
    FilterComponent,
    TableComponent
  }
})
export default class Show extends Vue {}
</script>
<style scoped>
</style>
