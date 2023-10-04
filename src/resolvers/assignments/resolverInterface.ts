import { EventHandlerType, ObjectTemplate } from '@cybertale/interface'
import { WrapperAbstract } from '@/resolvers/assignments/wrapperAbstract'

export interface ResolverInterface<T> {
  FormSelectList (wrapper: T): Promise<ObjectTemplate[]>
  FormDataList (wrapper: T): Promise<ObjectTemplate[]>
  FormButton (wrapper: T): Promise<ObjectTemplate[]>
  RowButton (wrapper: T): Promise<ObjectTemplate[]>
}
