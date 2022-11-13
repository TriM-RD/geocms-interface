<template>
  <div class="container">
    <img alt="Vue logo" src="../assets/logo.png">
    <ContentListComponent msg="Welcome to Your Vue.js + TypeScript App"/>
    <form action="{{ route('simple_search') }}" method="GET" style="width:600px;">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Type the name" aria-describedby="basic-addon2" name="search">
        <div class="input-group-append">
          <button class="btn btn-secondary" type="submit">Search</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import TableComponent from '@/components/TableComponent.vue'
import ContentListComponent from '@/components/ContentListComponent.vue' // @ is an alias to /src

@Options({
  components: {
    ContentListComponent
  }
})
export default class About extends Vue {}
</script>
