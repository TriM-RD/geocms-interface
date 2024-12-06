import { defineStore } from 'pinia'

export const useStoreMapObjects = defineStore('mapObjects', {
  state: () => ({
    mapObjects: {}
  }),
  actions: {
    set(data: any) {
      this.mapObjects = data
    }
  },
  getters: {
    getMapObjects: (state) => state.mapObjects
  }
})