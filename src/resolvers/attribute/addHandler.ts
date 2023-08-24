import { HandlerAbstract } from '@/resolvers/attribute/handlerAbstract'
import { ResolverAbstract } from '@/resolvers/resolverAbstract'

export class AddHandler extends HandlerAbstract {
  CreateResolver (): ResolverAbstract {
    return new AddHandler()
  }

}
