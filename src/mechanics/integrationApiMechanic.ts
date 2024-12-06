import { useStoreAvailability } from '@/stores/storeAvailability'
import { useStoreSettings } from '@/stores/storeSettings'
import { useStoreTranslations } from '@/stores/storeTranslations'
import http from '@/http-common'

export namespace Manager.Mechanic {
  export class IntegrationApiMechanic {
    private AvailabilityStore = useStoreAvailability()
    private StoreSettings = useStoreSettings()
    private StoreTranslations = useStoreTranslations()

    public postTentativeReservation = async (unitId: string | number) => {
      const response = await http.post(this.StoreSettings.oldMapParameters.mishReservationURL, {
        data: {
          propertyCode: this.StoreSettings.oldMapSettings.propertyId,
          unitId,
          dateFrom: this.AvailabilityStore.startDate,
          dateTo: this.AvailabilityStore.endDate,
          numGuests: this.AvailabilityStore.numberOfGuests
        }
      })
      if (Math.floor(response.status / 100) == 2) return response.data.reservation_id
      else {
        console.error(`Failed to post tentative reservation: ${response.status}`, response)
        return null
      }
    }

    public cancelTentativeReservation = async (reservationId: string | number) => {
      const response = await http.post(this.StoreSettings.oldMapParameters.mishCancelReservationURL, { data: { reservationId } })
      if (Math.floor(response.status / 100) != 2) console.error(`Failed to cancel tentative reservation: ${response.status}`, response)
    }

    public fetchUnitStatuses = async (dateFrom: string, dateTo: string, pmsid: string) => {
      try {
        const abortController = new AbortController()
        const activeAbortControllers = this.AvailabilityStore.activeAbortControllers
        activeAbortControllers.push(abortController)
        const response = await http.post(
          this.StoreSettings.oldMapParameters.mishUnitStatusURL,
          {
            data: { dateFrom, dateTo, pmsid }
          },
          { signal: abortController.signal }
        )
        const abortControllerIndex = activeAbortControllers.indexOf(abortController)
        if (abortControllerIndex >= 0) activeAbortControllers.splice(abortControllerIndex, 1)

        if (Math.floor(response.status / 100) == 2) {
          return response.data
        } else {
          throw new Error(`Failed to fetch unit statuses: ${response.status}`)
        }
      } catch (error: any) {
        if (error.code != 'ERR_CANCELED') console.error('Error fetching unit statuses:', error)
        return null
      }
    }

    public fetchPhobsPrices = async (kampId: number, grupacija: string, pitchOrMobile: string, dateFrom: string, brojdana: number, djecaGodine: any, brojosoba: number) => {
      try {
        const abortController = new AbortController()
        const activeAbortControllers = this.AvailabilityStore.activeAbortControllers
        activeAbortControllers.push(abortController)
        const response = await http.post(
          this.StoreSettings.oldMapParameters.phobsTotalPricesUrl,
          {
            data: {
              kampId,
              grupacija,
              pitchOrMobile,
              datumod: dateFrom,
              brojdana,
              djecaGodine,
              brojosoba,
              jezik: this.StoreTranslations.currentLanguage,
              rateId: Number(dateFrom.slice(0, 4)) == new Date().getFullYear() ? (pitchOrMobile == 'P' ? this.StoreSettings.oldMapSettings.parceleRateId : this.StoreSettings.oldMapSettings.defaultRateId) : pitchOrMobile == 'P' ? this.StoreSettings.oldMapParameters.rateP2024 : this.StoreSettings.oldMapParameters.rateM2024
            }
          },
          { signal: abortController.signal }
        )
        const abortControllerIndex = activeAbortControllers.indexOf(abortController)
        if (abortControllerIndex >= 0) activeAbortControllers.splice(abortControllerIndex, 1)
        if (Math.floor(response.status / 100) == 2) {
          return response.data
        } else {
          throw new Error(`Failed to fetch phobs prices: ${response.status}`)
        }
      } catch (error: any) {
        if (error.code != 'ERR_CANCELED') console.error('Error fetching phobs prices:', error)
        return null
      }
    }

    public getBookUrl = async (kampId: number, grupacija: string, brojSJ: string, datumod: string, brojdana: number, brojosoba: number, djecaGodine: any, rateID: string, promocode: string, jezik: string) => {
      const response = await http.post(this.StoreSettings.oldMapParameters.phobsBookURL, {
        data: { brojSJ, datumod, brojdana, brojosoba, djecaGodine, rateID, jezik, kampId, grupacija, promocode, enforceRateId: true }
      })
      if (Math.floor(response.status / 100) == 2) {
        return response.data
      } else {
        console.error( new Error(`Failed to fetch booking url: ${response.status}`))
        return null;
      }
    }

    public getPhobsRates = async (propertyId: number, group: string, labelPhobs: string, dateFrom: string, duration: number, numberOfPeople: number, childrenAges: any) => {
      const phobsRatesResponse = await http.post(this.StoreSettings.oldMapParameters.getPhobsRatesUrl, {
        data: { propertyId, group, labelPhobs, dateFrom, duration, nomberOfPeople: numberOfPeople, childrenAges }
      }) //TODO ispravi nomber u number i na backendu
      if (Math.floor(phobsRatesResponse.status / 100) != 2 || phobsRatesResponse.data.Error) {
        console.warn('PHOBS error for ' + labelPhobs, phobsRatesResponse.data.Error)
        return null
      }
      return phobsRatesResponse.data
    }
  }
}
