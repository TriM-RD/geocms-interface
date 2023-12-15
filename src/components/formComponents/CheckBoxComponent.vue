<template>
  <div :class="object?.Stats[statTypeEnum.Design].Data">
    <input class="form-check-input mt-0" type="checkbox"
           :checked="!!object?.Stats[statTypeEnum.Value].Data"
           :id="object?.Stats[statTypeEnum.Tag].Data"
           :required="attributeCheck(statTypeEnum.Required)"
           :disabled="attributeCheck(statTypeEnum.Disabled)"
           :class="validate()"
           @input="regionType.RegionTypes[object?.Region].ObjectTypes[object?.ObjectEnum].ChooseSubType(object as ObjectTemplate, $event.target.checked)">
    <label v-if="returnIfExists(statTypeEnum.Label) !== ''" class="form-check-label" for="flexCheckDefault">
      {{ object.Stats[statTypeEnum.Label].Data }}
    </label>
  </div>
  <div class="invalid-feedback">{{ returnIfExists(statTypeEnum.ErrorMessage) }}</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@cybertale/interface'
@Options({
  computed: {
    ObjectTemplate () {
      return ObjectTemplate
    }
  },
  props: {
    object: ObjectTemplate
  }
})
export default class CheckBoxComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  object!: ObjectTemplate

  returnIfExists (tag: number): string {
    if (this.object.Stats[tag]) {
      return this.object.Stats[tag].Data
    }
    return ''
  }

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
.form-check-input:checked {
  background-color: #606467;
  border-color: #606467;
}
</style>
