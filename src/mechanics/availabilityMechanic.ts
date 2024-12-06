import { useStoreAvailability } from '@/stores/storeAvailability'
import { useStoreSettings } from '@/stores/storeSettings'
import { useStoreApiFeatures } from '@/stores/storeApiFeatures'
import { useStoreColors } from '@/stores/storeColors'
import { useStoreToast } from '@/stores/storeToast'
import { Manager as IntegrationApiMechanic } from './integrationApiMechanic'

export namespace Manager.Mechanic {
  export class AvailabilityMechanic {
    private AvailabilityStore = useStoreAvailability()
    private StoreSettings = useStoreSettings()
    private ApiFeaturesStore = useStoreApiFeatures()
    private StoreColors = useStoreColors()
    private ApiMechanic = new IntegrationApiMechanic.Mechanic.IntegrationApiMechanic()

    private refreshAvailabilityIntervalId: number | undefined

    private showToast = useStoreToast().showToast

    public showAvailability = async () => {
      try {
        const isDataRefreshed = await this.refreshAvailabilityData()
        clearInterval(this.refreshAvailabilityIntervalId)
        if (isDataRefreshed) this.refreshAvailabilityIntervalId = setInterval(this.refreshAvailabilityData, this.StoreSettings.refreshAvailabilityPeriod || 60000)
      } catch (error) {
        console.error('Error fetching availability data:', error)
      }
    }

    public clear() {
      this.AvailabilityStore.activeAbortControllers.forEach((controller) => controller.abort())
      this.AvailabilityStore.activeAbortControllers = []
      clearInterval(this.refreshAvailabilityIntervalId)
      this.AvailabilityStore.featureColors = {}

      this.AvailabilityStore.unitStatuses = null
      this.AvailabilityStore.totalPrices = null
      this.AvailabilityStore.startDate = ''
      this.AvailabilityStore.endDate = ''
      this.AvailabilityStore.numberOfNights = 0
      this.AvailabilityStore.childrenAges = []
      this.AvailabilityStore.adultsValue = 0
      this.AvailabilityStore.numberOfGuests = 0
      this.AvailabilityStore.pitchOrMobile = ''

      this.AvailabilityStore.periodSuggestions = {}

      this.AvailabilityStore.restoreColors()
    }

    private calculateColors() {
      if (!this.AvailabilityStore.unitStatuses || !this.AvailabilityStore.totalPrices) {
        console.warn('Illegal mishResponseData or phobsPrices (or both)', this.AvailabilityStore.unitStatuses, this.AvailabilityStore.totalPrices)
        return
      }

      const categories = this.AvailabilityStore.pitchOrMobile == 'M' ? ['M', 'G'] : ['P']

      //camp is closed but no one told us or something => paint everything red!
      if (!Object.keys(this.AvailabilityStore.unitStatuses)?.length) {
        this.AvailabilityStore.featureColors = this.ApiFeaturesStore.features
          .filter((feature: any) => feature.category && feature.enabled && categories.includes(feature.category))
          .reduce((newColors: any, accommodationUnit: any) => {
            newColors[accommodationUnit.mapId] = this.StoreColors.COLOR_OCCUPIED
            return newColors
          }, {})
        return
      }

      let newColors: any = {}
      this.ApiFeaturesStore.features.forEach((feature: any) => {
        const accommodationUnit = feature
        const unit = this.AvailabilityStore.unitStatuses[feature.pmsNumber]
        if (!unit) return //probably an object
        if (!accommodationUnit?.enabled || !categories.includes(accommodationUnit.category)) return

        if (Number(accommodationUnit.onQuery)) newColors[accommodationUnit.mapId] = this.StoreColors.COLOR_INQUIRY_ONLY
        else if (unit.status == 'A' && this.AvailabilityStore.totalPrices[accommodationUnit.labelMish]) newColors[accommodationUnit.mapId] = this.StoreColors.COLOR_AVAILABLE
        else newColors[accommodationUnit.mapId] = this.StoreColors.COLOR_OCCUPIED
      })
      this.AvailabilityStore.featureColors = newColors
    }

    private getAvailabilityData = async () => {
      const childrenAges = this.AvailabilityStore.childrenAges.reduce((acc, age, index) => {
        acc[`child${index + 1}`] = age
        return acc
      }, {})

      const [day, month, year] = this.AvailabilityStore.startDate.split('.')
      const phobsDatum = `${year}-${month}-${day}`

      const [unitStatuses, phobsPrices] = await Promise.all([
        this.ApiMechanic.fetchUnitStatuses(this.AvailabilityStore.startDate, this.AvailabilityStore.endDate, this.StoreSettings.oldMapSettings.propertyId),
        this.ApiMechanic.fetchPhobsPrices(this.StoreSettings.propertyId, this.StoreSettings.groupName, this.AvailabilityStore.pitchOrMobile, phobsDatum, this.AvailabilityStore.numberOfNights, childrenAges, this.AvailabilityStore.adultsValue)
      ])
      if (!unitStatuses?.units || !phobsPrices) {
        console.warn('Failed to collect data', unitStatuses, phobsPrices)
        this.showToast('Failed to collect data', "text-bg-danger border-0", "liveToastMain", "toastMessageMain")
        return false
      }

      this.AvailabilityStore.unitStatuses = unitStatuses.units.reduce((o: any, us: any) => {
        o[us.unit_code] = us
        return o
      }, {})
      this.AvailabilityStore.totalPrices = phobsPrices
      return true
    }

    public refreshAvailabilityData = async () => {
      const isDataRefreshed = await this.getAvailabilityData()
      if (isDataRefreshed) {
        this.calculateColors()
        this.AvailabilityStore.colorAvailability()
      }
      return isDataRefreshed
    }
  }
}
