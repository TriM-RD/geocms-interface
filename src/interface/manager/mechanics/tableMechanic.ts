import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { ObjectTypeEnum } from '../events/types/objectType'
import { SubObjectTypeEnum } from '../events/types/subObjectType'
import { MechanicAbstract } from './mechanicAbstract'
import http from '@/http-common'
import { StatType } from '../events/types/statType'
import { ActionTypeEnum, RegionEnum } from '@/interface/manager/events/types/index'
import { EventHandlerType } from '../events/types/objectTypes/types'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'

export namespace Manager.Mechanic{

  export class TableMechanic extends MechanicAbstract {
    private page = 0
    private lastPageReached = false
    public async InitGet (_id: string, _api: string): Promise<ObjectTemplate[]> {
      if (this.lastPageReached) { return [] }
      if (this.page > 0) { this.refreshPage() }
      this.page++
      this.ObjectTemplates = []
      console.log(performance.now())
      const response = await http.get(`${process.env.VUE_APP_BASE_URL + _api}?page=${this.page}`)
      console.log(response)
      if (Object.keys(response.data).length !== 0) {
        console.log(performance.now())
        this.ObjectTemplates = await this.forEachElement(response.data)
        console.log(performance.now())
        return this.ObjectTemplates
      } else {
        console.log('test')
        this.lastPageReached = true
        return []
      }
    }

    private forEachElement (data: any) : Promise<ObjectTemplate[]> {
      return new Promise((resolve) => {
        const promises = data.map((_list: any) => {
          return Promise.all(_list.map((_object: any) => {
            return new ObjectTemplate(RegionEnum.ECabinetRow, ObjectTypeEnum.ECabinetColumn, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, this.reStructure(_object.Stats))
          }))
        })
        Promise.all(promises).then((results: any[]) => {
          let _temp: ObjectTemplate[] = []
          results.forEach((result) => {
            _temp = [..._temp, ...result]
          })
          resolve(_temp)
        })
      })
    }

    private reStructure (stats: any, append: any = null): any {
      let temp = {}
      // console.log(stats)
      // stats.forEach((_stat : any, _index: number) => { if (_stat !== undefined) temp = Object.assign(temp, { [_index]: StatType.StatTypes[_index]().CreateStat().InitData(_stat.Data != null ? _stat.Data : '') }) })
      for (let i = 0; i < Object.keys(StatType.StatTypes).length; i++) {
        if (stats[i] !== undefined) {
          temp = Object.assign(temp, { [i]: StatType.StatTypes[i]().CreateStat().InitData(stats[i].Data != null ? stats[i].Data : '') })
        }
      }
      if (append !== null) { temp = Object.assign(temp, append) }
      // console.log(temp)
      return temp
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    refreshPage () {
      if (this.mechanicInvoked !== null) {
        useToast()({
          component: ToastComponent,
          props: {
            msg: { info: 'Loading next set of data.' }
          }
        }, {
          type: TYPE.INFO
        })
        this.mechanicInvoked.dispatch(true)
      }
    }

    protected SubscribeConditions (): void {
      // RegionType.RegionTypes[RegionEnum.Table].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions () {
      // RegionType.RegionTypes[RegionEnum.Table].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
    }

    protected Button (_eventHandler: EventHandlerType): void {
      console.log('not implemented')
    }
  }

}
