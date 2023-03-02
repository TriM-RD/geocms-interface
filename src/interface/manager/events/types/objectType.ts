import { Manager } from './objectTypes/types'

export enum ObjectTypeEnum {
  Row,
  Field,
  Button,
  Text,
  Output,
  Alert,
  CheckBox,
  DataList,
  SelectList,
  Radio,
  Column,
  ColumnButton,
  FieldButton,
  SelectButton,
  ListRow,
  ECabinetRow,
  ECabinetColumn,
  ModalForm,
  MapPicker,
  FieldCode,
  DataSelect
}

export class ObjectType {
  public static ObjectTypes: { [index: number]: (getVueComponent: () => any) => void} =
    {
      [ObjectTypeEnum.Field]: Manager.Events.Type.Field.SetComponent,
      [ObjectTypeEnum.Row]: Manager.Events.Type.Row.SetComponent,
      [ObjectTypeEnum.Button]: Manager.Events.Type.Button.SetComponent,
      [ObjectTypeEnum.Text]: Manager.Events.Type.Text.SetComponent,
      [ObjectTypeEnum.Output]: Manager.Events.Type.Output.SetComponent,
      [ObjectTypeEnum.Alert]: Manager.Events.Type.Alert.SetComponent,
      [ObjectTypeEnum.CheckBox]: Manager.Events.Type.CheckBox.SetComponent,
      [ObjectTypeEnum.DataList]: Manager.Events.Type.DataList.SetComponent,
      [ObjectTypeEnum.SelectList]: Manager.Events.Type.SelectList.SetComponent,
      [ObjectTypeEnum.Radio]: Manager.Events.Type.Radio.SetComponent,
      [ObjectTypeEnum.Column]: Manager.Events.Type.Column.SetComponent,
      [ObjectTypeEnum.ColumnButton]: Manager.Events.Type.ColumnButton.SetComponent,
      [ObjectTypeEnum.FieldButton]: Manager.Events.Type.FieldButton.SetComponent,
      [ObjectTypeEnum.SelectButton]: Manager.Events.Type.SelectButton.SetComponent,
      [ObjectTypeEnum.ListRow]: Manager.Events.Type.ListRow.SetComponent,
      [ObjectTypeEnum.ECabinetRow]: Manager.Events.Type.ECabinetRow.SetComponent,
      [ObjectTypeEnum.ECabinetColumn]: Manager.Events.Type.ECabinetColumn.SetComponent,
      [ObjectTypeEnum.ModalForm]: Manager.Events.Type.ModalForm.SetComponent,
      [ObjectTypeEnum.MapPicker]: Manager.Events.Type.MapPicker.SetComponent,
      [ObjectTypeEnum.FieldCode]: Manager.Events.Type.FieldCode.SetComponent,
      [ObjectTypeEnum.DataSelect]: Manager.Events.Type.DataSelect.SetComponent
    }
}
