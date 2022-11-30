import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { ObjectType, ObjectTypeEnum } from '../events/types/objectType'
import { SubObjectTypeEnum } from '../events/types/subObjectType'
import { MechanicAbstract } from './mechanicAbstract'
import { Manager as Stat } from '../events/types/statTypes/types'
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
        this.id = (await http.get('http://blog.test/api/' + _route + '/' + this.id)).data
        console.log(this.id)
        const response = await http.get('http://blog.test/api/form/' + _route)
        return (this.ObjectTemplates = response.data.map((_object: any) => {
          return new ObjectTemplate(_object.Region, _object.ObjectEnum,
            _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats,
              {
                [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat()
                  .InitData(String(this.id))
              }))
        }))
      }
      const response = await http.get('http://blog.test/api/' + _route + '/' + this.id)
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
      console.log(temp)
      return temp
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions () {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
    }

    protected async Button (eventHandler: EventHandlerType): Promise<void> {
      // const targetCopy = new ObjectTemplate(eventHandler.payload.Region, eventHandler.payload.ObjectEnum, eventHandler.payload.SubObjectEnum, eventHandler.payload.ActionEnum, this.reStructure(Object.values(JSON.parse(JSON.stringify(eventHandler.payload.Stats)))))
      switch (router.currentRoute.value.name) {
        case 'DeviceAdd':
        case 'DeviceEdit':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:
              if (this.inEdit) {
                await http.patch('http://blog.test/api/entity/' + this.id, this.ObjectTemplates)
                  .then(response => (router.push({ name: 'DeviceEdit', params: { id: response.data.id } })))
              } else {
                await http.post('http://blog.test/api/entity', this.ObjectTemplates)
                  .then(response => (router.push({ name: 'DeviceEdit', params: { id: response.data.id } })))
              }
              break
            case SubObjectTypeEnum.Right:
              router.back()
              break
            default:
              break
          }
          break
        case 'GroupAdd':
        case 'GroupEdit':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:
              if (this.inEdit) {
                await http.patch('http://blog.test/api/group/' + this.id, this.ObjectTemplates)
                  .then(response => (router.push({ name: 'GroupEdit', params: { id: response.data.id } })))
              } else {
                await http.post('http://blog.test/api/group', this.ObjectTemplates)
                  .then(response => (router.push({ name: 'GroupEdit', params: { id: response.data.id } })))
              }
              break
            case SubObjectTypeEnum.Middle:
              await router.push({ name: 'AttributeAdd', params: { parentId: this.id } })
              break
            case SubObjectTypeEnum.Right:
              router.back()
              break
            default:
              break
          }
          break
        case 'AttributeAdd':
        case 'AttributeEdit':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:
              if (this.inEdit) {
                await http.patch('http://blog.test/api/attribute/' + this.id, this.ObjectTemplates)
                  .then(response => (router.push({ name: 'AttributeEdit', params: { id: response.data.id } })))
              } else {
                await http.post('http://blog.test/api/attribute', this.ObjectTemplates)
                  .then(response => (router.push({ name: 'AttributeEdit', params: { id: response.data.id } })))
              }
              break
            case SubObjectTypeEnum.Right:
              router.back()
              break
            default:
              break
          }
          break
      }
    }
  }

}
