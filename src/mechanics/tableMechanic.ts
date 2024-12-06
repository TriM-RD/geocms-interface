import http from '@/http-common'
import { EventHandlerType, MechanicAbstract, ObjectTemplate, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum, SubObjectTypeEnum } from '@cybertale/interface'
import router from '@/router'
import { useStoreApiFeatures } from '@/stores/storeApiFeatures'
import { useStoreMapFunctions } from '@/stores/storeMapFunctions'
import { useStorePois } from '@/stores/storePois'
import { useStoreSelectedFeatures } from '@/stores/storeSelectedFeatures'
import { useStoreToast } from '@/stores/storeToast'
import { $t } from '@/stores/storeTranslations'
import { useStoreMessageBox } from '@/stores/storeMessageBox'
import { useStoreSettings } from '@/stores/storeSettings'

export namespace Manager.Mechanic {
  export class TableMechanic extends MechanicAbstract {
    private page = 0
    private lastPageReached = false
    private campsaboutObject: any = null
    private poisStore = useStorePois()
    private selectedFeatures = useStoreSelectedFeatures()
    private groupTypeFilter: { [key: string]: string } = {
      all: '',
      group: 'group',
      template: 'template'
    }
    private filters = { code: '', group: '', division: '' }

    public async InitGet(_id: string, _api: string): Promise<ObjectTemplate[]> {
      try {
        const query = JSON.parse(_api)
        if (this.lastPageReached) {
          return []
        }
        if (this.page > 0) {
          this.loadNextPage()
        }
        this.page++
        this.ObjectTemplates = []
        let url = `${process.env.VUE_APP_BASE_URL + query.api}?page=${this.page}&order=${query.order}`
        for (const filter in query.filters) {
          url += `&${filter}=${query.filters[filter]}`
        }
        const response = await http.get(url)
        if (Object.keys(response.data).length !== 0) {
          this.ObjectTemplates = await this.forEachElement(response.data)
          return this.ObjectTemplates
        } else {
          this.lastPageReached = true
          return []
        }
      } catch (e) {
        if (this.lastPageReached) {
          return []
        }
        if (this.page > 0) {
          this.loadNextPage()
        }
        this.page++
        this.ObjectTemplates = []
        const response = await http.get(`${process.env.VUE_APP_BASE_URL + _api}?page=${this.page}&order=asc`)
        if (Object.keys(response.data).length !== 0) {
          this.ObjectTemplates = await this.forEachElement(response.data)
          return this.ObjectTemplates
        } else {
          this.lastPageReached = true
          return []
        }
      }
    }

    private forEachElement(data: any): Promise<ObjectTemplate[]> {
      return new Promise((resolve) => {
        const promises = data.map((_list: any) => {
          return Promise.all(
            _list.map((_object: any) => {
              return new ObjectTemplate(_object.Region, _object.ObjectEnum, _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats))
            })
          )
        })
        Promise.all(promises).then((results: any[]) => {
          let _temp: ObjectTemplate[] = []
          results.forEach((result) => {
            _temp = [..._temp, ...result]
          })
          resolve(_temp)
        })
      })
    }

    public InitSet(_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    loadNextPage(): void {
      /*useToast()(
        {
          component: ToastComponent,
          props: {
            msg: { info: 'Loading next set of data.' }
          }
        },
        {
          type: TYPE.INFO
        }
      )*/
      this.refreshPage() // TODO find out what is its use if any
    }

    refreshPage(): void {
      if (this.mechanicInvoked !== null) {
        this.mechanicInvoked.dispatch()
      }
    }

    protected SubscribeConditions(): void {
      RegionType.RegionTypes[RegionEnum.TableColumn].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.ClearButton.bind(this))
    }

    public UnsubscribeConditions(): void {
      RegionType.RegionTypes[RegionEnum.TableColumn].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
    }

    protected async ClearButton(_eventHandler: EventHandlerType): Promise<void> {
      const name = router.currentRoute.value.name
      if (typeof name !== 'string') return

      switch (name) {
        case 'filter':
          this.toggleClearButton(false)
          useStoreSelectedFeatures().clear()
          this.selectedFeatures = useStoreSelectedFeatures()
          this.refreshPage()
          this.refreshPage()
          useStoreMapFunctions().getReCenterMapFun()
          useStoreMapFunctions().resetLayerOpacityFun()
          break
      }
    }

    protected async Button(_eventHandler: EventHandlerType): Promise<void> {
      const name = router.currentRoute.value.name
      if (typeof name !== 'string') return

      switch (name) {
        case 'filter':
          this.handleFilterEvent(_eventHandler)
          break
        case 'unitId':
          switch (_eventHandler.subObjectType) {
            case SubObjectTypeEnum.Right:
              if (useStoreSettings().extraSecurity) {
                document.querySelector('.tooltip')?.remove()
                useStoreMessageBox().setData({
                  message: $t('The link you clicked will take you to an external website. Please be aware that we do not control the content or security of the external site.'),
                  onAccept: async () => {
                    this.isValidUrl(JSON.parse(_eventHandler.payload.Stats[StatTypeEnum.Value].Data))
                  },
                  showCancelButton: true
                })
                router.push({ name: 'dialog' })
              } else {
                this.isValidUrl(JSON.parse(_eventHandler.payload.Stats[StatTypeEnum.Value].Data))
              }
              break
            case SubObjectTypeEnum.Up:
              navigator.clipboard.writeText(JSON.parse(_eventHandler.payload.Stats[StatTypeEnum.Value].Data)).then(() => {
                useStoreToast().showToast('Content copied to clipboard!', '', 'liveToastMain', 'toastMessageMain')
              })
              break
          }
          break
      }
    }

    isValidUrl(urlString) {
      try {
        // Using the URL constructor to validate URL format
        new URL(urlString)
        window.open(urlString, '_blank')
      } catch (error) {
        console.warn('Link is incorrectly formatted, check CMS.')
      }
    }

    // Separate function to handle the 'filter' event
    private handleFilterEvent(_eventHandler: EventHandlerType): void {
      console.log(this.ObjectTemplates)
      this.updateAtPosition(_eventHandler.payload)

      //const payloadData = JSON.parse(_eventHandler.payload.Stats[0].Data)[0]
      const value = _eventHandler.payload.Stats[StatTypeEnum.Value].Data

      switch (_eventHandler.subObjectType) {
        case SubObjectTypeEnum.Left:
          this.handleLeftSubObjectType(value)
          break
        case SubObjectTypeEnum.Middle:
          this.handleMiddleSubObjectType(value)
          break
      }

      if (this.selectedFeatures.getData.length === 0) {
        useStoreMapFunctions().getResetLayerOpacityFun()
      }
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

    // Handle SubObjectTypeEnum.Left case
    private handleLeftSubObjectType(payloadData: any): void {
      this.toggleFeatureSelection(payloadData)

      if (this.selectedFeatures.getData.length > 0) {
        this.toggleClearButton(true)
        const selectedFeatureIds = this.filterPoisAndFeatures()
        useStoreMapFunctions().getFeatureHighlightFun([...selectedFeatureIds.filteredBrands, ...selectedFeatureIds.filteredPois])
        useStoreMapFunctions().getReCenterMapFun(selectedFeatureIds.filteredPois, 'poi')
        if (!selectedFeatureIds.filteredPois.length && selectedFeatureIds.filteredBrands.length) {
          useStoreMapFunctions().getReCenterMapFun(selectedFeatureIds.filteredBrands)
        }
      } else {
        this.toggleClearButton(false)
        useStoreMapFunctions().getReCenterMapFun()
      }
    }

    // Handle SubObjectTypeEnum.Middle case
    private handleMiddleSubObjectType(payloadData: any): void {
      this.toggleFeatureSelection(payloadData)

      if (this.selectedFeatures.getData.length > 0) {
        //const selectedTitles = this.selectedFeatures.getData
        this.toggleClearButton(true)
        const selectedFeatureIds = this.filterPoisAndFeatures()
        useStoreMapFunctions().getFeatureHighlightFun([...selectedFeatureIds.filteredBrands, ...selectedFeatureIds.filteredPois])
        useStoreMapFunctions().getReCenterMapFun(selectedFeatureIds.filteredBrands)
        if (selectedFeatureIds.filteredPois.length && !selectedFeatureIds.filteredBrands.length) {
          useStoreMapFunctions().getReCenterMapFun(selectedFeatureIds.filteredPois, 'poi')
        }
      } else {
        this.toggleClearButton(false)
        useStoreMapFunctions().getReCenterMapFun()
      }
    }

    filterPoisAndFeatures() {
      // Filter POIs based on selected icons
      const filteredPois = this.poisStore.getPois.features.filter((p) => this.selectedFeatures.getData.includes(p.properties.icon)).map((f) => f.properties.id)

      // Filter features based on selected titles and map the IDs
      const filteredBrands = useStoreApiFeatures()
        .getFeatures.filter((f) => this.selectedFeatures.getData.includes(f.label))
        .map((f) => f.mapId)

      // Return both filtered results as an object
      return {
        filteredPois,
        filteredBrands
      }
    }

    // Toggle feature selection (icon or title) in selectedFeatures
    private toggleFeatureSelection(feature: string): void {
      const selectedFeatures = this.selectedFeatures.getData
      if (selectedFeatures.includes(feature)) {
        this.selectedFeatures.setData(selectedFeatures.filter((name) => name !== feature))
      } else {
        this.selectedFeatures.setData([...selectedFeatures, feature])
      }
    }
  }
}
