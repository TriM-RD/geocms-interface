<template >
  <div v-if="!reRender">
    <!--component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ _objectTemplate.Stats[statTypeEnum.Tag].Data }`"  :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'></component-->
    <component :key="`${ 0 }-${ objectTemplates[0].Stats[statTypeEnum.Tag].Data }`"  :is="getComponent(objectTemplates[0].Region, objectTemplates[0].ObjectEnum)" :object='objectTemplates[0]'>
      <component :key="`${ 0 }-${ objectTemplates[1].Stats[statTypeEnum.Tag].Data }`"  :is="getComponent(objectTemplates[0].Region, objectTemplates[1].ObjectEnum)" :object='objectTemplates[1]'>
      </component>
    </component>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/mechanics/columnMechanic'
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
@Options({
  props: {
    object: ObjectTemplate,
    index: Number,
    pageRefresh: {
      type: Boolean,
      default: true
    }
  }
})
export default class DataSelectComponent extends Vue {
  pageRefresh!: boolean
  mechanic: MechanicAbstract = new Manager.Mechanic.ColumnMechanic()
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  object!: ObjectTemplate
  index!: number
  objectTemplates: ObjectTemplate[] = this.mechanic.InitSet([
    new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.DataList, SubObjectTypeEnum.ParentObject, ActionTypeEnum.SelectIdFromName, {
      [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Label].Data),
      [StatTypeEnum.Tooltip]: StatType.StatTypes[StatTypeEnum.Tooltip]().CreateStat().InitData(''),
      [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Tag].Data),
      [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Value].Data),
      [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
      [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Placeholder].Data),
      [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(this.object.Stats[StatTypeEnum.ItemList].Data),
      [StatTypeEnum.Required]: StatType.StatTypes[StatTypeEnum.Required]().CreateStat().InitData(this.resolveDisabledRequired()),
      [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(this.object.Stats[StatTypeEnum.ErrorMessage] !== undefined ? this.object.Stats[StatTypeEnum.ErrorMessage].Data : ''),
      [StatTypeEnum.IsValid]: StatType.StatTypes[StatTypeEnum.IsValid]().CreateStat().InitData(this.object.Stats[StatTypeEnum.IsValid] !== undefined ? this.object.Stats[StatTypeEnum.IsValid].Data : '')
    }),
    new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Down, ActionTypeEnum.Click, {
      [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(this.resolveDisabledButtonLabel()),
      [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('link-' + this.object.Stats[StatTypeEnum.Tag].Data),
      [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData(this.resolveDisabledButtonDesign()),
      [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data)
    })
  ]
  )

  get reRender () {
    this.objectTemplates = this.mechanic.InitSet([
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.DataList, SubObjectTypeEnum.ParentObject, ActionTypeEnum.SelectIdFromName, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Label].Data),
        [StatTypeEnum.Tooltip]: StatType.StatTypes[StatTypeEnum.Tooltip]().CreateStat().InitData(''),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Tag].Data),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Value].Data),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Placeholder].Data),
        [StatTypeEnum.ItemList]: StatType.StatTypes[StatTypeEnum.ItemList]().CreateStat().InitData(this.object.Stats[StatTypeEnum.ItemList].Data),
        [StatTypeEnum.Required]: StatType.StatTypes[StatTypeEnum.Required]().CreateStat().InitData(this.resolveDisabledRequired()),
        [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(this.object.Stats[StatTypeEnum.ErrorMessage] !== undefined ? this.object.Stats[StatTypeEnum.ErrorMessage].Data : ''),
        [StatTypeEnum.IsValid]: StatType.StatTypes[StatTypeEnum.IsValid]().CreateStat().InitData(this.object.Stats[StatTypeEnum.IsValid] !== undefined ? this.object.Stats[StatTypeEnum.IsValid].Data : '')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Down, ActionTypeEnum.Click, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(this.resolveDisabledButtonLabel()),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('link-' + this.object.Stats[StatTypeEnum.Tag].Data),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData(this.resolveDisabledButtonDesign()),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data)
      })
    ]
    )
    return this.pageRefresh
  }

  resolveDisabledRequired () { // TODO try to find a solution to enable required by choice
    if (this.object.Stats[StatTypeEnum.Disabled] === undefined) { return 'true' }
    if (this.object.Stats[StatTypeEnum.Disabled].Data === null) { return 'true' }
    if (this.object.Stats[StatTypeEnum.Disabled].Data === '') { return 'true' }
    return ''
  }

  resolveDisabledButtonLabel () {
    if (this.object.Stats[StatTypeEnum.Disabled] === undefined) { return 'Un-Link' }
    if (this.object.Stats[StatTypeEnum.Disabled].Data === null) { return 'Un-Link' }
    if (this.object.Stats[StatTypeEnum.Disabled].Data === '') { return 'Un-Link' }
    return 'Link'
  }

  resolveDisabledButtonDesign () {
    if (this.object.Stats[StatTypeEnum.Disabled] === undefined) { return 'btn btn-outline-danger me-2' }
    if (this.object.Stats[StatTypeEnum.Disabled].Data === null) { return 'btn btn-outline-danger me-2' }
    if (this.object.Stats[StatTypeEnum.Disabled].Data === '') { return 'btn btn-outline-danger me-2' }
    return 'btn btn-outline-info me-2'
  }

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
