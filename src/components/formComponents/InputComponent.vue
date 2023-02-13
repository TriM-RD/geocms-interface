<template>
  <div class="mb-3 row justify-content-md-center">
    <div class="col-lg"></div>
    <div class="col input-group">
      <label :title="tooltipCase()" class="input-group-text" :hidden="specialCase()">{{object.Stats[statTypeEnum.Label].Data }}</label>
      <input class="form-control"
             :id="object.Stats[statTypeEnum.Tag].Data"
             :required="attributeCheck(statTypeEnum.Required)"
             :disabled="attributeCheck(statTypeEnum.Disabled)"
             :autocomplete="`${object.Stats[statTypeEnum.AutoComplete] !== undefined?object.Stats[statTypeEnum.AutoComplete].Data:''}`"
             :class="object.Stats[statTypeEnum.Design].Data+' '+validate()"
             :type="`${object.Stats[statTypeEnum.ElementType] !== undefined?object.Stats[statTypeEnum.ElementType].Data:''}`"
             :value="object.Stats[statTypeEnum.Value].Data"
             :placeholder="`${object.Stats[statTypeEnum.Placeholder].Data}`"
             @input="regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, $event.target.value)">
      <slot></slot>
      <div class="invalid-feedback">{{ `${object.Stats[statTypeEnum.ErrorMessage] !== undefined?object.Stats[statTypeEnum.ErrorMessage].Data:''}` }}</div>
    </div>
    <div class="col-lg"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@/interface/manager/events/types'
@Options({
  props: {
    object: ObjectTemplate
  }
})
export default class InputComponent extends Vue {
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

  specialCase () : boolean {
    if (this.object.Stats[this.statTypeEnum.ElementType] === undefined) { return false }
    return this.object.Stats[this.statTypeEnum.ElementType].Data === 'hidden'
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
