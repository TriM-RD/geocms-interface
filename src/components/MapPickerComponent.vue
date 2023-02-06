<template>
  <div class="container" v-if="renderComponent">
    <component :key="`${ 0 }-${ objectTemplates[0].Stats[statTypeEnum.Tag].Data }`"  :is="getComponent(objectTemplates[0].Region, objectTemplates[0].ObjectEnum)" :object='objectTemplates[0]'/>

    <!--div class="row">
      <div class="col">

      </div>
      <div class="col-12 p-0">
        <mapbox-map
          style="height: 50vh"
          :accessToken="'pk.eyJ1Ijoiam9zbyIsImEiOiJjbDBpN3NnbWMwMDJlM2ptcng2bGIxazJjIn0.xuMyew046jayaAFfWnsfJQ'"
          mapStyle="light-v10">
          <mapbox-marker :lngLat="lngLat" :draggable="true" @update:lngLat="regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object)"/>
          <mapbox-geolocate-control :positionOptions="{ enableHighAccuracy: true, timeout: 6000 }" />
        </mapbox-map>
      </div>
    </div-->
  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { MapboxMap, MapboxMarker, MapboxGeolocateControl } from 'vue-mapbox-ts'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { Manager } from '@/interface/manager/mechanics/mapPickerMechanic'
import { MechanicAbstract } from '@/interface/manager/mechanics/mechanicAbstract'
import { RegionEnum, ObjectTypeEnum, SubObjectTypeEnum, ActionTypeEnum, StatTypeEnum, StatType, ObjectType, RegionType } from '@/interface/manager/events/types/index'
import router from '@/router'
@Options({
  components: {
    MapboxMap,
    MapboxMarker,
    MapboxGeolocateControl
  },
  props: {
    object: ObjectTemplate
  }
})
export default class MapPickerComponent extends Vue {
  lngLat: [number, number] = [0, 0]
  mechanic: MechanicAbstract = new Manager.Mechanic.MapPickerMechanic()
  regionType = RegionType
  regionEnum = RegionEnum
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  object!: ObjectTemplate
  renderComponent= false
  objectTemplates: ObjectTemplate[] = this.mechanic.InitSet([
    new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.InsertClick, {
      [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Label].Data),
      [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Tag].Data),
      [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Value].Data),
      [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
      [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('someValue'),
      [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data)
    }),
    new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Down, ActionTypeEnum.Click, {
      [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Delete'),
      [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Tag].Data),
      [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-danger me-2'),
      [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Id].Data)
    })
  ])

  mounted () {
    this.geoLocate()
    this.init()
  }

  init () {
    if (router.currentRoute.value.name === 'DeviceAdd') {
      this.geoLocate()
    }
    this.renderComponent = true
  }

  geoLocate () {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lngLat[1] = position.coords.latitude
        this.lngLat[0] = position.coords.longitude
        // Use the latitude and longitude values to do something with the user's location
      }, function (error: any) {
        console.error('Error getting location: ', error)
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      })
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetVueComponent()
  }
}

</script>
<style scoped>

</style>
