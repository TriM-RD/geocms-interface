import { defineStore } from 'pinia'

export const useStorePoisLabels = defineStore('poisLabels', {
  state: () => ({
    labels: {},
  }),
  actions: {
    set(data: any) {
      this.labels = data
    }
  },
  getters: {
    getPoisLabels: (state) => {
      return state.labels;
    }
  }
});