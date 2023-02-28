<template>
  <div class="container">
    <div class="tableComp">
      <TableComponent />
    </div>
  </div>
  <FooterComponent />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import TableComponent from '@/components/TableComponent.vue' // @ is an alias to /src
import FooterComponent from '@/components/showComponents/FooterComponent.vue' // @ is an alias to /src

@Options({
  components: {
    TableComponent,
    FooterComponent
  }
})
export default class Show extends Vue {}
</script>
<style scoped>
</style>
