import { useStoreAvailability } from '@/stores/storeAvailability'
import { useStoreSettings } from '@/stores/storeSettings'
import { useStoreApiFeatures } from '@/stores/storeApiFeatures'
import { useStoreColors } from '@/stores/storeColors'
import { useStoreUnitTypes } from '@/stores/storeUnitTypes'
import { useStoreToast } from '@/stores/storeToast'
import { Manager as IntegrationApiMechanic } from './integrationApiMechanic.js'
import { DayPeriod } from '@/model/DayPeriod.js'

//TODO prebaciti ovo na backend kad backend bude gotov?
//TODO napraviti neki interface za ovo i availabilityMechanic ili da jedno naslijedi drugo pa da i službeno budu interchanegeable - ali tek kada ih preradimo da zapravo budu mehanike
//TODO napraviti cache-iranje predloženih termina - da se ne računaju ponovo na svakom refresh-u

export namespace Manager.Mechanic {
  export class OccupancyOptimizationMechanic {
    private AvailabilityStore = useStoreAvailability()
    private StoreSettings = useStoreSettings()
    private ApiFeaturesStore = useStoreApiFeatures()
    private StoreColors = useStoreColors()
    private ApiMechanic = new IntegrationApiMechanic.Mechanic.IntegrationApiMechanic()
    private typesStore = useStoreUnitTypes()
    private weekDaysCroatianShort: string[] = ['ned', 'pon', 'uto', 'sri', 'cet', 'pet', 'sub']

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

    public refreshAvailabilityData = async () => {
      const isDataRefreshed = await this.getAvailabilityData()
      if (isDataRefreshed) {
        this.calculateColors()
        this.AvailabilityStore.colorAvailability()
      }
      return isDataRefreshed
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

    private getAvailabilityData = async () => {
      const childrenAges = this.AvailabilityStore.childrenAges.reduce((acc: any, age: any, index: any) => {
        acc[`child${index + 1}`] = age
        return acc
      }, {})

      const requestedPeriod = new DayPeriod(DayPeriod.dateFromMishFormat(this.AvailabilityStore.startDate), DayPeriod.dateFromMishFormat(this.AvailabilityStore.endDate))

      const phobsStartDate = DayPeriod.dateToPhobsFormat(requestedPeriod.getFrom())

      const movedStart = this.moveDate(requestedPeriod.getFrom(), Math.min(Math.ceil(requestedPeriod.getDuration() / 2) - 1, 2))
      const movedEnd = this.moveDate(requestedPeriod.getTo(), -1 * Math.min(Math.ceil(requestedPeriod.getDuration() / 3), 3))

      if (requestedPeriod.getDuration() < 0 || !movedStart || !movedEnd || isNaN(movedStart.getTime()) || isNaN(movedEnd.getTime())) {
        console.warn('Illegal start or end date', this.AvailabilityStore.startDate, this.AvailabilityStore.endDate)
        this.showToast('Illegal start or end date', 'text-bg-danger border-0', 'liveToastMain', 'toastMessageMain')
        return false
      }

      const [unitStatusesStart, unitStatusesEnd, phobsPrices] = await Promise.all([
        this.ApiMechanic.fetchUnitStatuses(DayPeriod.dateToMishFormat(movedStart), DayPeriod.dateToMishFormat(this.moveDate(movedStart, 1)), this.StoreSettings.oldMapSettings.propertyId),
        this.ApiMechanic.fetchUnitStatuses(DayPeriod.dateToMishFormat(movedEnd), DayPeriod.dateToMishFormat(this.moveDate(movedEnd, 1)), this.StoreSettings.oldMapSettings.propertyId),
        this.ApiMechanic.fetchPhobsPrices(this.StoreSettings.propertyId, this.StoreSettings.groupName, this.AvailabilityStore.pitchOrMobile, phobsStartDate, this.AvailabilityStore.numberOfNights, childrenAges, this.AvailabilityStore.adultsValue)
      ])
      if (!unitStatusesStart?.units || !unitStatusesEnd?.units || !phobsPrices || phobsPrices.error_message) {
        console.warn('Failed to collect data', unitStatusesStart, unitStatusesEnd, phobsPrices)
        this.showToast('Failed to collect data', 'text-bg-danger border-0', 'liveToastMain', 'toastMessageMain')
        return false
      }

      let unitStatuses: any = {}

      unitStatusesStart.units.forEach((status: any) => {
        const availablePeriodStart = status.status != 'A' ? null : this.getAvailablePeriod(movedStart, status.available_before, status.available_after)
        unitStatuses[status.unit_code] = Object.assign({}, { unit_code: status.unit_code, unit_id: status.unit_id, unit_type_code: status.unit_type_code, statusStart: status.status, availablePeriodStart })
      })
      unitStatusesEnd.units.forEach((status: any) => {
        const availablePeriodEnd = status.status != 'A' ? null : this.getAvailablePeriod(movedEnd, status.available_before, status.available_after)
        unitStatuses[status.unit_code] = Object.assign(unitStatuses[status.unit_code], { statusEnd: status.status, availablePeriodEnd })
      })

      this.AvailabilityStore.unitStatuses = unitStatuses
      this.AvailabilityStore.totalPrices = phobsPrices
      return true
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
      let periodSuggestions: { [key: string | number]: DayPeriod[] } = {}
      const requestedPeriod = new DayPeriod(DayPeriod.dateFromMishFormat(this.AvailabilityStore.startDate), DayPeriod.dateFromMishFormat(this.AvailabilityStore.endDate)) // TODO Refactorati to tako da se već u BookNow komponenti postavi requestedPeriod - kasnije (nakon što svi klijenti koriste novi sustav)

      this.ApiFeaturesStore.features.forEach((feature: any) => {
        const unit: any = this.AvailabilityStore.unitStatuses?.[feature.pmsNumber]

        if (!unit || !feature?.enabled || !categories.includes(feature.category)) return

        if (Number(feature.onQuery)) {
          newColors[feature.mapId] = this.StoreColors.COLOR_INQUIRY_ONLY
          return
        }

        if ((unit.statusStart != 'A' && unit.statusEnd != 'A') || !this.AvailabilityStore.totalPrices[feature.labelMish]) {
          newColors[feature.mapId] = this.StoreColors.COLOR_OCCUPIED
          return
        }

        const minGap: number = Number(this.typesStore.data[feature.labelMish]?.minRupa) || 0
        const maxGap: number = Number(this.typesStore.data[feature.labelMish]?.maxRupa) || 0
        const gapBefore = unit.availablePeriodStart && DayPeriod.getDayDifference(unit.availablePeriodStart.getFrom(), requestedPeriod.getFrom())
        const gapAfter = unit.availablePeriodStart && DayPeriod.getDayDifference(unit.availablePeriodStart.getTo(), requestedPeriod.getTo())
        if (requestedPeriod.isWithin(unit.availablePeriodStart) && (gapBefore <= minGap || gapBefore >= maxGap) && (gapAfter <= minGap || gapAfter >= maxGap)) {
          newColors[feature.mapId] = this.StoreColors.COLOR_AVAILABLE
          return
        }

        const suggestions = this.getSuggestedPeriods(requestedPeriod, unit.availablePeriodStart, unit.availablePeriodEnd, minGap, maxGap)
        if (suggestions.length) {
          periodSuggestions[feature.mapId] = suggestions
          newColors[feature.mapId] = this.StoreColors.COLOR_AVAILABLE_IN_OTHER_PERIODS
        } else {
          newColors[feature.mapId] = this.StoreColors.COLOR_OCCUPIED
        }
      })
      this.AvailabilityStore.featureColors = newColors
      this.AvailabilityStore.periodSuggestions = periodSuggestions
    }

    private getSuggestedPeriods(requestedPeriod: DayPeriod, periodStart: DayPeriod, periodEnd: DayPeriod, minGap: number, maxGap: number) {
      let suggestedPeriods: DayPeriod[] = []

      // Handle special cases
      if (!periodStart && !periodEnd) return suggestedPeriods
      if (!periodStart) periodStart = periodEnd

      // Generate basic suggestions
      suggestedPeriods.push(...this.suggestPeriods(requestedPeriod, periodStart, minGap, maxGap))
      if (periodEnd && !periodStart.equals(periodEnd)) suggestedPeriods.push(...this.suggestPeriods(requestedPeriod, periodEnd, minGap, maxGap))

      // Remove those that don't fit the requirements
      suggestedPeriods = suggestedPeriods.filter((period) => this.isPeriodValid(period, requestedPeriod, periodStart, periodEnd, minGap, maxGap))

      // Sort periods according to similarity to requested period
      suggestedPeriods.sort(requestedPeriod.compareBySimilarityToThis.bind(requestedPeriod))

      // Remove duplicates
      suggestedPeriods = suggestedPeriods.filter((period, index, array) => !period.equals(array[index - 1]))

      return suggestedPeriods
    }

    private suggestPeriods(requestedPeriod: DayPeriod, availablePeriod: DayPeriod, minGap: number, maxGap: number) {
      let suggestedPeriods: DayPeriod[] = []

      //if availablePeriod is too long it is effectively infinite
      availablePeriod = this.makeEffectiveInfinityExplicit(availablePeriod, requestedPeriod, maxGap)

      if (!availablePeriod.isInfinte()) suggestedPeriods.push(availablePeriod)
      if (!availablePeriod.isInfinte() && availablePeriod.getDuration() < requestedPeriod.getDuration()) return suggestedPeriods //both gaps are 0 and suggestion is shorter than the request => there is no point in suggesting more periods here

      const durations: number[] = [requestedPeriod.getDuration(), requestedPeriod.getDuration() - 1, requestedPeriod.getDuration() + 1]
      if (availablePeriod.getDuration() > maxGap) durations.push(availablePeriod.getDuration() - maxGap)
      if (availablePeriod.getDuration() > minGap) for (let i = 1; i <= minGap; i++) durations.push(availablePeriod.getDuration() - i)
      durations.forEach((duration) => {
        if (availablePeriod.getFrom()) {
          suggestedPeriods.push(new DayPeriod(availablePeriod.getFrom(), this.moveDate(availablePeriod.getFrom(), duration)))
          suggestedPeriods.push(new DayPeriod(this.moveDate(availablePeriod.getFrom(), maxGap), this.moveDate(availablePeriod.getFrom(), maxGap + duration)))
        }
        if (availablePeriod.getTo()) {
          suggestedPeriods.push(new DayPeriod(this.moveDate(availablePeriod.getTo(), -duration), availablePeriod.getTo()))
          suggestedPeriods.push(new DayPeriod(this.moveDate(availablePeriod.getTo(), -maxGap), this.moveDate(availablePeriod.getTo(), -maxGap - duration)))
        }
      })

      if (availablePeriod.getFrom()) {
        suggestedPeriods.push(new DayPeriod(availablePeriod.getFrom(), requestedPeriod.getTo()))
        suggestedPeriods.push(new DayPeriod(this.moveDate(availablePeriod.getFrom(), maxGap), requestedPeriod.getTo()))
      }
      if (availablePeriod.getTo()) {
        suggestedPeriods.push(new DayPeriod(requestedPeriod.getFrom(), availablePeriod.getTo()))
        suggestedPeriods.push(new DayPeriod(requestedPeriod.getFrom(), this.moveDate(availablePeriod.getTo(), -maxGap)))
      }

      if (availablePeriod.getFrom() && availablePeriod.getTo()) {
        suggestedPeriods.push(new DayPeriod(this.moveDate(availablePeriod.getFrom(), maxGap), this.moveDate(availablePeriod.getTo(), -maxGap)))
        for (let i = 1; i <= minGap; i++) suggestedPeriods.push(new DayPeriod(this.moveDate(availablePeriod.getFrom(), i), this.moveDate(availablePeriod.getTo(), -i)))
      }

      return suggestedPeriods
    }

    private isPeriodValid(period: DayPeriod, requestedPeriod: DayPeriod, availablePeriodStart: DayPeriod | null, availablePeriodEnd: DayPeriod | null, minGap: number, maxGap: number): boolean {
      const availablePeriod = period.isWithin(availablePeriodStart) ? availablePeriodStart : availablePeriodEnd
      if (!availablePeriod) return false // ne postoji available period

      if (!period.isWithin(availablePeriod)) return false // nije u available period

      if (!requestedPeriod.includesDate(period.getFrom()) && !period.includesDate(requestedPeriod.getFrom())) return false // niti jedan dan se ne preklapa s traženim periodom

      if (period.getDuration() > 2 * requestedPeriod.getDuration() || period.getDuration() > requestedPeriod.getDuration() + 10) return false // predugačak je

      if (period.getDuration() < requestedPeriod.getDuration() / 2 || period.getDuration() < requestedPeriod.getDuration() - 10) return false // prekratak je

      if (period.getDuration() < 1) return false // ili ne spava nijednu noć ili je period beskonačan

      const gapBefore = DayPeriod.getDayDifference(period.getFrom(), availablePeriod.getFrom())
      if (gapBefore > minGap && gapBefore < maxGap) return false // ima neprihvatljivu rupu prije

      const gapAfter = DayPeriod.getDayDifference(period.getTo(), availablePeriod.getTo())
      if (gapAfter > minGap && gapAfter < maxGap) return false // ima neprihvatljivu rupu poslije

      for (let i = 0; i < this.AvailabilityStore.bookingPeriods.length; i++) {
        const bookingPeriod = this.AvailabilityStore.bookingPeriods[i]
        const bookingDayPeriod = new DayPeriod(DayPeriod.dateFromPhobsFormat(bookingPeriod.dateFrom), DayPeriod.dateFromPhobsFormat(bookingPeriod.dateTo))
        if (bookingDayPeriod.isInfinte()) {
          console.warn('Illegal booking period from cms', bookingPeriod, bookingDayPeriod)
          continue
        } // Illegal period

        const from = period.getFrom()
        const includesFrom = bookingDayPeriod.includesDate(from)
        if (from && includesFrom && !bookingPeriod[this.weekDaysCroatianShort[from.getDay()] + 'D']) return false // nema dolazaka na taj dan

        const to = period.getTo()
        const includesTo = bookingDayPeriod.includesDate(to)
        if (to && includesTo && !bookingPeriod[this.weekDaysCroatianShort[to.getDay()] + 'O']) return false // nema odlazaka na taj dan

        //TODO dopusti prekratki termin s posebnim cjenikom ako su rupe s obje strane 0 - treba se čuti s Petrom iz Jadranke
        if ((includesFrom || includesTo) && period.getDuration() < bookingPeriod.minDays) return false // prekratki termin
      }

      return true
    }

    private makeEffectiveInfinityExplicit(availablePeriod: DayPeriod, requestedPeriod: DayPeriod, maxGap: number) {
      const effectiveInfinityTreshold = requestedPeriod.getDuration() + maxGap

      const availableFrom = availablePeriod.getFrom()
      const availableTo = availablePeriod.getTo()
      const requestedFrom = requestedPeriod.getFrom()
      const requestedTo = requestedPeriod.getTo()

      const newFrom = availableFrom && requestedFrom && availableFrom.getTime() < requestedFrom.getTime() && DayPeriod.getDayDifference(availableFrom, requestedFrom) > effectiveInfinityTreshold ? null : availableFrom
      const newTo = availableTo && requestedTo && availableTo.getTime() > requestedTo.getTime() && DayPeriod.getDayDifference(availableTo, requestedTo) > effectiveInfinityTreshold ? null : availableTo

      return new DayPeriod(newFrom, newTo)
    }

    private moveDate(date: Date | null, daysMoved: number): Date | null {
      if (!date) return null
      const resultDate = new Date(date)
      resultDate.setDate(resultDate.getDate() + daysMoved)
      return resultDate
    }

    private getAvailablePeriod(date: Date | null, availableBefore: number | null | undefined, availableAfter: number | null | undefined) {
      if (availableBefore === undefined || availableAfter === undefined) {
        this.clear()
        throw new Error("Occupancy Optimisation is being used but PMS isn't sending the neccessary data.")
      }
      const from = availableBefore === null ? null : this.moveDate(date, -availableBefore)
      const to = availableAfter === null ? null : this.moveDate(date, availableAfter + 1)
      return new DayPeriod(from, to)
    }
  }
}
