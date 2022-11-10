<template>
        <div class="input-group mb-3">
        <span class="input-group-text">Belongs to:</span>
        <input type="text" placeholder="Qr/Barcode id" class="form-control" aria-label="Amount (to the nearest dollar)">
        <span class="input-group-text">Search</span> 
        <span class="input-group-text"><img alt="QR" width="25" src="../assets/QRcode.png"></span>
        </div>
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
export default class DeviceAddPotrosacComponent extends Vue {
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
