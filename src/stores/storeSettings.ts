import { defineStore } from 'pinia'

// Define an interface for type safety (if using TypeScript)
export interface StoreSettingsState {
  useArrows: boolean
  useDots: boolean
  useThumbnail: boolean
  groupName: string
  propertyId: number
  oldMapParameters: any
  oldMapSettings: any
  accommodationTypes: string[]
  specialConditions: string[]
  promoCode: boolean
  refreshAvailabilityPeriod: number
  initialRecenter: number[]
  mapPath: string
  occupancyOptimization: boolean
  show360onModal: boolean
  mapboxStyle: string | null
  mapboxAccessToken: string | null
  extraSecurity: boolean
  showUnavailableAcc: boolean
}

export enum SettingsKeys {
  UseArrows = 'useArrows',
  UseDots = 'useDots',
  UseThumbnail = 'useThumbnail'
}

export const useStoreSettings = defineStore('settings', {
  state: (): StoreSettingsState => ({
    useArrows: true,
    useDots: true,
    useThumbnail: false,
    groupName: 'polidor',
    propertyId: 1,
    oldMapParameters: null,
    oldMapSettings: null,
    accommodationTypes: [],
    specialConditions: [],
    promoCode: false,
    refreshAvailabilityPeriod: 60000,
    initialRecenter: [0, 0],
    mapPath: '',
    occupancyOptimization: false,
    show360onModal: false,
    mapboxStyle: null,
    mapboxAccessToken: null,
    extraSecurity: true,
    showUnavailableAcc: false
  }),
  actions: {
    set(settingsData: Partial<StoreSettingsState>) {
      Object.assign(this, settingsData)
    },
    setOldMapParameters(oldMapParameters: any) {
      this.oldMapParameters = oldMapParameters
    },
    setOldMapSettings(oldMapSettings: any) {
      this.oldMapSettings = oldMapSettings
    }
  },
  getters: {
    get: (state) => (key: keyof StoreSettingsState) => {
      return state[key]
    }
  }
})
