import { defineStore } from 'pinia'
import { DayPeriod } from '@/model/DayPeriod'

export const useStoreAvailability = defineStore('availability', {
  state: () => ({
    colorAvailability: () => {},
    restoreColors: () => {},
    unitStatuses: null as any,
    totalPrices: null as any,
    startDate: '',
    endDate: '',
    lastTentativeReservationId: null as string | number | null,
    numberOfGuests: 0,
    numberOfNights: 0,
    childrenAges: [] as any,
    adultsValue: 0,
    pitchOrMobile: '',
    featureColors: {} as any,
    bookingPeriods: [] as any[],
    periodSuggestions: {} as { [key: string | number]: DayPeriod[] },
    activeAbortControllers: [] as AbortController[]
  }),
  actions: {},
  getters: {}
})
