import { defineStore } from 'pinia'

export const useStoreSelectedFeatures = defineStore('selectedFeatures', {
  state: () => ({
    data: []
  }),
  actions: {
    setData(data: any) {
      this.data = data
    },
    appendData(newData: any) {
      if (Array.isArray(newData)) {
        this.data = [...this.data, ...newData]
      } else {
        this.data.push(newData)
      }
    },
    clear() {
      this.removeAllTooltips()
      this.data = []
    },
    removeAllTooltips() {
      // Select all elements with the `.bs-tooltip-auto` class (the tooltip elements)
      const tooltips = document.querySelectorAll('.bs-tooltip-auto')

      // Use for...of to loop through the NodeList
      for (const tooltip of tooltips) {
        tooltip.remove()
      }
    }
  },
  getters: {
    getData: (state) => state.data
  }
})
