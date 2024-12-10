<template>
  <!-- Modal -->
  <div class="modal fade" id="firmSelectionModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t.selectFirm }}</h5>
          <button id="closeSelectFirmModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul class="list-group" id="firmList">
            <button type="button" @click="firmSelection(id)" class="list-group-item list-group-item-action" v-for="(name, id) in firms" :key="`${ id }-${ name }-${ Math.random().toString(36).slice(2, 7) }`">
              {{ name }}
            </button>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-facing-decorator';
import { Modal } from 'bootstrap'
import { Definitions } from '@/@geocms'
import { $t } from '@geocms/localization'

@Component({
  computed: {
    $t () {
      return $t
    }
  }
})
export default class FirmSelectionComponent extends Vue {
  firms = []
  @Inject() http: any;
  @Inject() Definitions: any;
  @Inject() router: any;
  @Inject() updateHeaders: any;

  async created () {
    await this.http.get(import.meta.env.VITE_APP_BASE_URL + 'firm').then((response: { data: never[] }) => {
      // success
      this.firms = response.data
    })
    this.openModal()
  }

  openModal () {
    const modal = document.getElementById('firmSelectionModal')
    if (modal) {
      const firmSelectionModal = new Modal(modal)
      firmSelectionModal.show()
    }
  }

  closeModal () {
    const modal = document.getElementById('closeSelectFirmModal')
    if (modal) {
      modal.click()
    }
  }

  async firmSelection (id: number) { // Not a number
    await this.http.get(import.meta.env.VITE_APP_BASE_URL + 'firm/' + id).then((response: { data: { id: string; name: string } }) => {
      // success
      this.closeModal()
      localStorage.setItem('firm', response.data.id)
      localStorage.setItem('firmName', response.data.name)
      this.$store.commit('setFirmName', response.data.name)
      this.$store.state.requiresAuth = 2
      this.updateHeaders()
      this.router.push({ name: Definitions.Other.Home })
    }).catch((error: { response: { status: string; data: any; headers: any }; request: any; message: any }) => {
      // Error
      if (error.response) {
        // The request was made, but the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Status Code: ' + error.response.status)
        console.log('Error Data:', error.response.data)
        console.log('Error Headers:', error.response.headers)
      } else if (error.request) {
        // The request was made, but no response was received
        console.log('No response received from the server')
      } else {
        // Something happened in setting up the request that triggered an error
        console.log('Error:', error.message)
      }
    })
  }
}
</script>

<style scoped>
.list-group-item {
  text-transform: capitalize;
}
</style>
