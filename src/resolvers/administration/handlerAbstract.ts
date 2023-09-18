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

export abstract class HandlerAbstract extends ResolverAbstract {
  public async SelectList (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[]): Promise<ObjectTemplate[]> {
    return objectTemplates
  }

  public async Button (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[], id: string, inEdit: boolean): Promise<ObjectTemplate[]> {
    switch (eventHandler.subObjectType) {
      case SubObjectTypeEnum.Left:
        await this.validateForm('user', Definitions.Administration.Edit, objectTemplates, refreshPage, append, id, inEdit, eventHandler.payload)
        break
      case SubObjectTypeEnum.Middle:
        refreshPage()
        objectTemplates = append([
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.SelectButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.ItemList].Data),
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Permission'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(Math.random().toString(36).slice(2, 7).toString()),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.Id].Data),
            [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.ErrorMessage].Data)
          })
        ])
        refreshPage()
        break
      case SubObjectTypeEnum.Right:
        await router.push({
          name: Definitions.Administration.Def
        })
        break
      case SubObjectTypeEnum.Down:
        refreshPage()
        this.resolveButtonDown(eventHandler, eventHandler.payload.Stats[StatTypeEnum.Tag].Data.split('-'), objectTemplates, refreshPage, id)
        refreshPage()
        break
      default:
        break
    }
    return objectTemplates
  }
}
