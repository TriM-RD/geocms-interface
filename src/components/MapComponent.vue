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
import { Vue } from 'vue-class-component'
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
  relData= []
  currentPopup: mapboxgl.Popup | null = null
  dashArraySequence = [
    [0, 4, 3],
    [0.5, 4, 2.5],
    [1, 4, 2],
    [1.5, 4, 1.5],
    [2, 4, 1],
    [2.5, 4, 0.5],
    [3, 4, 0],
    [0, 0.5, 3, 3.5],
    [0, 1, 3, 3],
    [0, 1.5, 3, 2.5],
    [0, 2, 3, 2],
    [0, 2.5, 3, 1.5],
    [0, 3, 3, 1],
    [0, 3.5, 3, 0.5]
  ];

  step = 0;

  mounted () {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoiam9zbyIsImEiOiJjbDBpN3NnbWMwMDJlM2ptcng2bGIxazJjIn0.xuMyew046jayaAFfWnsfJQ'
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/joso/clfv7rrii007101rpc2dhq56h/draft'
    })
    this.test()
  }

  async test () {
    const response = await http.get(process.env.VUE_APP_BASE_URL + 'map')
    this.entities = response.data.data
    this.generateMap()
  }

  async updateMapData (id: string) {
    const response = await http.get(process.env.VUE_APP_BASE_URL + 'maprelation/' + id)
    this.relData = response.data
    // Update the arrows with the relationship data
    await this.connectUnclusteredPoints(this.relData)
  }

  testingRadius (point: mapboxgl.MapboxGeoJSONFeature) {
    const features = this.map.querySourceFeatures('entities', {
      filter: ['has', 'point_count']
    })

    // find the closest feature to the point
    let closestFeature: any
    let minDistance = Infinity
    // eslint-disable-next-line camelcase
    for (const feature of features) {
      const pointCoordinates = point.geometry.type === 'Point' ? point.geometry.coordinates : undefined
      const center = feature.geometry.coordinates
      if (pointCoordinates) {
        const distance = new mapboxgl.LngLat(center[0], center[1]).distanceTo(new mapboxgl.LngLat(pointCoordinates[0], pointCoordinates[1]))
        if (distance < minDistance) {
          minDistance = distance
          closestFeature = feature
        }
      }
    }

    // calculate the cluster radius based on the size of the closest feature
    return minDistance / Math.sqrt(closestFeature.properties.point_count)
  }

  isPointInCluster (point: mapboxgl.MapboxGeoJSONFeature): boolean {
    const clusters = this.map.querySourceFeatures('entities', {
      filter: ['has', 'point_count']
    })

    for (const cluster of clusters) {
      const center = cluster.geometry.coordinates
      const pointCoordinates = point.geometry.type === 'Point' ? point.geometry.coordinates : undefined
      if (pointCoordinates) {
        const distance = new mapboxgl.LngLat(center[0], center[1]).distanceTo(new mapboxgl.LngLat(pointCoordinates[0], pointCoordinates[1]))
        if (distance > this.testingRadius(point)) {
          return true
        }
      }
    }

    return false
  }

  animateDashArray (timestamp: number) {
    const speed = 50
    const newStep = Math.floor((timestamp / speed) % this.dashArraySequence.length)

    if (newStep !== this.step) {
      this.map.setPaintProperty('arrow-layer-dashed', 'line-dasharray', this.dashArraySequence[this.step])
      this.step = newStep
    }

    requestAnimationFrame(this.animateDashArray.bind(this))
  }

  addArrowLayer (linesGeoJSON: any) {
    // Remove existing 'arrows' source and layers if they exist
    if (this.map.getSource('arrows')) {
      this.map.removeLayer('arrow-layer-background')
      this.map.removeLayer('arrow-layer-dashed')
      this.map.removeSource('arrows')
    }
    this.map.addSource('arrows', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: linesGeoJSON
      }
    })
    // Add a line layer without line-dasharray defined to fill the gaps in the dashed line
    this.map.addLayer({
      id: 'arrow-layer-background',
      type: 'line',
      source: 'arrows',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ffff00',
        'line-width': 3,
        'line-opacity': 0.4
      }
    }, 'icon-points')

    // Add a line layer with line-dasharray set to the first value in dashArraySequence
    this.map.addLayer({
      id: 'arrow-layer-dashed',
      type: 'line',
      source: 'arrows',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ffff00',
        'line-width': 3,
        'line-dasharray': [0, 4, 3]
      }
    }, 'icon-points')
  }

  async connectUnclusteredPoints (relationshipData: any[]): Promise<void> {
    // Obtain unclustered points from the 'icon-points' layer
    const unclusteredPoints = this.entities.features

    // Create a new array to store the LineString GeoJSON objects that should be added to the map
    const linesGeoJSON: any[] = []
    const allIds: any[] = []

    // Iterate over the relationship data and check if any of the points are within a cluster
    for (const [end, start] of Object.entries(relationshipData)) {
      if (start === null) continue

      const startFeature = unclusteredPoints.find((point: { properties: { id: any } }) => point.properties.id === start)
      const endFeature = unclusteredPoints.find((point: { properties: { id: any } }) => point.properties.id === end)

      // Check if any of the points are within a cluster
      if (this.isPointInCluster(startFeature) || this.isPointInCluster(endFeature)) {
        // If either point is in a cluster, do not create the LineString and continue to the next relationship
        continue
      }

      if (endFeature === undefined) { continue }
      /* this.map.setFeatureState({ source: 'entities', id: endFeature.id }, { change_opacity: true })
      console.log(this.map.getFeatureState({ source: 'entities', id: endFeature.id })) */
      allIds.push(endFeature.id)

      const startCoordinates = startFeature.geometry.coordinates
      const endCoordinates = endFeature.geometry.coordinates

      // Create the LineString GeoJSON object and add it to the array
      const lineGeoJSON = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [startCoordinates, endCoordinates]
        }
      }

      linesGeoJSON.push(lineGeoJSON)
    }

    this.addArrowLayer(linesGeoJSON)
    this.map.setPaintProperty('icon-points', 'icon-opacity', [
      'case',
      ['in', ['get', 'id'], ['literal', allIds]],
      1,
      ['!=', ['get', 'iconType'], 'ico-sro'],
      0.1,
      1
    ])
  }

  generateMap (mapUpdated = false) {
    if (!mapUpdated) {
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
        id: 'icon-points',
        type: 'symbol',
        source: 'entities', // Change this line
        filter: ['all', ['!', ['has', 'point_count']], ['has', 'iconType']],
        layout: {
          'icon-image': ['get', 'iconType'],
          'icon-allow-overlap': true,
          'icon-size': 0.6,
          'symbol-sort-key': [
            'case',
            ['==', ['get', 'iconType'], 'ico-sro'],
            9,
            0
          ]
        },
        paint: {
          'icon-opacity': [
            'case',
            ['boolean', ['feature-state', 'change_opacity'], false],
            1,
            ['!=', ['get', 'iconType'], 'ico-sro'],
            0.1,
            1
          ]
        }
      })

      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'entities', // Change this line
        filter: ['all', ['!', ['has', 'point_count']], ['!', ['has', 'iconType']]],
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
      this.map.on('click', 'icon-points', async (e: any) => {
        if (this.currentPopup) {
          this.currentPopup.remove()
        }
        const coordinates = e.features[0].geometry.coordinates.slice()
        const id = e.features[0].properties.id
        const code = e.features[0].properties.code

        // Update the map with new data
        await this.updateMapData(id)

        // Rest of the code
        const devicesWithSameCoordinates = this.entities.features.filter((device: { geometry: { coordinates: any[] } }) => {
          return device.geometry.coordinates[0] === coordinates[0] && device.geometry
            .coordinates[1] === coordinates[1]
        })
        const popup = new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat(coordinates)
          .setHTML(`<p>Code: ${code}</p><br><button class="btn btn-secondary btn-sm open-popup" >Open</button><br><p>Devices with same coordinates: ${devicesWithSameCoordinates.length}</p>`)
        popup.addTo(this.map)
        this.currentPopup = popup
        const btn = document.getElementsByClassName('open-popup')[0]
        btn.addEventListener('click', () => {
          this.$router.push({ name: 'DeviceEdit', params: { id: id } })
        })
      })

      this.map.on('click', 'unclustered-point', async (e: any) => {
        if (this.currentPopup) {
          this.currentPopup.remove()
        }
        const coordinates = e.features[0].geometry.coordinates.slice()
        const id = e.features[0].properties.id
        const code = e.features[0].properties.code

        // Update the map with new data
        await this.updateMapData(id)

        // Rest of the code
        const devicesWithSameCoordinates = this.entities.features.filter((device: { geometry: { coordinates: any[] } }) => {
          return device.geometry.coordinates[0] === coordinates[0] && device.geometry
            .coordinates[1] === coordinates[1]
        })
        const popup = new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat(coordinates)
          .setHTML(`<p>Code: ${code}</p><br><button class="btn btn-secondary btn-sm open-popup" >Open</button><br><p>Devices with same coordinates: ${devicesWithSameCoordinates.length}</p>`)
        popup.addTo(this.map)
        this.currentPopup = popup
        const btn = document.getElementsByClassName('open-popup')[0]
        btn.addEventListener('click', () => {
          this.$router.push({ name: 'DeviceEdit', params: { id: id } })
        })
      })
      this.map.on('move', () => {
        this.connectUnclusteredPoints(this.relData)
      })
    }
    if (this.entities.features.length > 0) {
      if (!mapUpdated) {
        const bounds = new mapboxgl.LngLatBounds()
        for (const element of this.entities.features) {
          bounds.extend(element.geometry.coordinates)
        }
        this.map.fitBounds(bounds, {
          padding: 20,
          maxZoom: 5
        })
      }

      this.animateDashArray(0)
    }
  }
}

</script>
<style scoped>

</style>
