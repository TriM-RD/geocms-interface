<template>
  <div class="container">
    <div class="tableComp">
      <TableComponent />
    </div>
  </div>
</template>

<script lang="ts">
import {Component} from 'vue-facing-decorator'
import TableComponent from '@/components/TableComponent.vue' // @ is an alias to /src

@Component({
  components: {
    TableComponent
  }
})
export default class Show {
}
</script>

<style scoped>
</style>