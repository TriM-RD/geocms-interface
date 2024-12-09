<template>
  <button type="button" class="list-group-item list-group-item-action" aria-current="true" @click.prevent='regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object)'>
    Hello World
    {{object.Stats[statTypeEnum.Value].Data}}
  </button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/mechanics/listRowMechanic'
import {
  ObjectTemplate,
  MechanicAbstract,
  ObjectType,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType,
  RegionEnum,
  SubObjectTypeEnum, ActionTypeEnum, StatType
} from '@cybertale/interface'
import { $t } from '@geocms/localization'
@Options({
  props: {
    object: ObjectTemplate,
    index: Number
  }
})
export default class ListRowComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.ListRowMechanic()
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  regionType = RegionType
  objectType = ObjectType
  object!: ObjectTemplate
  index!: number
  objectTemplates = this.mechanic.InitSet( // TODO most likely not used
    [
      new ObjectTemplate(RegionEnum.TableColumn, ObjectTypeEnum.Button, SubObjectTypeEnum.Middle, ActionTypeEnum.Click, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData($t.edit),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-info'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data)
      })
    ]
  )

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
