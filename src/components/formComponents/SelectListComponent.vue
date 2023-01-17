<template>
  <div v-if="renderComponent" class="mb-3 row justify-content-md-center">
        <div class="col"></div>
        <div class="col">
      <div class="input-group">
        <label :title="specialCase()" for="exampleDataList" class="input-group-text">{{object.Stats[statTypeEnum.Label].Data }}</label>
        <select class="form-select" aria-label="Default select example"
                :required="attributeCheck(statTypeEnum.Required)"
                :disabled="attributeCheck(statTypeEnum.Disabled)"
                :autocomplete="`${object.Stats[statTypeEnum.AutoComplete] !== undefined?object.Stats[statTypeEnum.AutoComplete].Data:''}`"
        @input="regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, $event.target.value)">
          <option :selected="object.Stats[statTypeEnum.Value] === undefined" hidden>Select a type.</option>
          <option v-for="(item, key, index) in JSON.parse(object.Stats[statTypeEnum.ItemList].Data)" :selected="check(item.id)" :key="`${ key }-${ index }`" :value="item.id">{{item.name}}</option>
        </select>
        <slot></slot>
      </div>
      </div>
      <div class="col"></div>
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
export default class SelectListComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  object!: ObjectTemplate
  renderComponent= true

  attributeCheck (statType : number) : boolean | string {
    if (this.object.Stats[statType] === undefined) { return false }
    return this.object.Stats[statType].Data
  }

  check (id : string) {
    if (this.object.Stats[this.statTypeEnum.Value] === undefined || id === undefined) { return false }
    return this.object.Stats[this.statTypeEnum.Value].Data === id.toString()
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
