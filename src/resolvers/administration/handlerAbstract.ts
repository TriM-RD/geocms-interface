import { ResolverAbstract } from '@/resolvers/resolverAbstract'
import {
  ActionTypeEnum,
  EventHandlerType,
  ObjectTemplate,
  ObjectTypeEnum,
  RegionEnum, StatType,
  StatTypeEnum,
  SubObjectTypeEnum
} from '@cybertale/interface'
import http from '@/http-common'
import { Definitions } from '@/definitions/appDefinitions'
import router from '@/router'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'

export abstract class HandlerAbstract extends ResolverAbstract {
  RowButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    return Promise.resolve(wrapper.objectTemplates)
  }

  public async FormButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Left:
        await this.validateForm('user', Definitions.Administration.Edit, wrapper.objectTemplates, wrapper.refreshPage, wrapper.append, wrapper.id, wrapper.inEdit, wrapper.eventHandler.payload)
        break
      case SubObjectTypeEnum.Middle:
        this.addObjectTemplateInputGroup(wrapper)
        wrapper.refreshPage()
        break
      case SubObjectTypeEnum.Right:
        await router.push({
          name: Definitions.Administration.Def
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
