import { ActionTypeEnum, EventHandlerType, MechanicAbstract, ObjectTemplate, ObjectTypeEnum, RegionEnum, RegionType, StatType, StatTypeEnum, SubObjectTypeEnum } from '@cybertale/interface'
import { v4 as uuidv4 } from 'uuid'
import { useStoreSettings } from '@/stores/storeSettings'
import { useRouter } from 'vue-router'
import { useStoreMapFunctions } from '@/stores/storeMapFunctions'
import { useStoreSelectedFeatures } from '@/stores/storeSelectedFeatures'

interface Icon {
  category: string
  name: string
}

export namespace Manager.Mechanic {
  export class ModalMechanic extends MechanicAbstract {
    private id = '-1'
    private inEdit = false
    private router = useRouter()
    private settingsStore = useStoreSettings()

    selectedFeatures: Icon[] = []

    public async InitGet(_id: string, _route: string): Promise<ObjectTemplate[]> {
      return this.ObjectTemplates
    }

    public InitSet(_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions(): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Field].SubscribeLogic(this.Field.bind(this))
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.CheckBox].SubscribeLogic(this.Field.bind(this))
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.InputGroup].SubscribeLogic(this.Field.bind(this))
    }

    public UnsubscribeConditions(): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Field].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.CheckBox].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.InputGroup].NullifyLogic()
      MechanicAbstract.instance = null
    }

    public appendFeature(feature) {
      this.Append([
        new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.ListItem, SubObjectTypeEnum.Up, ActionTypeEnum.Click, {
          [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(JSON.stringify(feature)),
          [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]()
            .CreateStat()
            .InitData('result' + uuidv4()),
          [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(feature.mapId),
          [StatTypeEnum.DependsOn]: StatType.StatTypes[StatTypeEnum.DependsOn]().CreateStat().InitData('search')
        })
      ])
    }

    public handleBook() {
      console.log('testMaTest')
    }

    protected Button(eventHandler: EventHandlerType): void {
      const valueIndex = this.getObjectTemplateIndex('searchForm', this.ObjectTemplates, StatTypeEnum.Tag)
      let queryValue = '-1'
      switch (eventHandler.subObjectType) {
        case SubObjectTypeEnum.Up:
          this.handleBook()
          break
        case SubObjectTypeEnum.Left:
          this.router.push({ name: 'map' })
          break
        case SubObjectTypeEnum.Right:
          this.updateAtPosition(eventHandler.payload)

          this.updateValueData(eventHandler, StatTypeEnum.Option, StatTypeEnum.Tag, StatTypeEnum.Option, StatTypeEnum.OptionIndices)

          if (this.selectedFeatures.indexOf(eventHandler.payload.Stats[0].Data) !== -1) {
            this.selectedFeatures.splice(this.selectedFeatures.indexOf(eventHandler.payload.Stats[0].Data), 1)
          } else {
            this.selectedFeatures.push(eventHandler.payload.Stats[0].Data)
          }

          this.removeElementFromArray(this.ObjectTemplates, 'search')

          if (JSON.parse(this.ObjectTemplates[valueIndex].Stats[StatTypeEnum.Value].Data)[0] ?? '' !== '') {
            queryValue = JSON.parse(this.ObjectTemplates[valueIndex].Stats[StatTypeEnum.Value].Data)[0]
          }
          if (this.selectedFeatures.length) {
            this.Append([
              new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.MultiMedia, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
                [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(queryValue.toLowerCase()),
                [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(JSON.stringify(this.selectedFeatures)),
                [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('content'),
                [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('content'),
                [StatTypeEnum.DependsOn]: StatType.StatTypes[StatTypeEnum.DependsOn]().CreateStat().InitData('search')
              })
            ])
          } else if (queryValue !== '-1') {
            this.Append([
              new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.MultiMedia, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
                [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(queryValue.toLowerCase()),
                [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('content'),
                [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('content'),
                [StatTypeEnum.DependsOn]: StatType.StatTypes[StatTypeEnum.DependsOn]().CreateStat().InitData('search')
              })
            ])
          }

          this.refreshPage()
          break
        case SubObjectTypeEnum.Down:
          this.refreshPage()
          this.removeElementByTag(eventHandler.payload.Stats[StatTypeEnum.Tag].Data.split('|')[1], this.ObjectTemplates)
          this.refreshPage()
          break
      }
    }

    protected isMobileDevice(): boolean {
      return /Mobi|Android|iPhone/i.test(navigator.userAgent)
    }

    protected openNativeShare(): void {
      navigator
        .share({
          //TODO implement content
          title: 'Your Personal Accommodation Link.',
          url: window.location.href
        })
        .then(() => console.log('Content shared successfully'))
        .catch((error) => console.log('Sharing failed', error))
    }

    /*protected openShareWindow(): void {
      const propertyId = this.settingsStore.get('propertyId')
      const unitID = 2138
      const windowURL = router.resolve({
        path: '/share',
        query: { propertyId, unitID }
      }).href

      window.open(windowURL, '', 'width=400,height=700')
    }*/

    protected Field(eventHandler: EventHandlerType) {
      let queryValue = ''
      switch (eventHandler.subObjectType) {
        case SubObjectTypeEnum.ParentObject:
          this.refreshPage()
          if (!this.isJSON(eventHandler.payload.Stats[StatTypeEnum.Value].Data)) {
            this.updateValueDataRev(eventHandler)
            queryValue = eventHandler.payload.Stats[StatTypeEnum.Value].Data
          } else {
            queryValue = JSON.parse(eventHandler.payload.Stats[StatTypeEnum.Value].Data)[0]
          }
          this.removeElementFromArray(this.ObjectTemplates, 'search')
          if (queryValue.length === 0) {
            this.router.push({
              name: 'search'
            })
          }
          if (this.selectedFeatures.length && queryValue === '') {
            queryValue = '-1'
          }
          if (queryValue !== '') {
            this.router.push({
              name: 'search',
              query: { q: queryValue }
            })
            if (this.selectedFeatures.length) {
              this.Append([
                new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.MultiMedia, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
                  [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(queryValue.toLowerCase()),
                  [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(JSON.stringify(this.selectedFeatures)),
                  [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('content'),
                  [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('content'),
                  [StatTypeEnum.DependsOn]: StatType.StatTypes[StatTypeEnum.DependsOn]().CreateStat().InitData('search')
                })
              ])
            } else {
              this.Append([
                new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.MultiMedia, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
                  [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(queryValue.toLowerCase()),
                  [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('content'),
                  [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('content'),
                  [StatTypeEnum.DependsOn]: StatType.StatTypes[StatTypeEnum.DependsOn]().CreateStat().InitData('search')
                })
              ])
            }
          }
          this.refreshPage()
          break
      }
    }

    protected updateValueDataRev(eventHandler: EventHandlerType, tagContainingValue: StatTypeEnum = StatTypeEnum.Value, searchByValueType: StatTypeEnum = StatTypeEnum.Tag) {
      const matchingIndex = this.getObjectTemplateIndex(eventHandler.payload.Stats[searchByValueType].Data, this.ObjectTemplates, searchByValueType)
      if (matchingIndex !== -1) {
        if (this.isJSON(this.ObjectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data)) {
          const stat = JSON.parse(this.ObjectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data)
          stat[eventHandler.payload.Stats[StatTypeEnum.ValueIndices].Data] = eventHandler.payload.Stats[tagContainingValue].Data
          this.ObjectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data = JSON.stringify(stat)
        } else {
          this.ObjectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data = eventHandler.payload.Stats[tagContainingValue].Data
        }
      }
    }

    private isJSON(str: string): boolean {
      let temp = null
      try {
        temp = JSON.parse(str)
      } catch (e) {
        return false
      }
      return Array.isArray(temp)
    }
  }
}
