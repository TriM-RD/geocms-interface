<template>
  <div>Test</div>
</template>
<script lang="ts">
// DO NOT USE <script setup>

//vue options API.
/*
import { defineComponent } from "vue";
export default defineComponent({});
*/

//class component
import { Component, Vue } from 'vue-facing-decorator'
@Component
export default class HelloWorld extends Vue {}
</script>
<style></style>
