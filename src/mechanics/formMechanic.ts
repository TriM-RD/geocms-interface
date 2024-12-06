import {
  ActionTypeEnum,
  EventHandlerType,
  MechanicAbstract,
  ObjectTemplate,
  ObjectTypeEnum,
  RegionEnum,
  RegionType, StatType, StatTypeEnum,
  SubObjectTypeEnum
} from '@cybertale/interface'
import { v4 as uuidv4 } from 'uuid'

export namespace Manager.Mechanic {

  export class FormMechanic extends MechanicAbstract {
    private id = '-1';
    private inEdit = false;

    public async InitGet (_id: string, _route: string): Promise<ObjectTemplate[]> {
      return this.ObjectTemplates
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Field].SubscribeLogic(this.Field.bind(this))
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.CheckBox].SubscribeLogic(this.Field.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Field].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.CheckBox].NullifyLogic()
      MechanicAbstract.instance = null
    }

    protected Button (eventHandler: EventHandlerType): void {
      switch (eventHandler.subObjectType) {
        case SubObjectTypeEnum.Middle:
          this.addObjectTemplateInputGroup(eventHandler)
          break
        case SubObjectTypeEnum.Down:
          this.refreshPage()
          this.removeElementByTag(eventHandler.payload.Stats[StatTypeEnum.Tag].Data.split('|')[1], this.ObjectTemplates)
          this.refreshPage()
      }
    }

    protected removeElementByTag (tag : string, objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      const elementIndex = this.getObjectTemplateIndex(tag, objectTemplates)
      objectTemplates.splice(elementIndex, 1)
      return objectTemplates
    }

    protected addObjectTemplateInputGroup (eventHandler: EventHandlerType) {
      this.refreshPage()
      eventHandler.payload = this.getObjectTemplateFromObject(eventHandler.payload)
      eventHandler.payload.Stats[StatTypeEnum.ElementType].Data = ''
      let i = 0
      const index = this.ObjectTemplates.findIndex((element) => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
      for (const objectTemplate of this.ObjectTemplates) {
        if (objectTemplate.Stats[StatTypeEnum.Tag].Data.includes(eventHandler.payload.Stats[StatTypeEnum.Tag].Data)) {
          i++
        }
      }
      eventHandler.payload.Stats[StatTypeEnum.Tag].Data = eventHandler.payload.Stats[StatTypeEnum.Tag].Data + uuidv4()
      this.ObjectTemplates = this.Splicing(index + i, this.ObjectTemplates, [eventHandler.payload as ObjectTemplate])
      this.refreshPage()
    }

    protected Splicing (index: number, objectTemplates: ObjectTemplate[], _objectTemplates: ObjectTemplate[]) : ObjectTemplate[] {
      for (const element of _objectTemplates) {
        objectTemplates.splice(index, 0, element)
      }
      return objectTemplates
    }

    getObjectTemplateFromObject (object : ObjectTemplate): ObjectTemplate {
      return new ObjectTemplate(object.Region, object.ObjectEnum, object.SubObjectEnum, object.ActionEnum, object.Stats)
    }

    protected Field (eventHandler: EventHandlerType) {
      switch (eventHandler.subObjectType) {
        case SubObjectTypeEnum.ParentObject:
          this.updateValueData(eventHandler)
          console.log(JSON.parse(JSON.stringify(this.ObjectTemplates)))
          break
      }
    }

    protected updateValueData (eventHandler: EventHandlerType, tagContainingValue: StatTypeEnum = StatTypeEnum.Value, searchByValueType: StatTypeEnum = StatTypeEnum.Tag) {
      const matchingIndex = this.getObjectTemplateIndex(eventHandler.payload.Stats[searchByValueType].Data, this.ObjectTemplates, searchByValueType)
      if (matchingIndex !== -1) {
        if (this.isJSON(this.ObjectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data)) {
          const stat = JSON.parse(this.ObjectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data)
          stat[eventHandler.payload.Stats[StatTypeEnum.ValueIndices].Data] = eventHandler.payload.Stats[tagContainingValue].Data
          this.ObjectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data = JSON.stringify(stat)
        } else {
          this.ObjectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data = eventHandler.payload.Stats[tagContainingValue].Data
        }
      }
    }

    protected getObjectTemplateIndex (tag: string, objectTemplates : ObjectTemplate[], searchByValueType: StatTypeEnum = StatTypeEnum.Tag) : number {
      return objectTemplates.findIndex(element =>
        element.Stats[searchByValueType] && (element.Stats[searchByValueType].Data === tag || element.Stats[searchByValueType].Data === tag.split('|')[1])
      )
    }

    private isJSON (str: string): boolean {
      let temp = null
      try {
        temp = JSON.parse(str)
      } catch (e) {
        return false
      }
      return Array.isArray(temp)
    }
  }
}