import http from '@/http-common'
import {
  EventHandlerType,
  ObjectTemplate,
  ObjectTypeEnum,
  MechanicAbstract,
  MechanicDelegate,
  StatTypeEnum,
  RegionEnum,
  RegionType
} from '@cybertale/interface'
import router from '@/router'
import { ResolverType } from '@/resolvers/resolverType'
import { Definitions } from '@/definitions/appDefinitions'
import { ResolverInterface } from '@/resolvers/assignments/resolverInterface'
import { FormWrapper } from '@/resolvers/assignments/formWrapper'
import * as Device from '@/resolvers/entity'

export namespace Manager.Mechanic{

  export class ModalFormMechanic extends MechanicAbstract {
    private id = '-1';
    private inEdit = false;

    public async InitGet (_id: string, _route: string): Promise<ObjectTemplate[]> {
      this.id = _id
      if (this.id === '-1') {
        const response = await http.get(import.meta.env.VITE_APP_BASE_URL + 'form/' + _route)
        return (this.ObjectTemplates = response.data.map((_object: any) => {
          return new ObjectTemplate(_object.Region, _object.ObjectEnum,
            _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats))
        }))
      }
      const response = await http.get(import.meta.env.VITE_APP_BASE_URL + _route + '/' + this.id)
      this.inEdit = true
      return (this.ObjectTemplates = response.data.map((_object: any) => {
        return new ObjectTemplate(_object.Region, _object.ObjectEnum,
          _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats))
      }))
    }

    private forEachElement (data: any) : ObjectTemplate[] {
      let _temp: ObjectTemplate[] = []
      data.forEach((_list: any) => {
        _temp = _temp.concat(_list.map((_object: any) => {
          return new ObjectTemplate(_object.Region, _object.ObjectEnum, _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats))
        }))
      })
      return _temp
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.SelectList].SubscribeLogic(this.SelectList.bind(this))
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.Field].SubscribeLogic(this.FieldButton.bind(this))
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.SelectList].SubscribeLogic(this.FieldButton.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.SelectList].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.Field].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.SelectList].NullifyLogic()
      this.ObjectTemplates = []
    }

    protected async FieldButton (eventHandler: EventHandlerType): Promise<void> {
      const temp = this.ObjectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
      this.ObjectTemplates[temp].Stats[StatTypeEnum.Value].Data = eventHandler.payload.Stats[StatTypeEnum.Value].Data
    }

    protected async SelectList (eventHandler: EventHandlerType): Promise<void> {
      const name = router.currentRoute.value.name
      if (typeof name === 'string') {
        this.ObjectTemplates = await (ResolverType.ResolverTypes[Definitions.Entity.Modal] as ResolverInterface<FormWrapper>).FormSelectList(new FormWrapper().SelectList(eventHandler, this.ObjectTemplates, this.refreshPage.bind(this), this.Append.bind(this)))
      }// TODO add regex to check if id is uuid
    }

    protected async Button (eventHandler: EventHandlerType): Promise<void> {
      const name = router.currentRoute.value.name
      if (typeof name !== 'string') {
        return
      }
      let tempId = this.id
      if (eventHandler.payload.Stats[StatTypeEnum.Value]) { tempId = 'formModalSubmit' + eventHandler.payload.Stats[StatTypeEnum.Value].Data }
      await (new Device.Modal.ModalHandler() as ResolverInterface<FormWrapper>).FormButton(new FormWrapper().Button(eventHandler, this.ObjectTemplates, this.refreshPage.bind(this), this.Append.bind(this), tempId, this.inEdit))
    }

    static getInstance (_mechanicCallback: MechanicDelegate | null = null): MechanicAbstract {
      if (!MechanicAbstract.instance) {
        MechanicAbstract.instance = new ModalFormMechanic()
      }
      MechanicAbstract.instance.SubscribeToVueComponent(_mechanicCallback)
      return MechanicAbstract.instance
    }
  }

}
