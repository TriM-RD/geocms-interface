import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { ObjectType, ObjectTypeEnum } from '../events/types/objectType'
import { SubObjectTypeEnum } from '../events/types/subObjectType'
import { MechanicAbstract } from './mechanicAbstract'
import http from '@/http-common'
import { StatType, StatTypeEnum } from '../events/types/statType'
import { RegionEnum, ActionTypeEnum, RegionType } from '@/interface/manager/events/types/index'
import router from '@/router'
import { EventHandlerType } from '../events/types/objectTypes/types'
import { routerKey, useRouter } from 'vue-router'

export namespace Manager.Mechanic{

  export class RowMechanic extends MechanicAbstract {
    public async InitGet (_id: string): Promise<ObjectTemplate[]> {
      this.ObjectTemplates = []
      const response = await http.get('http://blog.test/api/entity')
      return (this.ObjectTemplates = this.forEachElement(response.data))
    }

    private forEachElement (data: any) : ObjectTemplate[] {
      let _temp: ObjectTemplate[] = []
      data.forEach((_list: any) => {
        _temp = _temp.concat(_list.map((_object: any) => {
          return new ObjectTemplate(RegionEnum.Table, ObjectTypeEnum.Row, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Click, this.reStructure(_object.Stats))
        }))
      })
      return _temp
    }

    private reStructure (stats: any): any {
      let temp = {}
      // temp = Object.assign(temp, { [_index]: StatType.StatTypes[_index]().CreateStat().InitData(_stat.Data != null ? _stat.Data : '') })
      stats.forEach((_stat : any, _index: number) => { temp = Object.assign(temp, { [_index]: StatType.StatTypes[_index]().CreateStat().InitData(_stat.Data != null ? _stat.Data : '') }) })
      return temp
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = []
      for (const _object of _objectTemplates) {
        this.ObjectTemplates.push(new ObjectTemplate(RegionEnum.TableColumn, ObjectTypeEnum.Column, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Click, _object.Stats))
      }
      return this.ObjectTemplates
    }

    public SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.TableColumn].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions () {
      RegionType.RegionTypes[RegionEnum.TableColumn].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      MechanicAbstract.instance = null
    }

    protected Button (eventHandler: EventHandlerType): void {
      const _id = eventHandler.payload.Stats[StatTypeEnum.Id].Data
      switch (router.currentRoute.value.name) {
        case 'Device':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:// Izbriši
              http.delete('http://blog.test/api/entity/' + _id)
                .then(response => (router.push({ name: 'Device' })))
              router.replace({ name: 'Group' })
              break
            case SubObjectTypeEnum.Middle: // Uredi
              router.push({ name: 'DeviceEdit', params: { id: _id } })
              break
            case SubObjectTypeEnum.Right: // Pregledaj
              router.push({ name: 'DeviceEdit', params: { id: _id } })
              break
            default:
              break
          }
          break
        case 'Group':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:// Izbriši
              http.delete('http://blog.test/api/group/' + _id)
                .then(response => (router.push({ name: 'Group' })))
              router.replace({ name: 'Device' })
              break
            case SubObjectTypeEnum.Middle: // Uredi
              router.push({ name: 'GroupEdit', params: { id: _id } })
              break
            case SubObjectTypeEnum.Right: // Pregledaj
              router.push({ name: 'GroupEdit', params: { id: _id } })
              break
            default:
              break
          }
          break
        case 'GroupEdit':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:// Izbriši
              // eslint-disable-next-line no-case-declarations
              const tempParam = router.currentRoute.value.params.id
              http.delete('http://blog.test/api/attribute/' + _id)
                .then(response => (router.push({ name: 'GroupEdit', params: { id: tempParam } })))
              router.replace({ name: 'Device' })
              break
            case SubObjectTypeEnum.Middle: // Pregledaj
              router.push({ name: 'AttributeEdit', params: { parentId: router.currentRoute.value.params.id, id: _id } })
              break
            case SubObjectTypeEnum.Right: // Pregledaj
              router.push({ name: 'AttributeEdit', params: { id: _id } })
              break
            default:
              break
          }
          break
        case 'Division':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:// Izbriši
              http.delete('http://blog.test/api/division/' + _id)
                .then(response => (router.push({ name: 'Division' })))
              router.replace({ name: 'Device' })
              break
            case SubObjectTypeEnum.Middle: // Uredi
              router.push({ name: 'DivisionEdit', params: { id: _id } })
              break
            case SubObjectTypeEnum.Right: // Pregledaj
              router.push({ name: 'DivisionEdit', params: { id: _id } })
              break
            default:
              break
          }
          break
        case 'Administration':
          switch (eventHandler.subObjectType) {
            /* case SubObjectTypeEnum.Left:// Izbriši
              http.delete('http://blog.test/api/division/' + _id)
                .then(response => (router.push({ name: 'Division' })))
              router.push({ name: 'Device' })
              break */
            case SubObjectTypeEnum.Middle: // Uredi
              router.push({ name: 'AdministrationEdit', params: { id: _id } })
              break
            case SubObjectTypeEnum.Right: // Pregledaj
              router.push({ name: 'AdministrationEdit', params: { id: _id } })
              break
            default:
              break
          }
          break
      }
    }

    static getInstance (): MechanicAbstract {
      if (!MechanicAbstract.instance) {
        MechanicAbstract.instance = new RowMechanic()
      }

      return MechanicAbstract.instance
    }
  }

}
