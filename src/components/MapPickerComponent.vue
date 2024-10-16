<template>
  <div v-if="renderComponent">
    <div class="row">
      <div class="col-lg-4"></div>
      <div class="col-lg-4">
        <div class="input-group mt-3 mb-1">
          <label class="input-group-text text-truncate">{{ $t.longitude }}</label>
          <input type="text" class="form-control" placeholder="Longitude" @input="updateMarker" v-model="lngLat[0]" aria-label="Longitude">
          <label class="input-group-text">{{ $t.latitude }}</label>
          <input type="text" class="form-control" placeholder="Latitude" @input="updateMarker" v-model="lngLat[1]" aria-label="Latitude">
          <button class="btn btn-outline-info" type="button" @click="geoLocate">{{ $t.get }}</button>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12 p-0">
        <div id="map" style="height: 50vh;"></div>
      </div>
    </div>
    <div class="row" v-show="showImageButton">
      <div class="col-6">
        <button class="btn btn-outline-secondary" @click.prevent="toggleImageLayer">{{ imageLayerVisible ? 'Hide' : 'Show' }} Image Layer</button>
      </div>
      <div class="col-6">
        <button class="btn btn-outline-secondary" @click.prevent="changeStyle">{{ isSatelliteView ? 'Switch to Def View' : 'Switch to Sat View' }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
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
    Loading
  },
  props: {
    object: ObjectTemplate
  },
  watch: {
    renderComponent (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          console.log(newVal)
          this.init()
        })
      }
    }
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
  renderComponent = false
  map!: any
  marker: mapboxgl.Marker | null = null
  imageLayerVisible = true
  showImageButton = false
  isSatelliteView = false

  mounted () {
    this.renderComponent = true
  }

  changeStyle () {
    this.map.once('styledata', () => {
      this.addImageLayer()
      this.imageLayerVisible = true
    })
    if (this.isSatelliteView) {
      this.map.setStyle('mapbox://styles/joso/clyprewpl00a901r18zm5gczr')
      this.isSatelliteView = false
    } else {
      this.map.setStyle('mapbox://styles/joso/cltzjanet00mw01qub77penk0')
      this.isSatelliteView = true
    }
    // this.addImageLayer()
  }

  updateMarker () {
    if (this.marker) {
      this.marker.setLngLat(this.lngLat)
    }
    this.object.Stats[StatTypeEnum.Value].Data = JSON.stringify(this.lngLat)
  }

  init () {
    let temp = null
    if (this.object.Stats[StatTypeEnum.Value].Data) {
      temp = JSON.parse(this.object.Stats[StatTypeEnum.Value].Data)
    }

    if (temp === null || router.currentRoute.value.name === Definitions.Entity.Add || (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(String(router.currentRoute.value.params.id)))) {
      this.geoLocate()
    } else {
      this.lngLat = [temp[0], temp[1]]
      this.initMap()
    }
  }

  initMap () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zbyIsImEiOiJjbDBpN3NnbWMwMDJlM2ptcng2bGIxazJjIn0.xuMyew046jayaAFfWnsfJQ'
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/joso/clyprewpl00a901r18zm5gczr',
      center: this.lngLat,
      zoom: 9
    })

    this.map.on('load', () => {
      this.addMarker()
      this.addGeolocateControl()
      this.addImageLayer()
    })
  }

  addMarker () {
    if (this.map) {
      this.marker = new mapboxgl.Marker({
        draggable: true
      })
        .setLngLat(this.lngLat)
        .addTo(this.map)

      this.marker.on('dragend', () => {
        const lngLat = this.marker!.getLngLat()
        this.lngLat = [lngLat.lng, lngLat.lat]
        this.updateMarker()
      })
    }
  }

  addGeolocateControl () {
    if (this.map) {
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
      this.map.addControl(geolocate)
    }
  }

  addImageLayer () {
    if (this.map) {
      // Add your existing image layer
      this.map.addSource('my-source', {
        type: 'image',
        url: require('../assets/koversada.png'),
        coordinates: [
          [13.610872533, 45.136310612],
          [13.617992154, 45.136625937],
          [13.618265563, 45.130452494],
          [13.611145971, 45.130137161]
        ]
      })

      this.map.addLayer({
        id: 'my-layer',
        type: 'raster',
        source: 'my-source',
        paint: {
          'raster-fade-duration': 0,
          'raster-opacity': 0.5
        }
      })

      // Add the hosted Mapbox tileset as a source
      this.map.addSource('mapbox-tileset', {
        type: 'image',
        url: require('../assets/koversadaBig.png'),
        coordinates: [
          [13.59431264, 45.14664839], // Top-left
          [13.62086774, 45.14728560], // Top-right
          [13.62173370, 45.12959157], // Bottom-right
          [13.5951652, 45.1289459] // Bottom-left
        ]
      })/* this.map.addSource('mapbox-tileset', {
        type: 'raster', // GeoTIFFs are raster data
        url: 'mapbox://joso.9g1mhqyu', // The tileset ID you uploaded to Mapbox
        tileSize: 256 // Common tile size for raster tiles
      }) */

      this.map.addLayer({
        id: 'tileset-layer',
        type: 'raster', // Display raster data
        source: 'mapbox-tileset',
        paint: {
          'raster-opacity': 0.5, // Adjust opacity as needed
          'raster-fade-duration': 100 // Optional: makes transitions smoother
        }
      })

      // Show image layer button conditionally based on firmName
      if (localStorage.getItem('firmName') === 'trim') {
        this.showImageButton = true
      }
    }
  }

  toggleImageLayer () {
    if (this.map) {
      /* const visibility = this.map.getLayoutProperty('my-layer', 'visibility')
      console.log(visibility) */
      if (this.imageLayerVisible) {
        this.map.setLayoutProperty('my-layer', 'visibility', 'none')
        this.map.setLayoutProperty('tileset-layer', 'visibility', 'none')
        this.imageLayerVisible = false
      } else {
        this.map.setLayoutProperty('my-layer', 'visibility', 'visible')
        this.map.setLayoutProperty('tileset-layer', 'visibility', 'visible')
        this.imageLayerVisible = true
      }
    }
  }

  geoLocate () {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lngLat = [position.coords.longitude, position.coords.latitude]
        this.updateMarker()
        this.initMap()
      }, (error: any) => {
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
    if (this.map) {
      this.map.remove()
    }
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
