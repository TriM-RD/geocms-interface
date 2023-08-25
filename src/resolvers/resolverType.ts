import { Definitions } from '@/definitions/appDefinitions'

import { ResolverAbstract } from '@/resolvers/resolverAbstract'
import * as Resolver from '@/resolvers/device/'
// import * as GroupResolver from '@/resolvers/group/'
export class ResolverType {
  public static ResolverTypes: { [index: string]: ResolverAbstract } = {
    // Device
    [Definitions.Device.Def]: new Resolver.DefHandler.Resolver.Device.Def.DefHandler(),
    [Definitions.Device.Add]: new Resolver.Device.Add.AddHandler(),
    [Definitions.Device.Edit]: new Resolver.Device.Edit.EditHandler()
    // Group
    /* [Definitions.Group.Def]: new GroupResolver.DefHandler(),
    [Definitions.Group.Add]: new GroupResolver.AddHandler(),
    [Definitions.Group.Edit]: new GroupResolver.EditHandler() */
  }
}
