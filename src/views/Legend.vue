<template>
  <LegendComponent></LegendComponent>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import LegendComponent from '@/components/LegendComponent.vue'
import { useStoreLegend } from '@/stores/storeLegend'

@Component({
  components: { LegendComponent }
})
export default class Header extends Vue {}
</script>

<style scoped></style>
