<template>
  <tr v-if="renderComponent">
    <th scope="row"><img alt="arrow" width="27" src="../assets/arrow.png"></th>
    <component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`"  :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :entity='resolveEntities(_objectTemplate)' :object='_objectTemplate'></component>
  </tr>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/mechanics/rowMechanic'
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
    entity: Array,
    index: Number,
    rerender: Function
  }
})
export default class RowComponent extends Vue {
  rerender!: () => void
  mechanic: MechanicAbstract = Manager.Mechanic.RowMechanic.getInstance(this.rerender.bind(this))
  regionEnum = RegionEnum
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  renderComponent= false
  entity!: ObjectTemplate[]
  objectTemplates!: ObjectTemplate[]
  index!: number
  belongsTo!: { [key: string]: ObjectTemplate[] }

  mounted () {
    this.belongsTo = {}
    const itemsToDelete = []
    for (const item of this.entity) {
      if (item.Stats[StatTypeEnum.BelongsTo] !== undefined) {
        const data = item.Stats[StatTypeEnum.BelongsTo].Data
        this.belongsTo[data] = this.belongsTo[data] || []
        this.belongsTo[data].push(item)
        itemsToDelete.push(this.entity.indexOf(item))
      }
    }
    const tempEntity = JSON.parse(JSON.stringify(this.entity)) // TODO find a better fix (One way would be to add stats to getComponent and to not show if belongs
    for (let i = itemsToDelete.length - 1; i >= 0; i--) {
      tempEntity.splice(itemsToDelete[i], 1)
    }
    this.objectTemplates = this.mechanic.InitSet(tempEntity)
    console.log(this.objectTemplates)
    this.renderComponent = true
  }

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  resolveEntities (_object: ObjectTemplate) {
    for (const tag of Object.keys(this.belongsTo)) {
      if (_object.Stats[StatTypeEnum.Tag].Data === tag) {
        return this.belongsTo[tag]
      }
    }
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
