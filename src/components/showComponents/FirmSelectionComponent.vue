<template>
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#firmSelectionModal">
    Open Modal
  </button>

  <!-- Modal -->
  <div class="modal fade" id="firmSelectionModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Selectable List Modal</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul class="list-group" id="firmList">
            <button type="button" @click="firmSelection(id)" class="list-group-item list-group-item-action" v-for="(name, id) in firms" :key="`${ id }-${ name }-${ Math.random().toString(36).slice(2, 7) }`">
              {{ name }}
            </button>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" id="saveSelection">Save Selection</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import http from '@/http-common'

@Options({})
export default class FirmSelectionComponent extends Vue {
  firms = []

  async created () {
    await http.get(process.env.VUE_APP_BASE_URL + 'firm').then(response => {
      // success
      this.firms = response.data
    })
  }

  async firmSelection (id: number) { // Not a number
    await http.get(process.env.VUE_APP_BASE_URL + 'firm/' + id).then(response => {
      // success
      localStorage.setItem('firm', response.data.id)
      this.$store.state.requiresAuth = 2
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

</style>
