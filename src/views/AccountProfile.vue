<template>
    <div class="container" style="text-align: center;">
          <h4>About user</h4>
          <div class="input-group mb-3 col-lg-4">
          <span class="input-group-text" id="basic-addon1">Name</span>
          <span class="form-control">{{ $store.state.name }}</span>
          </div>
          <div class="input-group mb-3 col-lg-4">
          <span class="input-group-text" id="basic-addon2">Email</span>
          <span class="form-control">{{ $store.state.email }}</span>
          </div>
          <TableComponent />
    </div>
  </template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import TableComponent from '@/components/TableComponent.vue'
import createStore from '@/store/index'

@Options({
  components: {
    TableComponent
  }
})
export default class AccountProfile extends Vue {
}
</script>
