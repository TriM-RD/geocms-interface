import { defineStore } from 'pinia'

export const useStoreUnitTypes = defineStore('unitTypes', {
  state: () => ({
    data: {} as any
  }),
  actions: {
    setData(data: any) {
      this.data = data
    }
  },
  getters: {
    getData: (state) => state.data
  }
})
