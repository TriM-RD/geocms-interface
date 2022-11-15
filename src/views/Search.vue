<template>
  <div class="container">
    <img alt="Vue logo" src="../assets/logo.png">
    <ListComponent msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import http from '@/http-common'
import ListComponent from '@/components/ListComponent.vue' // @ is an alias to /src

@Options({
  components: {
    ListComponent
  }
})
export default class Search extends Vue {
}
</script>
