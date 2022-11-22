<template>
      <div class="container">
    <TableComponent />
    </div>
    <nav class="navbar fixed-bottom navbar-light bg-light">
      <form class="container-fluid justify-content-around">
        <router-link class="btn btn-outline-success me-2 flex-fill" type="button" to="/">Lorem Ipsum</router-link>
        <router-link class="btn btn-outline-secondary flex-fill" type="button" to="/typesAdd">Add</router-link>
    </form>
      </nav>
        <router-view/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import TableComponent from '@/components/TableComponent.vue'

@Options({
  components: {
    TableComponent
  }
})
export default class Types extends Vue {}
</script>
<style scoped>
</style>
