import { SubObjectTypeEnum, SubObjectType } from '../subObjectType'
import { StatChangeDel, StatChangeEventArgs } from '../../../containerClasses/statChangeEventArgs'
import { SimpleEventDispatcher } from 'ste-simple-events'
import { StatTypeEnum } from '../statType'
import { ObjectTemplate } from '../../../containerClasses/objectTemplate'

export type EventHandlerType = {subObjectType: SubObjectTypeEnum, payload: any}
export type LogicDelegate = (eventHandler: EventHandlerType) => void
// export type ComponentDelegate = (getVueComponent: () => any) => void

export namespace Manager.Events.Type{

    export abstract class ObjectTypeAbstract {
       private LogicInvoked: SimpleEventDispatcher<EventHandlerType> = new SimpleEventDispatcher<EventHandlerType>()
       public static getVueComponent: () => any
       public static SetComponent (getVueComponent: () => any): void {
         throw new Error('Function not implemented')
       }

       public abstract GetVueComponent (): any

      // protected abstract SubscribeCondition(sender: () => void) : void;
      public abstract Subscribe(subObjectType:SubObjectTypeEnum, statChangeDel:StatChangeDel) : void

      public InvokeStatChange (_statType: StatTypeEnum, _amount: any): void {
        throw new Error('Method not implemented.')
      }

      public ChooseSubType (_object : ObjectTemplate, _data : any = null) : boolean {
        return SubObjectType.SubObjectTypes[_object.SubObjectEnum].ChooseAction(_object, _data, this.InvokeLogic.bind(this))
      }

      protected InvokeLogic (eventHandler: EventHandlerType) : void {
        this.LogicInvoked.dispatch({ subObjectType: eventHandler.subObjectType, payload: eventHandler.payload })
      }

      public SubscribeLogic (logicDel: LogicDelegate) : void {
        this.LogicInvoked.subscribe(logicDel)
      }

      public UnSubscribeLogic (logicDel : LogicDelegate) : void {
        this.LogicInvoked.unsubscribe(logicDel)
      }

      public NullifyLogic () : void {
        this.LogicInvoked.clear()
      }
    }

   abstract class Default extends ObjectTypeAbstract {
     public InvokeStatChange (_statType: StatTypeEnum, _amount: any) : void{
       throw new Error('Method not implemented.')
     }

     public Subscribe (_subObjectType:SubObjectTypeEnum, _statChangeDel:StatChangeDel) :void{
       throw new Error('Method not implemented.')
     }
   }

   abstract class IChangeStat extends ObjectTypeAbstract {
    private StatChangeEvent:SimpleEventDispatcher<StatChangeEventArgs> = new SimpleEventDispatcher<StatChangeEventArgs>()

    public InvokeStatChange (_statType: StatTypeEnum, _amount: any) : void{
      this.StatChangeEvent.dispatch(new StatChangeEventArgs(_statType, _amount))
    }

    public Subscribe (_subObjectType:SubObjectTypeEnum, _statChangeDel:StatChangeDel) :void{
      this.StatChangeEvent.subscribe(SubObjectType.SubObjectTypes[_subObjectType].Subscribe(_statChangeDel))
    }
   }

   export class Field extends IChangeStat {
     public static SetComponent (getVueComponent: () => any): void {
       Field.getVueComponent = getVueComponent
     }

     public GetVueComponent (): any {
       return Field.getVueComponent()
     }
   }

   export class Button extends Default {
     public static SetComponent (getVueComponent: () => any): void {
       Button.getVueComponent = getVueComponent
     }

     public GetVueComponent (): any {
       return Button.getVueComponent()
     }
   }

   export class Row extends IChangeStat {
     public static SetComponent (getVueComponent: () => any): void {
       Row.getVueComponent = getVueComponent
     }

     public GetVueComponent (): any {
       return Row.getVueComponent()
     }
   }

   export class Text extends IChangeStat {
     public static SetComponent (getVueComponent: () => any): void {
       Text.getVueComponent = getVueComponent
     }

     public GetVueComponent (): any {
       return Text.getVueComponent()
     }
   }

   export class Output extends IChangeStat {
     public static SetComponent (getVueComponent: () => any): void {
       Output.getVueComponent = getVueComponent
     }

     public GetVueComponent (): any {
       return Output.getVueComponent()
     }
   }

   export class Alert extends IChangeStat {
     public static SetComponent (getVueComponent: () => any): void {
       Alert.getVueComponent = getVueComponent
     }

     public GetVueComponent (): any {
       return Alert.getVueComponent()
     }
   }

   export class CheckBox extends IChangeStat {
     public static SetComponent (getVueComponent: () => any): void {
       CheckBox.getVueComponent = getVueComponent
     }

     public GetVueComponent (): any {
       return CheckBox.getVueComponent()
     }
   }

   export class DataList extends IChangeStat {
     public static SetComponent (getVueComponent: () => any): void {
       DataList.getVueComponent = getVueComponent
     }

     public GetVueComponent (): any {
       return DataList.getVueComponent()
     }
   }

   export class SelectList extends IChangeStat {
     public static SetComponent (getVueComponent: () => any): void {
       SelectList.getVueComponent = getVueComponent
     }

     public GetVueComponent (): any {
       return SelectList.getVueComponent()
     }
   }

   export class Radio extends IChangeStat {
     public static SetComponent (getVueComponent: () => any): void {
       Radio.getVueComponent = getVueComponent
     }

     public GetVueComponent (): any {
       return Radio.getVueComponent()
     }
   }

  export class Column extends IChangeStat {
    public static SetComponent (getVueComponent: () => any): void {
      Column.getVueComponent = getVueComponent
    }

    public GetVueComponent (): any {
      return Column.getVueComponent()
    }
  }

  export class ColumnButton extends IChangeStat {
    public static SetComponent (getVueComponent: () => any): void {
      ColumnButton.getVueComponent = getVueComponent
    }

    public GetVueComponent (): any {
      return ColumnButton.getVueComponent()
    }
  }

  export class FieldButton extends IChangeStat {
    public static SetComponent (getVueComponent: () => any): void {
      FieldButton.getVueComponent = getVueComponent
    }

    public GetVueComponent (): any {
      return FieldButton.getVueComponent()
    }
  }

  export class SelectButton extends IChangeStat {
    public static SetComponent (getVueComponent: () => any): void {
      SelectButton.getVueComponent = getVueComponent
    }

    public GetVueComponent (): any {
      return SelectButton.getVueComponent()
    }
  }

  export class ListRow extends IChangeStat {
    public static SetComponent (getVueComponent: () => any): void {
      ListRow.getVueComponent = getVueComponent
    }

    public GetVueComponent (): any {
      return ListRow.getVueComponent()
    }
  }

  export class ECabinetRow extends IChangeStat {
    public static SetComponent (getVueComponent: () => any): void {
      ECabinetRow.getVueComponent = getVueComponent
    }

    public GetVueComponent (): any {
      return ECabinetRow.getVueComponent()
    }
  }

  export class ECabinetColumn extends IChangeStat {
    public static SetComponent (getVueComponent: () => any): void {
      ECabinetColumn.getVueComponent = getVueComponent
    }

    public GetVueComponent (): any {
      return ECabinetColumn.getVueComponent()
    }
  }

  export class ModalForm extends IChangeStat {
    public static SetComponent (getVueComponent: () => any): void {
      ModalForm.getVueComponent = getVueComponent
    }

    public GetVueComponent (): any {
      return ModalForm.getVueComponent()
    }
  }

  export class MapPicker extends IChangeStat {
    public static SetComponent (getVueComponent: () => any): void {
      MapPicker.getVueComponent = getVueComponent
    }

    public GetVueComponent (): any {
      return MapPicker.getVueComponent()
    }
  }

  export class FieldCode extends IChangeStat {
    public static SetComponent (getVueComponent: () => any): void {
      FieldCode.getVueComponent = getVueComponent
    }

    public GetVueComponent (): any {
      return FieldCode.getVueComponent()
    }
  }

  export class DataSelect extends IChangeStat {
    public static SetComponent (getVueComponent: () => any): void {
      DataSelect.getVueComponent = getVueComponent
    }

    public GetVueComponent (): any {
      return DataSelect.getVueComponent()
    }
  }
}
