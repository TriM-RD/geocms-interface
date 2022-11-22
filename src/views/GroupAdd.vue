<template>
    <TypesAddComponent />
    <div class="container">
    <TableComponent />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import TypesAddComponent from '@/components/TypesAddComponent.vue'
import TableComponent from '@/components/TableComponent.vue'

@Options({
  components: {
    TypesAddComponent,
    TableComponent
  }
})
export default class GroupAdd extends Vue {}
</script>
<style scoped>
</style>
