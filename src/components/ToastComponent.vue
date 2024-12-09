<template>
    <span class="fw-bold" v-if="msg.title">{{msg.title}}</span>
    <br v-if="msg.title">
    <span class="small" v-if="msg.info">{{msg.info}}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator';
@Component
export default class ToastComponent extends Vue {
  @Prop() msg!: { title: String, info: String };
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
