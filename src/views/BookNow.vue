<template>
    <BookNowComponent></BookNowComponent>
  </template>
  
  <script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator'
  import BookNowComponent from '@/components/BookNowComponent.vue'
  
  @Component({
    components: { BookNowComponent }
  })
  export default class BookNow extends Vue {}
  </script>
  
  <style scoped></style>