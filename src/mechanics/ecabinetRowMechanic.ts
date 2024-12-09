import { MechanicAbstract, MechanicDelegate, RegionEnum, RegionType, StatTypeEnum, EventHandlerType, SubObjectTypeEnum, ObjectTypeEnum, ObjectTemplate } from '@cybertale/interface'
import router from '@/router'
import { Definitions } from '@/definitions/appDefinitions'

export namespace Manager.Mechanic{

  export class ECabinetRowMechanic extends MechanicAbstract {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async InitGet (_id: string): Promise<ObjectTemplate[]> {
      throw new Error('Function not implemented')
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = []
      for (const _object of _objectTemplates) {
        this.ObjectTemplates.push(new ObjectTemplate(_object.Region, _object.ObjectEnum, _object.SubObjectEnum, _object.ActionEnum, _object.Stats))
      }
      return this.ObjectTemplates
    }

    public SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.ECabinetRow].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
      RegionType.RegionTypes[RegionEnum.ECabinetRow].ObjectTypes[ObjectTypeEnum.ModalForm].SubscribeLogic(this.ModalForm.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.ECabinetRow].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.ECabinetRow].ObjectTypes[ObjectTypeEnum.ModalForm].NullifyLogic()
      MechanicAbstract.instance = null
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected ModalForm (eventHandler: EventHandlerType): void {
      this.refreshPage()
    }

    protected Button (eventHandler: EventHandlerType): void {
      console.log(eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
      const formModalOpenButton = document.getElementById('formModalOpen' + eventHandler.payload.Stats[StatTypeEnum.Tag].Data.replace('button', '')) // TODO refactor, make it more programmatic and safer
      switch (router.currentRoute.value.name) {
        case Definitions.Entity.Edit:
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Middle:
              if (formModalOpenButton !== null) {
                formModalOpenButton.click()
              }
              break
            default:
              break
          }
          break
      }
    }

    static getInstance (_mechanicCallback: MechanicDelegate | null = null): MechanicAbstract {
      if (!MechanicAbstract.instance) {
        MechanicAbstract.instance = new ECabinetRowMechanic()
        MechanicAbstract.instance.SubscribeToVueComponent(_mechanicCallback)
      }
      return MechanicAbstract.instance
    }
  }

}
