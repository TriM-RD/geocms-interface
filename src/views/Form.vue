<template>
  <div class="container">
    <FormComponent/>
    <TableComponent v-if="renderComponent" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import FormComponent from '@/components/FormComponent.vue'
import TableComponent from '@/components/TableComponent.vue'
import http from '@/http-common'
import router from '@/router'

@Options({
  components: {
    FormComponent,
    TableComponent
  }
})
export default class Form extends Vue {
  renderComponent = false

  mounted () {
    switch (router.currentRoute.value.name) {
      case 'GroupEdit':
      case 'GroupAdd':
        this.renderComponent = true
        break
    }
  }
}
</script>
