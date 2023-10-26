import { MechanicAbstract, RegionEnum, RegionType, EventHandlerType, SubObjectTypeEnum, ObjectTypeEnum, ObjectTemplate } from '@cybertale/interface'
import router from '@/router'
import { TYPE, useToast } from 'vue-toastification'
import ToastComponent from '@/components/ToastComponent.vue'
import { Definitions } from '@/definitions/appDefinitions'

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
        case Definitions.Entity.Def:
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
              router.push({ name: Definitions.Entity.Add })
              break
            default:
              break
          }
          break
        case Definitions.Group.Def:
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Right:
              router.push({ name: Definitions.Group.Add })
              break
            default:
              break
          }
          break
        case Definitions.Division.Def:
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Right:
              router.push({ name: Definitions.Division.Add })
              break
            default:
              break
          }
          break
        case Definitions.Administration.Def:
          switch (eventHandler.subObjectType) {
            case SubObjectTypeEnum.Right:
              router.push({ name: Definitions.Administration.Add })
              break
            default:
              break
          }
          break
      }
    }
  }

}
