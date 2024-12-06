<template>
  <select class="form-select" aria-label="Default select example" :class="validate()" :required="attributeCheck(statTypeEnum.Required)" :disabled="attributeCheck(statTypeEnum.Disabled)" :autocomplete="returnIfExists(statTypeEnum.AutoComplete)" @input="handleInput">
    <option value="" :selected="object.Stats[statTypeEnum.Value] === undefined" hidden>{{object.Stats[statTypeEnum.Placeholder].Data}}</option>
    <option v-for="(item, key, index) in JSON.parse(object.Stats[statTypeEnum.ItemList].Data)" :selected="check(item.id)" :key="`${key}-${index}`" :value="item.id">
      {{ item.name }}
    </option>
  </select>
  <div class="invalid-feedback order-1">
    {{ returnIfExists(statTypeEnum.ErrorMessage) }}
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-facing-decorator'
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@cybertale/interface'

@Component
export default class SelectListComponent extends Vue {
  @Prop() object!: ObjectTemplate

  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  renderComponent = true

  validate(): string {
    if (this.object.Stats[this.statTypeEnum.IsValid] === undefined) return ''
    if (this.object.Stats[this.statTypeEnum.IsValid].Data === '') return ''
    if (this.object.Stats[this.statTypeEnum.IsValid].Data) return 'is-valid'
    /*console.log(this.object.Stats[this.statTypeEnum.IsValid].Data)
    console.log(this.object.Stats)*/
    if (this.object.Stats[this.statTypeEnum.ErrorMessage].Data === null) return ''
    if (this.object.Stats[this.statTypeEnum.ErrorMessage].Data !== '') return 'is-invalid'
    return ''
  }

  returnIfExists(tag: number): string {
    if (this.object.Stats[tag]) {
      return this.object.Stats[tag].Data
    }
    return ''
  }

  attributeCheck(statType: number): boolean | string {
    if (this.object.Stats[statType] === undefined) return false
    if (this.object.Stats[statType].Data === '') return false
    return this.object.Stats[statType].Data
  }

  check(id: string): boolean {
    if (this.object.Stats[this.statTypeEnum.Value] === undefined || id === undefined) return false
    return this.object.Stats[this.statTypeEnum.Value].Data === id.toString()
  }

  specialCase(): string | undefined {
    if (this.object !== undefined) {
      if (this.object.Stats[this.statTypeEnum.Tooltip] !== undefined) {
        return this.object.Stats[this.statTypeEnum.Tooltip].Data
      }
    }
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLSelectElement
    this.regionType.RegionTypes[this.object.Region].ObjectTypes[this.object.ObjectEnum].ChooseSubType(this.object as ObjectTemplate, target.value)
  }
}
</script>

<style scoped></style>
