<template>
  <div class="container">
    <FormComponent/>
    <TableComponent v-if="renderTable" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import FormComponent from '@/components/FormComponent.vue'
import TableComponent from '@/components/TableComponent.vue'
import router from '@/router'

@Options({
  components: {
    FormComponent,
    TableComponent
  }
})
export default class Form extends Vue {
  renderTable = false

  mounted () {
    switch (router.currentRoute.value.name) {
      case 'GroupEdit':
      case 'GroupAdd':
        this.renderTable = true
        break
    }
  }
}
</script>
