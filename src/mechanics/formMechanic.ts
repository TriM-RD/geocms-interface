import {
  EventHandlerType,
  MechanicAbstract,
  ObjectTemplate,
  ObjectTypeEnum,
  RegionEnum,
  RegionType,
  StatTypeEnum
} from '@cybertale/interface'
import http from '@/http-common'
import router from '@/router'
import { Definitions } from '@/definitions/appDefinitions'
import { ResolverType } from '@/resolvers/resolverType'
import { FormWrapper } from '@/resolvers/assignments/formWrapper'
import { ResolverInterface } from '@/resolvers/assignments/resolverInterface'

export namespace Manager.Mechanic{

  export class FormMechanic extends MechanicAbstract {
    private id = '-1';
    private inEdit = false;

    public async InitGet (_id: string, _route: string): Promise<ObjectTemplate[]> {
      this.id = _id
      if (this.id === '-1') {
        const response = await http.get(process.env.VUE_APP_BASE_URL + 'form/' + _route)
        return (this.ObjectTemplates = response.data.map((_object: any) => {
          return new ObjectTemplate(_object.Region, _object.ObjectEnum,
            _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats))
        }))
      }
      const response = await http.get(process.env.VUE_APP_BASE_URL + _route + '/' + this.id)
      if (response.data.id !== undefined) {
        await router.push({
          name: Definitions.Entity.Edit,
          params: { id: response.data.id }
        })
        return []
      }
      this.inEdit = true
      return (this.ObjectTemplates = response.data.map((_object: any) => {
        return new ObjectTemplate(_object.Region, _object.ObjectEnum,
          _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats))
      }))
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.SelectList].SubscribeLogic(this.SelectList.bind(this))
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Field].SubscribeLogic(this.FieldButton.bind(this))
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.SelectList].SubscribeLogic(this.FieldButton.bind(this))
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.ECabinetRow].SubscribeLogic(this.ECabinetRow.bind(this))
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.DataList].SubscribeLogic(this.DataList.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.SelectList].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Field].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.SelectList].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.ECabinetRow].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.DataList].NullifyLogic()
      MechanicAbstract.instance = null
    }

    protected async DataList (eventHandler: EventHandlerType): Promise<void> {
      if (eventHandler.payload.Stats[StatTypeEnum.Value].Data.id === null) {
        return
      }
      this.ObjectTemplates = await (ResolverType.ResolverTypes[Definitions.Other.Any] as ResolverInterface<FormWrapper>).FormDataList(new FormWrapper().DataList(eventHandler, this.ObjectTemplates, this.refreshPage.bind(this)))
    }

    protected async ECabinetRow (eventHandler: EventHandlerType): Promise<void> {
      this.ObjectTemplates = []
      this.refreshPage()
    }

    protected async FieldButton (eventHandler: EventHandlerType): Promise<void> {
      const temp = this.ObjectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
      this.ObjectTemplates[temp].Stats[StatTypeEnum.Value].Data = eventHandler.payload.Stats[StatTypeEnum.Value].Data
    }

    protected async SelectList (eventHandler: EventHandlerType): Promise<void> {
      const name = router.currentRoute.value.name
      if (typeof name === 'string') {
        this.ObjectTemplates = await (ResolverType.ResolverTypes[name] as ResolverInterface<FormWrapper>).FormSelectList(new FormWrapper().SelectList(eventHandler, this.ObjectTemplates, this.refreshPage.bind(this), this.Append.bind(this)))
      }// TODO add regex to check if id is uuid
    }

    protected async Button (eventHandler: EventHandlerType): Promise<void> {
      const name = router.currentRoute.value.name
      if (typeof name !== 'string') {
        return
      }
      this.ObjectTemplates = await (ResolverType.ResolverTypes[name] as ResolverInterface<FormWrapper>).FormButton(new FormWrapper().Button(eventHandler, this.ObjectTemplates, this.refreshPage.bind(this), this.Append.bind(this), this.id, this.inEdit))
    }
  }

}
