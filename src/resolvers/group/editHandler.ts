import { HandlerAbstract } from './handlerAbstract'
import { ObjectTemplate, SubObjectTypeEnum } from '@cybertale/interface'
import router from '@/router'
import { Definitions } from '@/definitions/appDefinitions'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'

export class EditHandler extends HandlerAbstract {
  public async RowButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Left:// Izbriši
        await this.validateDelete('attribute', wrapper.objectTemplates, wrapper.refreshPage, wrapper.id)
        break
      case SubObjectTypeEnum.Middle: // Uredi
        await router.push({
          name: Definitions.Attribute.Edit,
          params: {
            parentId: router.currentRoute.value.params.id,
            id: wrapper.id
          }
        })
        break
      case SubObjectTypeEnum.Right: // Pregledaj
        await router.push({
          name: Definitions.Attribute.Edit,
          params: { id: wrapper.id }
        })
        break
      default:
        break
    }
    return Promise.resolve(wrapper.objectTemplates)
  }
}
