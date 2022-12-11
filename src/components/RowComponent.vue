<template>
    <!--th scope="row"><img alt="arrow" width="27" src="../assets/arrow.png"></th>
    <td>{{object.Stats[statTypeEnum.Value].Data}}</td-->
  <tr v-if="renderComponent">
    <th scope="row"><img alt="arrow" width="27" src="../assets/arrow.png"></th>
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
  mechanic: MechanicAbstract = Manager.Mechanic.RowMechanic.getInstance()
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
      this.objectTemplates = this.mechanic.Append(
        [
          new ObjectTemplate(RegionEnum.TableColumn, ObjectTypeEnum.ColumnButton, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.objectTemplates[0].Stats[StatTypeEnum.Id].Data)
          })
        ]
      )
    }
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
