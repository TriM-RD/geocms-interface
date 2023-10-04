import { EventHandlerType, ObjectTemplate } from '@cybertale/interface'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'

export class TableWrapper extends WrapperAbstract {
  public Button (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, id: string): TableWrapper {
    this.eventHandler = eventHandler
    this.objectTemplates = objectTemplates
    this.refreshPage = refreshPage
    this.id = id
    return this
  }
}
