<template>
  <!--component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ _objectTemplate.Stats[statTypeEnum.Tag].Data }`"  :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'></component-->
  <component :key="`${ 0 }-${ objectTemplates[0].Stats[statTypeEnum.Tag].Data }`"  :is="getComponent(objectTemplates[0].Region, objectTemplates[0].ObjectEnum)" :object='objectTemplates[0]'>
    <component :key="`${ 0 }-${ objectTemplates[1].Stats[statTypeEnum.Tag].Data }`"  :is="getComponent(objectTemplates[0].Region, objectTemplates[1].ObjectEnum)" :object='objectTemplates[1]'>
    </component>
  </component>
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
export default class SelectButtonComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.ColumnMechanic()
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  object!: ObjectTemplate
  index!: number
  objectTemplates: ObjectTemplate[] = this.mechanic.InitSet([
    new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.SelectList, SubObjectTypeEnum.ParentObject, ActionTypeEnum.InsertClick, {
      [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(this.object.Stats[StatTypeEnum.ItemList].Data),
      [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Label].Data),
      [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Tag].Data),
      [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Value].Data),
      [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
      [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('someValue'),
      [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data),
      [StatTypeEnum.Disabled]: StatType.StatTypes[StatTypeEnum.Disabled]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Disabled] !== undefined ? this.object.Stats[StatTypeEnum.Disabled].Data : '')
    }),
    new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Down, ActionTypeEnum.Click, {
      [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Delete'),
      [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Tag].Data),
      [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-danger me-2'),
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
