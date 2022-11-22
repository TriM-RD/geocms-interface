<template>
    <div class="container">
        <p><b>Append New Device</b></p>
        <div class="input-group mb-3">
        <span class="input-group-text">Code</span>
        <input type="text" placeholder="Qr/Barcode id" class="form-control" aria-label="Amount (to the nearest dollar)">
        <span class="input-group-text">Search</span>
        <span class="input-group-text">Auto_Generate</span>
        <span class="input-group-text"><img alt="QR" width="25" src="../assets/QRcode.png"></span>
    </div>
        <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">Categories</span>
        <input type="text" class="form-control" placeholder="Energetika" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">Type</span>
        <input type="text" class="form-control" placeholder="Osigurač" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        </div>
    <nav class="navbar fixed-bottom navbar-light bg-light">
          <form class="container-fluid justify-content-around">
            <router-link class="btn btn-outline-success me-2 flex-fill" type="button" to="/">Save</router-link>
            <router-link class="btn btn-outline-secondary flex-fill" type="button" to="/device">Cancel</router-link>
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
export default class DeviceAppendComponent extends Vue {
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
</style>
