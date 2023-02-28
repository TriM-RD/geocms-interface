import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { ObjectTypeEnum } from '../events/types/objectType'
import { SubObjectTypeEnum } from '../events/types/subObjectType'
import { MechanicAbstract } from './mechanicAbstract'
import http from '@/http-common'
import { StatType } from '../events/types/statType'
import { ActionTypeEnum, RegionEnum, RegionType } from '@/interface/manager/events/types/index'
import { EventHandlerType } from '../events/types/objectTypes/types'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'
import router from '@/router'

export namespace Manager.Mechanic{

  export class TableMechanic extends MechanicAbstract {
    private page = 0
    private reverseOrder = false
    private lastPageReached = false
    public async InitGet (_id: string, _api: string): Promise<ObjectTemplate[]> {
      if (this.lastPageReached) { return [] }
      if (this.page > 0) { this.loadNextPage() }
      this.page++
      this.ObjectTemplates = []
      console.log(performance.now())
      const response = await http.get(`${process.env.VUE_APP_BASE_URL + _api}?page=${this.page}&order=asc`)
      console.log(response)
      if (Object.keys(response.data).length !== 0) {
        console.log(performance.now())
        this.ObjectTemplates = await this.forEachElement(response.data)
        console.log(performance.now())
        return this.ObjectTemplates
      } else {
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
      return temp
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    loadNextPage () {
      useToast()({
        component: ToastComponent,
        props: {
          msg: { info: 'Loading next set of data.' }
        }
      }, {
        type: TYPE.INFO
      })
      this.refreshPage()
    }

    refreshPage () {
      if (this.mechanicInvoked !== null) {
        this.mechanicInvoked.dispatch(this.reverseOrder)
        this.reverseOrder = false
      }
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Footer].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions () {
      RegionType.RegionTypes[RegionEnum.Footer].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
    }

    protected Button (_eventHandler: EventHandlerType): void {
      switch (router.currentRoute.value.name) {
        case 'Group':
        case 'Division':
          switch (_eventHandler.subObjectType) {
            case SubObjectTypeEnum.Middle:
              this.reverseOrder = true
              useToast()({
                component: ToastComponent,
                props: { msg: { title: 'Resorting...', info: 'Re-sorted names in table.' } }
              }, {
                type: TYPE.INFO
              })
              this.refreshPage()
              break
          }
          break
      }
    }
  }

}
