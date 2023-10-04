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
  public async FormSelectList (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    return wrapper.objectTemplates
  }

  RowButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    return Promise.resolve([])
  }

  public async FormButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Left:
        await this.validateForm('user', Definitions.Administration.Edit, wrapper.objectTemplates, wrapper.refreshPage, wrapper.append, wrapper.id, wrapper.inEdit, wrapper.eventHandler.payload)
        break
      case SubObjectTypeEnum.Middle:
        wrapper.refreshPage()
        wrapper.objectTemplates = wrapper.append([
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.SelectButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(wrapper.eventHandler.payload.Stats[StatTypeEnum.ItemList].Data),
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Permission'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(Math.random().toString(36).slice(2, 7).toString()),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(wrapper.eventHandler.payload.Stats[StatTypeEnum.Id].Data),
            [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(wrapper.eventHandler.payload.Stats[StatTypeEnum.ErrorMessage].Data)
          })
        ])
        wrapper.refreshPage()
        break
      case SubObjectTypeEnum.Right:
        await router.push({
          name: Definitions.Administration.Def
        })
        break
      case SubObjectTypeEnum.Down:
        wrapper.refreshPage()
        this.resolveButtonDown(wrapper.eventHandler, wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data.split('-'), wrapper.objectTemplates, wrapper.refreshPage, wrapper.id)
        wrapper.refreshPage()
        break
      default:
        break
    }
    return wrapper.objectTemplates
  }
}
