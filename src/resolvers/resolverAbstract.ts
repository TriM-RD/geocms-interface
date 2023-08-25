import { EventHandlerType, ObjectTemplate, StatTypeEnum } from '@cybertale/interface'
import { FormAssignment } from '@/resolvers/assignments/formAssignment'

export abstract class ResolverAbstract implements FormAssignment {
  protected removeElementFromArray (arr: Array<any>, belongsTo: string) : void {
    (() => {
      // Perform the array update
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].Stats[StatTypeEnum.BelongsTo] !== undefined) {
          if (arr[i].Stats[StatTypeEnum.BelongsTo].Data === belongsTo) {
            arr.splice(i, 1)
          }
        }
      }
    })()
  }

  abstract SelectList (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[]): Promise<ObjectTemplate[]>
  public async DataList (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void): Promise<ObjectTemplate[]> {
    refreshPage()
    const temp = objectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
    if (eventHandler.payload.Stats[StatTypeEnum.Value].Data.id !== null) {
      objectTemplates[temp].Stats[StatTypeEnum.Value].Data = eventHandler.payload.Stats[StatTypeEnum.Value].Data.id
    } else {
      objectTemplates[temp].Stats[StatTypeEnum.Value].Data = ''
    }
    refreshPage()
    return objectTemplates
  }
}
