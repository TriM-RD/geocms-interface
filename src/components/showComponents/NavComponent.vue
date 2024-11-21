<template>
  <ul class="nav nav-pills nav-fill border mb-md-4">
    <li v-if="checkFirm" class="nav-item border-end border-secondary border-opacity-10">
      <router-link to="/dashboard" class="nav-link rounded-1" :class="{active: $route.path === '/dashboard'}">Dashboard</router-link>
    </li>
    <li class="nav-item border-end border-secondary border-opacity-10">
      <router-link to="/" class="nav-link rounded-1" :class="{active: $route.path === '/'}">{{$t.map}}</router-link>
    </li>
    <li class="nav-item border-end border-secondary border-opacity-10">
      <router-link to="/entity" class="nav-link rounded-1" :class="{active: $route.path === '/entity'}">{{ $t.entities }}</router-link>
    </li>
    <li class="nav-item border-end border-secondary border-opacity-10">
      <router-link to="/permission" class="nav-link rounded-1" :class="{active: $route.path === '/permission'}">{{$t.permissions}}</router-link>
    </li>
    <li class="nav-item border-end border-secondary border-opacity-10">
      <router-link to="/group" class="nav-link rounded-1" :class="{active: $route.path === '/group'}">{{$t.groups}}</router-link>
    </li>
    <li class="nav-item border-end border-secondary border-opacity-10">
      <router-link to="/division" class="nav-link rounded-1" :class="{active: $route.path === '/division'}">{{$t.divisions}}</router-link>
    </li>
  </ul>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import {
  ObjectTemplate,
  ObjectType,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType,
  RegionEnum
} from '@cybertale/interface'
import { $t } from '@geocms/localization'
@Options({
  computed: {
    $t () {
      return $t
    }
  },
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

  get checkFirm () {
    return localStorage.getItem('firmName') === 'zaton'
  }
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
