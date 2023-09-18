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

  public async Button (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[], id: string, inEdit: boolean): Promise<ObjectTemplate[]> {
    switch (eventHandler.subObjectType) {
      case SubObjectTypeEnum.Left:
        await this.validateForm('attribute', Definitions.Attribute.Edit, objectTemplates, refreshPage, append, id, inEdit, eventHandler.payload)
        break
      case SubObjectTypeEnum.Middle:
        refreshPage()
        objectTemplates = append([
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.FieldButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Value'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(Math.random().toString(36).slice(2, 7).toString()),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.Id].Data)
          })
        ])
        refreshPage()
        break
      case SubObjectTypeEnum.Right:
        await router.push({
          name: Definitions.Group.Edit,
          params: { id: router.currentRoute.value.params.parentId }
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
