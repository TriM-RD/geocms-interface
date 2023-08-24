import { HandlerAbstract } from '@/resolvers/attribute/handlerAbstract'
import { ResolverAbstract } from '@/resolvers/resolverAbstract'

export class EditHandler extends HandlerAbstract {
  CreateResolver (): ResolverAbstract {
    return new EditHandler()
  }

}
