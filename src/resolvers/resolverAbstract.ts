import { EventHandlerType, ObjectTemplate, StatTypeEnum } from '@cybertale/interface'
import { FormAssignment } from '@/resolvers/assignments/formAssignment'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'
import http from '@/http-common'
import router from '@/router'

export abstract class ResolverAbstract implements FormAssignment {
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

  abstract SelectList (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[]): Promise<ObjectTemplate[]>
  public async DataList (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void): Promise<ObjectTemplate[]> {
    refreshPage()
    const temp = objectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
    if (eventHandler.payload.Stats[StatTypeEnum.Value].Data.id !== null) {
      objectTemplates[temp].Stats[StatTypeEnum.Value].Data = eventHandler.payload.Stats[StatTypeEnum.Value].Data.id
    } else {
      objectTemplates[temp].Stats[StatTypeEnum.Value].Data = ''
    }
    refreshPage()
    return objectTemplates
  }

  abstract Button (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[], id: string, inEdit: boolean): Promise<ObjectTemplate[]>

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
                name: 'Device'
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
}
