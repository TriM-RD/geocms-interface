<template>
  <div v-if="!reRender && renderComponent">
  <!--component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ _objectTemplate.Stats[statTypeEnum.Tag].Data }`"  :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'></component-->
  <component :key="`${ 0 }-${ objectTemplates[0].Stats[statTypeEnum.Tag].Data }`"  :is="getComponent(objectTemplates[0].Region, objectTemplates[0].ObjectEnum)" :object='objectTemplates[0]'>
    <component :key="`${ 0 }-${ objectTemplates[1].Stats[statTypeEnum.Tag].Data }`"  :is="getComponent(objectTemplates[0].Region, objectTemplates[1].ObjectEnum)" :object='objectTemplates[1]'>
    </component>
  </component>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/mechanics/helperFormMechanic'
import { $t } from '@/locales'
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
export default class FieldButtonComponent extends Vue {
  pageRefresh!: boolean
  renderComponent = true
  mechanic: MechanicAbstract = new Manager.Mechanic.HelperFormMechanic(this.reRenderInternal.bind(this))
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  object!: ObjectTemplate
  index!: number
  objectTemplates: ObjectTemplate[] = this.mechanic.InitSet([
    new ObjectTemplate(this.object.Region, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.InsertClick, {
      [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Label].Data),
      [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Tag].Data),
      [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Value].Data),
      [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
      [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('someValue'),
      [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data),
      [StatTypeEnum.Disabled]: StatType.StatTypes[StatTypeEnum.Disabled]().CreateStat().InitData(this.attributeCheck(this.statTypeEnum.Disabled)),
      [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(this.object.Stats[StatTypeEnum.ErrorMessage] !== undefined ? this.object.Stats[StatTypeEnum.ErrorMessage].Data : ''),
      [StatTypeEnum.IsValid]: StatType.StatTypes[StatTypeEnum.IsValid]().CreateStat().InitData(this.object.Stats[StatTypeEnum.IsValid] !== undefined ? this.object.Stats[StatTypeEnum.IsValid].Data : '')
    }),
    new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Down, ActionTypeEnum.Click, {
      [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData($t.delete),
      [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('delete-' + this.object.Stats[StatTypeEnum.Tag].Data),
      [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-danger me-2'),
      [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data),
      [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData(this.object.Stats[this.statTypeEnum.ElementType] !== undefined ? this.object.Stats[this.statTypeEnum.ElementType].Data : ''),
      [StatTypeEnum.Disabled]: StatType.StatTypes[StatTypeEnum.Disabled]().CreateStat().InitData(this.attributeCheck(this.statTypeEnum.Disabled))
    })
  ]
  )

  get reRender () {
    this.chooseTagType()
    return this.pageRefresh
  }

  chooseTagType () : void {
    switch (this.object.Stats[StatTypeEnum.Tag].Data) {
      case 'code':
        this.objectTemplates = this.mechanic.InitSet([
          new ObjectTemplate(this.object.Region, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.InsertClick, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Label].Data),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Tag].Data),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Value].Data),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
            [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Placeholder].Data),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data),
            [StatTypeEnum.Disabled]: StatType.StatTypes[StatTypeEnum.Disabled]().CreateStat().InitData(this.attributeCheck(this.statTypeEnum.Disabled)),
            [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(this.object.Stats[StatTypeEnum.ErrorMessage] !== undefined ? this.object.Stats[StatTypeEnum.ErrorMessage].Data : ''),
            [StatTypeEnum.IsValid]: StatType.StatTypes[StatTypeEnum.IsValid]().CreateStat().InitData(this.object.Stats[StatTypeEnum.IsValid] !== undefined ? this.object.Stats[StatTypeEnum.IsValid].Data : '')
          }),
          new ObjectTemplate(RegionEnum.MapPicker, ObjectTypeEnum.Button, SubObjectTypeEnum.Middle, ActionTypeEnum.Click, { // TODO need to add placeholder region
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData($t.autoGenerate),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('codeButton'),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-info me-2'),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data),
            // [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData(this.object.Stats[StatTypeEnum.ElementType].Data),
            [StatTypeEnum.Disabled]: StatType.StatTypes[StatTypeEnum.Disabled]().CreateStat().InitData(this.attributeCheck(this.statTypeEnum.Disabled))
          })
        ]
        )
        break
      default:
        this.objectTemplates = this.mechanic.InitSet([
          new ObjectTemplate(this.object.Region, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.InsertClick, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Label].Data),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Tag].Data),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Value].Data),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
            [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('someValue'),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data),
            [StatTypeEnum.Disabled]: StatType.StatTypes[StatTypeEnum.Disabled]().CreateStat().InitData(this.attributeCheck(this.statTypeEnum.Disabled)),
            [StatTypeEnum.ErrorMessage]: StatType.StatTypes[StatTypeEnum.ErrorMessage]().CreateStat().InitData(this.object.Stats[StatTypeEnum.ErrorMessage] !== undefined ? this.object.Stats[StatTypeEnum.ErrorMessage].Data : ''),
            [StatTypeEnum.IsValid]: StatType.StatTypes[StatTypeEnum.IsValid]().CreateStat().InitData(this.object.Stats[StatTypeEnum.IsValid] !== undefined ? this.object.Stats[StatTypeEnum.IsValid].Data : '')
          }),
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Down, ActionTypeEnum.Click, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData($t.delete),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('delete-' + this.object.Stats[StatTypeEnum.Tag].Data),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-danger me-2'),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data),
            [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData(this.object.Stats[this.statTypeEnum.ElementType] !== undefined ? this.object.Stats[this.statTypeEnum.ElementType].Data : ''),
            [StatTypeEnum.Disabled]: StatType.StatTypes[StatTypeEnum.Disabled]().CreateStat().InitData(this.attributeCheck(this.statTypeEnum.Disabled))
          })
        ]
        )
        break
    }
  }

  attributeCheck (statType : number) : string {
    if (this.object.Stats[statType] === undefined) { return '' }
    if (this.object.Stats[statType].Data === '') { return '' }
    return this.object.Stats[statType].Data
  }

  reRenderInternal (): void {
    if (!this.renderComponent) {
      this.objectTemplates = []
    } else {
      this.chooseTagType()
    }
    this.renderComponent = !this.renderComponent
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
