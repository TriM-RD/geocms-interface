import {
  EventHandlerType,
  MechanicAbstract,
  ObjectTemplate, ObjectTypeEnum, RegionEnum, RegionType,
  StatTypeEnum,
  SubObjectTypeEnum
} from '@cybertale/interface'

export namespace Manager.Mechanic{

  export class HelperFormMechanic extends MechanicAbstract {
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

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Placeholder].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Placeholder].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected Button (eventHandler: EventHandlerType): void {
      switch (eventHandler.subObjectType) {
        case SubObjectTypeEnum.Middle:
          this.generateCode(eventHandler, 'code')
          this.refreshPage()
          this.refreshPage()
          break
      }
    }

    generateRandomString (inputString: string): string {
      const characters = inputString.split('')
      for (let i = characters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = characters[i]
        characters[i] = characters[j]
        characters[j] = temp
      }
      return characters.join('')
    }

    private generateCode (eventHandler: EventHandlerType, tag: string) {
      const temp = this.ObjectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === tag)
      RegionType.RegionTypes[this.ObjectTemplates[temp].Region].ObjectTypes[this.ObjectTemplates[temp].ObjectEnum].ChooseSubType(this.ObjectTemplates[temp], this.generateRandomString(this.ObjectTemplates[temp].Stats[StatTypeEnum.Id].Data))
    }
  }

}
