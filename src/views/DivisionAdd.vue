<template>
    <CategoriesAddComponent />
    <div class="container">
    <TableComponent />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import CategoriesAddComponent from '@/components/CategoriesAddComponent.vue'
import TableComponent from '@/components/TableComponent.vue'

@Options({
  components: {
    CategoriesAddComponent,
    TableComponent
  }
})
export default class DivisionAdd extends Vue {}
</script>
<style scoped>
</style>
