import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { ObjectTypeEnum } from '../events/types/objectType'
import { SubObjectTypeEnum } from '../events/types/subObjectType'
import { MechanicAbstract } from './mechanicAbstract'
import http from '@/http-common'
import { StatType } from '../events/types/statType'
import { ActionTypeEnum, RegionEnum, RegionType } from '@/interface/manager/events/types/index'
import router from '@/router'
import { EventHandlerType } from '../events/types/objectTypes/types'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'

export namespace Manager.Mechanic{

  export class FooterMechanic extends MechanicAbstract {
    public async InitGet (_id = '-1'): Promise<ObjectTemplate[]> {
      this.ObjectTemplates = []
      const response = await http.get(process.env.VUE_APP_BASE_URL + 'entity')
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

    private reStructure (stats: any): any {
      console.log(JSON.parse(JSON.stringify(stats)))
      let temp = {}
      // temp = Object.assign(temp, { [_index]: StatType.StatTypes[_index]().CreateStat().InitData(_stat.Data != null ? _stat.Data : '') })
      stats.forEach((_stat : any, _index: number) => { temp = Object.assign(temp, { [_index]: StatType.StatTypes[_index]().CreateStat().InitData(_stat.Data != null ? _stat.Data : '') }) })
      return temp
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Footer].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions () {
      RegionType.RegionTypes[RegionEnum.Footer].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
    }

    protected Button (eventHandler: EventHandlerType): void {
      switch (router.currentRoute.value.name) {
        case 'Device':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.ParentObject:
              break
            case SubObjectTypeEnum.Middle:
              break
            case SubObjectTypeEnum.Left:
              if (window.innerWidth <= 760 && window.innerHeight <= 760) {
                const iframe = document.createElement('iframe')
                let installed = false
                iframe.style.display = 'none'
                iframe.src = 'geocms://'
                document.body.appendChild(iframe)
                iframe.onload = function () {
                  console.log('first')
                  installed = true
                }
                setTimeout(() => {
                  if (installed) {
                    console.log('second')
                    window.location.href = 'geocms://'
                  } else {
                    useToast()({
                      component: ToastComponent,
                      props: { msg: { title: 'App is missing.', info: 'GeoCMS Scanner is missing from your device.' } }
                    }, {
                      type: TYPE.ERROR
                    })
                  }
                }, 1000)
              } else {
                useToast()({
                  component: ToastComponent,
                  props: { msg: { title: 'Unsupported platform.', info: 'GeoCMS Scanner is not supported on this platform.' } }
                }, {
                  type: TYPE.ERROR
                })
              }
              break
            case SubObjectTypeEnum.Right:
              router.push({ name: 'DeviceAdd' })
              break
            case SubObjectTypeEnum.Up:
              break
            case SubObjectTypeEnum.Down:
              break
            default:
              break
          }
          break
        case 'Group':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:
              router.push({ name: 'Show' })
              break
            case SubObjectTypeEnum.Right:
              router.push({ name: 'GroupAdd' })
              break
            default:
              break
          }
          break
        case 'Division':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:
              router.push({ name: 'Show' })
              break
            case SubObjectTypeEnum.Right:
              router.push({ name: 'DivisionAdd' })
              break
            default:
              break
          }
          break
      }
    }
  }

}
