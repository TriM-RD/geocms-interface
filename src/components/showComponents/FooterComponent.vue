<template>
<nav class="navbar fixed-bottom navbar-light bg-light">
  <form class="container-fluid justify-content-around">
    <router-link class="btn btn-outline-success me-2 flex-fill" type="button" to="/scan">Scan<img alt="QR" width="25" src="../../assets/QRcode.png"></router-link>
    <router-link class="btn btn-outline-secondary flex-fill" type="button" to="/deviceAdd">Add<img alt="plus" width="25" src="../../assets/plus.png"></router-link>
</form>
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
export default class FooterComponent extends Vue {
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
.container-fluid{
  padding-bottom: 0.5%;
}
</style>
