<template>
  <HeaderComponent></HeaderComponent>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import HeaderComponent from '@/components/HeaderComponent.vue'

@Component({
  components: { HeaderComponent }
})
export default class Header extends Vue {}
</script>

<style scoped></style>
