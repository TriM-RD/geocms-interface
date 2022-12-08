<template>
    <div class="container">
        <div class="input-group flex-nowrap mb-3">
  <span class="input-group-text" id="addon-wrapping">Name</span>
  <input type="text" class="form-control" placeholder="My Attribute" aria-label="Username" aria-describedby="addon-wrapping">
</div>
<div class="input-group flex-nowrap mb-3">
  <span class="input-group-text" id="addon-wrapping">Label</span>
  <input type="text" class="form-control" placeholder="Content" aria-label="Username" aria-describedby="addon-wrapping">
</div>
<div class="input-group flex-nowrap mb-3">
  <span class="input-group-text" id="addon-wrapping">Placeholder</span>
  <input type="text" class="form-control" placeholder="You can wite content here..." aria-label="Username" aria-describedby="addon-wrapping">
</div>
<div class="input-group mb-3">
    <span class="input-group-text" id="addon-wrapping">Filed Type</span>
  <input type="text" class="form-control" placeholder="Input Field" aria-label="Text input with dropdown button">
  <button class="btn btn-outline-secondary  bo dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
  <ul class="dropdown-menu dropdown-menu-end">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
  </ul>
</div>
  <div class="input-group mb-3">
  <span class="input-group-text" id="addon-wrapping">Required</span>
  <img src="../assets/checkmark.png" class="input-group-text color" alt="Logo" width="50" height="38">
</div>
    </div>
    <router-view/>
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
export default class AttributesAddComponent extends Vue {
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
.btn-outline-secondary.bo{
background-color:#e9ecef;
border-color: #ced4da;
color: #212529;
}
.btn-outline-secondary.bo:hover{
  color:#212529;
}
.input-group-text.color{
  background-color: #fff;
}
</style>
