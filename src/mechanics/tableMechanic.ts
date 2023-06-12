import http from '@/http-common'
import { EventHandlerType, RegionEnum, RegionType, MechanicAbstract, SubObjectTypeEnum, ObjectTypeEnum, ObjectTemplate } from '@cybertale/interface'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'
import router from '@/router'

export namespace Manager.Mechanic{

  export class TableMechanic extends MechanicAbstract {
    private page = 0
    private reverseOrder = false
    private lastPageReached = false
    private groupTypeFilter: { [key: string]: string } = { all: '', group: 'group', template: 'template' }
    private filters = { code: '', group: '', division: '' }

    public async InitGet (_id: string, _api: string): Promise<ObjectTemplate[]> {
      try {
        const query = JSON.parse(_api)
        if (this.lastPageReached) { return [] }
        if (this.page > 0) { this.loadNextPage() }
        this.page++
        this.ObjectTemplates = []
        let url = `${process.env.VUE_APP_BASE_URL + query.api}?page=${this.page}&order=${query.order}`
        for (const filter in query.filters) {
          url += `&${filter}=${query.filters[filter]}`
        }
        const response = await http.get(url)
        if (Object.keys(response.data).length !== 0) {
          this.ObjectTemplates = await this.forEachElement(response.data)
          return this.ObjectTemplates
        } else {
          this.lastPageReached = true
          return []
        }
      } catch (e) {
        if (this.lastPageReached) { return [] }
        if (this.page > 0) { this.loadNextPage() }
        this.page++
        this.ObjectTemplates = []
        const response = await http.get(`${process.env.VUE_APP_BASE_URL + _api}?page=${this.page}&order=asc`)
        if (Object.keys(response.data).length !== 0) {
          this.ObjectTemplates = await this.forEachElement(response.data)
          return this.ObjectTemplates
        } else {
          this.lastPageReached = true
          return []
        }
      }
    }

    private forEachElement (data: any) : Promise<ObjectTemplate[]> {
      return new Promise((resolve) => {
        const promises = data.map((_list: any) => {
          return Promise.all(_list.map((_object: any) => {
            return new ObjectTemplate(_object.Region, _object.ObjectEnum, _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats))
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

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    loadNextPage (): void {
      useToast()({
        component: ToastComponent,
        props: {
          msg: { info: 'Loading next set of data.' }
        }
      }, {
        type: TYPE.INFO
      })
      this.refreshPage() // TODO find out what is its use if any
    }

    refreshPage (): void {
      if (this.mechanicInvoked !== null) {
        this.mechanicInvoked.dispatch(this.reverseOrder)
        this.reverseOrder = false
      }
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Table].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Table].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
    }

    protected Button (_eventHandler: EventHandlerType): void {
      switch (router.currentRoute.value.name) {
        case 'Group':
          switch (_eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:
              this.reverseOrder = true
              // TODO try to find a way to be able to have toast here instead of TableComponent
              this.refreshPage()
              break
          }
          break
        case 'Division':
          switch (_eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:
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
