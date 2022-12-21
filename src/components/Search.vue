<template>
  <form class="form-inline flex-nowrap bg-light mx-0 mx-lg-auto rounded p-1">
    <div class="input-group mb-3">
      <input v-model="title" @input="test()" class="form-control me-2" @keypress.enter.prevent type="search" placeholder="Search" aria-label="Search" >
    </div>
    <ListComponent v-if="title !== ''" :title="title"/>
  </form>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import ListComponent from '@/components/ListComponent.vue'
@Options({
  components: { ListComponent }
})
export default class Search extends Vue {
  title = ''
  renderComponent= false
  objectTemplates!: ObjectTemplate[]

  test () {
    console.log(this.title)
  }
}
</script>

<style scoped>

</style>
