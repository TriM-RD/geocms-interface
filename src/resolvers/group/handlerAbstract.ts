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
import { $t } from '@/locales'
import { ResolverAbstract } from '@/resolvers/resolverAbstract'

export abstract class HandlerAbstract extends ResolverAbstract {
  RowButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    return Promise.resolve(wrapper.objectTemplates)
  }

  public async FormSelectList (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Middle:
        this.removeElementFromArray(wrapper.objectTemplates, 'groupType')
        wrapper.refreshPage()
        wrapper.objectTemplates = wrapper.append((await http.get(process.env.VUE_APP_BASE_URL + 'form/group/' + wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
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
        await this.validateForm('group', Definitions.Group.Edit, wrapper.objectTemplates, wrapper.refreshPage, wrapper.append, wrapper.id, wrapper.inEdit, wrapper.eventHandler.payload)
        break
      case SubObjectTypeEnum.Middle:
        wrapper.refreshPage()
        /* wrapper.objectTemplates = this.Splice(3, wrapper.objectTemplates, [// TODO while 2 is correct, it needs to be redone to make it programmatic
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.SelectButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(wrapper.eventHandler.payload.Stats[StatTypeEnum.ItemList].Data),
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData($t.template),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('template' + Math.random().toString(36).slice(2, 7).toString()),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(wrapper.eventHandler.payload.Stats[StatTypeEnum.Id].Data),
            // TODO find a better fix
            [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData(wrapper.inEdit ? '' : wrapper.eventHandler.payload.Stats[StatTypeEnum.BelongsTo].Data), // TODO inEdit here might no longer be needed
            [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(wrapper.eventHandler.payload.Stats[StatTypeEnum.ErrorMessage].Data)
          })
        ]) */
        wrapper.refreshPage()
        break
      case SubObjectTypeEnum.Up:
        await router.push({ name: Definitions.Attribute.Add, params: { parentId: wrapper.id } })
        break
      case SubObjectTypeEnum.Right:
        await router.push({
          name: Definitions.Group.Def
        })
        break
      case SubObjectTypeEnum.Down:
        wrapper.refreshPage()
        this.resolveButtonDown(wrapper.eventHandler, wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data.split('|'), wrapper.objectTemplates, wrapper.refreshPage, wrapper.id)
        wrapper.refreshPage()
        break
      default:
        break
    }
    return Promise.resolve(wrapper.objectTemplates)
  }
}
