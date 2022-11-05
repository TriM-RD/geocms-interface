<template>
  <div>
    <div id="nav">
    <img class="img" alt="Vue logo" width="90" src="../../assets/logo.png">
      <input class="form" type="text" placeholder="Search">
      <select class="form1">
        <option selected>User Name</option>
        <option value="Log out">Log out</option>
      </select>
          <hr>
    </div>
    <hr>
  <div id="nav1">
    <router-link to="/" class="nav-link">Map/Home</router-link>
    <router-link to="/device" class="nav-link">Devices</router-link>
    <router-link to="/permissions" class="nav-link">Permissions</router-link>
    <router-link to="/types" class="nav-link">Types</router-link>
    <router-link to="/categories" class="nav-link">Categories</router-link>
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
export default class NavBarComponent extends Vue {
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
#nav {
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 33%;
}
#nav1 {
  padding-bottom: 20px;
}
.nav-link {
  display: inline-block;
  color: #2c3e50;
  border-style: solid;
  border-width: thin;
  border-color:#d4d7d9;
  border-radius: 2px;
}
.nav-link:hover{
  background-color:#97999c;
  color: white;
}
.active,.nav-link:focus{
  color: white;
  background-color:#6e7277;
}
.form {
  margin-top: 15% !important;
  border-radius: 5px;
  height: 30px;
  width: 200px;
  margin: 5px;
  padding: 2px;
  border-color: #d4d7d9;
  border-width: 1px;
}
.form1 {
  margin-top: 15% !important;
  height: 30px;
  width: 150px;
  text-align-last: center;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
  border-color: transparent;
  color: #2c3e50;
}
hr{
  margin-top:-5px !important;
}
</style>
