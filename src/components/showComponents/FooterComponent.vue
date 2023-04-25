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
    console.log(this.openTab)
    switch (this.openTab) {
      case 'Device':
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons(RegionEnum.Footer, RegionEnum.Footer, 'Scan', 'Add')
        )
        break
      case 'Group':
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons(RegionEnum.Table, RegionEnum.Footer, 'ReSort', 'Add')
        )
        break
      case 'Division':
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons(RegionEnum.Table, RegionEnum.Footer, 'ReSort', 'Add')
        )
        break
      case 'Permission':
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
      case 'DeviceEdit':
      case 'DeviceAdd':
      case 'DeviceReplace':
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
      case 'GroupEdit':
      case 'GroupAdd':
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
      case 'DivisionEdit':
      case 'DivisionAdd':
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
      case 'AttributeEdit':
      case 'AttributeAdd':
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
      case 'AdministrationEdit':
        this.objectTemplates = this.mechanic.InitSet(
          this.scaffoldButtons()
        )
        break
    }
    this.renderComponent = true
  }

  scaffoldButtons (leftRegion = RegionEnum.Form, rightRegion = RegionEnum.Form, leftButtonName = 'Save', rightButtonName = 'Cancel'): Array<any> {
    return [
      new ObjectTemplate(leftRegion, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(leftButtonName),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill')
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
