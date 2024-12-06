<template>
  <div>
    <div class="modal fade overflow-hidden show" id="unitModal" tabindex="-1" aria-labelledby="unitModalLabel" :style="{ opacity: loadingTemp ? 0.2 : 1 }">
      <div class="modal-dialog d-flex flex-column dvh-100 mb-0 mt-0 mt-sm-2 pt-2 pb-2">
        <div class="modal-content custom-rounded">
          <Loading v-model:active="loadingTemp" :size="50" />
          <div class="modal-body d-flex flex-column h-100" v-if="!loadingTemp">
            <div class="d-flex flex-column flex-grow-1 overflow-hidden rounded-bottom-3">
              <component :page-refresh="renderComponent" v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${key}-${index}-${_objectTemplate.Stats[statTypeEnum.Tag].Data}`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :modalFunction="modalFunction" :entity="resolveEntities(_objectTemplate)" :object="_objectTemplate"> </component>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator'
import '/node_modules/bootstrap-icons/font/bootstrap-icons.css'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ActionTypeEnum, MechanicAbstract, ObjectTemplate, ObjectTypeEnum, RegionEnum, RegionType, StatType, StatTypeEnum, SubObjectTypeEnum } from '@cybertale/interface'
import { Manager } from '@/mechanics/modalMechanic'
import { useStoreApiFeatures } from '@/stores/storeApiFeatures'
import { useRouter } from 'vue-router'
import http from '@/http-common'
import { useStoreSettings } from '@/stores/storeSettings'
import { v4 as uuidv4 } from 'uuid'
import { $t } from '@/stores/storeTranslations'

@Component({
  components: {
    Loading: LoadingComponent
  }
})
export default class ModalComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.ModalMechanic(this.reRender.bind(this))
  renderComponent = true
  objectTemplates!: ObjectTemplate[]
  statTypeEnum = StatTypeEnum
  belongsTo: { [key: string]: ObjectTemplate[] } = {}
  entity!: ObjectTemplate[]
  private router = useRouter()
  modalFunction = { open: this.openModal, close: this.closeModal }
  private mapSettingsStore = useStoreSettings()
  private featureData = {}
  loadingTemp = true
  apiFeatures = useStoreApiFeatures()
  isInitRunning = false

  mounted() {
    this.handleModal()
  }

  handleModal() {
    this.openModal()

    const modalElement = document.getElementById('unitModal')
    if (modalElement) {
      // Add event listener for the close button
      const closeButton = modalElement.querySelector('.btn-close')
      if (closeButton) {
        closeButton.addEventListener('click', this.goBack)
      }

      // Add event listener for the backdrop
      let isMouseMoving = false
      let mouseDownTime

      modalElement.addEventListener('mousedown', () => {
        isMouseMoving = false
        mouseDownTime = new Date().getTime()
      })

      modalElement.addEventListener('mousemove', () => {
        isMouseMoving = true
      })

      modalElement.addEventListener('mouseup', (event) => {
        const mouseUpTime = new Date().getTime()
        if (event.target === modalElement && !isMouseMoving && mouseUpTime - mouseDownTime < 200) {
          this.goBack()
        }
      })
    }
  }

  openModal() {
    const modalElement = document.getElementById('unitModal')
    if (modalElement) {
      modalElement.classList.add('show')
      modalElement.style.display = 'block'
      document.body.classList.add('modal-open')

      // Add backdrop
      const backdrop = document.createElement('div')
      backdrop.classList.add('modal-backdrop', 'fade', 'show')
      document.body.appendChild(backdrop)
    }
  }

  goBack() {
    this.closeModal()
    this.router.push({ name: 'map' })
  }

  closeModal() {
    const modalElement = document.getElementById('unitModal')
    if (modalElement) {
      modalElement.classList.remove('show')

      // Trigger fade-out animation
      setTimeout(() => {
        modalElement.style.display = 'none'
        document.body.classList.remove('modal-open')

        // Remove backdrop after the animation finishes
        const backdrop = document.querySelector('.modal-backdrop')
        if (backdrop) {
          backdrop.classList.remove('show')
          setTimeout(() => {
            backdrop.remove()
          }, 100) // Same duration as the animation
        }
      }, 100) // Duration of the fade-out
    }
  }

  beforeUnmount() {
    this.mechanic.UnsubscribeConditions()

    const modalElement = document.getElementById('unitModal')
    if (modalElement) {
      const closeButton = modalElement.querySelector('.btn-close')
      if (closeButton) {
        closeButton.removeEventListener('click', this.goBack)
      }
      modalElement.removeEventListener('click', this.goBack)
    }

    this.closeModal()
  }

  async created() {
    await this.Init()
  }

  resolveEntities(_object: ObjectTemplate): ObjectTemplate[] {
    if (this.belongsTo) {
      for (const tag of Object.keys(this.belongsTo)) {
        if (_object.Stats[StatTypeEnum.Tag].Data.includes(tag)) {
          return this.belongsTo[tag]
        }
      }
    }

    return []
  }

  getCategories() {
    const features = [
      ...new Set(
        useStoreApiFeatures()
          .getFeatures.filter((feature: any) => feature.featureType === 'object')
          .map((feature: any) => feature.category)
      )
    ]

    const buttons = []

    for (const [index, feature] of features.entries()) {
      // Determine classes based on position in the array
      const baseClass = 'flex-fill btn-sm btn btn-outline-camp mb-2 fs-7 text-uppercase'
      const positionClass = features.length === 1 ? 'rounded-5' : index === 0 ? 'rounded-start-5' : index === features.length - 1 ? 'rounded-end-5' : ''

      buttons.push(
        new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
          [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(feature),
          [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(`category${uuidv4()}|`),
          [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData(`["${baseClass} ${positionClass}", "${baseClass} ${positionClass} active"]`),
          [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
          [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('buttonsFilter'),
          [StatTypeEnum.OptionIndices]: StatType.StatTypes[StatTypeEnum.OptionIndices]().CreateStat().InitData(`${index}`),
          [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[22]')
        })
      )
    }
    const buttonGroup = [
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.InputGroup, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Click, {
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('buttonsFilter'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('["flex-fill btn btn-outline-success mb-2", "flex-fill btn btn-outline-success mb-2 active"]'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
        [StatTypeEnum.Option]: StatType.StatTypes[StatTypeEnum.Option]().CreateStat().InitData(this.createNumberArray(buttons.length))
      })
    ]
    return [...buttonGroup, ...buttons]
  }

  extractChildren(entities: ObjectTemplate[]): ObjectTemplate[] {
    const itemsToDelete = []

    for (let i = 0; i < entities.length; i++) {
      const item = entities[i]

      if (item.Stats[StatTypeEnum.BelongsTo] !== undefined) {
        const data = item.Stats[StatTypeEnum.BelongsTo].Data
        this.belongsTo[data] = this.belongsTo[data] || []
        if (
          !this.belongsTo[data].some(function (obj) {
            return obj.Stats[StatTypeEnum.Tag].Data === item.Stats[StatTypeEnum.Tag].Data
          })
        ) {
          this.belongsTo[data].push(item as ObjectTemplate)
        }

        // Add index to itemsToDelete array
        itemsToDelete.push(i)
      }
    }

    // Iterate in reverse to avoid issues with array modifications
    for (let i = itemsToDelete.length - 1; i >= 0; i--) {
      entities.splice(itemsToDelete[i], 1)
    }
    return entities
  }

  @Watch('apiFeatures.getFeatures', { immediate: true })
  async onUnitTypesChange(newValue: any): void {
    if (this.router.currentRoute.name === 'search') {
      this.entity = []
      this.objectTemplates = []
      await this.onFilterTriggerChange(newValue)
    }
  }

  async onFilterTriggerChange(newValue: any): Promise<void> {
    if (this.router.currentRoute.name === 'search') {
      if (Object.keys(this.apiFeatures.getFeatures).length) {
        await this.Init()
      } else {
        this.renderComponent = true
      }
    }
  }

  async Init(): Promise<void> {
    if (this.isInitRunning) return
    this.isInitRunning = true
    let entityTemp: any = []
    switch (this.router.currentRoute.name) {
      case 'filter':
        entityTemp = [
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.InputGroup, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Click, {
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('header'),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
            [StatTypeEnum.Option]: StatType.StatTypes[StatTypeEnum.Option]().CreateStat().InitData('0')
          }),
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('[{"title": "", "iconClass": "order-1 fa-solid fa-arrow-left"}]'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('modalClose|'),
            [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('icon'),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('d-flex position-absolute pt-3 align-items-center border-0 btn btn-outline-success close-modal-btn'),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
            [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('header'),
            [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[22]')
          }),
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Label, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData($t('Filter')),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('modalTitle|'),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('flex-fill btn btn-outline-info disabled border-0 text-camp main-heading-search'),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
            [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('header')
          }),
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Middle, ActionTypeEnum.Click, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('[{"title": "", "iconClass": "order-1 fa-solid fa-xmark"}]'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('filterClear|'),
            [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('icon'),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('d-flex clear-filter position-absolute pt-3 align-items-center border-0 btn btn-outline-success close-modal-btn top-0 end-0'),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
            [StatTypeEnum.Tooltip]: StatType.StatTypes[StatTypeEnum.Tooltip]().CreateStat().InitData($t('Clear selection')),
            [StatTypeEnum.Disabled]: StatType.StatTypes[StatTypeEnum.Disabled]().CreateStat().InitData(''),
            [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('header'),
            [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[22]')
          }),
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.MultiMedia, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('content'),
            [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('content')
          })
        ]
        break
      case 'search':
        if (Object.keys(this.apiFeatures.getFeatures).length) {
          entityTemp = await this.handleSearchRoute()
        } else {
          this.finalizeInit(false)
          return
        }
        break
      case 'unit': //TODO make it possible to work in /unit
      case 'unitId':
        await http.get(`https://campsabout.com/mapAPI/revision/modal.php?mapId=${this.$route.params.id}&propertyId=${this.mapSettingsStore.get('propertyId')}&group=${this.mapSettingsStore.get('groupName')}`).then((response) => {
          entityTemp = response.data
        })
        break
    }
    this.entity = entityTemp
    this.objectTemplates = this.mechanic.InitSet(this.extractChildren(entityTemp))
    this.renderComponent = false
    this.loadingTemp = false
    this.checkSearchQuery()
  }

  finalizeInit(renderComponent: boolean) {
    this.renderComponent = renderComponent
    this.isInitRunning = false
  }

  async handleSearchRoute() {
    return [
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.InputGroup, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Click, {
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('header'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
        [StatTypeEnum.Option]: StatType.StatTypes[StatTypeEnum.Option]().CreateStat().InitData('0')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('[{"title": "", "iconClass": "order-1 fa-solid fa-arrow-left"}]'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('modalClose|'),
        [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('icon'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('d-flex position-absolute pt-3 align-items-center mb-2 border-0 btn btn-outline-success close-modal-btn'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('header'),
        [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[22]')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Label, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData($t('hintTrazilica')),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('modalTitle|'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('flex-fill btn btn-outline-info disabled mb-2 border-0 text-camp main-heading-search'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('header')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.InputGroup, SubObjectTypeEnum.ParentObject, ActionTypeEnum.InsertClick, {
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData('[null]'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('searchForm'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
        [StatTypeEnum.Option]: StatType.StatTypes[StatTypeEnum.Option]().CreateStat().InitData('[0]')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.InsertClick, {
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('searchField|'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('search-input rounded-5 mb-3'),
        [StatTypeEnum.Disabled]: StatType.StatTypes[StatTypeEnum.Disabled]().CreateStat().InitData('["", "true"]'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('Enter pitch number or feature...'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('searchForm'),
        [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[1,13,14,22]'),
        [StatTypeEnum.OptionIndices]: StatType.StatTypes[StatTypeEnum.OptionIndices]().CreateStat().InitData('0'),
        [StatTypeEnum.ValueIndices]: StatType.StatTypes[StatTypeEnum.ValueIndices]().CreateStat().InitData('0')
      }),
      ...this.getCategories(),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.MultiMedia, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('content'),
        [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('content'),
        [StatTypeEnum.DependsOn]: StatType.StatTypes[StatTypeEnum.DependsOn]().CreateStat().InitData('search')
      })
    ]
  }

  createNumberArray(count: number): string {
    const values = []
    for (let i = count; i > 0; i--) {
      values.push('0')
    }
    return JSON.stringify(values)
  }

  getObjectTemplateIndex(tag: string, objectTemplates: ObjectTemplate[], searchByValueType: StatTypeEnum = StatTypeEnum.Tag): number {
    return objectTemplates.findIndex((element) => element.Stats[searchByValueType] && (element.Stats[searchByValueType].Data === tag || element.Stats[searchByValueType].Data === tag.split('|')[1]))
  }

  checkSearchQuery() {
    if (this.$route.query.q) {
      let thisObject = this.objectTemplates[this.getObjectTemplateIndex('searchForm', this.objectTemplates)]
      RegionType.RegionTypes[thisObject.Region].ObjectTypes[thisObject.ObjectEnum].ChooseSubType(thisObject, JSON.stringify([this.$route.query.q.toString()]))
    }
  }

  reRender(): void {
    this.renderComponent = !this.renderComponent
  }

  changeRender(): void {
    this.renderComponent = !this.renderComponent
    this.mechanic.UnsubscribeConditions()
    this.objectTemplates = []
    this.mechanic = new Manager.Mechanic.FormMechanic(this.reRender.bind(this))
    this.Init()
  }

  getComponent(_regionEnum: number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<style scoped>
.modal-dialog {
  max-width: 600px;
}

.modal-content {
  max-height: 95vh !important;
  border: none;
}

.modal-body {
  padding: 0;
}

.close-black {
  position: absolute;
  cursor: pointer;
  width: 30px;
  height: 30px;
}

.close-black {
  right: 15px;
  top: 15px;
  width: 40px;
  height: 40px;
}

.fancybox-container a {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 767px) {
  .modal-content {
    max-height: 100dvh !important;
    height: 100% !important; /* Adjusted for mobile screen real estate */
  }
}
</style>
