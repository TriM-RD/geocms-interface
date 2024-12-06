<template>
  <div id="mapContainer" style="width: 100%; height: 100vh"></div>
  <button @click.prevent="MapFunctions.color3dModelsByAvailability(map)"
    style="position: absolute; top: 10px; left: 10px">Show availability</button>
  <button @click.prevent="MapFunctions.restoreColors(map)" style="position: absolute; top: 50px; left: 10px">Restore
    colors</button>
  <button @click.prevent="MapFunctions.reCenterMap(campsaboutObject, false, false)"
    style="position: absolute; top: 90px; left: 10px">Recenter map</button>
</template>

<script lang="ts">
// DO NOT USE <script setup>

// vue options API.
/*
import { defineComponent } from "vue";
export default defineComponent({});
*/

// class component
import { Component, Vue } from 'vue-facing-decorator'
import MapFunctions from '../../../npm/campsabout-mapbox'
import campGeojson from '../assets/gj/polidor_1.json'
import mobileHomeDeluxePolidor from '@/assets/3dModels/mobile_home_deluxe_polidor.glb'
import mobileHomeComfortPolidor from '@/assets/3dModels/mobile_home_comfort_polidor.glb'
import mobileHomePremiumPetfriendlyPolidor from '@/assets/3dModels/mobile_home_premium_petfriendly_polidor.glb'
import mobileHomeVilaPolidor from '@/assets/3dModels/mobile_home_vila_polidor.glb'
import mobileHomeVilaSuperiorPolidor from '@/assets/3dModels/mobile_home_vila_superior_polidor.glb'
import glampingSatorPolidor from '@/assets/3dModels/glamping_sator_polidor.glb'
import glampingStudioPolidor from '@/assets/3dModels/glamping_studio_polidor.glb'
import glampingSobaPolidor from '@/assets/3dModels/glamping_soba_polidor.glb'
import billboard3DModel from '@/assets/3dModels/billboard.glb'
import kozlovic from '@/assets/img/kozlovic.png'
import rossi from '@/assets/img/rossi.png'
import festi from '@/assets/img/festigia.png'
import white from '@/assets/img/white.png'
import pois from '@/assets/gj/pois.json'

const mobile_home_deluxe_polidor = {
  class: 'mhDeluxe',
  filePath: mobileHomeDeluxePolidor,
  rotation: {
    x: 90,
    y: 180,
    z: 0
  },
  adjustment: {
    x: 0.55,
    y: 0.55,
    z: 0
  },
  scale: 800,
  height: 5
}

const mobile_home_comfort_polidor = {
  class: 'mhComfort',
  filePath: mobileHomeComfortPolidor,
  rotation: {
    x: 180,
    y: 0,
    z: 180
  },
  adjustment: {
    x: 0.55,
    y: 0.55,
    z: 0
  },
  scale: 800,
  height: 5
}

const mobile_home_premium_petfriendly_polidor = {
  class: 'mhPremiumPetFriendly',
  filePath: mobileHomePremiumPetfriendlyPolidor,
  rotation: {
    x: 180,
    y: 0,
    z: 180
  },
  adjustment: {
    x: 0.55,
    y: 0.55,
    z: 0
  },
  scale: 800,
  height: 5
}

const mobile_home_vila_polidor = {
  class: 'mhVileSuperior',
  filePath: mobileHomeVilaPolidor,
  rotation: {
    x: 90,
    y: 180,
    z: 0
  },
  adjustment: {
    x: 0.55,
    y: 0.55,
    z: 0
  },
  scale: 800,
  height: 5
}

const mobile_home_vila_superior_polidor = {
  class: 'mhFamilyPetFriendly',
  filePath: mobileHomeVilaSuperiorPolidor,
  rotation: {
    x: 90,
    y: 180,
    z: 0
  },
  adjustment: {
    x: 0.55,
    y: 0.55,
    z: 0
  },
  scale: 800,
  height: 5
}

const glamping_sator_polidor = {
  class: 'glampingTent',
  filePath: glampingSatorPolidor,
  rotation: {
    x: 0,
    y: 180,
    z: 0
  },
  adjustment: {
    x: 0.55,
    y: 0.55,
    z: 0
  },
  scale: 800,
  height: 5
}

const glamping_studio_polidor = {
  class: 'glampingStudio',
  filePath: glampingStudioPolidor,
  rotation: {
    x: 0,
    y: 180,
    z: 0
  },
  adjustment: {
    x: 0.55,
    y: 0.55,
    z: 0
  },
  scale: 800,
  height: 5
}

const glamping_soba_polidor = {
  class: 'glampingRoom',
  filePath: glampingSobaPolidor,
  rotation: {
    x: 0,
    y: 180,
    z: 0
  },
  adjustment: {
    x: 0.55,
    y: 0.55,
    z: 0
  },
  scale: 800,
  height: 5
}

const billboard3D = {
  class: 'billboard',
  filePath: billboard3DModel,
  default: kozlovic,
  rotation: {
    x: 90,
    y: 90,
    z: 0
  },
  adjustment: {
    x: 0.55,
    y: 0.55,
    z: 0
  },
  scale: 0.5,
  height: 5
}

@Component
export default class MapDemoComponent extends Vue {
  private MapFunctions = MapFunctions
  private map: any
  private campsaboutObject: any = null
  private maxPitch = 60
  private models = {
    mhDeluxe: mobile_home_deluxe_polidor,
    mhComfort: mobile_home_comfort_polidor,
    mhPremiumPetFriendly: mobile_home_premium_petfriendly_polidor,
    mhVileSuperior: mobile_home_vila_polidor,
    mhFamilyPetFriendly: mobile_home_vila_superior_polidor,
    glampingTent: glamping_sator_polidor,
    glampingStudio: glamping_studio_polidor,
    glampingRoom: glamping_soba_polidor
  }
  advertisement = [kozlovic, rossi, festi]
  CLASS_COLORS = {
    obala: '#f3f2e7',
    zemlja: '#dedfc4',
    'obala-line': 'transparent',
    cesta: '#e2e6e8',
    vegetacija: '#98b87c',
    parking_podloga: '#e2e6e8',
    'objekt wc roof1': '#f28586',
    bazen_podloga: '#e4e9e8',
    bazen: '#8decfe',
    parcela: '#b2dccb',
    glampingTent: '#444738',
    glampingRoom: '#248390',
    glampingStudio: '#8494e8',
    mhComfort: '#dde870',
    mhDeluxe: '#2b8649',
    mhPremiumPetFriendly: '#ffffff',
    mhPrivate: '#a8b1de',
    mhFamilyPetFriendly: '#39c2ce',
    mhVileSuperior: '#58628d',
    billboard: '#ffffff'
  }

  updatePitchLimit() {
    const zoom = this.campsaboutObject.map.getZoom()

    if (zoom >= 18) {
      this.maxPitch = 70
    } else if (zoom >= 13 && zoom < 18) {
      this.maxPitch = 65
    } else {
      this.maxPitch = 90
    }
    // No pitch limit if zoom level is less than 10
  }

  mounted() {
    const mapCenter = [13.5996718, 45.19148461]
    const maxOffset = 0.005

    this.map = MapFunctions.createMap({
      mapContainerId: "mapContainer",
      center: mapCenter,
      zoom: 17,
      style: null,
      accessToken: null,
      is3d: true,
    })

    if (this.map) {
      this.map.on('load', async () => {
        this.campsaboutObject = {
          map: this.map,
          campGeojson: campGeojson,
          bbox: MapFunctions.createBoundBox(campGeojson.features[0]),
          colors: MapFunctions.matchColorsWithIDs(campGeojson, this.CLASS_COLORS),
          sortedCampGeojson: MapFunctions.sortLayers(campGeojson),
          poiGeojson: pois,
          labelsGeojson: MapFunctions.getEmptyGeojson(),
          is3d: true,
          units3D: this.models,
          billboard3D: billboard3D,
          advertisement: this.advertisement,
        }

        await MapFunctions.initMap(this.campsaboutObject)
        MapFunctions.onClickAllLayers(this.campsaboutObject, (event: any, feature: any) => console.log('Clicked model: ', feature))
        MapFunctions.reCenterMap(this.campsaboutObject, false)

        /* // Functionality moved to initMap
        let adIndex = 0
        let mapMoving = false
        let idleTimeout: any
        this.campsaboutObject.map.on('zoom', this.updatePitchLimit)
        this.campsaboutObject.map.on('move', () => {
          if (this.campsaboutObject.map.getPitch() > this.maxPitch) {
            this.campsaboutObject.map.setPitch(this.maxPitch - 3) // Allow some buffer during move
          }
        })

        this.campsaboutObject.map.on('movestart', () => {
          if (this.campsaboutObject.map.getPitch() > this.maxPitch - 1) {
            this.campsaboutObject.map.setPitch(this.maxPitch - 5) // Enforce strict limit on move end
          }
          mapMoving = true
          clearTimeout(idleTimeout)
        })

        this.campsaboutObject.map.on('moveend', () => {
          if (this.campsaboutObject.map.getPitch() > this.maxPitch - 1) {
            this.campsaboutObject.map.setPitch(this.maxPitch - 5) // Enforce strict limit on move end
          }
          mapMoving = false
          idleTimeout = setTimeout(() => {
            if (!mapMoving) {
              MapFunctions.color3DBillboard(this.campsaboutObject.map, this.advertisement[adIndex])
              adIndex = (adIndex + 1) % this.advertisement.length
            }
          }, 5000) // 5 seconds

          const currentCenter = this.campsaboutObject.map.getCenter()
          const distanceFromMap = MapFunctions.distanceFromMap(currentCenter, this.campsaboutObject)
          if (distanceFromMap > maxOffset) {
            MapFunctions.reCenterMap(this.campsaboutObject, false, true, true)
          }
        })

        setInterval(() => {
          if (!mapMoving) {
            MapFunctions.color3DBillboard(this.campsaboutObject.map, this.advertisement[adIndex])
            adIndex = (adIndex + 1) % this.advertisement.length
          }
        }, 5000) // 5 seconds
        */
      })
    }
  }
}
</script>

<style></style>
