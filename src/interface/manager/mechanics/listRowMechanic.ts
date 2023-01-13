import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { ObjectType, ObjectTypeEnum } from '../events/types/objectType'
import { SubObjectTypeEnum } from '../events/types/subObjectType'
import { MechanicAbstract } from './mechanicAbstract'
import http from '@/http-common'
import { StatType, StatTypeEnum } from '../events/types/statType'
import { RegionEnum, ActionTypeEnum, RegionType } from '@/interface/manager/events/types/index'
import router from '@/router'
import { EventHandlerType } from '../events/types/objectTypes/types'

export namespace Manager.Mechanic{

  export class ListRowMechanic extends MechanicAbstract {
    public async InitGet (_id = '-1'): Promise<ObjectTemplate[]> {
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
      stats.forEach((_stat : any, _index: number) => { temp = Object.assign(temp, { [_index]: StatType.StatTypes[_index]().CreateStat().InitData(_stat.Data != null ? _stat.Data : '') }) })
      return temp
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.List].ObjectTypes[ObjectTypeEnum.ListRow].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions () {
      RegionType.RegionTypes[RegionEnum.List].ObjectTypes[ObjectTypeEnum.ListRow].NullifyLogic()
    }

    protected Button (eventHandler: EventHandlerType): void {
      // const _id = this.ObjectTemplates[0].Stats[StatTypeEnum.Id].Data
      const _id = eventHandler.payload.Stats[StatTypeEnum.Id].Data
      const _label = eventHandler.payload.Stats[StatTypeEnum.Label].Data
      switch (eventHandler.subObjectType) {
        case SubObjectTypeEnum.ParentObject:
          switch (_label) {
            case 'Group':
              router.push({ name: 'GroupEdit', params: { id: _id } })
              break
            case 'Division':
              router.push({ name: 'DivisionEdit', params: { id: _id } })
              break
            case 'Device':
              router.push({ name: 'DeviceEdit', params: { id: _id } })
              break
            default:
              break
          }
          break
        default:
          break
      }
    }
  }

}
