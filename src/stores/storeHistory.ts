import { defineStore } from 'pinia'

export const useStoreHistory = defineStore('history', {
  state: () => ({
    history: [] as string[]
  }),
  actions: {
    push(url: string) {
      this.history.push(url)
    },
    replace(url: string) {
      this.history.pop()
      this.history.push(url)
    }
  },
  getters: {
    getCurrent: (state) => state.history[state.history.length - 1],
    getPrevious: (state) => state.history[state.history.length - 2]
  }
})
