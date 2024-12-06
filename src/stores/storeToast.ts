import { defineStore } from 'pinia'
import { Toast } from 'bootstrap'

export const useStoreToast = defineStore('toast', {
  state: () => ({
    showToast: (message: string, classes = '', liveToastId = 'liveToast', toastMessageElementId = 'toastMessage') => {
      const toastLiveExample = document.getElementById(liveToastId)
      const toastMessageElement = document.getElementById(toastMessageElementId)

      if (!toastLiveExample || !toastMessageElement) return console.error('Toast element not found')

      // Add message to the toast body
      toastMessageElement.textContent = message

      // Add optional classes to style the toast (if any)
      if (classes) {
        toastLiveExample.classList.add(...classes.split(' ').filter((a) => a))
      }

      // Configure and show the toast
      const toast = new Toast(toastLiveExample, {
        autohide: true, // Automatically hide the toast
        delay: 1000 // Set delay to 3 seconds (3000 milliseconds)
      })
      toast.show()

      // Hide the toast after it finishes displaying
      toastLiveExample.addEventListener('hidden.bs.toast', () => {
        // Automatically clear classes after hiding (optional cleanup)
        if (classes) {
          toastLiveExample.classList.remove(...classes.split(' ').filter((a) => a))
        }
      })
    }
  }),
  actions: {},
  getters: {}
})
