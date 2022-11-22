import { Manager } from './statTypes/types'

export enum StatTypeEnum {
  Label,
  Value,
  Design,
  Tag,
  Id,
  ElementType,
  Placeholder,
  ItemList,
  EncompassHtml
}

export class StatType {
 public static StatTypes: { [index: number]: Manager.Events.Type.CreateStatDel } =
 {
   [StatTypeEnum.Tag]: new Manager.Events.Type.Tag().CreateStat,
   [StatTypeEnum.Value]: new Manager.Events.Type.Value().CreateStat,
   [StatTypeEnum.Design]: new Manager.Events.Type.Design().CreateStat,
   [StatTypeEnum.Label]: new Manager.Events.Type.Label().CreateStat,
   [StatTypeEnum.Id]: new Manager.Events.Type.Id().CreateStat,
   [StatTypeEnum.ElementType]: new Manager.Events.Type.ElementType().CreateStat,
   [StatTypeEnum.Placeholder]: new Manager.Events.Type.Placeholder().CreateStat,
   [StatTypeEnum.ItemList]: new Manager.Events.Type.ItemList().CreateStat,
   [StatTypeEnum.EncompassHtml]: new Manager.Events.Type.EncompassHtml().CreateStat
 }
}
