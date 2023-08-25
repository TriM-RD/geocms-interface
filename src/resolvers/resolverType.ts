import { Definitions } from '@/definitions/appDefinitions'

import { ResolverAbstract } from '@/resolvers/resolverAbstract'
import * as Device from '@/resolvers/device/'
import * as Group from '@/resolvers/group/'
import * as Attribute from '@/resolvers/attribute/'
export class ResolverType {
  public static ResolverTypes: { [index: string]: ResolverAbstract } = {
    // Device
    [Definitions.Device.Def]: new Device.Def.DefHandler(),
    [Definitions.Device.Add]: new Device.Add.AddHandler(),
    [Definitions.Device.Edit]: new Device.Edit.EditHandler(),
    [Definitions.Device.Replace]: new Device.Replace.ReplaceHandler(),
    // Group
    [Definitions.Group.Def]: new Group.Def.DefHandler(),
    [Definitions.Group.Add]: new Group.Add.AddHandler(),
    [Definitions.Group.Edit]: new Group.Edit.EditHandler(),
    // Attribute
    [Definitions.Attribute.Def]: new Attribute.Def.DefHandler(),
    [Definitions.Attribute.Add]: new Attribute.Add.AddHandler(),
    [Definitions.Attribute.Edit]: new Attribute.Edit.EditHandler()
  }
}
