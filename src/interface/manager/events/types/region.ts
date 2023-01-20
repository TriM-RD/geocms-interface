import { Manager } from './regionTypes/types'

export enum RegionEnum {Form, Table, TableColumn, TableRow, Show, Footer, List, ListRow, ECabinet, ECabinetRow}

export class RegionType {
    public static RegionTypes: { [index: number]: Manager.Events.Type.RegionAbstract } =
    {
      [RegionEnum.Form]: new Manager.Events.Type.Form(),
      [RegionEnum.Table]: new Manager.Events.Type.Table(),
      [RegionEnum.TableColumn]: new Manager.Events.Type.TableColumn(),
      [RegionEnum.Show]: new Manager.Events.Type.Show(),
      [RegionEnum.Footer]: new Manager.Events.Type.Footer(),
      [RegionEnum.TableRow]: new Manager.Events.Type.TableRow(),
      [RegionEnum.List]: new Manager.Events.Type.List(),
      [RegionEnum.ListRow]: new Manager.Events.Type.ListRow(),
      [RegionEnum.ECabinet]: new Manager.Events.Type.ECabinet(),
      [RegionEnum.ECabinetRow]: new Manager.Events.Type.ECabinetRow()
    }
}
