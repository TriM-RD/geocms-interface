<template>
  <div :class="object?.Stats[statTypeEnum.Design].Data">
    <div v-if="returnIfExists(statTypeEnum.ItemList) && !returnIfExists(statTypeEnum.Name)">
      <div v-for="(item, key, index) in JSON.parse(object.Stats[statTypeEnum.ItemList].Data)" :key="`${ key }-${ index }`">
        <input class="form-check-input mt-0"
               :name="object.Stats[statTypeEnum.Tag].Data"
               :value="item.id" type="radio"
               :checked="object.Stats[statTypeEnum.Value].Data===item.id"
               @input="handleInput($event, item.id)">
        <label class="form-check-label" :for="item.id">
          {{ item.name }}
        </label>
      </div>
    </div>
    <div v-else>
      <input class="form-check-input"
             :name="object.Stats[statTypeEnum.Name].Data"
             :value="object.Stats[statTypeEnum.ItemList].Data"
             type="radio"
             :checked="object.Stats[statTypeEnum.ItemList].Data===object.Stats[statTypeEnum.Value].Data"
             @input="handleInput($event, object.Stats[statTypeEnum.ItemList].Data)">
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-facing-decorator'
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@cybertale/interface'

@Component
export default class RadioComponent extends Vue {
  @Prop() object!: ObjectTemplate

  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum

  returnIfExists(tag: number): string {
    if (this.object.Stats[tag]) {
      return this.object.Stats[tag].Data
    }
    return ''
  }

  handleInput(event: Event, value: string) {
    this.regionType.RegionTypes[this.object.Region].ObjectTypes[this.object.ObjectEnum].ChooseSubType(this.object as ObjectTemplate, value)
  }
}
</script>

<style scoped>
.form-check .form-check-input {
  float: none;
}
.form-check-input {
  margin-right: 1%;
}
.form-check-input:checked {
  background-color: #606467;
  border-color: #606467;
}
</style>
