<template>
  <select class="form-select" aria-label="Default select example"
          :hidden="(getValue(statTypeEnum.ElementType) === 'hidden')"
          :class="validate()"
          :required="attributeCheck(statTypeEnum.Required)"
          :disabled="attributeCheck(statTypeEnum.Disabled)"
          :autocomplete="returnIfExists(statTypeEnum.AutoComplete)"
          @input="regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object as ObjectTemplate, $event.target.value)">
    <option value="" :selected="computedValue" hidden>Select a type.</option>
    <option v-for="(item, key, index) in JSON.parse(object.Stats[statTypeEnum.ItemList].Data)" :selected="check(item.id)" :key="`${ key }-${ index }`" :value="item.id">{{item.name}}</option>
  </select>
  <div class="invalid-feedback order-1">{{ returnIfExists(statTypeEnum.ErrorMessage) }}</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator'
import {ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum} from '@cybertale/interface'

@Component({
  computed: {
    ObjectTemplate() {
      return ObjectTemplate
    }
  }
})
export default class SelectListComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  @Prop() object!: ObjectTemplate
  renderComponent= true

  get computedValue(): boolean {
    return this.getStatData(StatTypeEnum.Value, 'boolean') as boolean
  }

  validate () : string {
    if (this.object.Stats[this.statTypeEnum.IsValid] === undefined) { return '' }
    if (this.object.Stats[this.statTypeEnum.IsValid].Data === '') { return '' }
    if (this.object.Stats[this.statTypeEnum.IsValid].Data) { return 'is-valid' }
    console.log(this.object.Stats[this.statTypeEnum.IsValid].Data)
    console.log(this.object.Stats)
    if (this.object.Stats[this.statTypeEnum.ErrorMessage].Data === null) { return '' }
    if (this.object.Stats[this.statTypeEnum.ErrorMessage].Data !== '') { return 'is-invalid' }
    return ''
  }

  returnIfExists (tag: number): string {
    if (this.object.Stats[tag]) {
      return this.object.Stats[tag].Data
    }
    return ''
  }

  getStatData(statType: StatTypeEnum, returnType: 'boolean' | 'string' = 'string'): boolean | string {
    try {
      const data = this.object.Stats[statType]?.Data ?? ''
      return returnType === 'boolean' ? !!data : data
    } catch (error) {
      return returnType === 'boolean' ? false : ''
    }
  }

  statIsDefined (statType: StatTypeEnum): boolean {
    return !!this.object.Stats[statType]
  }

  isJSON(str: string): boolean {
    try {
      return Array.isArray(JSON.parse(str))
    } catch {
      return false
    }
  }

  getValue( statEnum: StatTypeEnum, indexStatTypeEnum = StatTypeEnum.Option): string {
    const tempData:string = this.getStatData(statEnum) as string
    if (!tempData) return '';
    if (this.statIsDefined(indexStatTypeEnum) && this.isJSON(tempData)) {
      const data = JSON.parse(tempData);
      const optionData = this.getStatData(indexStatTypeEnum) as string
      if(this.isJSON(optionData)){
        const parsedOptionData = JSON.parse(optionData)[Number(this.object.Stats[StatTypeEnum.OptionIndices].Data)]
        return data[Number(parsedOptionData)] || '';
      }
      return data[Number(this.getStatData(indexStatTypeEnum))] || '';
    }

    return tempData;
  }

  attributeCheck (statType : number) : boolean | string {
    if (this.object.Stats[statType] === undefined) { return false }
    if (this.object.Stats[statType].Data === '') { return false }
    return this.object.Stats[statType].Data
  }

  check (id : string) {
    return this.getValue(StatTypeEnum.Value, StatTypeEnum.ValueIndices) === id.toString()
  }

  specialCase () {
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
