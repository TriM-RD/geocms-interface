<template v-if="renderComponent">
  <button data-bs-toggle="tooltip" data-bs-placement="top"
          :data-bs-title="tooltipCase()"
          :hidden="specialCase()"
          :disabled="attributeCheck(statTypeEnum.Disabled)"
          :class="`${object.Stats[statTypeEnum.Design].Data}`"
          @click.prevent='regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object)'>
    {{object.Stats[statTypeEnum.Label].Data}}
  </button>
  <slot></slot>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@cybertale/interface'
@Options({
  props: {
    object: ObjectTemplate
  }
})
export default class ButtonComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  object!: ObjectTemplate
  renderComponent= false

  tooltipCase () {
    if (this.object !== undefined) {
      if (this.object.Stats[this.statTypeEnum.Tooltip] !== undefined) {
        return this.object.Stats[this.statTypeEnum.Tooltip].Data
      }
    }
  }

  specialCase () : boolean {
    if (this.object.Stats[this.statTypeEnum.ElementType] === undefined) { return false }
    return this.object.Stats[this.statTypeEnum.ElementType].Data === 'hidden'
  }

  attributeCheck (statType : number) : boolean | string {
    if (this.object.Stats[statType] === undefined) { return false }
    if (this.object.Stats[statType].Data === '') { return false }
    return this.object.Stats[statType].Data
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
