import { ResolverAbstract } from '@/resolvers/resolverAbstract'
import {
  ObjectTemplate,
  StatTypeEnum,
  SubObjectTypeEnum
} from '@cybertale/interface'
import { Definitions } from '@/definitions/appDefinitions'
import router from '@/router'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'

export abstract class HandlerAbstract extends ResolverAbstract {
  RowButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    return Promise.resolve(wrapper.objectTemplates)
  }

  async FormButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Left:
        wrapper.objectTemplates = await this.validateForm('division', Definitions.Division.Edit, wrapper.objectTemplates, wrapper.refreshPage, wrapper.append, wrapper.id, wrapper.inEdit, wrapper.eventHandler.payload)
        break
      case SubObjectTypeEnum.Middle:
        this.addObjectTemplateInputGroup(wrapper)
        break
      case SubObjectTypeEnum.Right:
        await router.push({
          name: Definitions.Division.Def
        })
        break
      case SubObjectTypeEnum.Down:
        this.resolveButtonDown(wrapper.eventHandler, wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data.split('|'), wrapper.objectTemplates, wrapper.refreshPage, wrapper.id)
        wrapper.refreshPage()
        break
      default:
        break
    }
    return Promise.resolve(wrapper.objectTemplates)
  }
}
