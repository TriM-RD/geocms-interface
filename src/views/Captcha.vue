<template>
  <CaptchaComponent></CaptchaComponent>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import CaptchaComponent from '@/components/CaptchaComponent.vue'

@Component({
  components: { CaptchaComponent }
})
export default class Captcha extends Vue {}
</script>

<style scoped></style>
