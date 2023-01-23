<template>
  <div class="container">
    <FormComponent/>
    <TableComponent v-if="renderTable" />
    <ECabinetComponent v-if="renderECabinet" />
    <!--ModalFormComponent /-->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import FormComponent from '@/components/FormComponent.vue'
import TableComponent from '@/components/TableComponent.vue'
import http from '@/http-common'
import router from '@/router'
import ECabinetComponent from '@/components/ECabinetComponent.vue'
import ModalFormComponent from '@/components/ModalFormComponent.vue'

@Options({
  components: {
    ModalFormComponent,
    ECabinetComponent,
    FormComponent,
    TableComponent
  }
})
export default class Form extends Vue {
  renderTable = false
  renderECabinet = false

  mounted () {
    switch (router.currentRoute.value.name) {
      case 'DeviceEdit':
        this.renderECabinet = true
        break
      case 'GroupEdit':
      case 'GroupAdd':
        this.renderTable = true
        break
    }
  }
}
</script>
