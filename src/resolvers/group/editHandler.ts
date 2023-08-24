import { HandlerAbstract } from '@/resolvers/group/handlerAbstract'
import { ResolverAbstract } from '@/resolvers/resolverAbstract'

export class EditHandler extends HandlerAbstract {
  CreateResolver (): ResolverAbstract {
    return new EditHandler()
  }

}
