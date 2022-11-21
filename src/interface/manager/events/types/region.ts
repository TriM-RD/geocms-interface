import { Manager } from './regionTypes/types'

export enum RegionEnum {
  Form,
  Table,
  TableColumn,
  Show,
  ContentList,
ContentListRow}

export class RegionType {
    public static RegionTypes: { [index: number]: Manager.Events.Type.RegionAbstract } =
    {
      [RegionEnum.Form]: new Manager.Events.Type.Form(),
      [RegionEnum.Table]: new Manager.Events.Type.Table(),
      [RegionEnum.TableColumn]: new Manager.Events.Type.TableColumn(),
      [RegionEnum.Show]: new Manager.Events.Type.Show(),
      [RegionEnum.ContentList]: new Manager.Events.Type.ContentList(),
      [RegionEnum.ContentListRow]: new Manager.Events.Type.ContentListRow()
    }
}
