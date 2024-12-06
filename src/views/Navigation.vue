<template>
  <ModalComponent></ModalComponent>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import ModalComponent from '@/components/ModalComponent.vue'

@Component({
  components: { ModalComponent }
})
export default class Navigation extends Vue {}
</script>

<style scoped></style>
