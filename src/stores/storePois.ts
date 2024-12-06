import { defineStore } from 'pinia'

export const useStorePois = defineStore('pois', {
  state: () => ({
    pois: {},
  }),
  actions: {
    set(data: any) {
      this.pois = data
    }
  },
  getters: {
    getPois: (state) => {
      return state.pois;
    }
  }
});