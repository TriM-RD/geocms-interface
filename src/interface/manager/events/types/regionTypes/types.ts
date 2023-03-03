import { StatChangeDel } from '../../../containerClasses/statChangeEventArgs'
import { ObjectTypeEnum } from '../objectType'
import { SubObjectTypeEnum } from '../subObjectType'
import { Manager as ObjectTypeAbstract } from '../objectTypes/types'

export namespace Manager.Events.Type{

   export abstract class RegionAbstract {
     public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } = {}
     public Subscribe (_objectType: ObjectTypeEnum, _subObjectType: SubObjectTypeEnum, _statChangeDel:StatChangeDel): void {
       this.ObjectTypes[_objectType].Subscribe(_subObjectType, _statChangeDel)
     }
   }

  export class Form extends RegionAbstract {
    public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } =
    {
      [ObjectTypeEnum.Field]: new ObjectTypeAbstract.Events.Type.Field(),
      [ObjectTypeEnum.Button]: new ObjectTypeAbstract.Events.Type.Button(),
      [ObjectTypeEnum.Text]: new ObjectTypeAbstract.Events.Type.Text(),
      [ObjectTypeEnum.Alert]: new ObjectTypeAbstract.Events.Type.Alert(),
      [ObjectTypeEnum.CheckBox]: new ObjectTypeAbstract.Events.Type.CheckBox(),
      [ObjectTypeEnum.DataList]: new ObjectTypeAbstract.Events.Type.DataList(),
      [ObjectTypeEnum.SelectList]: new ObjectTypeAbstract.Events.Type.SelectList(),
      [ObjectTypeEnum.Radio]: new ObjectTypeAbstract.Events.Type.Radio(),
      [ObjectTypeEnum.FieldButton]: new ObjectTypeAbstract.Events.Type.FieldButton(),
      [ObjectTypeEnum.SelectButton]: new ObjectTypeAbstract.Events.Type.SelectButton(),
      [ObjectTypeEnum.ECabinetRow]: new ObjectTypeAbstract.Events.Type.ECabinetRow(),
      [ObjectTypeEnum.MapPicker]: new ObjectTypeAbstract.Events.Type.MapPicker(),
      [ObjectTypeEnum.FieldCode]: new ObjectTypeAbstract.Events.Type.FieldCode(),
      [ObjectTypeEnum.DataSelect]: new ObjectTypeAbstract.Events.Type.DataSelect()
    }
  }

  export class Table extends RegionAbstract {
    public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } =
    {
      [ObjectTypeEnum.Row]: new ObjectTypeAbstract.Events.Type.Row(),
      [ObjectTypeEnum.Button]: new ObjectTypeAbstract.Events.Type.Button()
    }
  }

  export class TableColumn extends RegionAbstract {
    public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } =
    {
      [ObjectTypeEnum.Button]: new ObjectTypeAbstract.Events.Type.Button(),
      [ObjectTypeEnum.Column]: new ObjectTypeAbstract.Events.Type.Column(),
      [ObjectTypeEnum.ColumnButton]: new ObjectTypeAbstract.Events.Type.ColumnButton()
    }
  }

  export class Show extends RegionAbstract {
    public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } =
      {
        // [ObjectTypeEnum.ShowResolve]: new ObjectTypeAbstract.Events.Type.ShowResolve()
      }
  }

  export class TableRow extends RegionAbstract {
    public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } =
      {
        // [ObjectTypeEnum.ShowResolve]: new ObjectTypeAbstract.Events.Type.ShowResolve()
      }
  }

  export class Footer extends RegionAbstract {
    public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } =
      {
        [ObjectTypeEnum.Button]: new ObjectTypeAbstract.Events.Type.Button()
      }
  }

  export class List extends RegionAbstract {
    public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } =
      {
        [ObjectTypeEnum.ListRow]: new ObjectTypeAbstract.Events.Type.ListRow()
      }
  }

  export class ListRow extends RegionAbstract {
    public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } =
      {
        [ObjectTypeEnum.Button]: new ObjectTypeAbstract.Events.Type.Button()
      }
  }

  export class ECabinet extends RegionAbstract {
    public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } =
      {
        [ObjectTypeEnum.Button]: new ObjectTypeAbstract.Events.Type.Button(),
        [ObjectTypeEnum.ECabinetRow]: new ObjectTypeAbstract.Events.Type.ECabinetRow()
      }
  }

  export class ECabinetRow extends RegionAbstract {
    public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } =
      {
        [ObjectTypeEnum.ECabinetColumn]: new ObjectTypeAbstract.Events.Type.ECabinetColumn(),
        [ObjectTypeEnum.Button]: new ObjectTypeAbstract.Events.Type.Button(),
        [ObjectTypeEnum.ModalForm]: new ObjectTypeAbstract.Events.Type.ModalForm()
      }
  }

  export class MapPicker extends RegionAbstract {
    public ObjectTypes: { [index: number]: ObjectTypeAbstract.Events.Type.ObjectTypeAbstract } =
      {
        [ObjectTypeEnum.Field]: new ObjectTypeAbstract.Events.Type.Field(),
        [ObjectTypeEnum.Button]: new ObjectTypeAbstract.Events.Type.Button()
      }
  }

}
