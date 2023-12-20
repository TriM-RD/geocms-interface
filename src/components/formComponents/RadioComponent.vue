<template>
  <div :class="object?.Stats[statTypeEnum.Design].Data">
    <div v-if="returnIfExists(statTypeEnum.ItemList)">
      <div v-for="(item, key, index) in JSON.parse(object.Stats[statTypeEnum.ItemList].Data)" :key="`${ key }-${ index }`">
        <input class="form-check-input mt-0"
               :name="object.Stats[statTypeEnum.Tag].Data"
               :value="item.id" type="radio"
               :checked="object.Stats[statTypeEnum.Value].Data===item.id"
               @input="regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, $event.target.value)">
        <label class="form-check-label" for="flexCheckDefault">
          {{ item.name }}
        </label>
      </div>
    </div>
    <div v-else>
      <input class="form-check-input"
             :name="object.Stats[statTypeEnum.Name].Data"
             :value="object.Stats[statTypeEnum.Value].Data"
             type="radio"
             :checked="object.Stats[statTypeEnum.Value].Data===object.Stats[statTypeEnum.Value].Data"
             @input="regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, $event.target.value)">
    </div>
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
export default class RadioComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  object!: ObjectTemplate

  returnIfExists (tag: number): string {
    if (this.object.Stats[tag]) {
      return this.object.Stats[tag].Data
    }
    return ''
  }
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
