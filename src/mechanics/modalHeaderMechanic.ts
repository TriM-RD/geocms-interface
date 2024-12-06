import { EventHandlerType, MechanicAbstract, ObjectTemplate, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum } from '@cybertale/interface'
import router from '@/router'

export namespace Manager.Mechanic {
  export class ModalHeaderMechanic extends MechanicAbstract {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async InitGet(_id: string): Promise<ObjectTemplate[]> {
      throw new Error('Function not implemented')
    }

    public InitSet(_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = []
      for (const _object of _objectTemplates) {
        this.ObjectTemplates.push(new ObjectTemplate(_object.Region, _object.ObjectEnum, _object.SubObjectEnum, _object.ActionEnum, _object.Stats))
      }
      return this.ObjectTemplates
    }

    protected SubscribeConditions(): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.MultiMedia].SubscribeLogic(this.MultiMedia.bind(this))
    }

    public UnsubscribeConditions(): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.MultiMedia].NullifyLogic()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected Button(eventHandler: EventHandlerType): void {
      throw new Error('Function not implemented')
    }

    refreshPage(): void {
      if (this.mechanicInvoked !== null) {
        this.mechanicInvoked.dispatch()
      }
    }

    protected async MultiMedia(_eventHandler: EventHandlerType): Promise<void> {
      const name = router.currentRoute.value.name
      if (typeof name !== 'string') return

      switch (name) {
        case 'unitId':
          switch (_eventHandler.subObjectType) {
            default:
              this.refreshPage()
              this.ObjectTemplates[this.getObjectTemplateIndex('secondary|header', this.ObjectTemplates, StatTypeEnum.Tag)].Stats[StatTypeEnum.Value].Data = _eventHandler.payload.Stats[StatTypeEnum.Value].Data
              this.ObjectTemplates[this.getObjectTemplateIndex('secondary|header', this.ObjectTemplates, StatTypeEnum.Tag)].Stats[StatTypeEnum.Label].Data = _eventHandler.payload.Stats[StatTypeEnum.Label].Data
              this.refreshPage()
              break
          }
          break
      }
    }
  }
}
