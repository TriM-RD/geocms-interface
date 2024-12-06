<template>
  <div v-if="(confirmedSteps.first || confirmedSteps.second || confirmedSteps.third) && hideOnLegend" @click="toggleAllInfo()" class="selected-parameters mt-1 me-1 ms-5 position-relative d-flex flex-column justify-content-center overflow-hidden bg-white p-2 p-sm-4 m-sm-auto mt-sm-3">
    <button v-if="!isMobile" data-bs-toggle="cursor-tooltip" :title="$t('clear')" class="btn btn-camp d-none d-sm-flex clear-button position-absolute d-flex justify-content-center align-items-center" style="font-size: 16px" @click="clear"><i class="fa-solid fa-xmark"></i></button>
    <div class="pe-5" v-show="allInfo">
      <span v-if="confirmedSteps.first">
        {{ $t('selectedAccommodation') }}: <strong>{{ selectedAccommodationsDisplay }}</strong
        ><br />
      </span>
      <span v-if="confirmedSteps.second && enteredPromoCode">
        {{ $t('promoCode') }}: <strong>{{ enteredPromoCode }}</strong
        ><br />
      </span>
      <span v-if="confirmedSteps.third">
        {{ $t('guests') }}:
        <strong
          >{{ $t('adults') }}: {{ adultsValue }} <template v-if="childrenValue > 0">, {{ $t('children').toLowerCase() }}: {{ childrenValue }} {{ childrenAgesDisplay }}</template> </strong
        ><br />
      </span>
    </div>
    <div>
      <span v-if="confirmedSteps.fourth">
        <div class="d-flex align-items-center">
          {{ $t('dates') }}:&nbsp; <strong>{{ formattedDates }} ({{ numberOfNights }} {{ $t('night_plural').toLowerCase() }})</strong>
          <button data-bs-toggle="cursor-tooltip" :title="$t('edit')" class="btn ms-auto ms-sm-0 btn-outline-camp py-0 border-0 p-0" style="width: 28px" @click.stop="bookStep(4), toggleAllInfo(true)">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button v-if="LegendStore.availabilityAdded && isMobile" class="btn btn-outline-camp py-0 border-0 p-0" style="width: 28px" @click.stop="clear">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <button v-if="LegendStore.availabilityAdded && isMobile" disabled class="btn btn-outline-camp py-0 border-0 p-0" style="width: 28px">
            <i :class="{ 'fa-solid': true, 'fa-caret-down': !allInfoShown, 'fa-caret-up': allInfoShown }"></i>
          </button>
        </div>
        <span v-if="specialConditions.length > 1" v-show="allInfo">
          {{ $t('specialConditions') }}: <strong>{{ getCondition(String(selectedCondition)) }}</strong>
        </span>
      </span>
    </div>
  </div>

  <ProgressBar v-if="(visibility.bookSelect || confirmedSteps.fourth) && (progress < 100 || showLoader)" class="progress-bar mt-sm-3 mt-1 mt-sm-3 ms-5 me-1 me-sm-5" :showValue="false" :value="progress"></ProgressBar>

  <Loading v-model:active="showLoader" :size="0" class="loader" />

  <div v-if="visibility.bookSelect" class="book-select justify-content-evenly rounded-5 position-relative d-flex justify-content-center overflow-hidden bg-white m-auto mt-2 mt-sm-3 mx-2 mx-sm-auto">
    <div v-if="visibility.firstStep" class="d-flex py-5 flex-column">
      <button type="button" class="book-steps-buttons" @click="clear" style="right: 15px">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <p class="fs-3 m-0">{{ $t('selectAccommodationType') }}:</p>
      <div class="select-type d-flex justify-content-center mt-3 mb-0 mx-3 mx-sm-5 flex-wrap">
        <button type="button" v-for="(typeArray, key) in accommodationTypes" :key="key" class="btn btn-outline-camp rounded-5 m-2" :class="{ active: selectedAccommodationTypes.includes(String(key)), selected: selectedAccommodationTypes.includes(String(key)) }" @click="accommodationTypesArray(String(key))">
          <i :class="typeArray[0].icon" class="me-2"></i>
          {{ getAccommodationName(String(key)) }}
        </button>
      </div>
      <button type="button" class="confirm-book btn-camp rounded-5" @click="promoCode ? bookStep(2) : bookStep(3)">{{ $t('confirm') }}</button>
      <span v-if="visibility.warning" class="validation-message">{{ getWarning(1) }}</span>
    </div>

    <div v-if="visibility.secondStep" class="d-flex py-5 flex-column">
      <button v-if="Object.keys(accommodationTypes).length !== 1" type="button" class="book-steps-buttons" @click="bookStep(1)" style="left: 15px">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <button type="button" class="book-steps-buttons" @click="clear" style="right: 15px">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <p class="fs-3 m-0">{{ $t('enterPromoCode') }}:</p>
      <div class="select-type d-flex justify-content-center mt-3 mb-0 mx-3 mx-sm-5 flex-wrap">
        <input v-model="enteredPromoCode" type="text" class="form-control w-50 m-2 rounded-5" id="floatingInput" :placeholder="$t('promoCode')" />
      </div>
      <button type="button" class="confirm-book btn-camp rounded-5" @click="bookStep(3)">{{ $t('confirm') }}</button>
    </div>

    <div v-if="visibility.thirdStep" class="d-flex py-5 flex-column">
      <button v-if="Object.keys(accommodationTypes).length !== 1 || promoCode" type="button" class="book-steps-buttons" @click="promoCode ? bookStep(2) : bookStep(1)" style="left: 15px">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <button type="button" class="book-steps-buttons" @click="clear" style="right: 15px">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <p class="fs-3 m-0">{{ $t('selectGuestNumber') }}:</p>
      <div class="select-guests d-flex mt-3 mb-0 mx-3 flex-column">
        <div>
          <div class="guest-number"><i class="fa-solid fa-user-group me-2"></i> {{ $t('adults') }}</div>
          <div class="input-container">
            <InputNumber v-model="adultsValue" :invalid="adultsValue === null" showButtons buttonLayout="horizontal" :min="0" :max="99">
              <template #incrementbuttonicon>
                <i class="fa-solid fa-plus"></i>
              </template>
              <template #decrementbuttonicon>
                <i class="fa-solid fa-minus"></i>
              </template>
            </InputNumber>
          </div>
        </div>
        <div>
          <div class="guest-number"><i class="fa-solid fa-children me-2"></i> {{ $t('children') }}</div>
          <div class="input-container">
            <InputNumber v-model="childrenValue" @update:modelValue="updateChildrenAges" showButtons buttonLayout="horizontal" :min="0" :max="99">
              <template #incrementbuttonicon>
                <i class="fa-solid fa-plus"></i>
              </template>
              <template #decrementbuttonicon>
                <i class="fa-solid fa-minus"></i>
              </template>
            </InputNumber>
          </div>
        </div>
        <div v-for="(age, index) in childrenAges" :key="index" style="justify-content: space-around">
          <div class="guest-number">{{ $t('ageChild') }} {{ index + 1 }}</div>
          <div class="input-container">
            <InputNumber v-model="childrenAges[index]" showButtons buttonLayout="horizontal" :min="0" :max="17">
              <template #incrementbuttonicon>
                <i class="fa-solid fa-plus"></i>
              </template>
              <template #decrementbuttonicon>
                <i class="fa-solid fa-minus"></i>
              </template>
            </InputNumber>
          </div>
        </div>
      </div>
      <button type="button" class="confirm-book btn-camp rounded-5" @click="bookStep(4)">{{ $t('confirm') }}</button>
      <span v-if="visibility.warning" class="validation-message">{{ getWarning(3) }}</span>
    </div>

    <div v-if="visibility.fourthStep" class="d-flex py-5 flex-column">
      <button type="button" class="book-steps-buttons" @click="bookStep(3)" style="left: 15px">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <button type="button" class="book-steps-buttons" @click="clear" style="right: 15px">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <p class="fs-3 m-0">{{ $t('selectDates') }}:</p>
      <DatePicker id="datePicker" @date-select="selectDate" @clear-click="clearCalendar" v-model="dates" selectionMode="range" hideOnRangeSelection :numberOfMonths="numberOfMonths" :minDate="minDate" :maxDate="maxDate" :disabledDates="blockedDates" dateFormat="dd.mm.yy" showButtonBar :manualInput="false" :selectOtherMonths="true" showIcon fluid iconDisplay="input" />
      <div v-if="specialConditions.length > 1" class="special-conditions">
        <button v-for="condition in specialConditions" :key="condition" @click="selectCondition(condition)" class="btn btn-outline-camp rounded-5" :class="{ active: selectedCondition === condition }">
          {{ getCondition(condition) }}
        </button>
      </div>
      <button type="button" class="confirm-book btn-camp rounded-5" @click="bookStep(5)" style="margin-top: 35px">{{ $t('seeAvailability') }}</button>
      <span v-if="visibility.warning" class="validation-message">{{ getWarning(4) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import ProgressBar from 'primevue/progressbar'
import { useStoreAvailability } from '@/stores/storeAvailability'
import { useStoreSettings } from '@/stores/storeSettings'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { $t } from '@/stores/storeTranslations'
import { Manager as AvailabilityManager } from '@/mechanics/availabilityMechanic'
import { Manager as OccupancyOptimizationManager } from '@/mechanics/occupancyOptimizationMechanic'
import { useStoreLegend } from '@/stores/storeLegend'
import { useStoreSelectedFeatures } from '@/stores/storeSelectedFeatures'

@Component({
  methods: { $t },
  components: {
    InputNumber,
    DatePicker,
    Dialog,
    Divider,
    ProgressBar,
    Loading: LoadingComponent
  }
})
export default class BookNowComponent extends Vue {
  $t = $t
  LegendStore = useStoreLegend()
  AvailabilityStore = useStoreAvailability()
  private StoreSettings = useStoreSettings()
  allInfoShown = true
  showLoader = false

  private AvailabilityMechanic = this.StoreSettings.occupancyOptimization ? new OccupancyOptimizationManager.Mechanic.OccupancyOptimizationMechanic() : new AvailabilityManager.Mechanic.AvailabilityMechanic()

  visibility = {
    bookSelect: false,
    firstStep: false,
    secondStep: false,
    thirdStep: false,
    fourthStep: false,
    warning: false
  }

  confirmedSteps = {
    first: false,
    second: false,
    third: false,
    fourth: false
  }

  progress = 0
  accommodationSet = false
  conditionsSet = false

  adultsValue: null | number = 2
  childrenValue = 0
  childrenAges: number[] = []

  bookingPeriods: [] = []

  dates: Date[] = []
  confirmedDates: Date[] | null = null
  maxDate = new Date()
  numberOfMonths = 2
  blockedDates = []
  foundPeriods = []

  accommodationTypes: {
    [key: string]: {
      icon: string | null
    }[]
  } = {}

  accommodationData: {
    pitch: {
      icon: string | null
    }[]
    mobileHomeGlamping: {
      icon: string | null
    }[]
    apartment: {
      icon: string | null
    }[]
  } = {
    pitch: [
      {
        icon: 'fa-solid camp-pitch'
      }
    ],
    mobileHomeGlamping: [
      {
        icon: 'fa-solid fa-house'
      }
    ],
    apartment: [
      {
        icon: 'fa-solid fa-building'
      }
    ]
  }

  promoCode: boolean | undefined
  enteredPromoCode = ''

  accommodationStore: string[] | undefined

  get minDate(): Date {
    const today = new Date()
    const daysToAdd = Number(useStoreSettings().oldMapParameters.prviDanZaRez) || 0
    return new Date(today.setDate(today.getDate() + daysToAdd))
  }

  get isMobile() {
    return window.innerWidth <= 1010
  }

  get allInfo() {
    return !this.LegendStore.availabilityAdded || !this.isMobile || this.allInfoShown
  }

  get hideOnLegend() {
    return !this.LegendStore.displayLegend || window.innerWidth > 768
  }

  toggleAllInfo(custom = null) {
    if (custom !== undefined && custom !== null) {
      this.allInfoShown = custom
      return
    }
    this.allInfoShown = !this.allInfoShown
  }

  setAccommodationTypes() {
    this.accommodationStore = this.StoreSettings.accommodationTypes
    for (const accommodationType in this.accommodationStore) {
      const type = this.accommodationStore[accommodationType]
      this.accommodationTypes[type] = this.accommodationData[type as keyof typeof this.accommodationData]
    }
  }

  getAccommodationName(accommodationType: string) {
    if (accommodationType === 'pitch') return $t('Pitch')
    if (accommodationType === 'mobileHomeGlamping') return $t('mhGlamping')
    return $t('Apartment')
  }

  specialConditions: string[] = []
  selectedCondition: string | null = null

  setSpecialConditions() {
    this.specialConditions.push('exactDates')
    this.selectedCondition = 'exactDates' // By default

    const conditionStore = this.StoreSettings.specialConditions

    for (const specialCondition in conditionStore) {
      this.specialConditions.push(conditionStore[specialCondition])
    }
  }

  getCondition(condition: string) {
    if (condition === 'exactDates') return $t('exactDates')
    if (condition === 'plus1day') return '± 1 ' + $t('day').toLowerCase()
    if (condition === 'plus2days') return '± 2 ' + $t('day_plural').toLowerCase()
    if (condition === 'plus3days') return '± 3 ' + $t('day_plural').toLowerCase()
    return '± 4 ' + $t('day_plural').toLowerCase()
  }

  confirmedCondition: string | null = null
  selectedAccommodationTypes: string[] = []
  confirmedAccommodationTypes: string[] = []

  mounted() {
    this.updateNumberOfMonths()
    window.addEventListener('resize', this.updateNumberOfMonths)
    this.fetchBookingPeriods()
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.updateNumberOfMonths)
  }

  fetchBookingPeriods() {
    const url = 'https://campsabout.com/mapAPI/revision/periodirez.php?id=' + useStoreSettings().propertyId + '&group=' + useStoreSettings().groupName

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.bookingPeriods = data
        this.AvailabilityStore.bookingPeriods = data
      })
      .catch((error) => {
        console.error('Error fetching the data:', error)
      })
  }

  updateNumberOfMonths() {
    if (window.innerWidth < 640) {
      this.numberOfMonths = 1
    } else {
      this.numberOfMonths = 2
    }
  }

  getDatesBetween(period: any) {
    const { dateFrom, dateTo } = period
    const days = ['nedD', 'ponD', 'utoD', 'sriD', 'cetD', 'petD', 'subD']

    const startDate = new Date(dateFrom)
    const endDate = new Date(dateTo)

    const dates = []

    if (endDate < startDate) {
      throw new Error('End date must be greater than or equal to start date.')
    }

    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split('T')[0]

      const dayIndex = currentDate.getDay()

      if (period[days[dayIndex]] === '0') {
        dates.push(new Date(formattedDate))
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }

  clearCalendar() {
    this.dates = []
    this.blockedDates = []
    for (let period of this.foundPeriods) {
      this.blockedDates = this.blockedDates.concat(this.getDatesBetween(period))
    }
    this.setMaxDateReset()
    this.$nextTick(() => {
      this.simulateDatePickerClick()
    })
  }

  getDatesBetweenAfterSelect() {
    this.blockedDates = []

    console.log('this.foundPeriods: ', this.foundPeriods)

    for (let period of this.foundPeriods) {
      const { dateFrom, dateTo } = period
      const days = ['nedO', 'ponO', 'utoO', 'sriO', 'cetO', 'petO', 'subO']

      const startDate = new Date(dateFrom)
      const endDate = new Date(dateTo)

      if (endDate < startDate) {
        throw new Error('End date must be greater than or equal to start date.')
      }

      let currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        const dayIndex = currentDate.getDay()
        const formattedDate = currentDate.toISOString().split('T')[0]

        let firstDatePlusMinNights = new Date(this.dates![0])
        firstDatePlusMinNights.setDate(firstDatePlusMinNights.getDate() + Number(period.minDays) - 1)

        if (currentDate <= firstDatePlusMinNights) {
          this.blockedDates.push(new Date(formattedDate))
        }

        if (period[days[dayIndex]] === '0') {
          this.blockedDates.push(new Date(formattedDate))
        }

        currentDate.setDate(currentDate.getDate() + 1)
      }
    }

    return this.blockedDates
  }

  accommodationTypesArray(type: string) {
    if (!this.selectedAccommodationTypes.includes(type)) {
      this.selectedAccommodationTypes = [type]
    }
  }

  findBookingPeriods() {
    const thisType = this.confirmedAccommodationTypes[0] === 'pitch' ? 'P' : 'M'

    this.foundPeriods = this.bookingPeriods.filter((period: string) => period.tip === thisType)
    this.setMaxDateReset()

    this.blockedDates = []

    for (let period of this.foundPeriods) {
      this.blockedDates = this.blockedDates.concat(this.getDatesBetween(period))
    }
  }

  getMaxBookableDate() {
    let maxBookableDate = this.foundPeriods.sort()[0]
    for (let period of this.foundPeriods.sort()) {
      if (new Date(period.dateTo).getTime() > new Date(maxBookableDate.dateTo).getTime()) {
        maxBookableDate = period
      }
    }
    return maxBookableDate
  }

  setMaxDateReset() {
    let biggestPeriod = this.getMaxBookableDate()

    let biggestPeriodDatumDo = new Date(biggestPeriod.dateTo)
    this.maxDate = new Date(biggestPeriodDatumDo.setDate(biggestPeriodDatumDo.getDate() - Number(biggestPeriod.minDays)))
  }

  setMaxDate() {
    let biggestPeriod = this.getMaxBookableDate()

    let biggestPeriodDatumDo = new Date(biggestPeriod.dateTo)

    this.maxDate = new Date(biggestPeriodDatumDo.setDate(biggestPeriodDatumDo.getDate()))
  }

  setBlockedDatesAfterSelectStartDate() {
    this.blockedDates = this.blockedDates.concat(this.getDatesBetweenAfterSelect())
  }

  selectDate() {
    this.dates.forEach((date) => {
      if (date) date.setHours(12, 0, 0, 0)
    })
    if (!this.dates[1]) {
      this.setBlockedDatesAfterSelectStartDate()
      this.setMaxDate()
    }
  }

  getWarning(step: number) {
    if (step === 1) return $t('accommodationWarning')
    if (step === 2) return $t('accommodationWarning')
    if (step === 3) return $t('adultWarning')
    if (step === 4) return $t('dateRangeWarning')
    return null
  }

  simulateDatePickerClick() {
    const datePickerInput = document.querySelector('#datePicker input') as HTMLInputElement

    if (datePickerInput) {
      datePickerInput.click()
    }
  }

  bookStep(step: number) {
    this.visibility.bookSelect = true

    if (!this.accommodationSet) {
      this.setAccommodationTypes()
      this.accommodationSet = true
      if (Object.keys(this.accommodationTypes).length === 1) {
        if (this.accommodationStore) {
          this.accommodationTypesArray(this.accommodationStore[0])
        }
      }
    }

    if (!this.conditionsSet) {
      this.setSpecialConditions()
      this.conditionsSet = true
    }

    this.promoCode = this.StoreSettings.promoCode

    if (step === 1) {
      this.confirmedSteps.first = false

      this.confirmedAccommodationTypes = []

      this.progress = this.getProgress(step)

      this.visibility.firstStep = true
      this.visibility.secondStep = false
      this.visibility.thirdStep = false
    }

    if (step === 2) {
      this.confirmedSteps.second = false

      if (this.selectedAccommodationTypes.length === 0) {
        this.confirmedSteps.first = false
        this.visibility.warning = true
        return
      }

      this.visibility.warning = false
      this.confirmedSteps.first = true

      this.confirmedAccommodationTypes = this.selectedAccommodationTypes

      this.progress = this.getProgress(step)

      this.visibility.firstStep = false
      this.visibility.secondStep = true
      this.visibility.thirdStep = false
    }

    if (step === 3) {
      this.confirmedSteps.third = false

      if (this.selectedAccommodationTypes.length === 0) {
        this.confirmedSteps.first = false
        this.visibility.warning = true
        return
      }

      this.visibility.warning = false
      this.confirmedSteps.first = true

      if (this.promoCode) {
        this.confirmedSteps.second = true
      }

      this.confirmedAccommodationTypes = this.selectedAccommodationTypes
      this.findBookingPeriods()

      this.progress = this.getProgress(step)

      this.visibility.firstStep = false
      this.visibility.secondStep = false
      this.visibility.thirdStep = true
      this.visibility.fourthStep = false
    }

    if (step === 4) {
      this.confirmedSteps.fourth = false

      if (this.adultsValue === 0) {
        this.confirmedSteps.third = false
        this.visibility.warning = true
        return
      }

      this.confirmedSteps.third = true
      this.visibility.warning = false

      this.progress = this.getProgress(step)

      this.visibility.thirdStep = false
      this.visibility.fourthStep = true

      if (this.specialConditions.length <= 1 && this.dates.length < 2) {
        this.$nextTick(() => {
          this.simulateDatePickerClick()
        })
      }
    }

    if (step === 5) {
      console.log('this.dates[1]: ', this.dates[1])
      if (!this.dates[1]) {
        this.visibility.warning = true
        return
      }

      this.confirmedSteps.fourth = true
      this.visibility.warning = false

      this.progress = this.getProgress(step)

      this.visibility.bookSelect = false
      this.visibility.fourthStep = false

      this.showAvailability()
    }
  }

  getProgress(step: number) {
    const accommodationCount = Object.keys(this.accommodationTypes).length
    const hasPromoCode = !!this.promoCode

    // Determine the total number of steps
    const totalSteps = accommodationCount === 1 ? (hasPromoCode ? 3 : 2) : hasPromoCode ? 4 : 3

    // Adjust step based on accommodation count and promo code
    let adjustedStep = step - 1

    if (accommodationCount === 1) {
      adjustedStep -= hasPromoCode ? 1 : 2
    } else if (!hasPromoCode && step > 1) {
      adjustedStep -= 1
    }

    // Calculate and return the progress percentage
    return (100 / totalSteps) * adjustedStep
  }

  updateChildrenAges() {
    if (this.childrenValue > this.childrenAges.length) {
      for (let i = this.childrenAges.length; i < this.childrenValue; i++) {
        this.childrenAges.push(0)
      }
    } else if (this.childrenValue < this.childrenAges.length) {
      this.childrenAges.splice(this.childrenValue)
    }
  }

  selectCondition(condition: string) {
    if (this.selectedCondition !== condition) {
      this.selectedCondition = condition
    }
  }

  get selectedAccommodationsDisplay() {
    if (this.confirmedSteps.first) {
      const newAccommodationArray: string[] = []
      this.confirmedAccommodationTypes.forEach((type) => {
        newAccommodationArray.push(this.getAccommodationName(type))
      })

      return newAccommodationArray.join(', ')
    }
    return null
  }

  get childrenAgesDisplay() {
    return this.childrenAges.length ? '(' + $t('ages').toLowerCase() + ': ' + `${this.childrenAges.join(', ')}` + ')' : ''
  }

  get formattedDates() {
    if (this.dates.length > 1) {
      if (window.innerWidth <= 768) {
        return `${this.formatDate(this.dates[0], true)} - ${this.formatDate(this.dates[1])}`
      }
      return `${this.formatDate(this.dates[0])} - ${this.formatDate(this.dates[1])}`
    }
    return ''
  }

  formatDate(date: Date, noYear = false) {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    let year = ''
    if (!noYear) {
      year = date.getFullYear()
    }
    return `${day}.${month}.${year}`
  }

  get numberOfNights() {
    if (!this.dates.length) {
      return 0
    }
    const start = new Date(this.dates[0])
    const end = new Date(this.dates[1])

    // Calculate the difference in milliseconds
    const diffInMilliseconds = Math.abs(end.getTime() - start.getTime())

    // Convert milliseconds to days
    const millisecondsPerDay = 1000 * 60 * 60 * 24
    const daysDifference = Math.floor((diffInMilliseconds + 10000) / millisecondsPerDay) // +10sec because I am afraid of leap seconds and that nonsence

    return daysDifference
  }

  async showAvailability() {
    if (this.dates.length > 1) {
      this.AvailabilityStore.startDate = this.formatDate(this.dates[0])
      this.AvailabilityStore.endDate = this.formatDate(this.dates[1])
    }
    this.AvailabilityStore.numberOfNights = this.numberOfNights
    this.AvailabilityStore.childrenAges = this.childrenAges
    this.AvailabilityStore.adultsValue = this.adultsValue
    this.AvailabilityStore.numberOfGuests = this.adultsValue + this.childrenAges.length
    this.AvailabilityStore.pitchOrMobile = this.selectedAccommodationTypes[0] === 'pitch' ? 'P' : 'M'

    this.showLoader = true
    await this.AvailabilityMechanic.showAvailability()
    this.showLoader = false
    if (this.isMobile) {
      useStoreLegend().toggleDisableLegend(false)
      this.allInfoShown = false
    }
  }

  clear() {
    useStoreSelectedFeatures().removeAllTooltips()
    if (window.innerWidth <= 768) {
      useStoreLegend().toggleDisableLegend(false)
    }

    this.AvailabilityMechanic.clear()
    this.showLoader = false

    this.visibility.bookSelect = false
    this.visibility.firstStep = false
    this.visibility.secondStep = false
    this.visibility.thirdStep = false
    this.visibility.fourthStep = false
    this.confirmedSteps.first = false
    this.confirmedSteps.second = false
    this.confirmedSteps.third = false
    this.confirmedSteps.fourth = false
    this.progress = 0
    this.visibility.warning = false
  }
}
</script>

<style>
.loader {
  margin-right: 10px;
  margin-top: -10px;
  float: inline-end;
}

.clear-button {
  right: 0px;
  top: 0px;
  margin: 15px;
  height: 35px;
  width: 35px !important;
  border-radius: 50% !important;
}

.selected-parameters {
  border-radius: var(--bs-border-radius-xxl) !important;
  pointer-events: auto;
  width: 450px;
  box-shadow: 0 0px 10px rgb(0 0 0 / 30%);
  /* font-size: clamp(0.75rem, 0.6645rem + 0.3647vw, 10rem); */
  font-size: 14px;
}

.progress-bar {
  border-radius: var(--bs-border-radius-xxl) !important;
  pointer-events: auto;
  width: auto;
  box-shadow: 0 0px 10px rgb(0 0 0 / 30%);
  background: white !important;
}

.p-progressbar-value {
  background: #56ba59 !important;
}

.book-select {
  z-index: 8;
  pointer-events: auto;
  box-shadow: 0 0px 10px rgb(0 0 0 / 30%);
}

.book-select p {
  color: #56ba59;
  padding: 0 30px;
  text-align: center;
}

.select-type > div {
  padding: 10px 20px;
  margin: 10px;
  font-weight: 600;
  transition: 0.3s ease;
}

.confirm-book {
  display: inline-flex;
  padding: 5px 15px;
  margin: 0 20px;
  margin-top: 20px;
  font-weight: 700;
  font-size: 20px;
  cursor: pointer;
  justify-content: center;
}

.book-steps-buttons {
  position: absolute;
  top: 15px;
  cursor: pointer;
  background-color: white;
  border: none;
  font-size: 26px;
  color: #56ba59;
}

.validation-message {
  display: flex;
  color: red;
  flex-direction: row;
  justify-content: center;
  font-size: 12px;
  margin-top: 10px;
}

.select-guests {
  max-height: 35vh;
  overflow-y: auto;
}

.select-guests > div {
  padding: 0 10px;
  margin: 5px 5px;
  transition: 0.3s ease all;
  display: flex;
  justify-content: space-between;
}

.guest-number {
  color: #56ba59;
  padding: 10px 20px;
  margin: 10px 0px;
  font-size: 18px;
  font-weight: 600;
  transition: 0.3s ease all;
  display: flex;
  align-items: center;
}

.input-container {
  display: flex;
  align-items: center;
  --p-inputnumber-button-border-radius: 2rem !important;
}

.p-inputnumber-horizontal .p-inputnumber-input {
  cursor: default;
  width: 45px;
  text-align: center;
  background: #56ba59;
  color: white;
  font-size: 17px;
}

.p-inputnumber-horizontal .p-inputnumber-increment-button,
.p-inputnumber-horizontal .p-inputnumber-decrement-button {
  width: 30px;
}

.special-conditions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
  max-width: 400px;
}

.special-conditions button {
  padding: 5px 15px;
  margin: 5px;
  font-weight: 700;
  transition: 0.3s ease;
}

.p-icon {
  vertical-align: top !important;
}

.p-inputnumber {
  display: inline-flex;
  justify-content: flex-end;
}

.p-datepicker {
  margin: 20px 10px 0 10px;
}

.p-datepicker-input {
  text-align: center;
  font-size: 17px !important;
  cursor: pointer;
  --p-inputtext-border-radius: 2rem !important;
}

.p-datepicker-day-selected {
  background: #56ba59 !important;
  color: white !important;
}

.p-disabled[data-p-selected='true'][tabindex='0'] {
  background: #56ba59 !important;
  color: white !important;
  opacity: 1;
}

.p-datepicker-day:not(.p-datepicker-day-selected):not(.p-disabled):hover {
  background: #56ba59 !important;
  color: white !important;
}

.p-datepicker-day-selected-range {
  background: #d1f5eb !important;
  color: black !important;
}

.p-disabled[data-p-selected='true'] {
  background: #d1f5eb !important;
  color: black !important;
  opacity: 1;
}

.p-datepicker-panel {
  z-index: 10000 !important;
  margin-left: auto;
  margin-right: auto;
  left: 0 !important;
  right: 0;
  width: 610px !important;
  margin-top: 10px !important;
}

.p-overlay-mask {
  backdrop-filter: blur(1px);
}

@media (max-width: 620px) {
  .book-select {
    width: auto;
  }
}

@media (max-width: 576px) {
  .progress-bar {
    border-top-left-radius: var(--bs-border-radius-xl) !important;
    border-top-right-radius: var(--bs-border-radius-xl) !important;
    border-bottom-right-radius: var(--bs-border-radius-xl) !important;
    border-bottom-left-radius: var(--bs-border-radius-xl) !important;
    pointer-events: auto;
    box-shadow: none;
    background: white !important;
    --p-progressbar-height: 10px;
    --bs-border-radius-xxl: 0px;
  }
  .loader {
    margin-right: 17px;
    margin-top: -40px;
    float: inline-end;
  }

  .selected-parameters {
    width: auto;
    margin-left: 15px !important;
    margin-right: 15px !important;
    border-top-left-radius: var(--bs-border-radius-xl) !important;
    border-top-right-radius: var(--bs-border-radius-xl) !important;
    border-bottom-right-radius: var(--bs-border-radius-xl) !important;
    border-bottom-left-radius: var(--bs-border-radius-xl) !important;
    box-shadow:
      inset 0px 10px 10px -10px rgb(0 0 0 / 30%),
      inset 0px -10px 10px -100px rgb(0 0 0 / 30%);
    font-size: 12px;
  }
}

@media (max-width: 640px) {
  .p-datepicker-panel {
    width: auto !important;
    margin: 10px !important;
  }
}
</style>
