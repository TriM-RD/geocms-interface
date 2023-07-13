<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="../../assets/LogoTriM.png" alt="Logo" width="90" class="d-inline-block align-text-top">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
        <div class="flex-grow-1 d-flex">
          <Search data-bs-toggle="modal" data-bs-target="#searchModal" :placeholder="'Search'"/>
        </div>
        <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Search</h5>
                <button type="button" class="btn-close" id="searchModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <Search />
              </div>
            </div>
          </div>
        </div>
        <ul class="d-flex">
          <li class="nav-item dropdown nav-justified">
            <button class="btn btn-outline-secondary dropdown-toggle w-100" type="button" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ $store.state.name }}
            </button>
            <ul class="dropdown-menu dropdown-content">
              <router-link to="/account" class="dropdown-item opacity-75">Profile</router-link>
              <router-link to="/administration" class="dropdown-item opacity-75">Administration</router-link>
              <li class="opacity-50"><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item opacity-75" type="button" v-on:click="openReport">Open Report</button></li>
              <li><button class="dropdown-item opacity-75" type="button" v-on:click="testMe">Test</button></li>
              <li class="opacity-50"><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item opacity-75" type="button" v-on:click="logout()">Log out</button></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
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
      window.location.href = window.location.origin
    }, response => {
      // error
    })
  }

  openReport () : void {
    const today = new Date()
    const date1 = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0]
    const date2 = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0]
    window.open('https://tri-m.app/ormari/api/report.php?datefrom=' + date1 + '&dateto=' + date2)
  }

  async testMe (): Promise<void> {
    const response = await http.get('http://supblue.test/api/user')
    console.log(response)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li{
  list-style-type: none;
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
.dropdown-divider {
  opacity: 0.5;
}
</style>
