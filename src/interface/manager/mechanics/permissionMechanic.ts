import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { ObjectTypeEnum } from '../events/types/objectType'
import { SubObjectTypeEnum } from '../events/types/subObjectType'
import { MechanicAbstract } from './mechanicAbstract'
import http from '@/http-common'
import { StatType } from '../events/types/statType'
import { ActionTypeEnum, RegionEnum, RegionType } from '@/interface/manager/events/types/index'
import { EventHandlerType } from '../events/types/objectTypes/types'
import router from '@/router'

export namespace Manager.Mechanic{

  export class PermissionMechanic extends MechanicAbstract {
    public async InitGet (_id: string, _api: string): Promise<ObjectTemplate[]> {
      this.ObjectTemplates = []
      const response = await http.get(process.env.VUE_APP_BASE_URL + _api)
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
        _temp = _temp.concat(_list.map((_object: any) => {
          return new ObjectTemplate(RegionEnum.ECabinet, ObjectTypeEnum.ECabinetRow, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, this.reStructure(_object.Stats))
        }))
      })
      return _temp
    }

    private reStructure (stats: any, append: any = null): any {
      let temp = {}
      for (let i = 0; i < Object.keys(StatType.StatTypes).length; i++) {
        if (stats[i] !== undefined) {
          temp = Object.assign(temp, { [i]: StatType.StatTypes[i]().CreateStat().InitData(stats[i].Data != null ? stats[i].Data : '') })
        }
      }
      if (append !== null) { temp = Object.assign(temp, append) }
      return temp
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions () {
      RegionType.RegionTypes[RegionEnum.Form].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
    }

    refreshPage () {
      if (this.mechanicInvoked !== null) {
        this.mechanicInvoked.dispatch(true)
      }
    }

    protected async Button (_eventHandler: EventHandlerType): Promise<void> {
      switch (_eventHandler.subObjectType) {
        case SubObjectTypeEnum.Left:
          this.refreshPage()
          break
        case SubObjectTypeEnum.Right:
          await router.go(0)
          break
      }
    }
  }

}
