<template>
    <div class="container">
      <div class="input-group flex-nowrap mb-3">
      <span class="input-group-text" id="addon-wrapping">Name</span>
      <input type="text" class="form-control" placeholder="My Attributes" aria-label="My Attribute" aria-describedby="addon-wrapping">
      </div>
      <div class="input-group mb-3">
  <span class="input-group-text" id="addon-wrapping">External</span>
  <img src="../assets/checkmark.png" class="input-group-text color" alt="Logo" width="50" height="38">
</div>
<div class="input-group flex-nowrap">
    <span class="input-group-text form-control" id="addon-wrapping">Permissions</span>
    <span class="input-group-text" id="addon-wrapping" >Add</span>
    </div>
    </div>
      <nav class="navbar fixed-bottom navbar-light bg-light">
            <form class="container-fluid justify-content-around">
              <router-link class="btn btn-outline-success me-2 flex-fill" type="button" to="/">Save</router-link>
              <router-link class="btn btn-outline-secondary flex-fill" type="button" to="/categories">Cancel</router-link>
          </form>
            </nav>
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
.input-group-text.color{
  background-color: #fff;
}
</style>
