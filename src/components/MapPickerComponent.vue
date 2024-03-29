<template>
  <div v-if="renderComponent">
    <div class="row">
      <div class="col-lg-4"></div>
      <div class="col-lg-4">
        <div class="input-group mt-3 mb-1">
          <label class="input-group-text text-truncate">{{ $t.longitude }}</label>
          <input type="text" class="form-control" placeholder="Longitude" @input="updateMarker(lngLat)" v-model="lngLat[0]" aria-label="Longitude">
          <label class="input-group-text">{{ $t.latitude }}</label>
          <input type="text" class="form-control" placeholder="Latitude" @input="updateMarker(lngLat)" v-model="lngLat[1]" aria-label="Latitude">
          <button class="btn btn-outline-info" type="button" @click="geoLocate()">{{ $t.get }}</button>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12 p-0">
        <mapbox-map
          style="height: 50vh"
          :flyToOptions="{ maxDuration: 2000, speed: 1.2 }"
          :center="[lngLat[0], lngLat[1]]"
          :zoom="9"
          :accessToken="'pk.eyJ1Ijoiam9zbyIsImEiOiJjbDBpN3NnbWMwMDJlM2ptcng2bGIxazJjIn0.xuMyew046jayaAFfWnsfJQ'"
          mapStyle="light-v10">
          <mapbox-marker @load="showMe()" v-show="false" :lngLat="lngLat" :draggable="true" @update:lngLat="updateMarker($event)"/>
          <mapbox-geolocate-control :positionOptions="{ enableHighAccuracy: true, timeout: 6000 }" />
        </mapbox-map>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { MapboxMap, MapboxMarker, MapboxGeolocateControl } from 'vue-mapbox-ts'
import { Manager } from '@/mechanics/mapPickerMechanic'
import {
  ObjectTemplate,
  MechanicAbstract,
  ObjectType,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType,
  RegionEnum
} from '@cybertale/interface'
import router from '@/router'
import Loading from 'vue-loading-overlay'
import { Definitions } from '@geocms/components'
import { $t } from '@geocms/localization'
@Options({
  computed: {
    $t () {
      return $t
    }
  },
  components: {
    MapboxMap,
    MapboxMarker,
    MapboxGeolocateControl,
    Loading
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
  showMarker = false

  mounted () {
    this.init()
  }

  updateMarker (value: [number, number]) {
    this.lngLat = value
    this.object.Stats[StatTypeEnum.Value].Data = JSON.stringify(value)
    this.renderComponent = true
  }

  init () {
    let temp = null
    if (this.object.Stats[StatTypeEnum.Value].Data) {
      temp = JSON.parse(this.object.Stats[StatTypeEnum.Value].Data)
    }

    if (temp === null || router.currentRoute.value.name === Definitions.Entity.Add || (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(String(router.currentRoute.value.params.id)))) {
      this.geoLocate()
    } else {
      this.updateMarker([temp[0], temp[1]])
    }
  }

  showMe () {
    this.showMarker = true
  }

  geoLocate () {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.updateMarker([position.coords.longitude, position.coords.latitude])
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
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}

</script>
<style scoped>

@media only screen and (max-width: 480px) {
  .input-group-text {
    font-size: 14px;
    display: inline-block;
    max-width: 70px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
