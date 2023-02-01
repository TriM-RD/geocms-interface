<template>
  <ul class="nav nav-pills nav-fill border mb-4">
    <li class="nav-item border-end border-secondary border-opacity-10">
      <router-link to="/" class="nav-link rounded-1" :class="{active: $route.path === '/'}">Map/Home</router-link>
    </li>
    <li class="nav-item border-end border-secondary border-opacity-10">
      <router-link to="/device" class="nav-link rounded-1" :class="{active: $route.path === '/device'}">Devices</router-link>
    </li>
    <li class="nav-item border-end border-secondary border-opacity-10">
      <router-link to="/permission" class="nav-link rounded-1" :class="{active: $route.path === '/permission'}">Permissions</router-link>
    </li>
    <li class="nav-item border-end border-secondary border-opacity-10">
      <router-link to="/group" class="nav-link rounded-1" :class="{active: $route.path === '/group'}">Groups</router-link>
    </li>
    <li class="nav-item border-end border-secondary border-opacity-10">
      <router-link to="/division" class="nav-link rounded-1" :class="{active: $route.path === '/division'}">Divisions</router-link>
    </li>
  </ul>
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
export default class NavComponent extends Vue {
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
.nav-pills>li>a,
.nav-pills>li>a:focus{
  color: gray;
}
.nav-pills>li>a:hover {
  color:  #fff;
  background-color: darkgray;
}
.nav-pills>li>a.active,
.nav-pills>li>a.active:focus,
.nav-pills>li>a.active:hover {
  color: #fff;
  background-color: gray;
}
</style>
