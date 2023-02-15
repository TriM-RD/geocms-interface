<template>
  <button type="button" class="list-group-item list-group-item-action" aria-current="true" @click.prevent='regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object)'>
    {{object.Stats[statTypeEnum.Value].Data}}
  </button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { Manager } from '@/interface/manager/mechanics/listRowMechanic'
import { MechanicAbstract } from '@/interface/manager/mechanics/mechanicAbstract'
import { RegionEnum, ObjectTypeEnum, SubObjectTypeEnum, ActionTypeEnum, StatTypeEnum, StatType, ObjectType, RegionType } from '@/interface/manager/events/types/index'
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
  objectTemplates = this.mechanic.InitSet(
    [
      new ObjectTemplate(RegionEnum.TableColumn, ObjectTypeEnum.Button, SubObjectTypeEnum.Middle, ActionTypeEnum.Click, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Edit'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-info'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data)
      })
    ]
  )

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetVueComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
