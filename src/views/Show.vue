<template>
  <div class="container">
    <div class="tableComp">
      <TableComponent />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator'
import TableComponent from '@/components/TableComponent.vue' // @ is an alias to /src

@Component({
  components: {
    TableComponent
  }
})
export default class Show extends Vue{
}
</script>

<style scoped>
</style>