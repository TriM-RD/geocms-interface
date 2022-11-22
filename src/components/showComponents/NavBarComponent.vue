<template>
 <nav>
 <div class="navbar container-fluid">
    <a class="navbar-brand" href="#">
      <img src="../../assets/logo.png" alt="Logo" width="90" class="d-inline-block align-text-top">
    </a>
    <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
    </form>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle boja" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          User name
        </a>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
        </ul>
      </li>
    </div>
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
    <router-link to="/permissions" class="nav-link boja">Permissions</router-link>
  </li>
  <li class="nav-item border">
    <router-link to="/types" class="nav-link boja">Types</router-link>
  </li>
  <li class="nav-item border">
    <router-link to="/categories" class="nav-link boja">Categories</router-link>
  </li>
</ul>
</div>
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
.container{
padding-bottom: 5%;
}
li{
  list-style-type: none;
}
hr{
margin-top:-1.5% !important;
}
</style>
