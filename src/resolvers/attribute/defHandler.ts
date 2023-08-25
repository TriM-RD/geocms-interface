import { HandlerAbstract } from '@/resolvers/attribute/handlerAbstract'
import { ResolverAbstract } from '@/resolvers/resolverAbstract'

export class DefHandler extends HandlerAbstract {
  CreateResolver (): ResolverAbstract {
    return new DefHandler()
  }

}
