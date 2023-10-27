<template>
<nav v-if="renderComponent" class="navbar fixed-bottom navbar-light bg-light">
  <form class="container-fluid justify-content-around">
  <component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'> </component>
  </form>
  </nav>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
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
import { Manager } from '@/mechanics/footerMechanic'
import { Definitions } from '@/definitions/appDefinitions'
import { $t } from '@/locales'
@Options({
  props: {
    object: ObjectTemplate
  }
})
export default class FooterComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.FooterMechanic()
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  object!: ObjectTemplate
  index!: number
  renderComponent= false
  objectTemplates!: ObjectTemplate[]
  openTab!: string | symbol

  @Watch('$route')
  onDataChanged (value: any, oldValue: string) {
    this.mechanic.UnsubscribeConditions()
    this.mechanic = new Manager.Mechanic.FooterMechanic()
    this.renderComponent = false
    this.openTab = value.name
    this.choose()
  }

  mounted () {
    if (this.$route.name !== undefined && this.$route.name !== null) { this.openTab = this.$route.name }
    this.choose()
  }

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }

  choose () {
    this.objectTemplates = []
    switch (this.openTab) {
      case Definitions.Entity.Def:
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons(RegionEnum.Footer, RegionEnum.Footer, $t.scan, $t.add)
        )
        break
      case Definitions.Group.Def:
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons(RegionEnum.Table, RegionEnum.Footer, $t.reSort, $t.add)
        )
        break
      case Definitions.Division.Def:
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons(RegionEnum.Table, RegionEnum.Footer, $t.reSort, $t.add)
        )
        break
      case Definitions.Permission.Def:
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
      case Definitions.Administration.Def:
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons(RegionEnum.Footer, RegionEnum.Footer, $t.reSort, $t.add)
        )
        break
      case Definitions.Entity.Add:
      case Definitions.Entity.Replace:
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
      case Definitions.Entity.Edit:
        this.objectTemplates = this.mechanic.InitSet([
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData($t.save),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill'),
            [StatTypeEnum.Disabled]: StatType.StatTypes[StatTypeEnum.Disabled]().CreateStat().InitData('')
          }),
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Down, ActionTypeEnum.Click, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData($t.delete),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-danger flex-fill'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('destroy')
          }),
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData($t.cancel),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
          })
        ]
        )
        break
      case Definitions.Group.Edit:
      case Definitions.Group.Add:
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
      case Definitions.Division.Edit:
      case Definitions.Division.Add:
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
      case Definitions.Attribute.Edit:
      case Definitions.Attribute.Add:
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
      case Definitions.Administration.Add:
      case Definitions.Administration.Edit:
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
    }
    if (this.objectTemplates.length > 0) {
      this.renderComponent = true
    }
  }

  scaffoldButtons (leftRegion = RegionEnum.Form, rightRegion = RegionEnum.Form, leftButtonName = $t.save, rightButtonName = $t.cancel): Array<any> {
    return [
      new ObjectTemplate(leftRegion, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(leftButtonName),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill'),
        [StatTypeEnum.Disabled]: StatType.StatTypes[StatTypeEnum.Disabled]().CreateStat().InitData('')
      }),
      new ObjectTemplate(rightRegion, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(rightButtonName),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
      })
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-fluid{
  padding-bottom: 0.5%;
}
</style>
