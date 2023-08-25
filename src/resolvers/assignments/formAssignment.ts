import { EventHandlerType, ObjectTemplate } from '@cybertale/interface'

export interface FormAssignment {
  SelectList (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void, append: (_objectTemplates: ObjectTemplate[]) => ObjectTemplate[]): Promise<ObjectTemplate[]>
  DataList (eventHandler: EventHandlerType, objectTemplates: ObjectTemplate[], refreshPage: () => void): Promise<ObjectTemplate[]>
}
