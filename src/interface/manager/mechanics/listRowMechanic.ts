import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { ObjectTypeEnum } from '../events/types/objectType'
import { SubObjectTypeEnum } from '../events/types/subObjectType'
import { MechanicAbstract } from './mechanicAbstract'
import { StatTypeEnum } from '../events/types/statType'
import { RegionEnum, RegionType } from '@/interface/manager/events/types'
import router from '@/router'
import { EventHandlerType } from '../events/types/objectTypes/types'

export namespace Manager.Mechanic{

  export class ListRowMechanic extends MechanicAbstract {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async InitGet (_id = '-1'): Promise<ObjectTemplate[]> {
      throw new Error('Function not implemented')
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.List].ObjectTypes[ObjectTypeEnum.ListRow].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.List].ObjectTypes[ObjectTypeEnum.ListRow].NullifyLogic()
    }

    protected Button (eventHandler: EventHandlerType): void {
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
