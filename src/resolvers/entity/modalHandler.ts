import { HandlerAbstract } from './handlerAbstract'
import {
  ObjectTemplate,
  StatTypeEnum,
  SubObjectTypeEnum
} from '@cybertale/interface'
import http from '@/http-common'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'
import { TagHelpers } from '@/definitions/tagHelpers'

export class ModalHandler extends HandlerAbstract {
  public async FormSelectList (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Middle:
        this.removeElementFromArray(wrapper.objectTemplates, TagHelpers.CyberTags.group)
        wrapper.refreshPage()
        wrapper.objectTemplates = wrapper.append((await http.get(process.env.VUE_APP_BASE_URL + 'form/entity_modal/' + wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
        wrapper.refreshPage()
        break
      default:
        wrapper.objectTemplates = await super.FormSelectList(wrapper)
        break
    }
    return wrapper.objectTemplates
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
