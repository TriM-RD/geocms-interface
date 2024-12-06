<template>
  <Loading v-model:active="renderComponent" />
  <div v-if="!renderComponent" class="d-flex flex-column flex-grow-1 overflow-hidden rounded-bottom-3">
    <div class="row mt-1">
      <div class="col text-center">
        <div class="btn-group d-flex" role="group" aria-label="Unit Information">
          <button
            v-for="(header, index) in headers"
            :key="index"
            type="button"
            class="fs-7 btn btn-outline-camp btn-sm flex-grow-1 text-uppercase"
            :class="{
              active: activeTab === index,
              'rounded-start-5': index === 0,
              'rounded-end-5': index === headers.length - 1
            }"
            @click="clickScroll(index)"
          >
            {{ $t(header) }}
          </button>
        </div>
      </div>
    </div>
    <div class="scroll-container mx-1 mx-sm-3 h-100 mt-sm-3 mt-0">
      <component class="scroll-item" :rerender="changeRender" v-for="(entity, key, index) in entities" :key="`${key}-${index}-${generateHash(entity)}`" :is="getComponent(regionEnum.Table, objectTypeEnum.Row)" :entity="entity" :index="key"></component>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ActionTypeEnum, MechanicAbstract, ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatType, StatTypeEnum, SubObjectTypeEnum } from '@cybertale/interface'
import { Manager } from '@/mechanics/tableMechanic'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { useStoreColors } from '@/stores/storeColors'
import { useStoreApiFeatures } from '@/stores/storeApiFeatures'
import { useStoreUnitTypes } from '@/stores/storeUnitTypes'
import { useStorePoisGroups } from '@/stores/storePoisGroups'
import { useStoreSelectedFeatures } from '@/stores/storeSelectedFeatures'
import http from '@/http-common'
import { useStoreSettings } from '@/stores/storeSettings'
import { $t } from '@/stores/storeTranslations'
import { DayPeriod } from '@/model/DayPeriod'
import { useStoreAvailability } from '@/stores/storeAvailability'
import { Manager as IntegrationApiMechanic } from '../mechanics/integrationApiMechanic'
import { Category, type ColorItem, type DataItem, useStoreLegend } from '@/stores/storeLegend'

@Component({
  methods: { $t },
  components: { Loading: LoadingComponent }
})
export default class ModalContentGroupComponent extends Vue {
  @Prop() readonly entity!: ObjectTemplate[]
  @Prop() readonly object!: ObjectTemplate
  @Prop({ default: true }) readonly pageRefresh!: boolean
  headers: string[] = []
  regionEnum = RegionEnum
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  mechanic: MechanicAbstract = new Manager.Mechanic.TableMechanic(this.reRender.bind(this))
  renderComponent = true
  loadingComponents = true
  objectTemplates!: ObjectTemplate[]
  entities: ObjectTemplate[][] = []
  currentPage = 1
  isInitRunning = false
  orderBy = 'asc'
  isLoading = false
  activeTab = 0
  $t = $t
  private router = useRouter()
  private FeaturesStore = useStoreApiFeatures()
  private cleanupScroll: (() => void) | null = null
  private unitTypes = useStoreUnitTypes()
  private ColorsStore = useStoreColors()
  private poisGroups = useStorePoisGroups()
  private selectedFeatures = useStoreSelectedFeatures()
  private mapSettingsStore = useStoreSettings()
  private AvailabilityStore = useStoreAvailability()
  private createStat = (statType: number, data: string) => StatType.StatTypes[statType]().CreateStat().InitData(data)
  private ApiMechanic = new IntegrationApiMechanic.Mechanic.IntegrationApiMechanic()

  generateHash(entity) {
    const stringifiedEntity = JSON.stringify(entity)
    let hash = 0
    for (let i = 0; i < stringifiedEntity.length; i++) {
      const char = stringifiedEntity.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash |= 0 // Convert to 32bit integer
    }
    return hash.toString(36) // Convert to base-36 for a shorter string
  }

  async created() {
    await this.Init()
    if (this.cleanupScroll) {
      this.cleanupScroll()
    }
    this.cleanupScroll = this.setupScroll()
  }

  beforeUnmount() {
    if (this.cleanupScroll) {
      this.cleanupScroll()
    }
    this.mechanic.UnsubscribeConditions()
  }

  setupScroll() {
    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement
    if (!scrollContainer) return () => {}

    let isDragging = false
    let startX: number
    let startY: number
    let scrollLeft: number
    let touchMoveCount = 0
    const TOUCH_MOVE_THRESHOLD = 3 // Number of touch moves to consider before activating drag
    const VERTICAL_THRESHOLD = 10 // Pixels of vertical movement required to deactivate drag

    const startDragging = (e: TouchEvent) => {
      isDragging = true
      startX = e.touches[0].pageX
      startY = e.touches[0].pageY
      scrollLeft = scrollContainer.scrollLeft
      touchMoveCount = 0
      scrollContainer.classList.add('active')
    }

    const startDraggingClick = (e: MouseEvent | TouchEvent) => {
      isDragging = true
      scrollContainer.classList.add('active')
      startX = 'touches' in e ? e.touches[0].pageX : e.pageX
      scrollLeft = scrollContainer.scrollLeft
    }

    const stopDragging = () => {
      isDragging = false
      scrollContainer.classList.remove('active')
    }

    const dragClick = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const x = 'touches' in e ? e.touches[0].pageX : e.pageX
      const walk = (x - startX) * 2 // Adjust scroll speed by multiplier
      scrollContainer.scrollLeft = scrollLeft - walk
    }

    const drag = (e: TouchEvent) => {
      if (!isDragging) return

      const x = e.touches[0].pageX
      const y = e.touches[0].pageY
      const deltaX = x - startX
      const deltaY = y - startY

      touchMoveCount++

      if (touchMoveCount > TOUCH_MOVE_THRESHOLD && Math.abs(deltaY) > VERTICAL_THRESHOLD) {
        // Vertical movement detected, deactivate dragging
        stopDragging()
        return
      }

      e.preventDefault()
      const walk = deltaX
      scrollContainer.scrollLeft = scrollLeft - walk
    }

    const scroll = () => {
      const containerWidth = scrollContainer.clientWidth
      const scrollPosition = scrollContainer.scrollLeft
      const currentItemIndex = Math.round(scrollPosition / containerWidth)
      this.setActiveTab(currentItemIndex)

      const scrollItems = scrollContainer.querySelectorAll('.scroll-item') as NodeListOf<HTMLElement>
      scrollItems.forEach((item, index) => {
        if (index === currentItemIndex) {
          item.scrollTop = 0
        }
      })
    }

    scrollContainer.addEventListener('mousedown', startDraggingClick)
    scrollContainer.addEventListener('mousemove', dragClick)
    scrollContainer.addEventListener('mouseup', stopDragging)
    scrollContainer.addEventListener('mouseleave', stopDragging)

    scrollContainer.addEventListener('touchstart', startDragging)
    scrollContainer.addEventListener('touchmove', drag, { passive: false })
    scrollContainer.addEventListener('touchend', stopDragging)

    if ('onscrollend' in window) {
      scrollContainer.addEventListener('scrollend', scroll)
    } else {
      scrollContainer.addEventListener('scroll', () => {
        setTimeout(scroll, 500)
      })
    }

    return () => {
      scrollContainer.removeEventListener('mousedown', startDraggingClick)
      scrollContainer.removeEventListener('mousemove', dragClick)
      scrollContainer.removeEventListener('mouseup', stopDragging)
      scrollContainer.removeEventListener('mouseleave', stopDragging)
      scrollContainer.removeEventListener('touchstart', startDragging)
      scrollContainer.removeEventListener('touchmove', drag)
      scrollContainer.removeEventListener('touchend', stopDragging)
      if ('onscrollend' in window) {
        scrollContainer.removeEventListener('scrollend', scroll)
      } else {
        scrollContainer.removeEventListener('scroll', scroll)
      }
    }
  }

  setActiveTab(index: number) {
    this.activeTab = index
  }

  reRender(reverseOrder: boolean) {
    if (this.loadingComponents) {
      this.entities = []
      this.objectTemplates = []
      this.headers = []
      this.Init()
    } else {
      this.loadingComponents = true
    }
  }

  changeRender() {
    if (this.renderComponent) {
      this.entities = []
      this.objectTemplates = []
      this.headers = []
      this.mechanic = new Manager.Mechanic.TableMechanic(this.reRender.bind(this))
      this.Init()
    } else {
      this.renderComponent = true
    }
  }

  clickScroll(index: number) {
    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement
    const scrollItems = scrollContainer.querySelectorAll('.scroll-item') as NodeListOf<HTMLElement>
    const targetItem = scrollItems[index]

    if (targetItem) {
      const scrollLeft = targetItem.offsetLeft - scrollContainer.offsetLeft
      scrollContainer.scrollTo({
        left: scrollLeft
      })
    }
  }

  @Watch('object.Stats', { immediate: true })
  async onSearchQueryTriggerChange(newValue: boolean): Promise<void> {
    if (this.router.currentRoute.name === 'search') {
      await this.Init()
    }
  }

  @Watch('unitTypes.getData', { immediate: true })
  onUnitTypesChange(newValue: any): void {
    if (this.router.currentRoute.name === 'filter') {
      this.entities = []
      this.onFilterTriggerChange(newValue)
    }
  }

  @Watch('poisGroups.getPoisGroups', { immediate: true })
  onPoisGroupsChange(newValue: any): void {
    if (this.router.currentRoute.name === 'filter') {
      this.entities = []
      this.onFilterTriggerChange(newValue)
    }
  }

  async onFilterTriggerChange(newValue: any): Promise<void> {
    if (this.router.currentRoute.name === 'filter') {
      if (Object.keys(this.unitTypes.getData).length || Object.keys(this.poisGroups.getPoisGroups).length) {
        await this.Init()
        if (this.cleanupScroll) {
          this.cleanupScroll()
        }
        this.cleanupScroll = this.setupScroll()
      } else {
        this.renderComponent = true
      }
    }
  }

  async Init() {
    if (this.isInitRunning) return
    this.isInitRunning = true

    switch (this.router.currentRoute.name) {
      case 'filter':
        if (Object.keys(this.unitTypes.getData).length || Object.keys(this.poisGroups.getPoisGroups).length) {
          await this.handleFilterRoute()
        } else {
          this.finalizeInit(false)
          return
        }
        break
      case 'search':
        await this.handleSearchRoute()
        break
      case 'unit':
      case 'unitId':
        await this.handleUnitRoute()
        break
    }

    if (Object.keys(this.objectTemplates ?? {}).length === 0) {
      this.finalizeInit(false)
      return
    }

    this.processObjectTemplates()
    this.getHeaders()
    this.finalizeInit(false)
  }

  async handleSearchRoute() {
    this.entities = []
    this.objectTemplates = this.mechanic.InitSet([])
    let searchTerm = this.object.Stats[StatTypeEnum.Value].Data.trim().toLowerCase()
    let allFeatures = this.FeaturesStore.getFeatures

    if (this.object.Stats[StatTypeEnum.Value].Data !== '') {
      if (this.object.Stats[StatTypeEnum.ItemList]) {
        const selectedCategories = JSON.parse(this.object.Stats[StatTypeEnum.ItemList].Data)
        allFeatures = allFeatures.filter((f: any) => selectedCategories.includes(f.category))
      }

      const filteredFeatures = searchTerm === '-1' ? allFeatures.sort((a, b) => a.number - b.number) : allFeatures.filter((f) => (f.name && f.name.toLowerCase().includes(searchTerm)) || (f.featureType !== 'object' && f.number.toString().includes(searchTerm))).sort((a: any, b: any) => a.number - b.number)

      filteredFeatures.forEach((feature: any) => this.appendFeature(feature))
    }
  }

  async handleUnitRoute() {
    if (!this.$route.params?.id) return console.warn('Unit route called without an id in the route')
    const modalDetailsResponse = await http.get(`https://campsabout.com/mapAPI/revision/modalDetails.php?mapId=${this.$route.params.id}&propertyId=${this.mapSettingsStore.get('propertyId')}&group=${this.mapSettingsStore.get('groupName')}`)

    if ([this.ColorsStore.COLOR_OCCUPIED].includes(this.AvailabilityStore.featureColors[this.$route.params?.id])) {
      this.object.Stats[StatTypeEnum.Label].Data = this.AvailabilityStore.startDate + ' - ' + this.AvailabilityStore.endDate
      RegionType.RegionTypes[this.object.Region].ObjectTypes[this.object.ObjectEnum].ChooseSubType(this.object)
    }

    if (![this.ColorsStore.COLOR_AVAILABLE, this.ColorsStore.COLOR_AVAILABLE_IN_OTHER_PERIODS].includes(this.AvailabilityStore.featureColors[this.$route.params?.id])) {
      this.objectTemplates = this.mechanic.InitSet(modalDetailsResponse.data)
      return
    }

    let tempResponseData = [...modalDetailsResponse.data]

    if (typeof this.FeaturesStore.features?.find != 'function') {
      this.objectTemplates = this.mechanic.InitSet(tempResponseData)
      console.warn('Invalid Feature list', this.FeaturesStore.features)
      return
    }

    const feature: any = this.FeaturesStore.features?.find((f) => f.mapId == this.$route.params?.id)
    const requestedPeriod = new DayPeriod(DayPeriod.dateFromMishFormat(this.AvailabilityStore.startDate), DayPeriod.dateFromMishFormat(this.AvailabilityStore.endDate))
    const suggestedPeriods = this.AvailabilityStore.featureColors[feature.mapId] == this.ColorsStore.COLOR_AVAILABLE ? [requestedPeriod] : this.AvailabilityStore.periodSuggestions[feature.mapId]

    let phobsRates: any[][] = []
    let promises: Promise<any>[] = []
    suggestedPeriods.forEach((period, index) =>
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          phobsRates[index] = await this.ApiMechanic.getPhobsRates(this.mapSettingsStore.propertyId, this.mapSettingsStore.groupName, feature.labelPhobs, DayPeriod.dateToPhobsFormat(period.getFrom()), period.getDuration(), this.AvailabilityStore.adultsValue, this.AvailabilityStore.childrenAges)
          resolve()
        })
      )
    )
    await Promise.all(promises)

    for (let i = 0; i < suggestedPeriods.length; i++) {
      if (!phobsRates[i]?.length) {
        console.warn("Didn't receive any phobs rates for period:", suggestedPeriods[i].toString())
        continue
      }
      const color = suggestedPeriods[i].equals(requestedPeriod) ? '#e8fee8' : '#fefedf'
      let showFirstActive = ''
      if (suggestedPeriods.length === 1) {
        showFirstActive = 'show'
      }
      tempResponseData.push(this.createColumnGroup('Prices', suggestedPeriods[i].toTitleString(), `PricesTab${i}|`, 'id3', ['0'], showFirstActive))

      for (const rate of phobsRates[i]) {
        tempResponseData.push(this.createDateDisplay(suggestedPeriods[i], rate, `PricesTab${i}|`, color))
      }
    }

    const lowestPrice = phobsRates
      .filter((r) => r)
      .flatMap((r) => r)
      .map((rate) => rate.price)
      .reduce((price1, price2) => (price1 < price2 ? price1 : price2), Infinity)
    if (lowestPrice == Infinity) console.warn('No valid Rates received from PHOBS', phobsRates)
    this.object.Stats[StatTypeEnum.Value].Data = lowestPrice
    if ([this.ColorsStore.COLOR_AVAILABLE_IN_OTHER_PERIODS].includes(this.AvailabilityStore.featureColors[this.$route.params?.id])) {
      this.object.Stats[StatTypeEnum.Label].Data = $t('Available in other periods')
    } else {
      this.object.Stats[StatTypeEnum.Label].Data = this.AvailabilityStore.startDate + ' - ' + this.AvailabilityStore.endDate
    }
    RegionType.RegionTypes[this.object.Region].ObjectTypes[this.object.ObjectEnum].ChooseSubType(this.object)

    this.objectTemplates = this.mechanic.InitSet(tempResponseData)
  }

  private createDateDisplay(suggestedPeriod: DayPeriod, rate: any, periodTag: string, backgroundColor: string = '#ffffed', showFirstActive = false) {
    const belongsTo = periodTag //u kodu je tag glavni id
    const tag = `dateDisplay${suggestedPeriod.toString().replaceAll(/\s+/g, '')}${uuidv4()}|`
    const id = 'id3' // tag je programski (za sve na frontendu) a id je iz baze => svima mora biti isti id i meni će u ovom slučaju biti "id3" (inače je u bazi uuid)
    const inherit = JSON.stringify([StatTypeEnum.Option.toString()])
    const optionIndices = '0' //index u parentovom Option array-u, meni će uvijek biti 0 jer samo jednu stvar postavljam
    const label = JSON.stringify([{ rate, period: suggestedPeriod, styleData: `background-color: ${backgroundColor};` }])
    const design = 'd-flex gap-2 custom-box align-items-center btn btn-camp-outline-secondary mb-2 border-0 rounded-3 shadow-sm active'
    const value = rate
    return this.createBookingRow(SubObjectTypeEnum.Middle, label, tag, value, design, belongsTo, id, inherit, optionIndices)
  }

  createBookingRow(subObjectType: number, label: string, tag: string, value: string, design: string, belongsTo: string, id: string, inherit: string, optionIndices: string): ObjectTemplate {
    return new ObjectTemplate(RegionEnum.TableColumn, ObjectTypeEnum.ECabinetRow, subObjectType, ActionTypeEnum.None, {
      [StatTypeEnum.Label]: this.createStat(StatTypeEnum.Label, label),
      [StatTypeEnum.Tag]: this.createStat(StatTypeEnum.Tag, tag),
      [StatTypeEnum.Value]: this.createStat(StatTypeEnum.Value, value),
      [StatTypeEnum.Design]: this.createStat(StatTypeEnum.Design, design),
      [StatTypeEnum.BelongsTo]: this.createStat(StatTypeEnum.BelongsTo, belongsTo),
      [StatTypeEnum.Id]: this.createStat(StatTypeEnum.Id, id),
      [StatTypeEnum.Inherit]: this.createStat(StatTypeEnum.Inherit, inherit),
      [StatTypeEnum.OptionIndices]: this.createStat(StatTypeEnum.OptionIndices, optionIndices)
    })
  }

  createNumberArrayFromSelected(group: string): string {
    console.log('group', group)
    let values = this.selectedUiFeatures.getData.filter((d) => d.group.toLowerCase() === group.toLowerCase()).map((d) => d.values)
    return JSON.stringify(...values)
  }

  createNumberArray(count: number): string {
    const values = []
    for (let i = count; i > 0; i--) {
      values.push('0')
    }
    return JSON.stringify(values)
  }

  getIcons(): ObjectTemplate[] {
    const buttons = []
    let columnGroup = 1
    // Iterate over POI groups and create column groups and buttons
    for (const [poiGroup, poiValues] of Object.entries(this.poisGroups.getPoisGroups)) {
      let group = poiGroup
      let values = []
      let index = 0
      // Add column group for the current POI group
      // Add buttons for each POI in the group
      for (const poiObject of poiValues) {
        const val = this.selectedFeatures.getData.includes(poiObject.ikonica) ? '1' : '0'
        values.push(val)
        const urlToImage = `https://campsabout.com/camp/polidor/1/assets/img/icons/${poiObject.ikonica}.svg` //TODO make a more sensible route
        const labelValue = `{"title": "${$t(poiObject.ikonica)}","index": "${index}","group": "${group}", "icon": "${poiObject.ikonica}","styleData": "flex-shrink: 0; background-image: url(${urlToImage});background-repeat: no-repeat;background-size: cover;width: 25px;height: 25px;", "iconClass": "filter-square order-1 rounded-1 me-2"}`
        const label = `[${labelValue}, ${labelValue}]`
        const design = '["d-flex custom-box align-items-center btn btn-camp-outline-secondary mb-2 border-0 rounded-3 shadow-sm", "d-flex custom-box align-items-center btn btn-camp-outline-secondary mb-2 border-0 rounded-3 shadow-sm active"]'
        buttons.push(this.createButton(SubObjectTypeEnum.Left, label, 'button' + uuidv4() + '|', poiObject.ikonica, design, 'columnGroup' + columnGroup, 'id2', '[22]', index.toString()))
        index++
      }

      buttons.push(this.createColumnGroup($t('FACILITIES'), $t(group), 'columnGroup' + columnGroup, 'id2', values))

      columnGroup++
    }
    return buttons
  }

  getTypes(): ObjectTemplate[] {
    const buttons = []

    // Initialize category indexes dynamically from the enum
    const categoryIndexes: { [key in Category]?: string[] } = Object.values(Category).reduce(
      (acc, category) => {
        if (category !== Category.S) {
          // Skip Category S
          acc[category] = []
        }
        return acc
      },
      {} as { [key in Category]?: string[] }
    )

    // Process legend data dynamically for all categories
    for (const value of useStoreLegend().getLegendData) {
      const { title: name, category: category, label, color } = value as ColorItem

      // Get the inclusion status of the label from selected features
      const val = this.selectedFeatures.getData.includes(label) ? '1' : '0'

      // Add to the respective category index
      if (categoryIndexes[category]) {
        categoryIndexes[category]!.push(val)
      }

      // Create a button for each category
      buttons.push(
        this.createTypeButton(
          name,
          label,
          color || '', // Color comes from ColorItem directly
          category,
          categoryIndexes[category]?.length - 1 || 0 // Position within its category
        )
      )
    }

    const columnGroups = []

    // Dynamically create column groups for any categories that have data
    Object.entries(categoryIndexes).forEach(([category, indexes]) => {
      if (indexes && indexes.length > 0) {
        const categoryTitle = useStoreLegend().getCategoryTitle(category as Category)
        columnGroups.push(this.createColumnGroup($t('ACCOMMODATION'), $t(categoryTitle), `columnAccGroup${category}`, `id1`, indexes))
      }
    })

    return [...columnGroups, ...buttons]
  }

  createTypeButton(name: string, label: string, color: string, category: string, count: number): ObjectTemplate {
    const labelStat = `[{"title": "${name}", "styleData": "flex-shrink: 0; background-color: ${color};", "iconClass": "filter-square order-1 rounded-1 filter-square me-2"}, {"title": "${name}", "styleData": "flex-shrink: 0; background-color: ${color};", "iconClass": "filter-square order-1 rounded-1 filter-square me-2"}]`
    const design = '["d-flex gap-2 custom-box align-items-center btn btn-camp-outline-secondary mb-2 border-0 rounded-3 shadow-sm", "d-flex gap-2 custom-box align-items-center btn btn-camp-outline-secondary mb-2 border-0 rounded-3 shadow-sm active"]'

    return this.createButton(SubObjectTypeEnum.Middle, labelStat, `button${category}${uuidv4()}|`, label, design, `columnAccGroup${category}`, 'id1', '[22]', count.toString())
  }

  createColumnGroup(label: string, value: string, tag: string, id: string, options: string[], design: string = ''): ObjectTemplate {
    return new ObjectTemplate(RegionEnum.TableColumn, ObjectTypeEnum.ColumnGroup, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
      [StatTypeEnum.Label]: this.createStat(StatTypeEnum.Label, label),
      [StatTypeEnum.Value]: this.createStat(StatTypeEnum.Value, value),
      [StatTypeEnum.ElementType]: this.createStat(StatTypeEnum.ElementType, 'accordion'),
      [StatTypeEnum.Design]: this.createStat(StatTypeEnum.Design, design),
      [StatTypeEnum.Tag]: this.createStat(StatTypeEnum.Tag, tag),
      [StatTypeEnum.Id]: this.createStat(StatTypeEnum.Id, id),
      [StatTypeEnum.Option]: this.createStat(StatTypeEnum.Option, JSON.stringify(options))
    })
  }

  // Helper function to create a button object
  createButton(clickType: number, label: string, tag: string, value: string, design: string, belongsTo: string, id: string, inherit: string, optionIndices: string): ObjectTemplate {
    return new ObjectTemplate(RegionEnum.TableColumn, ObjectTypeEnum.Button, clickType, ActionTypeEnum.Click, {
      [StatTypeEnum.Label]: this.createStat(StatTypeEnum.Label, label),
      [StatTypeEnum.Tag]: this.createStat(StatTypeEnum.Tag, tag),
      [StatTypeEnum.ElementType]: this.createStat(StatTypeEnum.ElementType, 'icon'),
      [StatTypeEnum.Value]: this.createStat(StatTypeEnum.Value, value),
      [StatTypeEnum.Design]: this.createStat(StatTypeEnum.Design, design),
      [StatTypeEnum.BelongsTo]: this.createStat(StatTypeEnum.BelongsTo, belongsTo),
      [StatTypeEnum.Id]: this.createStat(StatTypeEnum.Id, id),
      [StatTypeEnum.Inherit]: this.createStat(StatTypeEnum.Inherit, inherit),
      [StatTypeEnum.OptionIndices]: this.createStat(StatTypeEnum.OptionIndices, optionIndices)
    })
  }

  async handleFilterRoute() {
    let typesFinal = this.getTypes()

    let iconsFinal = this.getIcons()

    this.objectTemplates = this.mechanic.InitSet([...typesFinal, ...iconsFinal])
  }

  processObjectTemplates() {
    let tempId = null
    let tempObjectTemplates = []

    for (const element of this.objectTemplates) {
      const currentId = element.Stats[StatTypeEnum.Id].Data

      if (currentId === tempId) {
        tempObjectTemplates.push(JSON.parse(JSON.stringify(element)))
      } else {
        if (tempObjectTemplates.length > 0) {
          this.entities.push([...tempObjectTemplates])
          tempObjectTemplates = []
        }
        tempObjectTemplates.push(JSON.parse(JSON.stringify(element)))
      }
      tempId = currentId
    }

    if (tempObjectTemplates.length > 0) {
      this.entities.push([...tempObjectTemplates])
    }
  }

  finalizeInit(renderComponent: boolean) {
    this.renderComponent = renderComponent
    this.loadingComponents = false
    this.isInitRunning = false
    if (useStoreSelectedFeatures().getData.length === 0) {
      this.toggleClearButton(false)
    }
  }

  getHeaders(): void {
    this.headers = []
    for (const header of this.objectTemplates) {
      if (this.headers.indexOf(header.Stats[StatTypeEnum.Label].Data) === -1 && header.Stats[StatTypeEnum.BelongsTo] === undefined) {
        this.headers[this.headers.length] = header.Stats[StatTypeEnum.Label].Data
      }
    }
  }

  appendFeature(feature: any) {
    this.mechanic.Append([
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.ListItem, SubObjectTypeEnum.Up, ActionTypeEnum.Click, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('FEATURES'),
        [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(JSON.stringify(feature)),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]()
          .CreateStat()
          .InitData(uuidv4() + 'result|'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id')
      })
    ])
  }

  toggleClearButton(show: boolean) {
    const element = document.querySelector('.clear-filter') as HTMLElement | null

    if (element) {
      if (element.classList.contains('d-flex') && !show) {
        element.classList.replace('d-flex', 'd-none')
      } else if (element.classList.contains('d-none') && show) {
        element.classList.replace('d-none', 'd-flex')
      }
    }
  }

  getComponent(_regionEnum: number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<style scoped>
.scroll-item {
  padding-bottom: 6%;
  flex: 0 0 100%;
  scroll-snap-align: center;
}

@media (max-width: 768px) {
  .scroll-item {
    padding-top: 2%;
    padding-bottom: 2%;
  }
}

.col {
  padding: 15px;
}

.scroll-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  cursor: grab;
  user-select: none;
  /*clip-path: inset(0px 20px 0px 20px);*/
}

.scroll-container:active {
  cursor: grabbing;
}

.scroll-item {
  flex: 0 0 100%;
  scroll-snap-align: center;
  transition: transform 0.3s ease;
  overflow-y: auto;
  max-height: 100%;
  overflow-wrap: break-word;
  /* Ensures long words break and wrap */
  word-wrap: break-word;
  /* Older syntax, still effective for some browsers */
  word-break: break-word;
}

.scroll-item:active {
  transform: scale(0.98);
}

/* Scrollbar styling */
.scroll-container::-webkit-scrollbar,
.scroll-item::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.scroll-container::-webkit-scrollbar-thumb,
.scroll-item::-webkit-scrollbar-thumb {
  background: #4caf50;
  border-radius: 3px;
  border: 2px solid #ffffff;
}
</style>
