<template>
  <div class="flex-container">
    <div class="input">
    <b>Filter Resaults:</b>
    </div>
    <div class="input" style="float:center">
        <span class="input-text" id="border">Type</span>
        <input type="text" class="form-control" id="border1" placeholder="Everything">
    </div>
    <div class="input" style="float:right">
        <span class="input-text" id="border">Category</span>
        <input type="text" class="form-control" id="border1" placeholder="Everything">
    </div>
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
export default class FilterComponent extends Vue {
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
.input {
  display: flex;
  align-items: stretch;
  width: 40%;
  margin: 20px;
}
.input-text {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  white-space: nowrap;
  background-color: #ced4da;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
#border {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
#border1 {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.flex-container {
  display: flex;
  padding: 10px;
}
</style>
