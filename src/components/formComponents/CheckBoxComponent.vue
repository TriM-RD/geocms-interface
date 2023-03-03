<template>
  <div class="mb-3 row justify-content-md-center">
    <div class="col-lg"></div>
    <div class="col input-group mb-3">
      <div class="input-group-text">
        <input class="form-check-input mt-0" type="checkbox" :checked="object.Stats[statTypeEnum.Value].Data"
               @input="regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, $event.target.checked)">
      </div>
      <input disabled :value="object.Stats[statTypeEnum.Label].Data" type="text" class="form-control" aria-label="Text input with checkbox">
    </div>
    <div class="col-lg"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@cybertale/interface'
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
