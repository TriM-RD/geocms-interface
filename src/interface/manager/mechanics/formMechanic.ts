import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { ObjectTypeEnum } from '../events/types/objectType'
import { SubObjectTypeEnum } from '../events/types/subObjectType'
import { MechanicAbstract, MechanicDelegate } from './mechanicAbstract'
import http from '@/http-common'
import { StatType, StatTypeEnum } from '../events/types/statType'
import router from '@/router'
import { RegionEnum, RegionType } from '../events/types/region'
import { EventHandlerType } from '../events/types/objectTypes/types'
import { ActionTypeEnum } from '../events/types'

export namespace Manager.Mechanic{

  export class FormMechanic extends MechanicAbstract {
    private id = '-1';
    private inEdit = false;

    public async InitGet (_id: string, _route: string): Promise<ObjectTemplate[]> {
      this.id = _id
      if (this.id === '-1') {
        this.id = (await http.get(process.env.VUE_APP_BASE_URL + _route + '/' + this.id)).data
        console.log(this.id)
        const response = await http.get(process.env.VUE_APP_BASE_URL + 'form/' + _route)
        return (this.ObjectTemplates = response.data.map((_object: any) => {
          return new ObjectTemplate(_object.Region, _object.ObjectEnum,
            _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats,
              {
                [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat()
                  .InitData(String(this.id))
              }))
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

    private reStructure (stats: any, append: any = null): any {
      let temp = {}
      // console.log(stats)
      // stats.forEach((_stat : any, _index: number) => { if (_stat !== undefined) temp = Object.assign(temp, { [_index]: StatType.StatTypes[_index]().CreateStat().InitData(_stat.Data != null ? _stat.Data : '') }) })
      for (let i = 0; i < Object.keys(StatType.StatTypes).length; i++) {
        if (stats[i] !== undefined) {
          temp = Object.assign(temp, { [i]: StatType.StatTypes[i]().CreateStat().InitData(stats[i].Data != null ? stats[i].Data : '') })
        }
      }
      if (append !== null) { temp = Object.assign(temp, append) }
      return temp
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
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.SelectList].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Field].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.SelectList].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.ECabinetRow].NullifyLogic()
      MechanicAbstract.instance = null
    }

    refreshPage () {
      if (this.mechanicInvoked !== null) {
        this.mechanicInvoked.dispatch(true)
      }
    }

    private compare (objectToCompare: ObjectTemplate): number {
      let answer = -1
      for (let i = 0; i < this.ObjectTemplates.length; i++) {
        if (this.ObjectTemplates[i].Stats[StatTypeEnum.Value] !== undefined) {
          if (this.ObjectTemplates[i].Stats[StatTypeEnum.Value].Data === objectToCompare.Stats[StatTypeEnum.Value].Data) {
            answer = i
            return answer
          }
        }
      }
      return answer
    }

    protected async ECabinetRow (eventHandler: EventHandlerType): Promise<void> {
      this.ObjectTemplates = []
      this.refreshPage()
    }

    protected async FieldButton (eventHandler: EventHandlerType): Promise<void> {
      console.log(eventHandler.payload.Stats[StatTypeEnum.Value].Data)
      const temp = this.ObjectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
      this.ObjectTemplates[temp].Stats[StatTypeEnum.Value].Data = eventHandler.payload.Stats[StatTypeEnum.Value].Data
      console.log(this.ObjectTemplates)
    }

    protected async SelectList (eventHandler: EventHandlerType): Promise<void> {
      switch (router.currentRoute.value.name) {
        case 'DeviceAdd':
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
                if (row.Stats[StatTypeEnum.Tag].Data === 'row') {
                  rowCount = Number(row.Stats[StatTypeEnum.Value].Data)
                  rowsExist = true
                }
              }
              if (rowsExist) { rowCount += 1 }
              this.ObjectTemplates = this.Append([
                new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.ECabinetRow, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
                  [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Row'),
                  [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('row'),
                  [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(rowCount.toString()),
                  [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData('')
                  /* [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
                  [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.Id].Data) */
                })
              ])
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
              /* console.log(eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
              console.log(JSON.parse(JSON.stringify(this.ObjectTemplates))) */
              this.ObjectTemplates.splice(this.ObjectTemplates.findIndex(
                element => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data), 1)
              // console.log(this.ObjectTemplates)
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
              if (this.inEdit) {
                await http.patch(process.env.VUE_APP_BASE_URL + 'user/' + this.id, this.ObjectTemplates)
                  .then(response => (router.push({ name: 'AdministrationEdit', params: { id: response.data.id } })))
              }/* else {
                await http.post('http://blog.test/api/division', this.ObjectTemplates)
                  .then(response => (router.push({ name: 'DivisionEdit', params: { id: response.data.id } })))
              } */
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

    removeElementFromArray (arr: Array<any>, belongsTo: string) {
      (() => {
        // Perform the array update
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].Stats[StatTypeEnum.BelongsTo] !== undefined) {
            if (arr[i].Stats[StatTypeEnum.BelongsTo].Data === belongsTo) {
              arr.splice(i, 1)
            }
          }
        }
      })()
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
          if (this.inEdit) {
            await http.patch(process.env.VUE_APP_BASE_URL + route + '/' + this.id, this.ObjectTemplates)
              .then((response) => {
                if (response.data.id !== false) {
                  router.push({
                    name: redirectTo,
                    params: { id: response.data.id }
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
