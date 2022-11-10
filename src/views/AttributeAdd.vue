<template>
    <AttributeAddComponent />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import AttributeAddComponent from '@/components/AttributeAddComponent.vue'

@Options({
  components: {
    AttributeAddComponent
  }
})
export default class AttributeAdd extends Vue {}
</script>
<style scoped>
</style>
