<template>
    <span class="fw-bold" v-if="msg.title">{{msg.title}}</span>
    <br v-if="msg.title">
    <span class="small" v-if="msg.info">{{msg.info}}</span>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
@Options({
  props: {
    msg: { title: String, info: String }
  }
})
export default class ToastComponent extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
