import http from '@/http-common'
import {
  EventHandlerType,
  ObjectTemplate,
  ObjectTypeEnum,
  SubObjectTypeEnum,
  MechanicAbstract,
  MechanicDelegate,
  StatTypeEnum,
  RegionEnum,
  RegionType,
  ActionTypeEnum, StatType
} from '@cybertale/interface'
import router from '@/router'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'

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
      switch (router.currentRoute.value.name) {
        case 'DeviceAdd':
        case 'DeviceEdit':// TODO add regex to check if id is uuid
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Middle:
              this.removeElementFromArray(this.ObjectTemplates, 'group')
              this.refreshPage()
              this.ObjectTemplates = this.Append((await http.get(process.env.VUE_APP_BASE_URL + 'form/entity_modal/' + eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
              this.refreshPage()
              break
            default:
              break
          }
          /* switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Middle:
              this.removeElementFromArray(this.ObjectTemplates, 'group')
              this.refreshPage()
              console.log(this.ObjectTemplates)
              this.ObjectTemplates = this.AppendAndFilterDuplicate((await http.get(process.env.VUE_APP_BASE_URL + 'form/entity/' + eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
              console.log(this.ObjectTemplates)
              this.refreshPage()
              break
            default:
              break
          } */
          break
      }
    }

    protected async Button (eventHandler: EventHandlerType): Promise<void> {
      const temp = document.getElementById('formModalSubmit' + eventHandler.payload.Stats[StatTypeEnum.Value].Data)
      switch (eventHandler.subObjectType) {
        case SubObjectTypeEnum.Middle:
          await this.resolveButtonMiddle(eventHandler, eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
          break
        case SubObjectTypeEnum.Left:
          await this.validateForm('entity', temp)
          break
        case SubObjectTypeEnum.Right:
          await router.push({
            name: 'Device'
          })
          break
        case SubObjectTypeEnum.Down:
          this.refreshPage()
          this.resolveButtonDown(eventHandler, eventHandler.payload.Stats[StatTypeEnum.Tag].Data.split('-'))
          this.refreshPage()
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

    private async resolveButtonMiddle (eventHandler: EventHandlerType, tag: string) {
      switch (tag) {
        default:
          this.refreshPage()
          this.ObjectTemplates = this.Splice(2, [// TODO while 2 is correct, it needs to be redone to make it programmatic
            new ObjectTemplate(RegionEnum.ModalForm, ObjectTypeEnum.SelectButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
              [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.ItemList].Data),
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Division'),
              [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(Math.random().toString(36).slice(2, 7).toString()),
              [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
              [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.Id].Data),
              [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.ErrorMessage].Data)
            })
          ])
          this.refreshPage()
          break
      }
    }

    private resolveButtonDown (eventHandler: EventHandlerType, strings: string[]) {
      switch (strings[0]) {
        case 'destroy':
          if (window.confirm('Are you sure you want to delete this entity?')) {
            http.delete(process.env.VUE_APP_BASE_URL + 'entity' + '/' + this.id)
              .then((response) => {
                useToast()({
                  component: ToastComponent,
                  props: {
                    msg: response.data.msg
                  }
                }, {
                  type: response.data.status as TYPE
                })
                router.push({
                  name: 'Device'
                })
              })
          }
          break
        case 'codeButton':
          this.generateCode(eventHandler, strings[0])
          this.refreshPage()
          this.refreshPage()
          break
        case 'delete':
          this.removeElementByTag(eventHandler, strings[1])
          break
        default:
          break
      }
    }

    private removeElementByTag (eventHandler : EventHandlerType, tag : string) {
      const elementIndex = this.ObjectTemplates.findIndex(
        element => element.Stats[StatTypeEnum.Tag].Data === tag)
      this.ObjectTemplates.splice(elementIndex, 1)
    }

    private generateCode (eventHandler: EventHandlerType, string: string) {
      const temp = this.ObjectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === 'code')
      console.log(this.ObjectTemplates[temp].Stats[StatTypeEnum.Label].Data)
      console.log(this.ObjectTemplates[temp].Stats[StatTypeEnum.Value].Data)
      this.ObjectTemplates[temp].Stats[StatTypeEnum.Value].Data = this.generateRandomString(this.ObjectTemplates[temp].Stats[StatTypeEnum.Id].Data)
      console.log(this.ObjectTemplates[temp].Stats[StatTypeEnum.Value].Data)
    }

    generateRandomString (inputString: string): string {
      const characters = inputString.split('')
      for (let i = characters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = characters[i]
        characters[i] = characters[j]
        characters[j] = temp
      }
      return characters.join('')
    }

    private async validateForm (route: string, temp: any) {
      const form = document.getElementById('modal-form')
      if (form) {
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
