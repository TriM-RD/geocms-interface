<template>
  <div v-if="active" class="d-flex justify-content-center align-items-center" :style="getStyle">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-facing-decorator'

@Component
export default class LoadingComponent extends Vue {
  @Prop({ required: true }) active!: boolean
  @Prop({ default: false }) canCancel!: boolean
  @Prop({ default: 100 }) size!: number | string // Default size is 100 (can be vh or px)
  @Prop({ default: 1 }) transparency!: number // Default transparency is 1 (fully opaque)

  @Emit('update:active')
  updateActive(newValue: boolean) {
    return newValue
  }

  watchActive(newValue: boolean) {
    if (!newValue && this.canCancel) {
      this.updateActive(false)
    }
  }

  mounted() {
    this.$watch('active', this.watchActive)
  }

  get getStyle() {
    const sizeValue = typeof this.size === 'number' ? `${this.size}vh` : this.size
    return `height: ${sizeValue}; opacity: ${this.transparency};`
  }
}
</script>

<style scoped>
/* Optional custom styles for the spinner */
</style>
