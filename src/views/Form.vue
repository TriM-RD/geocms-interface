<template>
  <div class="container">
    <FormComponent/>
    <TableComponent v-if="renderTable" />
    <ListComponent v-if="renderList" :use-routes="true" />
    <div style="height: 10vh"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import FormComponent from '@/components/FormComponent.vue'
import TableComponent from '@/components/TableComponent.vue'
import router from '@/router'
import ListComponent from '@/components/ListComponent.vue'
import { Definitions } from '@/definitions/appDefinitions'

@Options({
  components: {
    ListComponent,
    FormComponent,
    TableComponent
  }
})
export default class Form extends Vue {
  renderTable = false
  renderList = false

  mounted () {
    switch (router.currentRoute.value.name) {
      case Definitions.Group.Edit:
      case Definitions.Group.Add:
        this.renderTable = true
        break
      case Definitions.Entity.Edit:
        this.renderList = true
        break
    }
  }
}
</script>
