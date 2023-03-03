import http from '@/http-common'
import { EventHandlerType, ObjectTemplate, ObjectTypeEnum, SubObjectTypeEnum, MechanicAbstract, MechanicDelegate, StatTypeEnum, RegionEnum, RegionType } from '@cybertale/interface'
import router from '@/router'

export namespace Manager.Mechanic{

  export class ModalFormMechanic extends MechanicAbstract {
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
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.SelectList].NullifyLogic()
      this.ObjectTemplates = []
    }

    protected async SelectList (eventHandler: EventHandlerType): Promise<void> {
      switch (router.currentRoute.value.name) {
        case 'DeviceAdd':
        case 'DeviceEdit':// TODO add regex to check if id is uuid
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Middle:
              this.removeElementFromArray(this.ObjectTemplates, 'group')
              this.refreshPage()
              this.ObjectTemplates = this.Append((await http.get(process.env.VUE_APP_BASE_URL + 'form/entity/' + eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
              this.refreshPage()
              break
            default:
              break
          }
          break
      }
    }

    protected async Button (eventHandler: EventHandlerType): Promise<void> {
      const temp = document.getElementById('formModalSubmit' + eventHandler.payload.Stats[StatTypeEnum.Value].Data)
      switch (eventHandler.subObjectType) {
        case SubObjectTypeEnum.Left:
          await this.validateForm('entity', temp)
          break
        default:
          break
      }
    }

    static getInstance (_mechanicCallback: MechanicDelegate | null = null): MechanicAbstract {
      if (!MechanicAbstract.instance) {
        MechanicAbstract.instance = new ModalFormMechanic()
      }
      MechanicAbstract.instance.SubscribeToVueComponent(_mechanicCallback)
      return MechanicAbstract.instance
    }

    private async validateForm (route: string, temp: any) {
      for (const form of document.getElementsByClassName('needs-validation')) {
        if (!(form as HTMLFormElement).checkValidity()) {
          form.classList.add('was-validated')
        } else {
          await http.post(process.env.VUE_APP_BASE_URL + route, this.ObjectTemplates)
            .then((response) => {
              if (response.data.id !== false) {
                if (temp !== null) { temp.click() }
              } else {
                this.refreshPage()
                form.classList.remove('was-validated')
                this.ObjectTemplates.length = 0
                this.ObjectTemplates = this.Append(response.data.entities)
                this.refreshPage()
              }
            })
          // }
        }
      }
    }
  }

}
