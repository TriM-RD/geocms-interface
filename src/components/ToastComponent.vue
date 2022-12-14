<template>
  <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
    <div id="liveToast" :class='customClass' role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">{{ title }}</strong>
        <small>upravo izvršeno</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
@Options({
  props: {
    title: String,
    message: String,
    customClass: {
      type: String,
      default: 'toast hide'
    }
  }
})
export default class ShowInfo extends Vue {
  title!: string
  message!: string
  customClass!: string
}
</script>
