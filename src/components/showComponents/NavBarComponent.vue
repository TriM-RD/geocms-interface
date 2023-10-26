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
          <Search data-bs-toggle="modal" data-bs-target="#searchModal" :placeholder="$t.search"/>
        </div>
        <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ $t.search }}</h5>
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
              {{ $store.state.firm }}/{{ $store.state.name }}
            </button>
            <ul class="dropdown-menu dropdown-content">
              <router-link to="/account" class="dropdown-item opacity-75">{{$t.profile}}</router-link>
              <router-link to="/administration" class="dropdown-item opacity-75">{{ $t.administration }}</router-link>
              <router-link to="/firm-selection" class="dropdown-item opacity-75">{{ $t.firmSelection }}</router-link>
              <li class="opacity-50"><hr class="dropdown-divider"></li>
              <li><button data-bs-toggle="modal" data-bs-target="#reportModal" class="dropdown-item opacity-75" type="button">
                {{ $t.openReport }}</button></li>
              <li class="opacity-50"><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item opacity-75" type="button" v-on:click="logout()">{{ $t.logOut }}</button></li>
            </ul>
          </li>
        </ul>
        <div class="modal fade" id="reportModal" tabindex="-1" aria-labelledby="reportModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ $t.report }}</h5>
                <button type="button" class="btn-close" id="reportModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <Datepicker
                  class="d-block w-100"
                  @update:model-value="openReport"
                  range
                  :enable-time-picker="false"
                  auto-apply
                  inline
                />
              </div>
            </div>
          </div>
        </div>
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
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { $t } from '../../locales'
@Options({
  computed: {
    $t () {
      return $t
    }
  },
  components: { Search, Datepicker },
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

  openReport (dates: Date[]) : void {
    window.open('https://tri-m.app/ormari/api/report.php?datefrom=' +
      dates[0].toISOString().split('T')[0] +
      '&dateto=' + dates[1].toISOString().split('T')[0])
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
