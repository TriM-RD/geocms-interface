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
          <Search data-bs-toggle="modal" data-bs-target="#searchModal"/>
        </div>
        <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="btn-close" id="searchModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <Search />
              </div>
            </div>
          </div>
        </div>
        <ul class="d-flex">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle boja" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              User name
            </a>
            <ul class="dropdown-menu dropdown-content">
              <router-link to="/account" class="dropdown-item">Profile</router-link>
              <router-link to="/administration" class="dropdown-item">Administration</router-link>
              <li><button class="dropdown-item" type="button" v-on:click="logout()">Log out</button></li>
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
import Search from '@/components/Search.vue'
import { Watch } from 'vue-property-decorator'
@Options({
  components: { Search },
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

  @Watch('$route')
  onDataChanged (value: any, oldValue: string) {
    const temp = document.getElementById('searchModalClose')
    if (temp !== null) {
      temp.click()
    }
  }

  async logout () : Promise<void> {
    await http.get(process.env.VUE_APP_BASE_URL + 'user/logout').then(response => {
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
ul{
  padding-inline-start: 0 !important;
}
.dropdown-content {
  right: 0 !important;
  left: auto !important;
}
</style>
