<template>
  <!-- Modal -->
  <div class="modal fade" id="firmSelectionModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Select Firm</h5>
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
import { Options, Vue } from 'vue-class-component'
import http from '@/http-common'
import { Modal } from 'bootstrap'
import router from '@/router'
import { Definitions } from '@/definitions/appDefinitions'

@Options({})
export default class FirmSelectionComponent extends Vue {
  firms = []

  async created () {
    await http.get(process.env.VUE_APP_BASE_URL + 'firm').then(response => {
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
    await http.get(process.env.VUE_APP_BASE_URL + 'firm/' + id).then(response => {
      // success
      this.closeModal()
      localStorage.setItem('firm', response.data.id)
      localStorage.setItem('firmName', response.data.name)
      this.$store.commit('setFirmName', response.data.name)
      this.$store.state.requiresAuth = 2
      this.$router.push({ name: Definitions.Other.Home })
    }).catch(error => {
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
