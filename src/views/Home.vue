<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import FormComponent from '@/components/FormComponent.vue'

@Component({
  components: { FormComponent }
})
export default class Home extends Vue {}
</script>

<style scoped></style>
