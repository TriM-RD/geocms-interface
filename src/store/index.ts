import { createStore } from 'vuex'

export default createStore({
  state: {
    name: '',
    email: '',
    firm: '',
    requiresAuth: 0,
    clientId: '',
    codeVerifier: '',
    codeChallenge: '',
    nonce: ''
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
    }
  },
  actions: {
  },
  modules: {
  }
})
