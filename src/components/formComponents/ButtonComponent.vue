<template v-if="renderComponent">
  <button data-bs-toggle="tooltip" data-bs-placement="top"
          :data-bs-title="tooltipCase()"
          :hidden="specialCase()"
          :disabled="attributeCheck(statTypeEnum.Disabled)"
          :class="getValue(statTypeEnum.Design)"
          @click.prevent='regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object)'>
    {{ getValue(statTypeEnum.Label) }}
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

  getValue (statEnum: number) : string {
    if (this.object) {
      if (this.object.Stats[this.statTypeEnum.Option] && this.isJSON(this.object.Stats[statEnum].Data)) {
        const data = JSON.parse(this.object.Stats[statEnum].Data)
        return data[Number(this.object.Stats[this.statTypeEnum.Option].Data)]
      } else {
        return this.object.Stats[statEnum].Data
      }
    }
    return ''
  }

  isJSON (str: string): boolean {
    let temp = null
    try {
      temp = JSON.parse(str)
    } catch (e) {
      return false
    }
    return Array.isArray(temp)
  }

  tooltipCase () {
    if (this.object) {
      if (this.object.Stats[this.statTypeEnum.Tooltip]) {
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
