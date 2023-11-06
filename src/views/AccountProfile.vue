<template>
    <div class="container" style="text-align: center;">
          <h4>{{$t.aboutUser}}</h4>
          <div class="input-group mb-3 col-lg-4">
          <span class="input-group-text" id="basic-addon1">{{ $t.userName }}</span>
          <span class="form-control">{{ $store.state.name }}</span>
          </div>
          <div class="input-group mb-3 col-lg-4">
          <span class="input-group-text" id="basic-addon2">{{ $t.email }}</span>
          <span class="form-control">{{ $store.state.email }}</span>
          </div>
          <ListComponent :use-routes="true"/>
    </div>
  </template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import ListComponent from '@/components/ListComponent.vue'
import { $t } from '../locales'
// import createStore from '@/store/index'

@Options({
  computed: {
    $t () {
      return $t
    }
  },
  components: {
    ListComponent
  }
})
export default class AccountProfile extends Vue {
}
</script>
