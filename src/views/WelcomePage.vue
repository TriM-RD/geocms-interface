<template>
    <WelcomeComponent />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import WelcomeComponent from '@/components/WelcomeComponent.vue' // @ is an alias to /src

  @Options({
    components: {
      WelcomeComponent
    }
  })
export default class WelcomePage extends Vue {}
</script>
<style scoped>
</style>
