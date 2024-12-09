<template>
  <div class="container-fluid" ref="container">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator';
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

@Component
export default class FancyboxComponent extends Vue {
  @Prop() options!: Record<string, unknown>;
  container!: HTMLDivElement;

  mounted () {
    Fancybox.bind(this.$refs.container as HTMLDivElement, '[data-fancybox]', {
      ...(this.options || {})
    })
  }

  updated () {
    Fancybox.unbind(this.$refs.container as HTMLDivElement)
    Fancybox.close()

    Fancybox.bind(this.$refs.container as HTMLDivElement, '[data-fancybox]', {
      ...(this.options || {})
    })
  }

  unmounted () {
    Fancybox.destroy()
  }
}
</script>

<style scoped></style>
