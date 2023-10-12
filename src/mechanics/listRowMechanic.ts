import { MechanicAbstract, StatTypeEnum, RegionEnum, RegionType, EventHandlerType, SubObjectTypeEnum, ObjectTypeEnum, ObjectTemplate } from '@cybertale/interface'
import router from '@/router'
import { Definitions } from '@/definitions/appDefinitions'

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
            case Definitions.Group.Def:
              router.push({ name: Definitions.Group.Edit, params: { id: _id } })
              break
            case Definitions.Division.Def:
              router.push({ name: Definitions.Division.Edit, params: { id: _id } })
              break
            case Definitions.Device.Def:
            case 'Replacement History':
              router.push({ name: Definitions.Device.Edit, params: { id: _id } })
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
