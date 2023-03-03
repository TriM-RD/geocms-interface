<template>
  <td>
    <div class="btn-group d-none d-md-flex justify-content-center">
      <component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`"  :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'></component>
    </div>
    <div class="dropdown d-md-none">
      <button type="button" class="btn btn-outline-secondary" data-bs-toggle="dropdown" aria-expanded="false">
        <span class="bi-chevron-down"></span>
      </button>
      <ul class="dropdown-menu">
        <li v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }-'li'`"
            class="dropdown-item btn-group justify-content-center">
          <component :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`"  :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'></component>
        </li>
      </ul>
    </div>
  </td>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/interface/manager/mechanics/columnMechanic'
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
