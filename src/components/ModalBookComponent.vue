<template>
  <Loading v-model:active="showLoader" class="loader" />
  <div v-if="showInquiryOnly" class="booking-card d-flex flex-fill pb-2 pb-sm-1 justify-content-evenly">
    <div class="d-flex flex-column align-items-center" data-bs-toggle="tooltip" data-bs-placement="top" :data-bs-title="$t('Send query info') + '.'">
      <div class="date-info text-center">
        <small class="text-center"
          ><b>{{ dateRange }}</b></small
        >
      </div>
      <button class="btn btn-sm btn-secondary mx-4 text-uppercase" type="button" @click="sendQuery">{{ $t('SendQuery') }}</button>
    </div>
  </div>
  <div v-else-if="showBooking && price && label !== 'Date Range'" class="booking-card d-flex flex-fill pb-2 pb-sm-1 justify-content-evenly">
    <div v-if="price" class="d-flex flex-column align-content-center justify-content-center me-2">
      <!-- Add "justify-content-center" for vertical centering -->
      <small class="fs-7">{{ $t('FROM') }}</small>
      <div class="price-info">
        <span>€</span>
        <span class="price-number">{{ price }}</span>
      </div>
    </div>
    <div class="d-flex flex-column">
      <div class="date-info text-center">
        <small
          ><b>{{ label }}</b></small
        >
      </div>
      <button class="btn btn-sm btn-secondary" type="button" @click="showPrices">{{ $t(buttonText) }}</button>
    </div>
  </div>
  <div v-else-if="showBooking && storeSettings.showUnavailableAcc && label !== 'Date Range'" class="booking-card d-flex flex-fill pb-2 pb-sm-1 justify-content-evenly align-items-center">
    <div class="d-flex flex-column align-items-center" data-bs-toggle="tooltip" data-bs-placement="top" :data-bs-title="$t('Accommodation for selected date is unavailable') + '.'">
      <div class="date-info text-center">
        <small class="text-center"
          ><b>{{ label }}</b></small
        >
      </div>
      <button class="btn btn-sm btn-secondary mx-4 text-uppercase disabled" type="button" @click="showPrices">{{ $t('unavailable') }}</button>
      <!--div class="date-info text-center mx-1">
        <small class="text-danger-emphasis">{{  }}</small>
      </div-->
    </div>
  </div>

  <div class="container d-flex justify-content-end position-fixed top-0 end-0 p-3 toast-container" data-bs-autohide="true">
    <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" style="width: fit-content">
      <div id="toastMessage" class="toast-body"></div>
    </div>
  </div>

  <div class="modal fade" id="modalUpitForma">
    <!-- iframe za inquiry formu -->
    <div class="modal-dialog upitforma">
      <div class="modal-content bmd-modalContent">
        <div class="modal-body">
          <div class="bmd-close-button">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          </div>
          <div class="embed-responsive embed-responsive-16by9">
            <iframe id="iframePanom" class="embed-responsive-item" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      </div>
      <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
  </div>
  <!-- /.modal -->
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum } from '@cybertale/interface'
import { useStoreAvailability } from '@/stores/storeAvailability'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useStoreToast } from '@/stores/storeToast'
import { useStoreColors } from '@/stores/storeColors'
import { $t, useStoreTranslations } from '@/stores/storeTranslations'
import { useStoreSettings } from '@/stores/storeSettings'
import { useStoreApiFeatures } from '@/stores/storeApiFeatures'
import { Modal } from 'bootstrap'

//TODO Josip preimenuj u ShowPricesComponent ili nešto slično - može kasnije

interface LabelData {
  styleData: string
  iconClass: string
  title: string
  markValue: string
  markClass: string
  contentValue: string
  contentClass: string
}
@Component({
  methods: { $t },
  components: {
    Loading: LoadingComponent
  }
})
export default class ModalBookComponent extends Vue {
  @Prop() object!: ObjectTemplate

  private AvailabilityStore = useStoreAvailability()
  private ToastStore = useStoreToast()
  private ColorsStore = useStoreColors()
  private TranslationsStore = useStoreTranslations()
  private FeaturesStore = useStoreApiFeatures()
  storeSettings = useStoreSettings()

  showLoader = false
  showBooking = false
  showInquiryOnly = false

  buttonText = 'SHOW PRICES'

  $t = $t

  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum

  get showIcon(): boolean {
    return this.getStatData(StatTypeEnum.ElementType) === 'icon'
  }

  get price(): string | LabelData {
    return this.getValue(StatTypeEnum.Value, StatTypeEnum.ValueIndices)
  }

  get buttonClass(): string {
    return this.getValue(StatTypeEnum.Design) as string
  }

  get label(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.title
    }
    return this.getValue(StatTypeEnum.Label) as string
  }

  get iconClass(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.iconClass
    }
    return ''
  }

  get markValue(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.markValue
    }
    return ''
  }
  get markClass(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.markClass
    }
    return ''
  }

  get styleData(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.styleData
    }
    return ''
  }

  get contentValue(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.contentValue
    }
    return ''
  }

  get contentClass(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.contentClass
    }
    return ''
  }

  get dateRange(): string {
    if (this.AvailabilityStore.startDate && this.AvailabilityStore.endDate) return this.AvailabilityStore.startDate + ' - ' + this.AvailabilityStore.endDate
    return ''
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
    if (this.ColorsStore.COLOR_INQUIRY_ONLY == this.AvailabilityStore.featureColors[this.$route.params?.id]) this.showInquiryOnly = true
    if ([this.ColorsStore.COLOR_AVAILABLE, this.ColorsStore.COLOR_OCCUPIED, this.ColorsStore.COLOR_AVAILABLE_IN_OTHER_PERIODS].includes(this.AvailabilityStore.featureColors[this.$route.params?.id])) this.showBooking = true
    if (this.storeSettings.oldMapParameters?.changeButtonOnGreen === 'true' && this.ColorsStore.COLOR_AVAILABLE === this.AvailabilityStore.featureColors[this.$route.params?.id]) {
      this.buttonText = 'BOOK'
    } else {
      this.buttonText = 'SHOW PRICES'
    }
  }

  async showPrices() {
    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement
    const scrollItems = scrollContainer.querySelectorAll('.scroll-item') as NodeListOf<HTMLElement>
    const targetItem = scrollItems[scrollItems.length - 1] //TODO make it more dynamic

    if (targetItem) {
      const scrollLeft = targetItem.offsetLeft - scrollContainer.offsetLeft
      scrollContainer.scrollTo({
        left: scrollLeft
      })
    }
  }

  sendQuery() {
    const currentLanguage = this.TranslationsStore.currentLanguage
    const urlKey = 'contactForm' + currentLanguage.charAt(0).toLocaleUpperCase() + currentLanguage.charAt(1).toLocaleLowerCase()

    const link = this.storeSettings.oldMapParameters[urlKey] + '?space_code=' + this.FeaturesStore.features.find((feature) => feature.mapId == this.$route.params?.id)?.pmsNumber || '' + '&date_from=' + this.AvailabilityStore.startDate.replaceAll('.', '-') + '&date_to=' + this.AvailabilityStore.endDate.replaceAll('.', '-') + '#specimen'

    const modalUpitForma: any = document.getElementById('modalUpitForma')
    const iframe = modalUpitForma.querySelector('iframe')
    iframe.setAttribute('src', link)

    const modal = new Modal(modalUpitForma)
    modal.show()
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

  disableBooking(message: string, classes = '') {
    this.ToastStore.showToast(message, classes)
    this.showLoader = false
    this.showBooking = false
  }
}
</script>

<style scoped>
.loader {
  float: inline-end;
}

.booking-card {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  display: flex;
  align-items: center;
  background-color: #f5ecd7;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
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
}
</style>
