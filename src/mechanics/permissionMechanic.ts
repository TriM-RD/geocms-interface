import { EventHandlerType, RegionEnum, RegionType, MechanicAbstract, SubObjectTypeEnum, ObjectTypeEnum, ObjectTemplate } from '@cybertale/interface'
import router from '@/router'

export namespace Manager.Mechanic{

  export class PermissionMechanic extends MechanicAbstract {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async InitGet (_id: string, _api: string): Promise<ObjectTemplate[]> {
      throw new Error('Function not implemented')
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
    }

    protected async Button (_eventHandler: EventHandlerType): Promise<void> {
      switch (_eventHandler.subObjectType) {
        case SubObjectTypeEnum.Left:
          this.refreshPage()
          break
        case SubObjectTypeEnum.Right:
          await router.go(0)
          break
      }
    }
  }

}
