<template>
  <div ref="container">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

@Options({
  props: {
    options: Object
  }
})
export default class FancyboxComponent extends Vue {
  options!: Record<string, unknown>;
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
