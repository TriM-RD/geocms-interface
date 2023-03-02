import { ObjectTemplate } from '../containerClasses/objectTemplate'
import { EventHandlerType } from '../events/types/objectTypes/types'
import { SimpleEventDispatcher } from 'ste-simple-events'
import { StatType, StatTypeEnum } from '@/interface/manager/events/types'

export type MechanicDelegate = (eventHandler: boolean) => void;

export abstract class MechanicAbstract {
  public ObjectTemplates!: ObjectTemplate[];
  protected static instance: MechanicAbstract | null;
  protected mechanicInvoked: SimpleEventDispatcher<boolean> = new SimpleEventDispatcher<boolean>();
  protected abstract SubscribeConditions() : void;
  public abstract UnsubscribeConditions() : void;
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

  public Splice (index: number, _objectTemplates: ObjectTemplate[]) : ObjectTemplate[] {
    for (const element of _objectTemplates) {
      this.ObjectTemplates.splice(index, 0, element)
    }
    return this.ObjectTemplates
  }

  protected removeElementFromArray (arr: Array<any>, belongsTo: string) : void {
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

  protected reStructure (stats: any, append: any = null): any {
    let temp = {}
    for (let i = 0; i < Object.keys(StatType.StatTypes).length; i++) {
      if (stats[i] !== undefined) {
        temp = Object.assign(temp, { [i]: StatType.StatTypes[i]().CreateStat().InitData(stats[i].Data != null ? stats[i].Data : '') })
      }
    }
    if (append !== null) { temp = Object.assign(temp, append) }
    return temp
  }

  protected refreshPage (): void {
    if (this.mechanicInvoked !== null) {
      this.mechanicInvoked.dispatch(true)
    }
  }
}
