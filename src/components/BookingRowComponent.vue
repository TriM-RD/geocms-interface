<template>
  <div class="container">
    <div class="booking-row row align-items-center" :style="styleData">
      <div class="col-md-6 col-12 pt-1 pb-1">
        <h5 class="text-truncate">{{ title }}</h5>
        <div v-if="!!description" class="d-flex align-items-center">
          <p class="text-truncate mb-0">{{ description }}</p>
          <button type="button" class="bi bi-info-circle-fill btn btn-camp-outline-info border-0"
            data-bs-toggle="tooltip" data-bs-placement="top" :title="description" style="float: right"></button>
        </div>
      </div>
      <div class="col-md-2 col-6 price-info">
        <span>{{ price }}</span>
        <span>€</span>
      </div>
      <div class="col-md-4 col-6 d-flex justify-content-center">
        <Loading v-if="showLoader" v-model:active="showLoader" class="bookingRowLoader" />
        <button v-else class="btn btn-sm btn-camp rounded-3 fs-7 mb-2 mb-sm-0" type="button" @click="handleBooking">
          {{ t("BOOK") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum } from '@cybertale/interface'
import { useStoreMessageBox } from '@/stores/storeMessageBox'
import { useStoreAvailability } from '@/stores/storeAvailability'
import { useStoreApiFeatures } from '@/stores/storeApiFeatures'
import { useStoreSettings } from '@/stores/storeSettings'
import { useStoreUnitTypes } from '@/stores/storeUnitTypes'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useStoreToast } from '@/stores/storeToast'
import { useStoreColors } from '@/stores/storeColors'
import { Manager as AvailabilityManager } from '@/mechanics/availabilityMechanic'
import { Manager as IntegrationApiManager } from '@/mechanics/integrationApiMechanic'
import { $t, useStoreTranslations } from '@/stores/storeTranslations'
import { DayPeriod } from '@/model/DayPeriod'

interface LabelData {
  styleData: string
  rate: any
  period: any
}
@Component({
  components: {
    Loading: LoadingComponent
  }
})
export default class LabelComponent extends Vue {
  @Prop() object!: ObjectTemplate

  private MessageBoxStore = useStoreMessageBox()
  private AvailabilityStore = useStoreAvailability()
  private FeaturesStore = useStoreApiFeatures()
  private ToastStore = useStoreToast()
  private ColorsStore = useStoreColors()
  private SettingsStore = useStoreSettings()
  private TranslationsStore = useStoreTranslations()
  private UnitTypeStore = useStoreUnitTypes()

  private showLoader = false

  private AvailabilityMechanic = new AvailabilityManager.Mechanic.AvailabilityMechanic()
  private IntegrationApiMechanic = new IntegrationApiManager.Mechanic.IntegrationApiMechanic()

  t = $t

  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum

  get title(): string {
    const value = this.getValue(StatTypeEnum.Label) as LabelData
    return value.rate.name
  }

  get description(): string {
    const value = this.getValue(StatTypeEnum.Label) as LabelData
    return value.rate.description || ''
  }

  get styleData(): string {
    const value = this.getValue(StatTypeEnum.Label) as LabelData
    return value.styleData || ''
  }

  get price(): string {
    const value = this.getValue(StatTypeEnum.Label) as LabelData
    return String(value.rate.price) || ' - '
  }

  get rateId(): string {
    const value = this.getValue(StatTypeEnum.Label) as LabelData
    return value.rate.rateId || ''
  }

  get period(): DayPeriod {
    const value = this.getValue(StatTypeEnum.Label) as LabelData
    return new DayPeriod(new Date(value.period.from), new Date(value.period.to))
  }

  getValue(statEnum: StatTypeEnum, indexStatTypeEnum = StatTypeEnum.Option): string | LabelData {
    const tempData: string = this.getStatData(statEnum) as string
    if (!tempData) return ''

    if (this.statIsDefined(indexStatTypeEnum) && this.isJSON(tempData)) {
      const data = JSON.parse(tempData)
      const optionData = this.getStatData(indexStatTypeEnum) as string
      if (this.isJSON(optionData)) {
        const parsedOptionData = JSON.parse(optionData)[Number(this.object.Stats[StatTypeEnum.OptionIndices].Data)]
        return data[Number(parsedOptionData)] || ''
      }
      return data[Number(this.getStatData(indexStatTypeEnum))] || ''
    }

    return tempData
  }

  getStatData(statType: StatTypeEnum, returnType: 'boolean' | 'string' = 'string'): boolean | string {
    try {
      const data = this.object.Stats[statType]?.Data ?? ''
      return returnType === 'boolean' ? !!data : data
    } catch (error) {
      console.error(`Error accessing data for statType ${statType}:`, error)
      return returnType === 'boolean' ? false : ''
    }
  }

  statIsDefined(statType: StatTypeEnum): boolean {
    return !!this.object.Stats[statType]
  }

  specialCase(): boolean {
    return this.getValue(this.statTypeEnum.ElementType) === 'hidden'
  }

  isJSON(str: string): boolean {
    let temp = null
    try {
      temp = JSON.parse(str)
    } catch (e) {
      return false
    }
    return Array.isArray(temp)
  }

  tooltipCase(): string | undefined {
    if (this.object !== undefined) {
      if (this.object.Stats[this.statTypeEnum.Tooltip] !== undefined) {
        return this.object.Stats[this.statTypeEnum.Tooltip].Data
      }
    }
  }

  mounted() {
    if ([this.ColorsStore.COLOR_AVAILABLE, this.ColorsStore.COLOR_INQUIRY_ONLY].includes(this.AvailabilityStore.featureColors[this.$route.params?.id])) this.showBooking = true
  }

  async handleBooking() {
    this.showLoader = true
    if (this.AvailabilityStore.lastTentativeReservationId) {
      await this.IntegrationApiMechanic.cancelTentativeReservation(this.AvailabilityStore.lastTentativeReservationId)
      this.AvailabilityStore.lastTentativeReservationId = null
    }

    const notAvailableMessage = $t('Smjestaj ipak nije dostupan')
    const noInternetMessage = $t('No booking service')

    if (!this.$route.params?.id) return this.showErrorAlert(noInternetMessage, 'text-bg-warning border-0')
    if (typeof this.FeaturesStore.features?.find != 'function') return this.showErrorAlert(noInternetMessage, 'text-bg-warning border-0')
    const feature: any = this.FeaturesStore.features?.find((f) => f.mapId == this.$route.params?.id)

    const childrenAges = this.AvailabilityStore.childrenAges.reduce((acc: any, age: any, index: any) => {
      acc[`child${index + 1}`] = age
      return acc
    }, {})

    const [phobsBookUrl, unitStatuses] = await Promise.all([
      this.IntegrationApiMechanic.getBookUrl(this.SettingsStore.propertyId, this.SettingsStore.groupName, feature.pmsNumber, DayPeriod.dateToPhobsFormat(this.period.getFrom()), this.period.getDuration(), this.AvailabilityStore.adultsValue, childrenAges, this.rateId, '', this.TranslationsStore.currentLanguage),
      this.IntegrationApiMechanic.fetchUnitStatuses(DayPeriod.dateToMishFormat(this.period.getFrom()), DayPeriod.dateToMishFormat(this.period.getTo()), this.SettingsStore.oldMapSettings.propertyId)
    ])
    if (!phobsBookUrl || !unitStatuses?.units || !unitStatuses.units.find((u) => u.unit_code == feature.pmsNumber)) return this.showErrorAlert(notAvailableMessage, 'text-bg-warning border-0')

    const unitId = this.AvailabilityStore.unitStatuses[feature.pmsNumber]?.unit_id
    if (!unitId) return this.showErrorAlert(notAvailableMessage), 'text-bg-warning border-0'

    this.MessageBoxStore.setData({
      message: $t('Booking message 20min'),
      onAccept: async () => {
        this.AvailabilityStore.lastTentativeReservationId = await this.IntegrationApiMechanic.postTentativeReservation(unitId)

        let bookingData: any = { external_booking_id: this.AvailabilityStore.lastTentativeReservationId }
        if (this.UnitTypeStore.data[feature.labelMish]?.bookTocnogBroja) bookingData.lot_number = feature?.gpsNumber || feature?.pmsNumber //TODO promijeniti kad sredimo novi backend

        this.AvailabilityMechanic.refreshAvailabilityData()
        this.postPhobs(phobsBookUrl, bookingData)

        await new Promise<void>((resolve, reject) => {
          setTimeout(resolve, 1000)
        })

        this.showLoader = false
      },
      showCancelButton: true
    })
    this.$router.push({ name: 'dialog' })
  }

  postPhobs(phobsBookUrl: string, data: any, method = 'post') {
    const form = document.createElement('form')
    form.method = method
    form.action = phobsBookUrl
    form.target = '_blank'

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input')
        hiddenField.type = 'hidden'
        hiddenField.name = key
        hiddenField.value = data[key]

        form.appendChild(hiddenField)
      }
    }

    document.body.appendChild(form)
    form.submit()
  }

  showErrorAlert(message: string, classes = '') {
    this.AvailabilityMechanic.refreshAvailabilityData()
    this.ToastStore.showToast(message, classes)
    this.showLoader = false
    this.$router.push({ name: 'map' })
  }
}
</script>

<style scoped>
.booking-row {
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fefefe;
  border-radius: 8px;
}

.bookingRowLoader {
  height: 100% !important;
}

.booking-card {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
}

.booking-card .align-content-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* Center vertically */
  text-align: center;
  /* Center horizontally */
}

.price-info {
  font-weight: bold;
  text-wrap: nowrap;
}

.btn-book {
  background-color: #6c757d;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  transition: background-color 0.3s;
}

.btn-book:hover {
  background-color: #5a6268;
}

.date-info {
  font-size: 0.9rem;
  color: #6c757d;
  margin-left: auto;
}
</style>
