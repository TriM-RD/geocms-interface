import { HandlerAbstract } from './handlerAbstract'
import { ObjectTemplate, SubObjectTypeEnum } from '@cybertale/interface'
import router from '@/router'
import { Definitions } from '@/definitions/appDefinitions'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'

export class DefHandler extends HandlerAbstract {
  public async RowButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Left:// Izbriši
        await this.validateDelete('division', wrapper.objectTemplates, wrapper.refreshPage, wrapper.id)
        break
      case SubObjectTypeEnum.Middle: // Uredi
        await router.push({
          name: Definitions.Division.Edit,
          params: { id: wrapper.id }
        })
        break
      case SubObjectTypeEnum.Right: // Pregledaj
        await router.push({
          name: Definitions.Division.Edit,
          params: { id: wrapper.id }
        })
        break
      default:
        break
    }
    return Promise.resolve(wrapper.objectTemplates)
  }

  public async TableButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.Left:
        useToast()({
          component: ToastComponent,
          props: { msg: { title: 'Resorting...', info: 'Re-sorted names in table.' } }
        }, {
          type: TYPE.INFO
        })
        wrapper.refreshPage()
        break
    }
    return wrapper.objectTemplates
  }
}
