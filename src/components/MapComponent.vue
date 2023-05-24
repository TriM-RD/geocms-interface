<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 p-0 position-relative">
        <div class="device-code-input">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <transition name="shake">
              <input list="device-codes" :disabled="renderComponent" :value="deviceCode" @input="deviceCode = $event.target.value" :class="{'is-invalid': error, 'form-control shake': error, 'form-control': !error}" placeholder="Enter device code..." @change="zoomToDevice"/>
            </transition>
            <button class="btn btn-primary" type="button" @click="zoomToDevice">Search</button>
            <datalist id="device-codes" v-if="deviceCode.length >= 2 && !renderComponent">
              <option v-for="feature in entities.features" :value="feature.properties.code" :key="feature.properties.code"></option>
            </datalist>
            <div class="invalid-feedback">
              Device not found
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 p-0 position-relative">
        <div class="map-container" style="height: 75vh; position: relative;">
          <div class="map-legend position-absolute top-0 start-0 bg-white" style="z-index: 1; max-width: 200px;">
            <div class="list-group">
              <label class="list-group-item rounded-0 d-flex align-items-center" v-for="iconType in iconTypes" :key="iconType">
                <div class="d-flex align-items-center">
                  <input :disabled="renderComponent" class="form-check-input me-2 checkbox-lg" type="checkbox" :value="iconType" v-model="checkedIconTypes" @change="updateSymbolVisibility" :id="iconType" checked>
                  <img class="mt-1" :src="getIconPath(iconType)" :alt="iconType" style="height: 24px; width: 24px;">
                </div>
                <div class="d-none d-sm-block ms-1" style="text-transform: uppercase;">{{iconType}}</div>
              </label>
            </div>
          </div>
          <Loading v-model:active="renderComponent"
                   :can-cancel="false"
                   :is-full-page="false"
                   style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"/>
          <div id="map" style="height: 100%; width: 100%;"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import http from '@/http-common'
import Loading from 'vue-loading-overlay'
import { StatTypeEnum } from '@cybertale/interface'
import { Modal } from 'bootstrap'
@Options({
  components: {
    Loading
  }
})

export default class MapComponent extends Vue {
  longitude = 0
  latitude = 0
  trigger!: boolean
  indexMode = false
  map!: any
  entities: any
  relData= []
  currentPopup: mapboxgl.Popup | null = null
  renderComponent= true
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
  checkedIconTypes: string[] = ['ico-lamp', 'ico-sro', 'ico-ssro', 'struja-idle']
  iconTypes: string[] = ['ico-lamp', 'ico-sro', 'ico-ssro', 'struja-idle']
  deviceCode = ''
  error = false

  getIconPath (iconType: string) {
    return require('@/assets/map_files/' + iconType + '.svg')
  }

  mounted () {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoiam9zbyIsImEiOiJjbDBpN3NnbWMwMDJlM2ptcng2bGIxazJjIn0.xuMyew046jayaAFfWnsfJQ'
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/joso/clfv7rrii007101rpc2dhq56h/draft'
    })
    this.test()
  }

  async zoomToDevice () : Promise<void> {
    // Your method to fetch the device data should go here, this is just a placeholder
    const featureWithCode = this.entities.features.find((feature: any) => {
      // Replace 'codeProperty' with the actual property name that contains the code in your feature object
      const code = feature.properties.code
      return code === this.deviceCode
    })
    if (featureWithCode) {
      // Then you could zoom to the device location like this
      this.map.flyTo({
        center: [featureWithCode.geometry.coordinates[0], featureWithCode.geometry.coordinates[1]],
        zoom: 18 // Set the zoom level to your preference
      })

      const allIds = [featureWithCode.properties.id]
      const iconSize = [
        'interpolate',
        ['linear'],
        ['zoom'],
        16, [
          'case',
          ['in', ['get', 'id'], ['literal', allIds]], 0.4,
          ['==', ['get', 'iconType'], 'struja-idle'], 0.6,
          ['==', ['get', 'iconType'], 'ico-sro'], 0.6,
          0.3
        ],
        17, [
          'case',
          ['in', ['get', 'id'], ['literal', allIds]], 0.6,
          ['==', ['get', 'iconType'], 'struja-idle'], 0.6,
          ['==', ['get', 'iconType'], 'ico-sro'], 0.6,
          0.3
        ],
        18, [
          'case',
          ['in', ['get', 'id'], ['literal', allIds]], 0.8,
          ['==', ['get', 'iconType'], 'struja-idle'], 0.6,
          ['==', ['get', 'iconType'], 'ico-sro'], 0.6,
          0.3
        ]
      ]

      const iconOpacity = [
        'case',
        ['in', ['get', 'id'], ['literal', allIds]],
        1,
        ['all', ['!=', ['get', 'iconType'], 'ico-sro'], ['!=', ['get', 'iconType'], 'struja-idle']],
        0.1,
        1
      ]

      this.map.setLayoutProperty('icon-points', 'icon-size', iconSize)
      this.map.setPaintProperty('icon-points', 'icon-opacity', iconOpacity)

      this.map.addSource('single-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })
      this.map.getSource('single-point').setData(featureWithCode)

      // Initialize an index for cycling through the colors
      let colorIndex = 0

      // Define your colors
      const colors = ['blue', 'lightblue']

      // Set initial color and add the layer
      this.map.addLayer({
        id: 'circle-overlay',
        type: 'circle',
        source: 'single-point',
        paint: {
          'circle-radius': 30,
          'circle-color': colors[colorIndex],
          'circle-opacity': 0.5
        }
      })

      // Create a function to update the color
      const updateColor = () => {
        // Update the color
        this.map.setPaintProperty('circle-overlay', 'circle-color', colors[colorIndex])

        // Update the index for the next color
        colorIndex = (colorIndex + 1) % colors.length
      }

      // Call the function every 500 milliseconds (0.5 seconds)
      const intervalId = setInterval(updateColor, 500)

      // Clear the interval after 10 seconds
      setTimeout(() => {
        clearInterval(intervalId)

        // Remove the circle layer
        this.map.removeLayer('circle-overlay')
        this.map.removeSource('single-point')
      }, 30000)

      this.error = false
    } else {
      this.error = true
    }
  }

  updateSymbolVisibility () : void {
    if (this.checkedIconTypes.includes('ico-lamp')) {
      this.map.setLayoutProperty('clusters', 'visibility', 'visible')
      this.map.setLayoutProperty('cluster-count', 'visibility', 'visible')
    } else {
      this.map.setLayoutProperty('clusters', 'visibility', 'none')
      this.map.setLayoutProperty('cluster-count', 'visibility', 'none')
    }
    this.map.setFilter('icon-points', ['in', 'iconType', ...this.checkedIconTypes])
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
    this.animateDashArray(0)
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
      allIds.push(endFeature.properties.id)

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
    const iconSize = [
      'interpolate',
      ['linear'],
      ['zoom'],
      16, [
        'case',
        ['in', ['get', 'id'], ['literal', allIds]], 0.2,
        ['==', ['get', 'iconType'], 'struja-idle'], 0.6,
        ['==', ['get', 'iconType'], 'ico-sro'], 0.6,
        0.3
      ],
      17, [
        'case',
        ['in', ['get', 'id'], ['literal', allIds]], 0.4,
        ['==', ['get', 'iconType'], 'struja-idle'], 0.6,
        ['==', ['get', 'iconType'], 'ico-sro'], 0.6,
        0.3
      ],
      18, [
        'case',
        ['in', ['get', 'id'], ['literal', allIds]], 0.6,
        ['==', ['get', 'iconType'], 'struja-idle'], 0.6,
        ['==', ['get', 'iconType'], 'ico-sro'], 0.6,
        0.3
      ]
    ]

    const iconOpacity = [
      'case',
      ['in', ['get', 'id'], ['literal', allIds]],
      1,
      ['all', ['!=', ['get', 'iconType'], 'ico-sro'], ['!=', ['get', 'iconType'], 'struja-idle']],
      0.1,
      1
    ]
    this.map.setLayoutProperty('icon-points', 'icon-size', iconSize)
    this.map.setPaintProperty('icon-points', 'icon-opacity', iconOpacity)
  }

  generateMap (mapUpdated = false, cluster = true) {
    if (!mapUpdated) {
      this.map.addSource('entities', {
        type: 'geojson',
        data: this.entities,
        cluster: cluster,
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
          'icon-size': [
            'case',
            ['==', ['get', 'iconType'], 'ico-sro'],
            0.6,
            ['==', ['get', 'iconType'], 'struja-idle'],
            0.6,
            0.3
          ],
          'symbol-sort-key': [
            'case',
            ['==', ['get', 'iconType'], 'ico-sro'],
            9,
            ['==', ['get', 'iconType'], 'struja-idle'],
            9,
            0
          ]
        },
        paint: {
          'icon-opacity': [
            'case',
            ['boolean', ['feature-state', 'change_opacity'], false],
            1,
            ['all', ['!=', ['get', 'iconType'], 'ico-sro'], ['!=', ['get', 'iconType'], 'struja-idle']],
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
        const precision = 1000000
        // Rest of the code
        const devicesWithSameCoordinates = this.entities.features.filter((device: { id: string, geometry: { coordinates: any[] }, properties : { iconType: string, code: string } }) => {
          return device.id === id ||
            (
              Math.round(parseFloat(device.geometry.coordinates[0]) * precision) === Math.round(parseFloat(coordinates[0]) * precision) &&
              Math.round(parseFloat(device.geometry.coordinates[1]) * precision) === Math.round(parseFloat(coordinates[1]) * precision)
            )
        }).map((device: { properties: { iconType: string, code: string, id: string } }) => {
          return {
            code: device.properties.code,
            iconType: device.properties.iconType,
            id: device.properties.id
          }
        })
        let additionalButtons = '<div class="list-group">'
        for (const device of devicesWithSameCoordinates) {
          if (device.iconType === 'struja-idle') {
            additionalButtons += `<button class="list-group-item list-group-item-action controller-ncv-button btn-outline-secondary btn-sm btn-fixed text-truncate w-100 small-font" title="View ormar ${device.code}" data-devicecode="${device.code}" style="width: 120px;">View ormar ${device.code}</button>`
          }
          additionalButtons += `<button class="list-group-item list-group-item-action additional-button btn-outline-secondary btn-sm btn-fixed text-truncate w-100 small-font" title="Open ${device.code}" data-deviceid="${device.id}" data-devicecode="${device.code}" style="width: 120px;">Open ${device.code}</button>`
        }
        additionalButtons += '</div>'

        const popup = new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat(coordinates)
          .setHTML(`<div class="d-flex flex-column h-100">
      <p class="small-font">Code: ${code}</p>
      ${additionalButtons}
      <p class="small-font mt-3 mb-0">Devices with same coordinates: ${devicesWithSameCoordinates.length}</p>
    </div>`)
        popup.addTo(this.map)
        this.currentPopup = popup

        const ncvBtns = document.getElementsByClassName('controller-ncv-button')
        Array.from(ncvBtns).forEach(btn => {
          btn.addEventListener('click', () => {
            const deviceCode = btn.getAttribute('data-devicecode')
            const iframe = document.getElementById('yourIframeId') as HTMLIFrameElement
            if (iframe !== null) {
              if (iframe.contentWindow !== null) {
                iframe.contentWindow.postMessage({ command: 'openModalOrmar', code: deviceCode }, '*')
              }
            }
            const myModalElement = document.getElementById('myModal')
            if (myModalElement !== null) {
              const myModal = new Modal(myModalElement, {})
              myModal.show()
            }
          })
        })

        const additionalBtns = document.getElementsByClassName('additional-button')
        Array.from(additionalBtns).forEach(btn => {
          btn.addEventListener('click', () => {
            const deviceId = btn.getAttribute('data-deviceid')
            console.log(deviceId)
            if (deviceId) { this.$router.push({ name: 'DeviceEdit', params: { id: deviceId } }) }
          })
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
      /* this.map.on('move', () => {
        this.animateDashArray(0)
      }) */
      this.map.on('zoomend', () => {
        this.handleZoomChange()
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
      // this.animateDashArray(0)
      this.renderComponent = false
    }
  }

  async handleZoomChange (): Promise<void> {
    const zoomLevel = this.map.getZoom()

    // Adjust the value 14 to the desired zoom level for clustered points to appear
    if (zoomLevel <= 16) {
      await this.connectUnclusteredPoints(this.relData)
    }
  }
}

</script>
<style scoped>
.small-font {
  font-size: 0.7rem;  /* Adjust as needed */
}
.checkbox-lg {
  transform: scale(1.5);
  margin-right: 10px;
  cursor: pointer;
}

.shake {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

</style>
