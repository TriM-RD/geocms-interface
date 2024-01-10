<template>
  <input class="form-control" :list="object.Stats[statTypeEnum.BelongsTo].Data"
         :class="returnIfExists(statTypeEnum.Design) + ' ' + validate()"
         :required="attributeCheck(statTypeEnum.Required)"
         :disabled="attributeCheck(statTypeEnum.Disabled)"
         :type="returnIfExists(statTypeEnum.ElementType)"
         :value="`${object?.Stats[statTypeEnum.Value].Data !== null?object.Stats[statTypeEnum.Value].Data.name === undefined?valueName:object.Stats[statTypeEnum.Value].Data.name:''}`"
         :placeholder="returnIfExists(statTypeEnum.Placeholder)"
         @input="inputEvent(object as ObjectTemplate, $event.target.value)">
  <datalist :id="object.Stats[statTypeEnum.BelongsTo].Data" v-if="dspStyle">
    <option v-for="(item, key, index) in JSON.parse(object.Stats[statTypeEnum.ItemList].Data)" :selected="check(item.name)" :key="`${ key }-${ index }`" :value="item.name">{{item.name}}</option>
  </datalist>
  <div class="invalid-feedback order-1">{{ returnIfExists(statTypeEnum.ErrorMessage) }}</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum } from '@cybertale/interface'

interface Option {
  id: number;
  name: string;
}

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
export default class DataListComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  object!: ObjectTemplate
  dspStyle = false
  options: Option[] = JSON.parse(this.object.Stats[this.statTypeEnum.ItemList].Data)

  returnIfExists (tag: number): string {
    if (this.object.Stats[tag]) {
      return this.object.Stats[tag].Data
    }
    return ''
  }

  getValue (statEnum: number, indexStatTypeEnum = StatTypeEnum.Option) : string {
    if (this.object.Stats[statEnum]) {
      if (this.object.Stats[indexStatTypeEnum] && this.object.Stats[statEnum] && this.isJSON(this.object.Stats[statEnum].Data)) {
        const data = JSON.parse(this.object.Stats[statEnum].Data)
        return data[Number(this.object.Stats[indexStatTypeEnum].Data)]
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

  get valueName (): string {
    const temp = this.options.find((option: any) => option.id === this.getValue(StatTypeEnum.Value, StatTypeEnum.ValueIndices))
    if (!temp) { return this.getValue(StatTypeEnum.Value, StatTypeEnum.ValueIndices) }
    return temp?.name
  }

  attributeCheck (statType : number) : boolean | string {
    if (this.object.Stats[statType] === undefined) { return false }
    if (this.object.Stats[statType].Data === '') { return false }
    return this.object.Stats[statType].Data
  }

  validate () : string {
    if (this.object.Stats[this.statTypeEnum.IsValid] === undefined) { return '' }
    if (this.object.Stats[this.statTypeEnum.IsValid].Data === '') { return '' }
    if (this.object.Stats[this.statTypeEnum.IsValid].Data) { return 'is-valid' }
    if (this.object.Stats[this.statTypeEnum.ErrorMessage].Data === null) { return '' }
    if (this.object.Stats[this.statTypeEnum.ErrorMessage].Data !== '') { return 'is-invalid' }
    return ''
  }

  inputEvent (object: ObjectTemplate, value: string) : void {
    this.dspStyle = value.length >= 3
    this.regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, value)
  }

  check (id : string) : boolean {
    if (this.object.Stats[this.statTypeEnum.Value] === undefined || id === undefined) { return false }
    return this.object.Stats[this.statTypeEnum.Value].Data === id.toString()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
