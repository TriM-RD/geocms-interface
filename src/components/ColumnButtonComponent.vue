<template>
    <!--th scope="row"><img alt="arrow" width="27" src="../assets/arrow.png"></th-->
  <td>
  <component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`"  :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'></component>
  </td>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { Manager } from '@/interface/manager/mechanics/columnMechanic'
import { MechanicAbstract } from '@/interface/manager/mechanics/mechanicAbstract'
import { RegionEnum, ObjectTypeEnum, SubObjectTypeEnum, ActionTypeEnum, StatTypeEnum, StatType, ObjectType, RegionType } from '@/interface/manager/events/types/index'
@Options({
  props: {
    object: ObjectTemplate,
    index: Number
  }
})
export default class ColumnButtonComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.ColumnMechanic()
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  object!: ObjectTemplate
  index!: number
  objectTemplates: ObjectTemplate[] = this.mechanic.InitSet([
    new ObjectTemplate(RegionEnum.TableColumn, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
      [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Delete'),
      [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-danger me-2'),
      [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data)
    }),
    new ObjectTemplate(RegionEnum.TableColumn, ObjectTypeEnum.Button, SubObjectTypeEnum.Middle, ActionTypeEnum.Click, {
      [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Edit'),
      [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-info me-2'),
      [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data)
    })
  ])

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
