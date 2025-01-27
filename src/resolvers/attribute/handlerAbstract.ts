import { ResolverAbstract } from '@/resolvers/resolverAbstract'
import {
  ActionTypeEnum,
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
  public RowButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    return Promise.resolve(wrapper.objectTemplates)
  }

  public async FormSelectList (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Middle:
        wrapper = this.updateValueData(wrapper)
        this.removeElementFromArray(wrapper.objectTemplates, 'attributeType')
        wrapper.objectTemplates = wrapper.append((await http.get(import.meta.env.VITE_APP_BASE_URL + 'form/attribute/' + wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
        wrapper.refreshPage()
        break
      default:
        wrapper.objectTemplates = await super.FormSelectList(wrapper)
        break
    }
    return Promise.resolve(wrapper.objectTemplates)
  }

  public async FormButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Left:
        await this.validateForm('attribute', Definitions.Attribute.Edit, wrapper.objectTemplates, wrapper.refreshPage, wrapper.append, wrapper.id, wrapper.inEdit, wrapper.eventHandler.payload)
        break
      case SubObjectTypeEnum.Middle:
        this.addObjectTemplateInputGroup(wrapper)
        break
      case SubObjectTypeEnum.Right:
        await router.push({
          name: Definitions.Group.Edit,
          params: { id: router.currentRoute.value.params.parentId }
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
