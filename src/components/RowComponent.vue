<template>
    <!--th scope="row"><img alt="arrow" width="27" src="../assets/arrow.png"></th>
    <td>{{object.Stats[statTypeEnum.Value].Data}}</td-->
  <tr v-if="renderComponent">
    <component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`"  :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'></component>
  </tr>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { Manager } from '@/interface/manager/mechanics/rowMechanic'
import { MechanicAbstract } from '@/interface/manager/mechanics/mechanicAbstract'
import { RegionEnum, ObjectTypeEnum, SubObjectTypeEnum, ActionTypeEnum, StatTypeEnum, StatType, ObjectType, RegionType } from '@/interface/manager/events/types/index'
@Options({
  props: {
    entity: Array,
    index: Number
  }
})
export default class RowComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.RowMechanic()
  regionEnum = RegionEnum
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  renderComponent= false
  entity!: ObjectTemplate[]
  objectTemplates!: ObjectTemplate[]
  index!: number

  mounted () {
    this.objectTemplates = this.mechanic.InitSet(this.entity)
    if (this.objectTemplates !== undefined) {
      console.log(this.objectTemplates)
    }
    this.objectTemplates = this.mechanic.Append(
      [
        new ObjectTemplate(RegionEnum.TableColumn, ObjectTypeEnum.ColumnButton, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
          [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Delete'),
          [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-danger'),
          [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.objectTemplates[0].Stats[StatTypeEnum.Id].Data)
        })
      ]
    )
    console.log(this.objectTemplates)
    this.renderComponent = true
  }

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
