import { SubObjectTypeEnum, SubObjectType } from '../subObjectType'
import { StatChangeDel, StatChangeEventArgs } from '@/interface/manager/containerClasses/statChangeEventArgs'
import { SimpleEventDispatcher } from 'ste-simple-events'
import InputComponent from '@/components/formComponents/InputComponent.vue'
import SubmitButtonComponent from '@/components/formComponents/SubmitButtonComponent.vue'
import RowComponent from '@/components/RowComponent.vue'
import TextAreaComponent from '@/components/formComponents/TextAreaComponent.vue'
import ResolveShowComponent from '@/components/ResolveShowComponent.vue'
import AlertComponent from '@/components/formComponents/AlertComponent.vue'
import CheckBoxComponent from '@/components/formComponents/CheckBoxComponent.vue'
import DataListComponent from '@/components/formComponents/DataListComponent.vue'
import SelectListComponent from '@/components/formComponents/SelectListComponent.vue'
import RadioComponent from '@/components/formComponents/RadioComponent.vue'
import ColumnComponent from '@/components/ColumnComponent.vue'
import ColumnButtonComponent from '@/components/ColumnButtonComponent.vue'
import FieldButtonComponent from '@/components/FieldButtonComponent.vue'
import SelectButtonComponent from '@/components/SelectButtonComponent.vue'
import { StatTypeEnum } from '../statType'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'

export type EventHandlerType = {subObjectType: SubObjectTypeEnum, payload: any}
export type LogicDelegate = (eventHandler: EventHandlerType) => void;

export namespace Manager.Events.Type{

    export abstract class ObjectTypeAbstract {
       private LogicInvoked: SimpleEventDispatcher<EventHandlerType> = new SimpleEventDispatcher<EventHandlerType>();

      // protected abstract SubscribeCondition(sender: () => void) : void;
      public abstract Subscribe(subObjectType:SubObjectTypeEnum, statChangeDel:StatChangeDel) : void;

      public abstract GetVueComponent(): any;

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
    private StatChangeEvent:SimpleEventDispatcher<StatChangeEventArgs> = new SimpleEventDispatcher<StatChangeEventArgs>();

    public InvokeStatChange (_statType: StatTypeEnum, _amount: any) : void{
      this.StatChangeEvent.dispatch(new StatChangeEventArgs(_statType, _amount))
    }

    public Subscribe (_subObjectType:SubObjectTypeEnum, _statChangeDel:StatChangeDel) :void{
      this.StatChangeEvent.subscribe(SubObjectType.SubObjectTypes[_subObjectType].Subscribe(_statChangeDel))
    }
   }

   export class Field extends IChangeStat {
     public GetVueComponent () {
       return InputComponent
     }
   }

   export class Button extends Default {
     public GetVueComponent () {
       return SubmitButtonComponent
     }
   }

   export class Row extends IChangeStat {
     public GetVueComponent () {
       return RowComponent
     }
   }

   export class Text extends IChangeStat {
     public GetVueComponent () {
       return TextAreaComponent
     }
   }

   export class ShowResolve extends IChangeStat {
     public GetVueComponent () {
       return ResolveShowComponent
     }
   }

   export class Alert extends IChangeStat {
     public GetVueComponent () {
       return AlertComponent
     }
   }

   export class CheckBox extends IChangeStat {
     public GetVueComponent () {
       return CheckBoxComponent
     }
   }

   export class DataList extends IChangeStat {
     public GetVueComponent () {
       return DataListComponent
     }
   }

   export class SelectList extends IChangeStat {
     public GetVueComponent () {
       return SelectListComponent
     }
   }

   export class Radio extends IChangeStat {
     public GetVueComponent () {
       return RadioComponent
     }
   }

  export class Column extends IChangeStat {
    public GetVueComponent () {
      return ColumnComponent
    }
  }

  export class ColumnButton extends IChangeStat {
    public GetVueComponent () {
      return ColumnButtonComponent
    }
  }

  export class FieldButton extends IChangeStat {
    public GetVueComponent () {
      return FieldButtonComponent
    }
  }

  export class SelectButton extends IChangeStat {
    public GetVueComponent () {
      return SelectButtonComponent
    }
  }
}
