import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { ObjectTypeEnum } from '../events/types/objectType'
import { SubObjectTypeEnum } from '../events/types/subObjectType'
import { MechanicAbstract, MechanicDelegate } from './mechanicAbstract'
import http from '@/http-common'
import { StatType, StatTypeEnum } from '../events/types/statType'
import { RegionEnum, RegionType } from '../events/types/region'
import { EventHandlerType } from '../events/types/objectTypes/types'
import router from '@/router'

export namespace Manager.Mechanic{

  export class ModalFormMechanic extends MechanicAbstract {
    private id = '-1';
    private inEdit = false;

    public async InitGet (_id: string, _route: string): Promise<ObjectTemplate[]> {
      this.id = _id
      if (this.id === '-1') {
        this.id = (await http.get(process.env.VUE_APP_BASE_URL + _route + '/' + this.id)).data
        console.log(this.id)
        const response = await http.get(process.env.VUE_APP_BASE_URL + 'form/' + _route)
        return (this.ObjectTemplates = response.data.map((_object: any) => {
          return new ObjectTemplate(_object.Region, _object.ObjectEnum,
            _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats,
              {
                [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat()
                  .InitData(String(this.id))
              }))
        }))
      }
      const response = await http.get(process.env.VUE_APP_BASE_URL + _route + '/' + this.id)
      this.inEdit = true
      return (this.ObjectTemplates = response.data.map((_object: any) => {
        return new ObjectTemplate(_object.Region, _object.ObjectEnum,
          _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats))
      }))
    }

    private forEachElement (data: any) : ObjectTemplate[] {
      let _temp: ObjectTemplate[] = []
      data.forEach((_list: any) => {
        _temp = _temp.concat(_list.map((_object: any) => {
          return new ObjectTemplate(_object.Region, _object.ObjectEnum, _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats))
        }))
      })
      return _temp
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
      console.log(temp)
      return temp
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      this.ObjectTemplates = []
    }

    refreshPage () {
      if (this.mechanicInvoked !== null) {
        this.mechanicInvoked.dispatch(true)
      }
    }

    protected async Button (eventHandler: EventHandlerType): Promise<void> {
      const temp = document.getElementById('formModalSubmit' + eventHandler.payload.Stats[StatTypeEnum.Value].Data)
      switch (eventHandler.subObjectType) {
        case SubObjectTypeEnum.Left:
          if (this.inEdit) {
            await http.patch(process.env.VUE_APP_BASE_URL + 'entity/' + this.id, this.ObjectTemplates)
              .then(response => (temp?.click()))
          } else {
            await http.post(process.env.VUE_APP_BASE_URL + 'entity', this.ObjectTemplates)
              .then(response => (temp?.click()))
          }
          break
        default:
          break
      }
    }

    static getInstance (_mechanicCallback: MechanicDelegate | null = null): MechanicAbstract {
      if (!MechanicAbstract.instance) {
        MechanicAbstract.instance = new ModalFormMechanic()
      }
      MechanicAbstract.instance.SubscribeToVueComponent(_mechanicCallback)
      return MechanicAbstract.instance
    }
  }

}
