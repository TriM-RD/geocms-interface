<template>
  <div class="mb-3 row justify-content-md-center">
    <div class="col-lg"></div>
    <div class="col">
  <div class="input-group">
    <label :title="`${object.Stats[statTypeEnum.Tooltip].Data}`" for="exampleDataList" class="input-group-text">{{object.Stats[statTypeEnum.Label].Data }}</label>
    <input class="form-control" list="datalistOptions"
           :class="validate()"
           :required="attributeCheck(statTypeEnum.Required)"
           :disabled="attributeCheck(statTypeEnum.Disabled)"
           :type="`${object.Stats[statTypeEnum.ElementType] !== undefined?object.Stats[statTypeEnum.ElementType].Data:''}`"
           :value="`${object.Stats[statTypeEnum.Value].Data !== null?object.Stats[statTypeEnum.Value].Data.name === undefined?valueName:object.Stats[statTypeEnum.Value].Data.name:''}`"
           :placeholder="`${object.Stats[statTypeEnum.Placeholder].Data}`"
           @input="inputEvent(object, $event.target.value)">
    <datalist id="datalistOptions" v-if="dspStyle">
      <option v-for="(item, key, index) in JSON.parse(object.Stats[statTypeEnum.ItemList].Data)" :selected="check(item.name)" :key="`${ key }-${ index }`" :value="item.name">{{item.name}}</option>
    </datalist>
    <slot></slot>
    <div class="invalid-feedback">{{ `${object.Stats[statTypeEnum.ErrorMessage] !== undefined?object.Stats[statTypeEnum.ErrorMessage].Data:''}` }}</div>
  </div>
  </div>
  <div class="col-lg"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from 'cyber-interface'

interface Option {
  id: number;
  name: string;
}

@Options({
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

  get valueName (): string {
    const temp = this.options.find((option: any) => option.id === this.object.Stats[this.statTypeEnum.Value].Data)
    if (temp === undefined) { return this.object.Stats[this.statTypeEnum.Value].Data }
    return temp!.name
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
    if (this.object.Stats[this.statTypeEnum.ErrorMessage].Data !== '') { console.log('test'); return 'is-invalid' }
    return ''
  }

  inputEvent (object: ObjectTemplate, value: string) {
    if (value.length >= 3) {
      this.dspStyle = true
    } else {
      this.dspStyle = false
    }
    this.regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, value)
  }

  check (id : string) {
    if (this.object.Stats[this.statTypeEnum.Value] === undefined || id === undefined) { return false }
    return this.object.Stats[this.statTypeEnum.Value].Data === id.toString()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
