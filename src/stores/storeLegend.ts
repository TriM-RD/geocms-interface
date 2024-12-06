import { defineStore } from 'pinia'
export enum Category {
  P = 'P',
  M = 'M',
  G = 'G',
  A = 'A',
  K = 'K',
  S = 'S'
}

export type ColorItem = {
  color: string
  title: string
  label: string
  category: Category
}

export type LegendItem = {
  icon: string
  title: string
  colors: ColorItem[]
}

export type DataItem = {
  //Deprecated
  category: Category // Specify possible categories
  color: string
  naziv: string // Title or name in your data
  oznaka: string // Label in your data
}
export const useStoreLegend = defineStore('legend', {
  state: () => ({
    data: [] as ColorItem[],
    availabilityAdded: false,
    disableLegend: false,
    displayLegend: true,
    isMobile: false
  }),
  actions: {
    appendColorItem(data: ColorItem, availabilityAdded = false) {
      this.data.push(data)
      this.availabilityAdded = availabilityAdded
    },
    clearCategoryAvailability() {
      this.availabilityAdded = false
      // Filter out items where the category is 'S'
      this.data = this.data.filter((item) => item.category !== 'S')
    },
    getCategoryTitle(category: Category): string {
      const categoryTitles: { [key in Category]: string } = {
        [Category.P]: 'Pitch',
        [Category.M]: 'Mobile Homes',
        [Category.G]: 'Glamping',
        [Category.A]: 'Apartments',
        [Category.K]: 'Caravan',
        [Category.S]: 'Availability'
      }
      return categoryTitles[category] || 'Unknown'
    },
    toggleDisableLegend(overwrite = null) {
      if (overwrite !== null) {
        this.disableLegend = overwrite
        return
      }
      this.disableLegend = !this.disableLegend
    },
    toggleDisplayLegend(overwrite = null) {
      if (overwrite !== null) {
        this.displayLegend = overwrite
        return
      }
      this.displayLegend = !this.displayLegend
    },
    toggleIsMobile(overwrite = null) {
      if (overwrite !== null) {
        this.isMobile = overwrite
        return
      }
      this.isMobile = !this.isMobile
    }
  },
  getters: {
    getLegendData: (state) => state.data,
    getDisableLegend: (state) => state.disableLegend,
    getDisplayLegend: (state) => state.displayLegend,
    getIsMobile: (state) => state.isMobile
  }
})
