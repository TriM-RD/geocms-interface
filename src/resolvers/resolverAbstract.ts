import { EventHandlerType, ObjectTemplate, StatTypeEnum } from '@cybertale/interface'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'
import http from '@/http-common'
import router from '@/router'
import { ResolverInterface } from '@/resolvers/assignments/resolverInterface'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'
import { Definitions } from '@/definitions/appDefinitions'

export abstract class ResolverAbstract implements ResolverInterface<WrapperAbstract> {
  protected removeElementFromArray (arr: Array<any>, belongsTo: string) : void {
    (() => {
      // Perform the array update
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].Stats[StatTypeEnum.BelongsTo] !== undefined) {
          if (arr[i].Stats[StatTypeEnum.BelongsTo].Data === belongsTo) {
            arr.splice(i, 1)
          }
        }
      }
    })()
  }

  abstract FormSelectList (wrapper: WrapperAbstract): Promise<ObjectTemplate[]>
  public async TableButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    throw new Error('Feature not implemented')
  }

  public async FormDataList (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    wrapper.refreshPage()
    const temp = wrapper.objectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
    if (wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data.id !== null) {
      wrapper.objectTemplates[temp].Stats[StatTypeEnum.Value].Data = wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data.id
    } else {
      wrapper.objectTemplates[temp].Stats[StatTypeEnum.Value].Data = ''
    }
    wrapper.refreshPage()
    return wrapper.objectTemplates
  }

  abstract FormButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]>
  abstract RowButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]>

  protected resolveButtonDown (eventHandler: EventHandlerType, strings: string[], objectTemplates: ObjectTemplate[], refreshPage: () => void, id: string): ObjectTemplate[] {
    switch (strings[0]) {
      case 'destroy':
        if (window.confirm('Are you sure you want to delete this entity?')) {
          http.delete(process.env.VUE_APP_BASE_URL + 'entity' + '/' + id)
            .then((response) => {
              useToast()({
                component: ToastComponent,
                props: {
                  msg: response.data.msg
                }
              }, {
                type: response.data.status as TYPE
              })
              router.push({
                name: Definitions.Entity.Def
              })
            })
        }
        break
      case 'delete':
        this.removeElementByTag(eventHandler, strings[1], objectTemplates)
        break
      default:
        break
    }
    return objectTemplates
  }

  protected async validateForm (route: string, redirectTo: string, objectTemplates: ObjectTemplate[], refreshPage: () => void,
    append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[], id : string, inEdit : boolean, button: ObjectTemplate | null = null): Promise<ObjectTemplate[]> {
    const form = document.getElementById('classic-form')
    if (form) {
      if (!(form as HTMLFormElement).checkValidity()) {
        form.classList.add('was-validated')
      } else {
        const validatingToast = useToast()({
          component: ToastComponent,
          props: { msg: { title: '', info: 'Validating...' } }
        }, {
          type: TYPE.INFO
        })
        if (inEdit && !(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id))) {
          await http.patch(process.env.VUE_APP_BASE_URL + route + '/' + id, objectTemplates)
            .then((response) => {
              if (response.data.id !== false) {
                refreshPage()// TODO Most Likely not needed anymore
                objectTemplates.length = 0
                objectTemplates = append(response.data.entities)
                refreshPage()// TODO End
                useToast().dismiss(validatingToast)
                useToast()({
                  component: ToastComponent,
                  props: { msg: { title: '', info: 'Form submitted.' } }
                }, {
                  type: TYPE.SUCCESS
                })
                router.push({
                  name: redirectTo,
                  params: { id: response.data.id },
                  query: { refresh: Date.now() }
                })
              } else {
                refreshPage()
                form.classList.remove('was-validated')
                objectTemplates.length = 0
                objectTemplates = append(response.data.entities)
                refreshPage()
                useToast().dismiss(validatingToast)
                useToast()({
                  component: ToastComponent,
                  props: { msg: { title: '', info: 'Validation failed.' } }
                }, {
                  type: TYPE.WARNING
                })
              }
            })
        } else {
          await http.post(process.env.VUE_APP_BASE_URL + route, objectTemplates)
            .then((response) => {
              if (response.data.id !== false) {
                router.push({
                  name: redirectTo,
                  params: { id: response.data.id }
                })
                useToast().dismiss(validatingToast)
                useToast()({
                  component: ToastComponent,
                  props: { msg: { title: '', info: 'Form submitted.' } }
                }, {
                  type: TYPE.SUCCESS
                })
              } else {
                refreshPage()
                form.classList.remove('was-validated')
                objectTemplates.length = 0
                objectTemplates = append(response.data.entities)
                refreshPage()
                useToast().dismiss(validatingToast)
                useToast()({
                  component: ToastComponent,
                  props: { msg: { title: '', info: 'Validation failed.' } }
                }, {
                  type: TYPE.ERROR
                })
              }
            })
        }
      }
    }
    if (button) { button.Stats[StatTypeEnum.Disabled].Data = '' }
    return objectTemplates
  }

  protected async validateDelete (route: string, objectTemplates: ObjectTemplate[], refreshPage: () => void, id: string): Promise<ObjectTemplate[]> {
    if (window.confirm('Are you sure you want to delete this entity?')) {
      refreshPage()
      http.delete(process.env.VUE_APP_BASE_URL + route + '/' + id)
        .then((response) => {
          useToast()({
            component: ToastComponent,
            props: {
              msg: response.data.msg
            }
          }, {
            type: response.data.status as TYPE
          })
          refreshPage()
        })
    }
    return objectTemplates
  }

  protected Splice (index: number, objectTemplates: ObjectTemplate[], _objectTemplates: ObjectTemplate[]) : ObjectTemplate[] {
    for (const element of _objectTemplates) {
      objectTemplates.splice(index, 0, element)
    }
    return objectTemplates
  }

  protected removeElementByTag (eventHandler : EventHandlerType, tag : string, objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
    const elementIndex = objectTemplates.findIndex(
      element => element.Stats[StatTypeEnum.Tag].Data === tag)
    objectTemplates.splice(elementIndex, 1)
    return objectTemplates
  }

  protected checkIfContains (str: string, word: string): boolean {
    return str.includes(word)
  }

  protected updateValueData (wrapper: WrapperAbstract): void {
    const matchingIndex = wrapper.objectTemplates.findIndex(element =>
      element.Stats[StatTypeEnum.Tag].Data.includes(wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
    )

    if (matchingIndex !== -1) {
      wrapper.objectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data = wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data
    }
  }
}
