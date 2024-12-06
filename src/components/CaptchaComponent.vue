<template>
  <Loading v-model:active="loading" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import { useReCaptcha } from 'vue-recaptcha-v3'
import LoadingComponent from '@/components/LoadingComponent.vue'

@Component({
  components: {
    Loading: LoadingComponent
  }
})
export default class CaptchaComponent extends Vue {
  recaptcha!: any
  loading = true
  mounted() {
    this.recaptcha = useReCaptcha()
    // Optionally call captcha on component mount or any other trigger
    this.openCaptcha()
  }

  async openCaptcha() {
    try {
      if (this.recaptcha) {
        const token = await this.recaptcha.executeRecaptcha('submit')
        if (token) await this.onCaptchaVerified(token)
      }
    } catch (error) {
      console.error('Captcha verification failed:', error)
    }
  }

  async onCaptchaVerified(token: string) {
    try {
      const formData = new FormData()
      formData.append('token', token)

      const response = await fetch('https://campsabout.com/mapAPI/revision/captcha.php', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        this.$emit('verified', token)
      } else {
        console.error('Captcha verification failed:', data.message)
      }
    } catch (error) {
      console.error('Error during server verification:', error)
    }
  }
}
</script>
