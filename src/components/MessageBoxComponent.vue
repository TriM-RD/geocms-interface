<template>
  <div id="MessageBoxModal" class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ displayData.title }}</h3>
          <button v-if="displayData.showCancelButton" type="button" class="btn-close" aria-label="Close" @click="$router.back()"></button>
        </div>
        <div class="modal-body">
          <p v-html="displayData.message"></p>
        </div>
        <div class="modal-footer">
          <button v-if="displayData.showCancelButton" type="button" class="btn btn-light" @click="$router.back()">
            {{ displayData.cancelButtonText }}
          </button>
          <button
            v-if="displayData.showDeclineButton"
            type="button"
            class="btn btn-danger"
            @click="
              async () => {
                await displayData.onDecline()
                goBack()
              }
            "
          >
            {{ displayData.declineButtonText }}
          </button>
          <button
            v-if="displayData.showAcceptButton"
            type="button"
            class="btn btn-camp"
            @click="
              async () => {
                await displayData.onAccept()
                goBack()
              }
            "
          >
            {{ displayData.acceptButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import { useStoreMessageBox } from '@/stores/storeMessageBox'
import { Modal } from 'bootstrap'
import { computed } from 'vue'
import { $t } from '@/stores/storeTranslations'

@Component
export default class MessageBoxComponent extends Vue {
  private store = useStoreMessageBox()

  private modal: Modal | null = null

  displayData = computed(() =>
    Object.assign(
      {
        message: '',
        title: $t('Imporant message'),
        showCancelButton: false,
        cancelButtonText: $t('Cancel'),
        showDeclineButton: false,
        declineButtonText: $t('Decline'),
        onDecline: () => {},
        showAcceptButton: true,
        acceptButtonText: $t('Accept'),
        onAccept: () => {}
      },
      this.store.data
    )
  )

  created() {
    if (this.displayData.message === '') {
      this.$router.push({ name: 'map' })
    }
  }

  mounted() {
    const modalDiv = document.getElementById('MessageBoxModal')
    if (modalDiv) this.modal = Modal.getOrCreateInstance(modalDiv, { backdrop: false, keyboard: false })
    this.modal?.show()
  }

  goBack() {
    if (this.$route.fullPath.includes('/dialog')) this.$router.back()
  }
}
</script>

<style scoped>
@media (max-width: 576px) {
  .btn {
    padding: 0.375rem 0.75rem; /* Match Bootstrap button padding */
    font-size: 1rem; /* Match Bootstrap font size */
    line-height: 1.5; /* Match Bootstrap line height */
    border-radius: 0.25rem; /* Match Bootstrap border radius */
  }
}
</style>
