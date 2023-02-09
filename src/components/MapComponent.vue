<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 p-0">
        <div id="map" style="height: 75vh"/>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import http from '@/http-common'

export default class MapComponent extends Vue {
  longitude = 0
  latitude = 0
  trigger!: boolean
  indexMode = false
  map!: any
  entities: any
  mounted () {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoiam9zbyIsImEiOiJjbDBpN3NnbWMwMDJlM2ptcng2bGIxazJjIn0.xuMyew046jayaAFfWnsfJQ'
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10'
    })
    this.test()
  }

  async test () {
    const response = await http.get(process.env.VUE_APP_BASE_URL + 'map')
    this.entities = response.data.data
    this.generateMap()
  }

  generateMap () {
    this.map.on('load', () => {
      this.map.addSource('entities', {
        type: 'geojson',
        data: this.entities,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      })
      this.map.addLayer({
        id: 'clusters',
        source: 'entities',
        type: 'circle',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      })
      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'entities',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      })
      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'entities',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      })
      this.map.on('click', 'clusters', (e: any) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        })
        const clusterId = features[0].properties.cluster_id
        this.map.getSource('entities').getClusterExpansionZoom(
          clusterId,
          (err: any, zoom: any) => {
            if (err) return
            this.map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            })
          }
        )
      })
      this.map.on('click', 'unclustered-point', (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice()
        const id = e.features[0].properties.id
        const code = e.features[0].properties.code
        // Find all the devices with the same coordinates
        const devicesWithSameCoordinates = this.entities.features.filter((device: { geometry: { coordinates: any[] } }) => {
          return device.geometry.coordinates[0] === coordinates[0] && device.geometry
            .coordinates[1] === coordinates[1]
        })
        const popup = new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat(coordinates)
          .setHTML(`<p>Code: ${code}</p><br><button class="btn btn-secondary btn-sm open-popup" >Open</button><br><p>Devices with same coordinates: ${devicesWithSameCoordinates.length}</p>`)
        popup.addTo(this.map)
        const btn = document.getElementsByClassName('open-popup')[0]
        btn.addEventListener('click', () => {
          this.$router.push({ name: 'DeviceEdit', params: { id: id } })
        })
      })
    })
    if (this.entities.features.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      for (const element of this.entities.features) {
        bounds.extend(element.geometry.coordinates)
      }
      this.map.fitBounds(bounds, {
        padding: 20,
        maxZoom: 5
      })
    }
  }
}

</script>
<style scoped>

</style>
