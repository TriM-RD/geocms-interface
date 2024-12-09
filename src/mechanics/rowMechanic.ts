import http from '@/http-common'
import router from '@/router'
import { EventHandlerType, RegionEnum, ActionTypeEnum, RegionType, StatType, StatTypeEnum, MechanicAbstract, MechanicDelegate, SubObjectTypeEnum, ObjectTypeEnum, ObjectTemplate } from '@cybertale/interface'
import { ResolverType } from '@/resolvers/resolverType'
import { FormWrapper } from '@/resolvers/assignments/formWrapper'
import { ResolverAbstract } from '@/resolvers/resolverAbstract'
import { RowWrapper } from '@/resolvers/assignments/rowWrapper'
import { ResolverInterface } from '@/resolvers/assignments/resolverInterface'

export namespace Manager.Mechanic{

  export class RowMechanic extends MechanicAbstract {
    public async InitGet (_id: string): Promise<ObjectTemplate[]> {
      this.ObjectTemplates = []
      const response = await http.get(process.env.VUE_APP_BASE_URL)
      return (this.ObjectTemplates = this.forEachElement(response.data))
    }

    private forEachElement (data: any) : ObjectTemplate[] {
      let _temp: ObjectTemplate[] = []
      data.forEach((_list: any) => {
        _temp = _temp.concat(_list.map((_object: any) => {
          return new ObjectTemplate(RegionEnum.Table, ObjectTypeEnum.Row, SubObjectTypeEnum.ParentObject, ActionTypeEnum.Click, this.reStructure(_object.Stats))
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
      this.ObjectTemplates = []
      for (const _object of _objectTemplates) {
        this.ObjectTemplates.push(new ObjectTemplate(_object.Region, _object.ObjectEnum, _object.SubObjectEnum, _object.ActionEnum, _object.Stats))
      }
      return this.ObjectTemplates
    }

    public SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.TableColumn].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.TableColumn].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      MechanicAbstract.instance = null
    }

    protected async Button (eventHandler: EventHandlerType): Promise<void> {
      const name = router.currentRoute.value.name
      if (typeof name !== 'string') {
        return
      }
      this.ObjectTemplates = await (ResolverType.ResolverTypes[name] as ResolverInterface<RowWrapper>).RowButton(new RowWrapper().Button(eventHandler, this.ObjectTemplates, this.refreshPage.bind(this), eventHandler.payload.Stats[StatTypeEnum.Id].Data))
    }

    static getInstance (_mechanicCallback: MechanicDelegate | null = null): MechanicAbstract {
      if (!MechanicAbstract.instance) {
        MechanicAbstract.instance = new RowMechanic()
        MechanicAbstract.instance.SubscribeToVueComponent(_mechanicCallback)
      }
      return MechanicAbstract.instance
    }
  }

}
