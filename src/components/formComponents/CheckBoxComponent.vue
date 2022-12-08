<template>
  <div class="mb-3 row justify-content-md-center">
    <div class="col"></div>
    <div class="col">
  <div class="form-check" :class="`${object.Stats[statTypeEnum.Design].Data}`">
    <label class="form-check-label">{{object.Stats[statTypeEnum.Label].Data }}</label>
    <input
    :type="`${object.Stats[statTypeEnum.ElementType] !== undefined?object.Stats[statTypeEnum.ElementType].Data:''}`"
    class="form-check-input"
    :value="object.Stats[statTypeEnum.Value].Data"
    @input="regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, $event.target.value)">

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
export default class CheckBoxComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  object!: ObjectTemplate
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form-check-input:checked {
  background-color: #606467;
  border-color: #606467;
}
</style>
