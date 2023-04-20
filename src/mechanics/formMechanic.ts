import { MechanicAbstract, MechanicDelegate, ActionTypeEnum, StatType, StatTypeEnum, RegionEnum, RegionType, EventHandlerType, SubObjectTypeEnum, ObjectTypeEnum, ObjectTemplate } from '@cybertale/interface'
import http from '@/http-common'
import router from '@/router'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'

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
          name: 'DeviceEdit',
          params: { id: response.data.id }
        })
        return []
      }
      this.inEdit = true
      console.log(response.data)
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
      MechanicAbstract.instance = null
    }

    protected async DataList (eventHandler: EventHandlerType): Promise<void> {
      if (eventHandler.payload.Stats[StatTypeEnum.Value].Data.id === null) {
        return
      }
      this.refreshPage()
      const temp = this.ObjectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
      if (eventHandler.payload.Stats[StatTypeEnum.Value].Data.id !== null) {
        this.ObjectTemplates[temp].Stats[StatTypeEnum.Value].Data = eventHandler.payload.Stats[StatTypeEnum.Value].Data.id
      } else {
        this.ObjectTemplates[temp].Stats[StatTypeEnum.Value].Data = ''
      }
      this.refreshPage()
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
        case 'AttributeAdd':
        case 'AttributeEdit':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Middle:
              this.removeElementFromArray(this.ObjectTemplates, 'attributeType')
              this.refreshPage()
              this.ObjectTemplates = this.Append((await http.get(process.env.VUE_APP_BASE_URL + 'form/attribute/' + eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
              this.refreshPage()
              break
            default:
              break
          }
          break
      }
    }

    protected async Button (eventHandler: EventHandlerType): Promise<void> {
      let rowCount = 0
      let rowsExist = false
      switch (router.currentRoute.value.name) {
        case 'DeviceAdd':
        case 'DeviceEdit':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Middle:
              this.refreshPage()
              this.ObjectTemplates = this.Splice(2, [// TODO while 2 is correct, it needs to be redone to make it programmatic
                new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.SelectButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
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
            case SubObjectTypeEnum.Left:
              await this.validateForm('entity', 'DeviceEdit')
              break
            case SubObjectTypeEnum.Right:
              await router.push({
                name: 'Device'
              })
              break
            case SubObjectTypeEnum.Up:
              this.refreshPage()
              for (const row of this.ObjectTemplates) {
                if (row.Stats[StatTypeEnum.Tag].Data === 'ecabinetRow') {
                  rowCount = Number(row.Stats[StatTypeEnum.Value].Data)
                  rowsExist = true
                }
              }
              if (rowsExist) { rowCount += 1 }
              this.ObjectTemplates = this.Append([
                new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.ECabinetRow, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
                  [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Row'),
                  [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('ecabinetRow'),
                  [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(rowCount.toString()),
                  [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData('')
                })
              ])
              this.refreshPage()
              break
            case SubObjectTypeEnum.Down:
              this.refreshPage()
              console.log(eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
              this.ObjectTemplates.splice(this.ObjectTemplates.findIndex(
                element => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data), 1)
              this.refreshPage()
              break
            default:
              break
          }
          break
        case 'GroupAdd':
        case 'GroupEdit':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:
              await this.validateForm('group', 'GroupEdit')
              break
            case SubObjectTypeEnum.Middle:
              await router.push({ name: 'AttributeAdd', params: { parentId: this.id } })
              break
            case SubObjectTypeEnum.Right:
              await router.push({
                name: 'Group'
              })
              break
            default:
              break
          }
          break
        case 'DivisionAdd':
        case 'DivisionEdit':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:
              await this.validateForm('division', 'DivisionEdit')
              break
            case SubObjectTypeEnum.Middle:
              this.refreshPage()
              this.ObjectTemplates = this.Append([
                new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.SelectButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
                  [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.ItemList].Data),
                  [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Permission'),
                  [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(Math.random().toString(36).slice(2, 7).toString()),
                  [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
                  [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.Id].Data),
                  [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.ErrorMessage].Data)
                })
              ])
              this.refreshPage()
              break
            case SubObjectTypeEnum.Right:
              await router.push({
                name: 'Division'
              })
              break
            case SubObjectTypeEnum.Down:
              this.refreshPage()
              this.ObjectTemplates.splice(this.ObjectTemplates.findIndex(
                element => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data), 1)
              this.refreshPage()
              break
            default:
              break
          }
          break
        case 'AttributeAdd':
        case 'AttributeEdit':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:
              await this.validateForm('attribute', 'AttributeEdit')
              break
            case SubObjectTypeEnum.Middle:
              this.refreshPage()
              this.ObjectTemplates = this.Append([
                new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.FieldButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
                  [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Value'),
                  [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(Math.random().toString(36).slice(2, 7).toString()),
                  [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
                  [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.Id].Data)
                })
              ])
              this.refreshPage()
              break
            case SubObjectTypeEnum.Right:
              await router.push({
                name: 'GroupEdit',
                params: { id: router.currentRoute.value.params.parentId }
              })
              break
            case SubObjectTypeEnum.Down:
              this.refreshPage()
              this.ObjectTemplates.splice(this.ObjectTemplates.findIndex(
                element => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data), 1)
              this.refreshPage()
              break
            default:
              break
          }
          break
        case 'AdministrationEdit':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Right:
              await router.push({
                name: 'Administration'
              })
              break
            case SubObjectTypeEnum.Left:
              await this.validateForm('user', 'AdministrationEdit')
              break
            case SubObjectTypeEnum.Middle:
              this.refreshPage()
              this.ObjectTemplates = this.Append([
                new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.SelectButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
                  [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.ItemList].Data),
                  [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Permission'),
                  [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(Math.random().toString(36).slice(2, 7).toString()),
                  [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
                  [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.Id].Data)
                })
              ])
              this.refreshPage()
              break
            case SubObjectTypeEnum.Down:
              this.refreshPage()
              this.ObjectTemplates.splice(this.ObjectTemplates.findIndex(
                element => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data), 1)
              this.refreshPage()
              break
            default:
              break
          }
          break
      }
    }

    static getInstance (_mechanicCallback: MechanicDelegate | null = null): MechanicAbstract {
      if (!MechanicAbstract.instance) {
        MechanicAbstract.instance = new FormMechanic()
      }
      MechanicAbstract.instance.SubscribeToVueComponent(_mechanicCallback)
      return MechanicAbstract.instance
    }

    private async validateForm (route: string, redirectTo: string) {
      for (const form of document.getElementsByClassName('needs-validation')) {
        if (!(form as HTMLFormElement).checkValidity()) {
          form.classList.add('was-validated')
        } else {
          if (this.inEdit && !(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(this.id))) {
            await http.patch(process.env.VUE_APP_BASE_URL + route + '/' + this.id, this.ObjectTemplates)
              .then((response) => {
                if (response.data.id !== false) {
                  this.refreshPage()
                  this.ObjectTemplates.length = 0
                  this.ObjectTemplates = this.Append(response.data.entities)
                  this.refreshPage()
                  useToast()({
                    component: ToastComponent,
                    props: { msg: { title: '', info: 'Form submitted.' } }
                  }, {
                    type: TYPE.SUCCESS
                  })
                } else {
                  this.refreshPage()
                  form.classList.remove('was-validated')
                  this.ObjectTemplates.length = 0
                  this.ObjectTemplates = this.Append(response.data.entities)
                  this.refreshPage()
                }
              })
          } else {
            await http.post(process.env.VUE_APP_BASE_URL + route, this.ObjectTemplates)
              .then((response) => {
                if (response.data.id !== false) {
                  router.push({
                    name: redirectTo,
                    params: { id: response.data.id }
                  })
                  useToast()({
                    component: ToastComponent,
                    props: { msg: { title: '', info: 'Form submitted.' } }
                  }, {
                    type: TYPE.SUCCESS
                  })
                } else {
                  this.refreshPage()
                  form.classList.remove('was-validated')
                  this.ObjectTemplates.length = 0
                  this.ObjectTemplates = this.Append(response.data.entities)
                  this.refreshPage()
                }
              })
          }
        }
      }
    }
  }

}