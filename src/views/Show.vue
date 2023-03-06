<template>
  <div class="container">
    <div class="tableComp">
      <TableComponent />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import TableComponent from '@/components/TableComponent.vue' // @ is an alias to /src

@Options({
  components: {
    TableComponent
  }
})
export default class Show extends Vue {
}
</script>
<style scoped>
</style>
