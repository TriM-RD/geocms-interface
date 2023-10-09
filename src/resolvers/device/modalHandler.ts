import { HandlerAbstract } from './handlerAbstract'
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
import router from '@/router'
import { Modal } from 'bootstrap'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'

export class ModalHandler extends HandlerAbstract {
  public async FormSelectList (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Middle:
        this.removeElementFromArray(wrapper.objectTemplates, 'group')
        wrapper.refreshPage()
        wrapper.objectTemplates = wrapper.append((await http.get(process.env.VUE_APP_BASE_URL + 'form/entity_modal/' + wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
        wrapper.refreshPage()
        break
      default:
        break
    }
    return Promise.resolve(wrapper.objectTemplates)
  }

  protected async resolveButtonMiddle (eventHandler: EventHandlerType, tag: string, objectTemplates: ObjectTemplate[], refreshPage: () => void, id: string): Promise<void> {
    switch (tag) {
      default:
        refreshPage()
        objectTemplates = this.Splice(2, objectTemplates, [// TODO while 2 is correct, it needs to be redone to make it programmatic
          new ObjectTemplate(RegionEnum.ModalForm, ObjectTypeEnum.SelectButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.ItemList].Data),
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Division'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(Math.random().toString(36).slice(2, 7).toString()),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.Id].Data),
            [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(eventHandler.payload.Stats[StatTypeEnum.ErrorMessage].Data)
          })
        ])
        refreshPage()
        break
    }
  }

  protected async validateForm (route: string, redirectTo: string, objectTemplates: ObjectTemplate[], refreshPage: () => void,
    append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[], id : string, inEdit : boolean, button: ObjectTemplate | null = null): Promise<ObjectTemplate[]> {
    const temp = document.getElementById(id)
    const form = document.getElementById('modal-form')
    if (form) {
      if (!(form as HTMLFormElement).checkValidity()) {
        form.classList.add('was-validated')
      } else {
        await http.post(process.env.VUE_APP_BASE_URL + route, objectTemplates)
          .then((response) => {
            if (response.data.id !== false) {
              if (temp !== null) {
                temp.click()
              }
            } else {
              refreshPage()
              form.classList.remove('was-validated')
              objectTemplates.length = 0
              objectTemplates = append(response.data.entities)
              refreshPage()
            }
          })
        // }
      }
    }
    return objectTemplates
  }
}
