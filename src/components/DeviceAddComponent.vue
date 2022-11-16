<template>
<div class="container">
    <p><b>Add New Device</b></p>
    <div class="input-group mb-3">
    <span class="input-group-text">Code</span>
    <input type="text" placeholder="Qr/Barcode id" class="form-control" aria-label="Amount (to the nearest dollar)">
    <span class="input-group-text"><img alt="QR" width="25" src="../assets/QRcode.png"></span>
    </div>
    <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Categories</span>
    <input type="text" class="form-control" placeholder="Energetika" aria-label="Username" aria-describedby="basic-addon1">
    </div>
    <div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">Type</span>
    <input type="text" class="form-control" placeholder="Potrošač" aria-label="Username" aria-describedby="basic-addon1">
    </div>
    <div class="input-group mb-3">
    <span class="input-group-text">Coordinates</span>
    <input type="text" placeholder="Potrošač" class="form-control" aria-label="Amount (to the nearest dollar)">
    <input type="text" placeholder="Potrošač" class="form-control" aria-label="Amount (to the nearest dollar)">
    <span class="input-group-text">GET</span>
    </div>
    <div class="input-group mb-3">
    <span class="form-control" style="background-color:#e9ecef">Additional Dynamic Form  Fields Based On Objects Type</span>
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
export default class DeviceAddComponent extends Vue {
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
