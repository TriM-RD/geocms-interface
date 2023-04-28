import { MechanicAbstract, StatTypeEnum, RegionEnum, RegionType, EventHandlerType, SubObjectTypeEnum, ObjectTypeEnum, ObjectTemplate } from '@cybertale/interface'
import router from '@/router'

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
            case 'Replacement History':
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
