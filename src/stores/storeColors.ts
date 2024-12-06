import { defineStore } from 'pinia'
import type { ColorItem } from '@/stores/storeLegend'

export const useStoreColors = defineStore('classColors', {
  state: () => ({
    classColors: {},
    COLOR_AVAILABLE: '#01d64b', //TODO make it into a single object
    COLOR_OCCUPIED: '#fe4658', //TODO as above
    COLOR_INQUIRY_ONLY: '#2f57de', //TODO as above
    COLOR_AVAILABLE_IN_OTHER_PERIODS: '#fed480', //TODO as above
    availabilityConst: {
      COLOR_AVAILABLE: { color: '#01d64b', category: 'S', label: 'CA', title: 'Available' } as ColorItem,
      COLOR_OCCUPIED: { color: '#fe4658', category: 'S', label: 'CO', title: 'Occupied' } as ColorItem,
      COLOR_INQUIRY_ONLY: { color: '#2f57de', category: 'S', label: 'CI', title: 'Inquiry Only' } as ColorItem,
      COLOR_AVAILABLE_IN_OTHER_PERIODS: { color: '#fed480', category: 'S', label: 'CP', title: 'Limited Availability' } as ColorItem
    }
  }),
  actions: {
    set(data: any) {
      this.classColors = data
    }
  },
  getters: {
    getColors: (state) => state.classColors,
    getAvailabilityConst: (state) => state.availabilityConst
  }
})
