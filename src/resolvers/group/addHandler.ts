import { HandlerAbstract } from '@/resolvers/group/handlerAbstract'
import { ResolverAbstract } from '@/resolvers/resolverAbstract'

export class AddHandler extends HandlerAbstract {
  CreateResolver (): ResolverAbstract {
    return new AddHandler()
  }
}
