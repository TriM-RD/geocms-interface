import { ResolverAbstract } from '@/resolvers/resolverAbstract'
import { EventHandlerType, ObjectTemplate, StatTypeEnum, SubObjectTypeEnum } from '@cybertale/interface'
import http from '@/http-common'

export abstract class HandlerAbstract extends ResolverAbstract {
  public async SelectList (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[]): Promise<ObjectTemplate[]> {
    switch (eventHandler.subObjectType) {
      case SubObjectTypeEnum.Middle:
        this.removeElementFromArray(objectTemplates, 'attributeType')
        refreshPage()
        objectTemplates = append((await http.get(process.env.VUE_APP_BASE_URL + 'form/attribute/' + eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
        refreshPage()
        break
      default:
        break
    }
    return objectTemplates
  }
}
