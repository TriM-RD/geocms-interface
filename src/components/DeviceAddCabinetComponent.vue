<template>
    <div class="container">
        <p><b>Add New Device</b></p>
        <div class="input-group mb-3">
        <span class="input-group-text">Coordinates</span>
        <input type="text" placeholder="Potrošač" class="form-control" aria-label="Amount (to the nearest dollar)">
        <input type="text" placeholder="Potrošač" class="form-control" aria-label="Amount (to the nearest dollar)">
        <span class="input-group-text">GET</span>
        </div>
    </div>
        <div class="container">
        <table class="table">
  <tbody>
    <tr scope="row">
      <td><OsiguracComponent /></td>
      <td></td>
      <td></td>
      <td><AddComponent /></td>
    </tr>
    <tr scope="row">
      <td><OsiguracComponent /></td>
      <td><OsiguracComponent /></td>
      <td><OsiguracComponent /></td>
      <td><AddComponent /></td>
    </tr>
    <tr scope="row">
      <td><OsiguracComponent /></td>
      <td><OsiguracComponent /></td>
      <td><OsiguracComponent /></td>
      <td><AddComponent /></td>
    </tr>
  </tbody>
</table>
    <div class="d-grid mb-3 justify-content-md-end">
        <router-link type="button" class="btn btn-success" to="/deviceAppend">Add New Row<img alt="plus" width="25" src="../assets/plus.png"></router-link>
    </div>
</div>
    <router-view/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@/interface/manager/events/types'
import OsiguracComponent from '@/components/OsiguracComponent.vue'
import AddComponent from '@/components/AddComponent.vue'

@Options({
  props: {
    object: ObjectTemplate
  },
  components: {
    OsiguracComponent,
    AddComponent
  }
})
export default class DeviceAddCabinetComponent extends Vue {
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
