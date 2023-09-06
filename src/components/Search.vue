<template>
  <form class="form-inline flex-nowrap bg-light mx-0 mx-lg-auto rounded p-1">
    <div class="input-group rounded">
      <input :disabled="($store.state.requiresAuth === 3)" v-model="title" class="form-control me-2 rounded" @keypress.enter.prevent="$refs.myChild.Init()" type="search" :placeholder="placeholder" aria-label="Search" >
      <button :disabled="($store.state.requiresAuth === 3)" type="button" class="btn" @click.prevent="$refs.myChild.Init();">
      <span class="input-group-text border-0" id="search-addon">
    <i class="bi bi-search"></i>
  </span>
      </button>
    </div>
    <ListComponent v-if="title !== ''" :title="title" ref="myChild"/>
  </form>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@cybertale/interface'
import ListComponent from '@/components/ListComponent.vue'
@Options({
  components: { ListComponent },
  props: {
    placeholder: {
      type: String,
      default: 'group:"def" division:"default" device:"example"'
    }
  }
})
export default class Search extends Vue {
  title = ''
  placeholder = 'group:"def" division:"default" device:"example"'
  renderComponent = false
  objectTemplates!: ObjectTemplate[]
}
</script>

<style scoped>

</style>
