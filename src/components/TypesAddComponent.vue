<template>
  <div class="container">
    <div class="input-group flex-nowrap mb-3">
    <span class="input-group-text" id="addon-wrapping">Name</span>
    <input type="text" class="form-control" placeholder="Type Name" aria-label="Username" aria-describedby="addon-wrapping">
    </div>
    <div class="input-group flex-nowrap">
    <span class="input-group-text form-control" id="addon-wrapping">Attributes</span>
    <router-link class="input-group-text nav-link boja" id="addon-wrapping" type="button" to="/attributeAdd">Add</router-link>
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
export default class TypesAddComponent extends Vue {
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
a.boja{
  background-color:#e9ecef;
}
a.boja:hover{
  background-color:#e9ecef;
  color:#212529;
}
.nav-link{
  color:#212529;
}
</style>
