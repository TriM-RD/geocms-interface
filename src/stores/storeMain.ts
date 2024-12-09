import { defineStore } from 'pinia'

interface State {
  name: string
  email: string
  firm: string
  requiresAuth: number
  clientId: string
  codeVerifier: string
  codeChallenge: string
  nonce: string
  mapResizeDelegate: () => void
}

export const useStoreMain = defineStore('main', {
  state: (): State => ({
    name: '',
    email: '',
    firm: '',
    requiresAuth: 0,
    clientId: '',
    codeVerifier: '',
    codeChallenge: '',
    nonce: '',
    mapResizeDelegate: () => {
      console.log()
    }
  }),

  actions: {
    setClientId(clientId: string) {
      this.clientId = clientId
    },
    setCodeVerifier(codeVerifier: string) {
      this.codeVerifier = codeVerifier
    },
    setCodeChallenge(codeChallenge: string) {
      this.codeChallenge = codeChallenge
    },
    setNonce(nonce: string) {
      this.nonce = nonce
    },
    setFirmName(name: string) {
      this.firm = name
    },
    setMapResizeDelegate(delegate: () => void) {
      this.mapResizeDelegate = delegate
    },
    invokeDelegate() {
      if (this.mapResizeDelegate && typeof this.mapResizeDelegate === 'function') {
        setTimeout(() => {
          /* const row = document.getElementById('row-content')
          TODO might be needed in the future or a similar option
          if (row) {
            row.style.maxHeight = (window.innerHeight - row.getBoundingClientRect().top) + 'px'
          } */
          this.mapResizeDelegate()
        }, 500)
      }
    }
  }
})