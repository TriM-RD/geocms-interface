<template>
    <div class="navbar-light bg-light">
        <hr>
<div class="container">
  <ul class="nav nav-pills nav-fill">
  <li class="nav-item border">
    <router-link to="/map" class="nav-link boja">Map/Home</router-link>
  </li>
  <li class="nav-item border">
    <router-link to="/device" class="nav-link boja">Devices</router-link>
  </li>
  <li class="nav-item border">
    <router-link to="/permission" class="nav-link boja">Permission</router-link>
  </li>
  <li class="nav-item border">
    <router-link to="/groups" class="nav-link boja">Groups</router-link>
  </li>
  <li class="nav-item border">
    <router-link to="/divisions" class="nav-link boja">Divisions</router-link>
  </li>
</ul>
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
a{
  color:#868b90;
}
a.boja:hover{
  background-color:#969b9f;
  color:#fff
}
a.boja:focus{
  background-color:#606467;
  color: #fff;
}

a.bojaa:focus{
  background-color:#969b9f;
  color: #fff;
  border-radius: 5%;
}
a.bojaaa:active{
  background-color:#969b9f;
  color: #fff;
}
.container{
padding-bottom: 1%;
padding-top: 1%;
}
li{
  list-style-type: none;
}
hr{
margin-top:-1.5% !important;
}
.container{
margin-bottom: 1%;
}
.d-flex{
  display:contents !important;
}
ul.padd{
  padding-inline-start: 0 !important;
}
</style>
