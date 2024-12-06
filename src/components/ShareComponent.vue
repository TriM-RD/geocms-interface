<template>
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" />
    </head>
    <body>
      <div class="background d-flex align-items-start flex-column dvh-100">
        <div class="d-flex flex-column mx-auto">
          <div class="d-flex justify-content-center p-5">
            <img class="img-container bg-white p-3 rounded" :src="qrUrl" />
          </div>
          <div class="container mb-4 bg-white p-3 rounded">
            <label class="form-label ms-1">Copy link</label>
            <div class="d-flex gap-2">
              <input type="text" class="form-control" v-model="linkToSend" id="linktosend" readonly />
              <button type="button" class="btn btn-primary" @click.prevent="copyLink">Copy</button>
            </div>
          </div>
          <form class="container bg-white mb-4 p-3 rounded" novalidate>
            <label class="form-label ms-1">Send this link</label>
            <div class="d-flex gap-2">
              <input type="hidden" id="linktosend" class="form-control" name="qrlink" v-model="linkToSend" />
              <div class="flex-grow-1">
                <input type="email" class="form-control" id="emailInput" name="email" v-model="email" aria-describedby="emailHelp" placeholder="Enter email" required />
              </div>
              <button type="submit" class="btn btn-primary" @click.prevent="sendEmail">Send</button>
            </div>
          </form>
          <div class="container mb-4 bg-white p-3 rounded">
            <label class="form-label ms-1">Or share this link via</label>
            <div class="d-grid gap-2 d-flex justify-content-center">
              <button type="button" class="social-icon btn btn-outline-primary rounded-circle" @click="shareOnSocialMedia('facebook')">
                <i class="d-flex justify-content-center bi bi-facebook"></i>
              </button>
              <button type="button" class="social-icon btn btn-outline-success rounded-circle" @click="shareOnSocialMedia('whatsapp')">
                <i class="d-flex justify-content-center bi bi-whatsapp"></i>
              </button>
              <button type="button" class="social-icon btn btn-outline-dark rounded-circle" @click="shareOnSocialMedia('x')">
                <i class="d-flex justify-content-center bi bi-twitter-x"></i>
              </button>
              <button type="button" class="social-icon btn btn-outline-info rounded-circle" @click="shareOnSocialMedia('telegram')">
                <i class="d-flex justify-content-center bi bi-telegram"></i>
              </button>
              <button type="button" class="social-icon btn btn-outline-warning rounded-circle" @click="shareOnSocialMedia('snapchat')">
                <i class="d-flex justify-content-center bi bi-snapchat"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="container d-flex justify-content-end position-fixed top-0 p-3">
        <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" style="width: fit-content">
          <div id="toastMessage" class="toast-body"></div>
        </div>
      </div>
    </body>
  </html>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import { useStoreToast } from '@/stores/storeToast'
import { useStoreSettings } from '@/stores/storeSettings'

@Component
export default class Share extends Vue {
  private ToastStore = useStoreToast()

  qrUrl: string | undefined = undefined
  linkToSend: string | undefined = undefined
  group: string | undefined = undefined
  propertyId: string | undefined = undefined
  unitID: string | undefined = undefined
  email: string | undefined = undefined

  mounted() {
    this.group = useStoreSettings().groupName as string | undefined
    this.propertyId = useStoreSettings().propertyId as string | undefined
    this.unitID = this.$route.params.id as string | undefined

    if (this.group && this.propertyId && this.unitID) {
      this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&bgcolor=e1eee2&data=https://campsabout.com/camp/${this.group}/${this.propertyId}/index?unit=${this.unitID}`
      const resolvedPath = this.$router.resolve({
        name: 'unitId'
      }).href
      this.linkToSend = `${window.location.origin}${resolvedPath}`
    }
  }

  async sendEmail() {
    const form = document.querySelector('form') as HTMLFormElement

    if (form.checkValidity() === false) {
      this.ToastStore.showToast('Please enter a valid email address.')
      form.classList.add('was-validated')
      return
    }

    try {
      const formData = new FormData()
      formData.append('qrlink', this.linkToSend!)
      formData.append('email', this.email!)

      await fetch('https://campsabout.com/mapAPI/campmailer.php', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      })
        .then(() => {
          this.ToastStore.showToast('Email sent successfully!')
        })
        .catch((error) => {
          this.ToastStore.showToast('Failed to send email. Please try again later.')
          console.error('Error:', error)
        })
    } catch (error) {
      this.ToastStore.showToast('Failed to send email. Please try again later.')
      console.error('Error:', error)
    }
  }

  copyLink() {
    if (this.linkToSend) {
      navigator.clipboard.writeText(this.linkToSend).then(() => {
        this.ToastStore.showToast('Link copied to clipboard!')
      })
    }
  }

  shareOnSocialMedia(platform: string) {
    if (this.linkToSend) {
      let url
      switch (platform) {
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.linkToSend)}`
          break
        case 'whatsapp':
          url = `https://api.whatsapp.com/send?text=${encodeURIComponent(this.linkToSend)}`
          break
        case 'x':
          url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.linkToSend)}`
          break
        case 'telegram':
          url = `https://t.me/share/url?url=${encodeURIComponent(this.linkToSend)}`
          break
        case 'snapchat':
          url = `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(this.linkToSend)}`
          break
        default:
          console.error('Unsupported platform')
          return
      }
      window.open(url, '_blank')
    }
  }
}
</script>

<style>
.background {
  background-image: url(/src/assets/share-bg.svg);
  background-position: center;
  background-size: cover;
  overflow-x: hidden;
}

.container,
.img-container {
  --bs-bg-opacity: 0.85 !important;
}

.social-icon {
  width: 40px;
  height: 40px;
  --bs-btn-bg: white !important;
}

.social-icon i {
  font-size: 20px;
}
</style>
