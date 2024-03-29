import { MechanicAbstract, StatType, StatTypeEnum, RegionEnum, EventHandlerType, SubObjectTypeEnum, ObjectTypeEnum, ObjectTemplate } from '@cybertale/interface'
import http from '@/http-common'

export namespace Manager.Mechanic{

  export class ListMechanic extends MechanicAbstract {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async InitGet (_id = '-1', _route: string): Promise<ObjectTemplate[]> {
      this.ObjectTemplates = []

      // Add a conditional to include the id in the request URL when it's not '-1'.
      const requestUrl =
        process.env.VUE_APP_BASE_URL +
        _route +
        (_id !== '-1' ? '/' + _id : '')

      const response = await http.get(requestUrl)

      if (Object.keys(response.data).length !== 0) {
        this.ObjectTemplates = this.forEachElement(response.data)
        return this.ObjectTemplates
      } else {
        return []
      }
    }

    private forEachElement (data: any) : ObjectTemplate[] {
      let _temp: ObjectTemplate[] = []
      data.forEach((_list: any) => {
        _temp = _temp.concat(_list.filter((_object : ObjectTemplate) => { return _object.Stats[StatTypeEnum.Tag].Data === 'name' }).map((_object: any) => {
          return new ObjectTemplate(RegionEnum.List, ObjectTypeEnum.Button, SubObjectTypeEnum.Middle, _object.ActionEnum, this.reStructure(_object.Stats))
        }))
      })
      return _temp
    }

    protected reStructure (stats: any): any {
      let temp = {}
      stats.forEach((_stat : any, _index: number) => { temp = Object.assign(temp, { [_index]: StatType.StatTypes[_index]().CreateStat().InitData(_stat.Data != null ? _stat.Data : '') }) })
      return temp
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      // RegionType.RegionTypes[RegionEnum.Table].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions (): void {
      // RegionType.RegionTypes[RegionEnum.Table].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected Button (_eventHandler: EventHandlerType): void {
      throw new Error('Method not implemented.')
    }
  }

}
