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
        const response = await http.get(process.env.VUE_APP_BASE_URL + 'form/' + _route)
        return (this.ObjectTemplates = response.data.map((_object: any) => {
          return new ObjectTemplate(_object.Region, _object.ObjectEnum,
            _object.SubObjectEnum, _object.ActionEnum, this.reStructure(_object.Stats))
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
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.SelectList].SubscribeLogic(this.SelectList.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
      RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.SelectList].NullifyLogic()
      this.ObjectTemplates = []
    }

    refreshPage () {
      if (this.mechanicInvoked !== null) {
        this.mechanicInvoked.dispatch(true)
      }
    }

    protected async SelectList (eventHandler: EventHandlerType): Promise<void> {
      switch (router.currentRoute.value.name) {
        case 'DeviceAdd':
        case 'DeviceEdit':// TODO add regex to check if id is uuid
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Middle:
              this.removeElementFromArray(this.ObjectTemplates, 'group')
              this.refreshPage()
              this.ObjectTemplates = this.Append((await http.get(process.env.VUE_APP_BASE_URL + 'form/entity/' + eventHandler.payload.Stats[StatTypeEnum.Value].Data)).data)
              this.refreshPage()
              break
            default:
              break
          }
          break
      }
    }

    protected async Button (eventHandler: EventHandlerType): Promise<void> {
      const temp = document.getElementById('formModalSubmit' + eventHandler.payload.Stats[StatTypeEnum.Value].Data)
      switch (eventHandler.subObjectType) {
        case SubObjectTypeEnum.Left:
          this.validateForm('entity', temp)
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

    private async validateForm (route: string, temp: any) {
      for (const form of document.getElementsByClassName('needs-validation')) {
        if (!(form as HTMLFormElement).checkValidity()) {
          form.classList.add('was-validated')
        } else {
          /* if (this.inEdit && !(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(this.id))) {
            await http.patch(process.env.VUE_APP_BASE_URL + route + '/' + this.id, this.ObjectTemplates)
              .then((response) => {
                if (response.data.id !== false) {
                  this.refreshPage()
                  this.ObjectTemplates.length = 0
                  this.ObjectTemplates = this.Append(response.data.entities)
                  this.refreshPage()
                } else {
                  this.refreshPage()
                  form.classList.remove('was-validated')
                  this.ObjectTemplates.length = 0
                  this.ObjectTemplates = this.Append(response.data.entities)
                  this.refreshPage()
                }
              })
          } else { */
          console.log(this.ObjectTemplates)
          await http.post(process.env.VUE_APP_BASE_URL + route, this.ObjectTemplates)
            .then((response) => {
              if (response.data.id !== false) {
                  // eslint-disable-next-line no-unused-expressions
                  temp?.click()
              } else {
                this.refreshPage()
                form.classList.remove('was-validated')
                this.ObjectTemplates.length = 0
                this.ObjectTemplates = this.Append(response.data.entities)
                this.refreshPage()
              }
            })
          // }
        }
      }
    }
  }

}
