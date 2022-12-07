<template>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">
      <img src="../../assets/logo.png" alt="Logo" width="90" class="d-inline-block align-text-top">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
      <div class="flex-grow-1 d-flex">
            <form class="form-inline flex-nowrap bg-light mx-0 mx-lg-auto rounded p-1">
              <div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2">
</div>
            </form>
        </div>
      <ul class="d-flex">
        <li class="nav-item">
        <ul class="nav-item dropdown">
          <a class="nav-link dropdown-toggle boja" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            User name
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <router-link to="/account" class="dropdown-item">Profile</router-link>
            <li><button class="dropdown-item" type="button" v-on:click="logout()">Log out</button></li>
          </ul>
        </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@/interface/manager/events/types'
import http from '@/http-common'
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
  async logout () : Promise<void> {
    await http.get('http://blog.test/api/user/logout').then(response => {
      // success
      window.location.reload()
    }, response => {
      // error
    })
  }
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
li{
  list-style-type: none;
}
.container{
margin-bottom: 1%;
}
.d-flex{
  display:contents !important;
}

</style>
