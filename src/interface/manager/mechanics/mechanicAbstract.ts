import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { EventHandlerType } from '../events/types/objectTypes/types'
import { SubObjectTypeEnum } from '../events/types/subObjectType'
import { SimpleEventDispatcher } from 'ste-simple-events'
import { StatTypeEnum } from '@/interface/manager/events/types'

export type MechanicDelegate = (eventHandler: boolean) => void;

export abstract class MechanicAbstract {
  protected static instance: MechanicAbstract | null;
  protected mechanicInvoked: SimpleEventDispatcher<boolean> = new SimpleEventDispatcher<boolean>();
  protected abstract SubscribeConditions() : void;
  public abstract UnsubscribeConditions() : any;
  protected abstract Button(eventHandler: EventHandlerType) : void;
  constructor (_mechanicCallback: MechanicDelegate | null = null) {
    this.SubscribeToVueComponent(_mechanicCallback)
    this.SubscribeConditions()
  }

  public SubscribeToVueComponent (_mechanicCallback: MechanicDelegate | null = null) : void {
    if (_mechanicCallback !== null) { this.mechanicInvoked.subscribe(_mechanicCallback) }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getInstance (_mechanicCallback: MechanicDelegate | null = null): MechanicAbstract | null {
    return null
  }

  public abstract InitGet (_id: string, _api: string): Promise<ObjectTemplate[]>;

  public abstract InitSet(_objectTemplates: ObjectTemplate[]) : ObjectTemplate[];

  public Append (_objectTemplates: ObjectTemplate[]) : ObjectTemplate[] {
    for (const element of _objectTemplates) {
      this.ObjectTemplates.push(element)
    }
    return this.ObjectTemplates
  }

  protected removeElementFromArray (arr: Array<any>, belongsTo: string) {
    (() => {
      // Perform the array update
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].Stats[StatTypeEnum.BelongsTo] !== undefined) {
          if (arr[i].Stats[StatTypeEnum.BelongsTo].Data === belongsTo) {
            arr.splice(i, 1)
          }
        }
      }
    })()
  }

  public ObjectTemplates!: ObjectTemplate[];
}
