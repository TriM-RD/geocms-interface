import { defineStore } from 'pinia'

export const useStorePoisGroups = defineStore('poisGroups', {
  state: () => ({
    pois: {},
  }),
  actions: {
    set(data: any) {
      this.pois = data
    }
  },
  getters: {
    getPoisGroups: (state) => {
      return state.pois;
    }
  }
});