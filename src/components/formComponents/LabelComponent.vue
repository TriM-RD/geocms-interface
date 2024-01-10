<template>
  <label :title="tooltipCase()" :class="object.Stats[statTypeEnum.Design].Data" :hidden="specialCase()">{{object.Stats[statTypeEnum.Label].Data }}</label>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@cybertale/interface'
@Options({
  props: {
    object: ObjectTemplate
  }
})
export default class LabelComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  object!: ObjectTemplate

  validate () : string {
    if (this.object.Stats[this.statTypeEnum.IsValid] === undefined) { return '' }
    if (this.object.Stats[this.statTypeEnum.IsValid].Data === '') { return '' }
    if (this.object.Stats[this.statTypeEnum.IsValid].Data) { return 'is-valid' }
    if (this.object.Stats[this.statTypeEnum.ErrorMessage].Data === null) { return '' }
    if (this.object.Stats[this.statTypeEnum.ErrorMessage].Data !== '') { return 'is-invalid' }
    return ''
  }

  getValue (statEnum: number) : string {
    if (this.object.Stats[statEnum]) {
      if (this.object.Stats[this.statTypeEnum.Option] && this.object.Stats[statEnum] && this.isJSON(this.object.Stats[statEnum].Data)) {
        const data = JSON.parse(this.object.Stats[statEnum].Data)
        return data[Number(this.object.Stats[this.statTypeEnum.Option].Data)]
      } else {
        return this.object.Stats[statEnum].Data
      }
    }
    return ''
  }

  specialCase () : boolean {
    return this.getValue(this.statTypeEnum.ElementType) === 'hidden'
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

  attributeCheck (statType : number) : boolean | string {
    if (this.object.Stats[statType] === undefined) { return false }
    if (this.object.Stats[statType].Data === '') { return false }
    return this.object.Stats[statType].Data
  }

  tooltipCase () : string | undefined {
    if (this.object !== undefined) {
      if (this.object.Stats[this.statTypeEnum.Tooltip] !== undefined) {
        return this.object.Stats[this.statTypeEnum.Tooltip].Data
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
