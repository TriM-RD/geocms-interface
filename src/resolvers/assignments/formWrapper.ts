import { EventHandlerType, ObjectTemplate } from '@cybertale/interface'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'

export class FormWrapper extends WrapperAbstract {
  public Button (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[], id: string, inEdit: boolean): FormWrapper {
    this.eventHandler = eventHandler
    this.objectTemplates = objectTemplates
    this.refreshPage = refreshPage
    this.append = append
    this.id = id
    this.inEdit = inEdit
    return this
  }

  DataList (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void): FormWrapper {
    this.eventHandler = eventHandler
    this.objectTemplates = objectTemplates
    this.refreshPage = refreshPage
    return this
  }

  SelectList (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[]): FormWrapper {
    this.eventHandler = eventHandler
    this.objectTemplates = objectTemplates
    this.refreshPage = refreshPage
    this.append = append
    return this
  }
}
