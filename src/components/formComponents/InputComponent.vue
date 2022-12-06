<template>
  <div class="mb-3 row justify-content-md-center">
    <div class="col"></div>
    <div class="col input-group">
      <label class="input-group-text" :hidden="specialCase()">{{object.Stats[statTypeEnum.Label].Data }}</label>
      <input class="form-control"
             :class="object.Stats[statTypeEnum.Design].Data"
             :type="`${object.Stats[statTypeEnum.ElementType] !== undefined?object.Stats[statTypeEnum.ElementType].Data:''}`"
             :value="object.Stats[statTypeEnum.Value].Data"
             :placeholder="`${object.Stats[statTypeEnum.Placeholder].Data}`"
             @input="regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, $event.target.value)">
      <slot></slot>
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
export default class InputComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  object!: ObjectTemplate

  specialCase () : boolean {
    if (this.object.Stats[this.statTypeEnum.ElementType] === undefined) { return false }
    return this.object.Stats[this.statTypeEnum.ElementType].Data === 'hidden'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
