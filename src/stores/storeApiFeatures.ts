import { defineStore } from 'pinia'

export const useStoreApiFeatures = defineStore('apiFeatures', {
  state: () => ({
    features: [],
  }),
  actions: {
    set(data: any) {
      this.features = data
    }
  },
  getters: {
    getFeatures: (state) => {
      return state.features;
    }
  }
});