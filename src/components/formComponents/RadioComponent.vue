<template>
  <div class="mb-3 row justify-content-md-center" >
    <div class="col-lg"></div>
    <div class="col-lg"></div>
    <div class="col input-group" v-for="(item, key, index) in JSON.parse(object.Stats[statTypeEnum.ItemList].Data)" :key="`${ key }-${ index }`">
      <div class="input-group-text">
        <input class="form-check-input mt-0" :name="object.Stats[statTypeEnum.Label].Data" :value="item.id" type="radio" :checked="object.Stats[statTypeEnum.Value].Data===item.id"
               @input="regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, $event.target.value)">
      </div>
      <input disabled type="text" :value="item.name" class="form-control" aria-label="Text input with radio button">
    </div>
    <div class="col-lg"></div>
    <div class="col-lg"></div>
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
export default class RadioComponent extends Vue {
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
.form-check .form-check-input{
  float: none;
}
.form-check-input{
  margin-right: 1%;
}
.form-check-input:checked {
  background-color: #606467;
  border-color: #606467;
}
</style>
