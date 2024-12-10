import { EventHandlerType, ObjectTemplate, StatTypeEnum, SubObjectTypeEnum } from '@cybertale/interface'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'
import http from '@/http-common'
import router from '@/router'
import { ResolverInterface } from '@/resolvers/assignments/resolverInterface'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'
import { Definitions } from '@/definitions/appDefinitions'
import { v4 as uuidv4 } from 'uuid'
import { TagHelpers } from '@/@geocms'
import CyberTags = TagHelpers.CyberTags

export abstract class ResolverAbstract implements ResolverInterface<WrapperAbstract> {
  protected removeElementFromArray (arr: Array<any>, dependsOn: string) : void {
    (() => {
      // Perform the array update
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].Stats[StatTypeEnum.DependsOn] !== undefined) {
          if (arr[i].Stats[StatTypeEnum.DependsOn].Data.includes(dependsOn)) {
            arr.splice(i, 1)
          }
        }
      }
    })()
  }

  public async FormField (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.ParentObject:
        wrapper = this.updateValueData(wrapper)
        break
    }
    return wrapper.objectTemplates
  }

  public async FormRadio (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.ParentObject:
        wrapper = this.updateValueData(wrapper, StatTypeEnum.ItemList, StatTypeEnum.Name)
        break
    }
    return wrapper.objectTemplates
  }

  public async FormSelectList (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    switch (wrapper.eventHandler.subObjectType) {
      case SubObjectTypeEnum.ParentObject:
        wrapper = this.updateValueData(wrapper)
        break
    }
    return wrapper.objectTemplates
  }

  public async TableButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    throw new Error('Feature not implemented')
  }

  public async FormDataList (wrapper: WrapperAbstract): Promise<ObjectTemplate[]> {
    const matchingIndex = wrapper.objectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
    if (this.isJSON(wrapper.objectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data)) {
      const stat = JSON.parse(wrapper.objectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data)
      stat[wrapper.eventHandler.payload.Stats[StatTypeEnum.ValueIndices].Data] = wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data.id
      wrapper.objectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data = JSON.stringify(stat)
    } else {
      if (wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data.id) {
        wrapper.objectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data = wrapper.eventHandler.payload.Stats[StatTypeEnum.Value].Data.id
      } else {
        wrapper.objectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data = ''
      }
    }

    return wrapper.objectTemplates
  }

  abstract FormButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]>
  abstract RowButton (wrapper: WrapperAbstract): Promise<ObjectTemplate[]>

  protected resolveButtonDown (eventHandler: EventHandlerType, strings: string[], objectTemplates: ObjectTemplate[], refreshPage: () => void, id: string): ObjectTemplate[] {
    switch (strings[0]) {
      case 'destroy':
        if (window.confirm('Are you sure you want to delete this entity?')) {
          http.delete(import.meta.env.VITE_APP_BASE_URL + 'entity' + '/' + id)
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
        this.removeElementByTag(strings[1], objectTemplates)
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
          await http.patch(import.meta.env.VITE_APP_BASE_URL + route + '/' + id, objectTemplates)
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
          await http.post(import.meta.env.VITE_APP_BASE_URL + route, objectTemplates)
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
      http.delete(import.meta.env.VITE_APP_BASE_URL + route + '/' + id)
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

  protected removeElementByTag (tag : string, objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
    const elementIndex = this.getObjectTemplateIndex(tag, objectTemplates)
    objectTemplates.splice(elementIndex, 1)
    return objectTemplates
  }

  protected addObjectTemplateInputGroup (wrapper: WrapperAbstract) : WrapperAbstract {
    wrapper.refreshPage()
    wrapper.eventHandler.payload = this.getObjectTemplateFromObject(wrapper.eventHandler.payload)
    wrapper.eventHandler.payload.Stats[StatTypeEnum.ElementType].Data = ''
    let i = 0
    const index = wrapper.objectTemplates.findIndex(element => element.Stats[StatTypeEnum.Tag].Data === wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data)
    for (const objectTemplate of wrapper.objectTemplates) {
      if (objectTemplate.Stats[StatTypeEnum.Tag].Data.includes(wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data)) {
        i++
      }
    }
    wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data = wrapper.eventHandler.payload.Stats[StatTypeEnum.Tag].Data + uuidv4()
    wrapper.objectTemplates = this.Splice(index + i, wrapper.objectTemplates, [wrapper.eventHandler.payload as ObjectTemplate])
    // console.log(wrapper.objectTemplates)
    wrapper.refreshPage()
    return wrapper
  }

  getObjectTemplateFromObject (object : ObjectTemplate): ObjectTemplate {
    return new ObjectTemplate(object.Region, object.ObjectEnum, object.SubObjectEnum, object.ActionEnum, object.Stats)
  }

  protected getObjectTemplateIndex (tag: string, objectTemplates : ObjectTemplate[], searchByValueType: StatTypeEnum = StatTypeEnum.Tag) : number {
    return objectTemplates.findIndex(element =>
      element.Stats[searchByValueType] && (element.Stats[searchByValueType].Data === tag || element.Stats[searchByValueType].Data === tag.split('|')[1])
    )
  }

  protected updateValueData (wrapper: WrapperAbstract, tagContainingValue: StatTypeEnum = StatTypeEnum.Value, searchByValueType: StatTypeEnum = StatTypeEnum.Tag): WrapperAbstract {
    const matchingIndex = this.getObjectTemplateIndex(wrapper.eventHandler.payload.Stats[searchByValueType].Data, wrapper.objectTemplates, searchByValueType)
    if (matchingIndex !== -1) {
      if (this.isJSON(wrapper.objectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data)) {
        const stat = JSON.parse(wrapper.objectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data)
        stat[wrapper.eventHandler.payload.Stats[StatTypeEnum.ValueIndices].Data] = wrapper.eventHandler.payload.Stats[tagContainingValue].Data
        wrapper.objectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data = JSON.stringify(stat)
      } else {
        wrapper.objectTemplates[matchingIndex].Stats[StatTypeEnum.Value].Data = wrapper.eventHandler.payload.Stats[tagContainingValue].Data
      }
    }
    return wrapper
  }

  protected append (wrapper: WrapperAbstract, _objectTemplates: ObjectTemplate[]) : ObjectTemplate[] {
    for (const element of _objectTemplates) {
      wrapper.objectTemplates.push(new ObjectTemplate(element.Region, element.ObjectEnum, element.SubObjectEnum, element.ActionEnum, element.Stats))
    }
    return wrapper.objectTemplates
  }

  private isJSON (str: string): boolean {
    let temp = null
    try {
      temp = JSON.parse(str)
    } catch (e) {
      return false
    }
    return Array.isArray(temp)
  }
}
