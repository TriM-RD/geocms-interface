import { Manager } from './statTypes/types'

export enum StatTypeEnum {
  Title,
  Value,
  Design,
  Label,
  Id,
  Type,
  Placeholder
}

export class StatType {
 public static StatTypes: { [index: number]: Manager.Events.Type.CreateStatDel } =
 {
   [StatTypeEnum.Title]: new Manager.Events.Type.Title().CreateStat,
   [StatTypeEnum.Value]: new Manager.Events.Type.Value().CreateStat,
   [StatTypeEnum.Design]: new Manager.Events.Type.Design().CreateStat,
   [StatTypeEnum.Label]: new Manager.Events.Type.Label().CreateStat,
   [StatTypeEnum.Id]: new Manager.Events.Type.Id().CreateStat,
   [StatTypeEnum.Type]: new Manager.Events.Type.Type().CreateStat,
   [StatTypeEnum.Placeholder]: new Manager.Events.Type.Placeholder().CreateStat
 }
}
