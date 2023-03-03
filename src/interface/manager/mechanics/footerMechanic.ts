import { MechanicAbstract, RegionEnum, RegionType, EventHandlerType, SubObjectTypeEnum, ObjectTypeEnum, ObjectTemplate } from 'cyber-interface'
import router from '@/router'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'

export namespace Manager.Mechanic{

  export class FooterMechanic extends MechanicAbstract {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async InitGet (_id = '-1'): Promise<ObjectTemplate[]> {
      throw new Error('Function not implemented')
    }

    public InitSet (_objectTemplates: ObjectTemplate[]): ObjectTemplate[] {
      this.ObjectTemplates = _objectTemplates
      return this.ObjectTemplates
    }

    protected SubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Footer].ObjectTypes[ObjectTypeEnum.Button].SubscribeLogic(this.Button.bind(this))
    }

    public UnsubscribeConditions (): void {
      RegionType.RegionTypes[RegionEnum.Footer].ObjectTypes[ObjectTypeEnum.Button].NullifyLogic()
    }

    protected Button (eventHandler: EventHandlerType): void {
      console.log('show')
      switch (router.currentRoute.value.name) {
        case 'Device':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Left:
              if (window.innerWidth <= 760 && window.innerHeight <= 760) {
                window.location.href = 'geocms://'
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
            default:
              break
          }
          break
        case 'Group':
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Right:
              router.push({ name: 'GroupAdd' })
              break
            default:
              break
          }
          break
        case 'Division':
          switch (eventHandler.subObjectType) {
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
