<template>
<nav v-if="renderComponent" class="navbar fixed-bottom navbar-light bg-light">
  <form class="container-fluid justify-content-around">
  <component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'> </component>
  </form>
  </nav>
    <router-view/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import {
  ObjectType,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType,
  RegionEnum,
  SubObjectTypeEnum, ActionTypeEnum, StatType
} from '@/interface/manager/events/types'
import { MechanicAbstract } from '@/interface/manager/mechanics/mechanicAbstract'
import { Manager } from '@/interface/manager/mechanics/footerMechanic'
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
  openTab!: string

  @Watch('$route')
  onDataChanged (value: any, oldValue: string) {
    this.renderComponent = false
    this.openTab = value.name
    this.choose()
  }

  mounted () {
    this.choose()
  }

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetVueComponent()
  }

  choose () {
    this.objectTemplates = []
    switch (this.openTab) {
      case 'Device':
        this.objectTemplates = this.mechanic.InitSet(
          [
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Scan'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill')
            }),
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Add'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
            })
          ]
        )
        break
      case 'Group':
        this.objectTemplates = this.mechanic.InitSet(
          [
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Middle, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Lorem Ipsum'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill')
            }),
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Add'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
            })
          ]
        )
        break
      case 'Map':
        this.objectTemplates = this.mechanic.InitSet(
          [
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Save'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill')
            }),
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Add'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
            })
          ]
        )
        break
      case 'Division':
        this.objectTemplates = this.mechanic.InitSet(
          [
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Middle, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Lorem Ipsum'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill')
            }),
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Add'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
            })
          ]
        )
        break
      case 'DeviceAdd':
        this.objectTemplates = this.mechanic.InitSet(
          [
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Save'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill')
            }),
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Cancel'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
            })
          ]
        )
        break
      case 'GroupAdd':
        this.objectTemplates = this.mechanic.InitSet(
          [
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Save'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill')
            }),
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Cancel'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
            })
          ]
        )
        break
      case 'AttributeAdd':
        this.objectTemplates = this.mechanic.InitSet(
          [
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Save'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill')
            }),
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Cancel'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
            })
          ]
        )
        break
      case 'DivisionAdd':
        this.objectTemplates = this.mechanic.InitSet(
          [
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Save'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill')
            }),
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Cancel'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
            })
          ]
        )
        break
      case 'DeviceCabinet':
        this.objectTemplates = this.mechanic.InitSet(
          [
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Save'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill')
            }),
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Cancel'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
            })
          ]
        )
        break
      case 'DeviceAppend':
        this.objectTemplates = this.mechanic.InitSet(
          [
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Save'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success me-2 flex-fill')
            }),
            new ObjectTemplate(RegionEnum.Footer, ObjectTypeEnum.Button, SubObjectTypeEnum.Right, ActionTypeEnum.Click, {
              [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Cancel'),
              [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-secondary flex-fill')
            })
          ]
        )
        break
    }
    this.renderComponent = true
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-fluid{
  padding-bottom: 0.5%;
}
</style>
