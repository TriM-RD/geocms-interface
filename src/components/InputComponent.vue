<template>
  <div class="mb-3 row justify-content-md-center">
    <div class="col"></div>
    <div class="col">
      <label class="form-label h3">{{object.Stats[statTypeEnum.Title].Data }}</label>
      <input :type="`${object.Stats[statTypeEnum.Type] !== undefined?object.Stats[statTypeEnum.Type].Data:''}`"
             :class="`${object.Stats[statTypeEnum.Design].Data}`"
             :value="object.Stats[statTypeEnum.Value].Data"
             :placeholder="`${object.Stats[statTypeEnum.Placeholder].Data}`"
             @input="regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, $event.target.value)">
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
