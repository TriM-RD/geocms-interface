import { HandlerAbstract } from '@/resolvers/group/handlerAbstract'
import { ResolverAbstract } from '@/resolvers/resolverAbstract'

export class DefHandler extends HandlerAbstract {
  CreateResolver (): ResolverAbstract {
    return new DefHandler()
  }

}
