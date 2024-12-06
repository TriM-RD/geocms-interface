import { defineStore } from 'pinia'

export const useStoreLocation = defineStore('location', {
  state: () => ({
    lng: 0,
    lat: 0,
    setupLocationTracking: () => {}
  }),
  actions: {
    set(data: any) {
      const { lng, lat } = data
      this.lng = lng
      this.lat = lat
    },
    setSetupFunction(fn: () => void) {
      this.setupLocationTracking = fn
    }
  },
  getters: {
    getLocation: (state) => ({ lng: state.lng, lat: state.lat })
  }
})
