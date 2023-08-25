import { Definitions } from '@/definitions/appDefinitions'

import { ResolverAbstract } from '@/resolvers/resolverAbstract'
import * as Device from '@/resolvers/device/'
// import * as GroupResolver from '@/resolvers/group/'
export class ResolverType {
  public static ResolverTypes: { [index: string]: ResolverAbstract } = {
    // Device
    [Definitions.Device.Def]: new Device.Def.DefHandler(),
    [Definitions.Device.Add]: new Device.Add.AddHandler(),
    [Definitions.Device.Edit]: new Device.Edit.EditHandler(),
    [Definitions.Device.Replace]: new Device.Replace.ReplaceHandler()
    // Group
    /* [Definitions.Group.Def]: new GroupResolver.DefHandler(),
    [Definitions.Group.Add]: new GroupResolver.AddHandler(),
    [Definitions.Group.Edit]: new GroupResolver.EditHandler() */
  }
}
