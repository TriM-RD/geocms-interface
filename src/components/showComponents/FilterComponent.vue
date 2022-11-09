<template>
    <div class="container row g-3">
    <div class="col-lg-4 mb-3">
    <b>Filter Resaults:</b>
    </div>
    <div class="input-group mb-3 col-lg-4">
    <span class="input-group-text" id="basic-addon1">Type</span>
    <input type="text" class="form-control" placeholder="Everything" aria-label="Username" aria-describedby="basic-addon1">
  </div>
  <div class="input-group mb-3 col-lg-4">
    <span class="input-group-text" id="basic-addon1">Category</span>
    <input type="text" class="form-control" placeholder="Everything" aria-label="Username" aria-describedby="basic-addon1">
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
.input-group{
  width: auto;
}
b{
  text-align: center;
}
</style>
