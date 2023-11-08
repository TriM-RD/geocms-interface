import { HandlerAbstract } from './handlerAbstract'
import {
  ObjectTemplate,
  SubObjectTypeEnum
} from '@cybertale/interface'
import { Definitions } from '@/definitions/appDefinitions'
import router from '@/router'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'

export class DefHandler extends HandlerAbstract {
  public async RowButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Left:// Izbriši
        await this.validateDelete('entity', wrapper.objectTemplates, wrapper.refreshPage, wrapper.id)
        break
      case SubObjectTypeEnum.Middle: // Uredi
        await router.push({
          name: Definitions.Entity.Edit,
          params: { id: wrapper.id }
        })
        break
      case SubObjectTypeEnum.Right: // Pregledaj
        await router.push({
          name: Definitions.Entity.Edit,
          params: { id: wrapper.id }
        })
        break
      default:
        break
    }
    return Promise.resolve(wrapper.objectTemplates)
  }
}
