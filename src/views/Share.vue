<template>
  <ShareComponent></ShareComponent>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import ShareComponent from '@/components/ShareComponent.vue'

@Component({
  components: { ShareComponent }
})
export default class Share extends Vue {}
</script>

<style scoped></style>
