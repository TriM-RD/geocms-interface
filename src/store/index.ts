import { createStore } from 'vuex'
import { State } from '@/store/types'

export default createStore<State>({
  state: {
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
  },
  mutations: {
    setClientId (state, clientId) {
      state.clientId = clientId
    },
    setCodeVerifier (state, codeVerifier) {
      state.codeVerifier = codeVerifier
    },
    setCodeChallenge (state, codeChallenge) {
      state.codeChallenge = codeChallenge
    },
    setNonce (state, nonce) {
      state.nonce = nonce
    },
    setFirmName (state, name) {
      state.firm = name
    },
    setMapResizeDelegate (state, delegate) {
      state.mapResizeDelegate = delegate
    }
  },
  actions: {
    invokeDelegate ({ state }) {
      if (state.mapResizeDelegate && typeof state.mapResizeDelegate === 'function') {
        setTimeout(() => {
          /* const row = document.getElementById('row-content') TODO might be needed in the future or a similar option
          if (row) {
            row.style.maxHeight = (window.innerHeight - row.getBoundingClientRect().top) + 'px'
          } */
          state.mapResizeDelegate()
        }, 500)
      }
    }
  },
  modules: {
  }
})
