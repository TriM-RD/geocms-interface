import http from '@/http-common'
import router from '@/router'
import { EventHandlerType, RegionEnum, ActionTypeEnum, RegionType, StatType, StatTypeEnum, MechanicAbstract, MechanicDelegate, SubObjectTypeEnum, ObjectTypeEnum, ObjectTemplate } from '@cybertale/interface'
import { useToast, TYPE } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'

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
      const _id = eventHandler.payload.Stats[StatTypeEnum.Id].Data
      switch (router.currentRoute.value.name) {
        case 'Device':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:// Izbriši
              await this.validateForm('entity', _id)
              break
            case SubObjectTypeEnum.Middle: // Uredi
              await router.push({
                name: 'DeviceEdit',
                params: { id: _id }
              })
              break
            case SubObjectTypeEnum.Right: // Pregledaj
              await router.push({
                name: 'DeviceEdit',
                params: { id: _id }
              })
              break
            default:
              break
          }
          break
        case 'Group':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:// Izbriši
              await this.validateForm('group', _id)
              break
            case SubObjectTypeEnum.Middle: // Uredi
              await router.push({
                name: 'GroupEdit',
                params: { id: _id }
              })
              break
            case SubObjectTypeEnum.Right: // Pregledaj
              await router.push({
                name: 'GroupEdit',
                params: { id: _id }
              })
              break
            default:
              break
          }
          break
        case 'GroupEdit':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:// Izbriši
              await this.validateForm('attribute', _id)
              break
            case SubObjectTypeEnum.Middle: // Pregledaj
              await router.push({
                name: 'AttributeEdit',
                params: {
                  parentId: router.currentRoute.value.params.id,
                  id: _id
                }
              })
              break
            case SubObjectTypeEnum.Right: // Pregledaj
              await router.push({
                name: 'AttributeEdit',
                params: { id: _id }
              })
              break
            default:
              break
          }
          break
        case 'Division':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:// Izbriši
              await this.validateForm('division', _id)
              break
            case SubObjectTypeEnum.Middle: // Uredi
              await router.push({
                name: 'DivisionEdit',
                params: { id: _id }
              })
              break
            case SubObjectTypeEnum.Right: // Pregledaj
              await router.push({
                name: 'DivisionEdit',
                params: { id: _id }
              })
              break
            default:
              break
          }
          break
        case 'Administration':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Middle: // Uredi
              await router.push({
                name: 'AdministrationEdit',
                params: { id: _id }
              })
              break
            case SubObjectTypeEnum.Right: // Pregledaj
              await router.push({
                name: 'AdministrationEdit',
                params: { id: _id }
              })
              break
            default:
              break
          }
          break
      }
    }

    static getInstance (_mechanicCallback: MechanicDelegate | null = null): MechanicAbstract {
      if (!MechanicAbstract.instance) {
        MechanicAbstract.instance = new RowMechanic()
        MechanicAbstract.instance.SubscribeToVueComponent(_mechanicCallback)
      }
      return MechanicAbstract.instance
    }

    private async validateForm (route: string, _id: string) {
      if (window.confirm('Are you sure you want to delete this entity?')) {
        this.refreshPage()
        http.delete(process.env.VUE_APP_BASE_URL + route + '/' + _id)
          .then((response) => {
            useToast()({
              component: ToastComponent,
              props: {
                msg: response.data.msg
              }
            }, {
              type: response.data.status as TYPE
            })
            this.refreshPage()
          })
      }
    }
  }

}
