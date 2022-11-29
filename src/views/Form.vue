<template>
  <div class="container">
    <FormComponent/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import FormComponent from '@/components/FormComponent.vue'
import http from '@/http-common' // @ is an alias to /src

@Options({
  components: {
    FormComponent
  }
})
export default class Form extends Vue {
}
</script>
