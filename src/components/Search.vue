<template>
  <form class="form-inline flex-nowrap bg-light mx-0 mx-lg-auto rounded p-1">
    <div class="input-group rounded">
      <input :disabled="(storeMain.requiresAuth === 3)" v-model="title" class="form-control me-2 rounded" @keypress.enter.prevent="$refs.myChild.Init()" type="search" :placeholder="placeholder" aria-label="Search" >
      <button :disabled="(storeMain.requiresAuth === 3)" type="button" class="btn" @click.prevent="$refs.myChild.Init();">
      <span class="input-group-text border-0" id="search-addon">
    <i class="bi bi-search"></i>
  </span>
      </button>
    </div>
    <ListComponent v-if="title !== ''" :title="title" ref="myChild"/>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator';
import { ObjectTemplate } from '@cybertale/interface'
import ListComponent from '@/components/ListComponent.vue'
import {useStoreMain} from "@/stores/storeMain";
@Component({
  components: { ListComponent },
  props: {
    placeholder: {
      type: String,
      default: 'group:"def" division:"default" entity:"example"'
    }
  }
})
export default class Search extends Vue {
  title = ''
  placeholder = 'group:"def" division:"default" entity:"example"'
  renderComponent = false
  objectTemplates!: ObjectTemplate[]
  storeMain = useStoreMain()
}
</script>

<style scoped>

</style>
