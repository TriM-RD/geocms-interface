<template>
  <div id="mapContainer"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator'
import { MapFunctions, NavFunctions } from '../../../npm/campsabout-mapbox'
import { useStoreColors } from '@/stores/storeColors'
import { useStoreAvailability } from '@/stores/storeAvailability'
import { useStoreApiFeatures } from '@/stores/storeApiFeatures'
import { useStoreLocation } from '@/stores/storeLocation'
import { useStoreUnitTypes } from '@/stores/storeUnitTypes'
import { useStoreMapFunctions } from '@/stores/storeMapFunctions'
import { useStorePoisGroups } from '@/stores/storePoisGroups'
import { useStoreMessageBox } from '@/stores/storeMessageBox'
import { useStoreSettings } from '@/stores/storeSettings'
import { useStorePoisLabels } from '@/stores/storePoisLabels'
import { useStorePois } from '@/stores/storePois'
import http from '@/http-common'
import * as turf from '@turf/turf'
import { useStoreTranslations, $t } from '@/stores/storeTranslations'
import { useStoreHistory } from '@/stores/storeHistory'
import { useStoreDirections } from '@/stores/storeDirections'
import { type ColorItem, type DataItem, useStoreLegend } from '@/stores/storeLegend'
let campsaboutObject: any = null
@Component
export default class MapComponent extends Vue {
  @Prop({ required: true }) readonly runMapInit!: () => Promise<void>
  private map: any
  campsaboutObject: any = null
  private models: { [index: string]: any } = {}
  private advertisement: any[] = []
  private campGeojson = MapFunctions.getEmptyGeojson()
  private pois = MapFunctions.getEmptyGeojson()
  private labelsGeojson = MapFunctions.getEmptyGeojson()
  private storeColors = useStoreColors()
  private locationStore = useStoreLocation()
  private mapFunctions = useStoreMapFunctions()
  private mapSettingsStore = useStoreSettings()
  private featuresStore = useStoreApiFeatures()
  private loaded = false
  private initialMapSettings: { [index: string]: any } = {}
  private poiLabels: { [index: string]: any } = {}
  private groupName: string
  private propertyId: number
  private featureData: {}
  private poisGroups = useStorePoisGroups()
  private poisLabelsStore = useStorePoisLabels()
  private poisStore = useStorePois()
  private AvailabilityStore = useStoreAvailability()
  private watchPositionId!: number
  private setupLocationFlag = true
  private MessageBox = useStoreMessageBox()
  private TranslationsStore = useStoreTranslations()
  private HistoryStore = useStoreHistory()
  private clickableIds: any = { openModal: {}, openPopup: {} }
  private numberArr: any = {}
  private onlyOnceGeolocateFlag = true
  isRotating = false

  private initializeCampsaboutObject() {
    campsaboutObject = {
      map: this.map,
      campGeojson: this.campGeojson,
      colors: MapFunctions.matchColorsWithIDs(this.campGeojson, this.storeColors.getColors),
      sortedCampGeojson: MapFunctions.sortLayers(this.campGeojson),
      labelsGeojson: this.labelsGeojson,
      is3d: this.initialMapSettings.is3d,
      units3D: this.models,
      billboard3D: null,
      advertisement: this.advertisement,
      geolocate: null,
      directions: null,
      poly: null,
      language: useStoreTranslations().currentLanguage,
      onRouteChangeDel: null,
      clickableIds: this.clickableIds,
      numberArr: this.numberArr
    }
    campsaboutObject.sortedCampGeojson.poi = this.pois
    campsaboutObject.bbox = MapFunctions.createBoundBox(campsaboutObject, ['0'])
  }

  //{13.602281590199624,45.18697216235387}
  private async setupMapEventListeners() {
    //TODO rework so that it is not based on source
    await MapFunctions.onClickAllLayers(campsaboutObject, (event: any, feature: any) => {
      if (this.$router.currentRoute.value.name === 'poiNavigationPreview' || this.$router.currentRoute.value.name === 'poiNavigationRun' || this.$router.currentRoute.value.name === 'navigationPreview' || this.$router.currentRoute.value.name === 'navigationRun') {
        return
      }
      const noGps = window.localStorage.getItem('noGps')?.toLowerCase() === 'true'
      const coordinates = event?.lngLat
      console.log(`{${coordinates.lng},${coordinates.lat}}`)
      console.log(feature.properties)
      if (feature.source === 'poi-source') {
        const classes = feature?.properties?.class?.split(' ')
        console.log(classes)
        if (this.clickableIds.openModal[feature.properties.id]) {
          this.$router.push({ name: 'unitId', params: { id: feature.properties.id } })
        } else if (this.clickableIds.openPopup[feature.properties.id]) {
          if (campsaboutObject?.map) {
            MapFunctions.openPopup(event, feature, campsaboutObject, $t, this.goBackHome.bind(this), this.navigateTo.bind(this), noGps)
            this.$router.push({ name: 'poiId', params: { id: feature.properties.id } })
          }
        }
      }
      // General clickableIds check for any source (not just 'poi-source')
      console.log(feature.source)
      if (this.clickableIds.openModal[feature.properties.id] && (feature.source === 'camp-fill-source' || feature.source === 'camp-fill-centroid-source' || feature.source === 'label-source')) {
        this.$router.push({ name: 'unitId', params: { id: feature.properties.id } })
      } else if (this.clickableIds.openPopup[feature.properties.id] && (feature.source === 'camp-fill-source' || feature.source === 'camp-fill-source' || feature.source === 'camp-fill-centroid-source' || feature.source === 'label-source')) {
        feature.properties.icon = useStoreLegend().getLegendData.find((item) => item.label === feature.properties.class).title
        MapFunctions.openPopup(event, feature, campsaboutObject, $t, this.goBackHome.bind(this), this.navigateTo.bind(this), noGps)
        this.$router.push({ name: 'poiId', params: { id: feature.properties.id } })
      }
    })
  }

  goBackHome() {
    if (this.$router.currentRoute.value.name === 'poiNavigationPreview' || this.$router.currentRoute.value.name === 'poiNavigationRun' || this.$router.currentRoute.value.name === 'navigationPreview' || this.$router.currentRoute.value.name === 'navigationRun') {
      return
    }
    this.$router.push({ name: 'map' })
  }

  navigateTo() {
    this.$router.push({ name: 'poiNavigationPreview' })
  }

  rotateMap(bearing, point) {
    const { latitude, longitude } = point.coords
    campsaboutObject.map.easeTo({
      center: [longitude, latitude], // Center the map on the user's current position
      bearing: bearing || 0, // Rotate based on heading
      zoom: 18, // Close zoom level
      duration: 4000, // Smooth transition speed
      easing: (t: number) => 1 - Math.pow(1 - t, 4) // Linear easing
    })
  }

  private loadMap(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.map) return reject('Map is not defined')

      this.map.on('load', async () => {
        this.initializeCampsaboutObject()
        await MapFunctions.initMap(campsaboutObject)
        await this.setupMapEventListeners()
        if (window.localStorage.getItem('noGps')?.toLocaleLowerCase() == 'true') {
          await MapFunctions.reCenterMap(campsaboutObject) //TODO check which is better user experience
        }
        resolve()
      })
    })
  }

  private handlePositionUpdate(position: GeolocationPosition) {
    this.locationStore.set({ lat: position.coords.latitude, lng: position.coords.longitude })
  }

  private handleLocationError(error: GeolocationPositionError) {
    if (error.code != 1) return console.error('Error getting location: ', error)

    //Error code 1 means user blocked permission, ask for it again
    navigator.geolocation.clearWatch(this.watchPositionId)
    if (window.localStorage.getItem('noGps')?.toLocaleLowerCase() == 'false') window.localStorage.setItem('noGps', 'ask')
  }

  @Watch('$route.query.groupName', { immediate: true })
  onGroupNameChange(newGroupName: string | undefined, groupName: string | undefined) {
    if (!this.loaded || !newGroupName) return
    this.mapSettingsStore.set(true, true, false, newGroupName)
  }

  @Watch('$route.query.mapId', { immediate: true })
  onMapIdChanged(newMapId: string | undefined, oldMapId: string | undefined) {
    if (!this.loaded || !newMapId) return
    console.log(this.HistoryStore.getPrevious?.split('?'))
    if (this.HistoryStore.getPrevious?.split('?')[0].includes('/search')) return this.zoomToFeature(newMapId)

    this.MessageBox.setData({
      message: $t('Zoom in?'),
      title: $t('Zoom in title'),
      showDeclineButton: true,
      onAccept: () => this.zoomToFeature(newMapId)
    })
    this.$router.push({
      name: 'dialog',
      query: {
        mapId: this.$route.query.mapId
      }
    })
  }

  zoomToFeature(newMapId: string) {
    MapFunctions.highlightFeature(campsaboutObject, [newMapId], true)
    MapFunctions.reCenterMap(Object.assign({}, campsaboutObject, { bbox: MapFunctions.createBoundBox(campsaboutObject, [newMapId]) }))
  }

  private async fetchData() {
    const apiCalls = [
      await this.runMapInit(), //TODO refactor, transfer all to some third file
      this.callApi(`https://campsabout.com/mapAPI/revision/brand.php?id=${this.mapSettingsStore.get('propertyId')}&group=${this.mapSettingsStore.get('groupName')}`).then((data) => {
        useStoreUnitTypes().setData(data)
        for (const unitType of Object.values(data)) {
          const typedUnit = unitType as DataItem
          const colorItem: ColorItem = {
            color: typedUnit.color,
            title: typedUnit.naziv,
            label: typedUnit.oznaka,
            category: typedUnit.category
          }
          useStoreLegend().appendColorItem(colorItem)
        }
      }),
      this.callApi(`https://campsabout.com/camp/${this.mapSettingsStore.get('groupName')}/${this.mapSettingsStore.get('propertyId')}/assets/gj/${this.mapSettingsStore.get('mapPath')}.json`).then((data) => (this.campGeojson = data)),
      this.callApi(`https://campsabout.com/mapAPI/revision/pois.php?id=${this.mapSettingsStore.get('propertyId')}&group=${this.mapSettingsStore.get('groupName')}`).then((data) => {
        this.pois = data
        this.poisStore.set(data)
        console.log(data)
        data.features.forEach((feature) => {
          const classes = feature?.properties?.class?.split(' ')
          if (feature?.properties?.openModal || classes.includes['noClick']) {
            this.clickableIds.openModal[feature.properties.id] = true
          } else {
            this.clickableIds.openPopup[feature.properties.id] = true
          }
        })
      }),
      this.callApi(`https://campsabout.com/mapAPI/natpisi.php?id=${this.mapSettingsStore.get('propertyId')}&group=${this.mapSettingsStore.get('groupName')}`).then((data) => (this.labelsGeojson = data)),
      this.callApi(`https://campsabout.com/mapAPI/revision/getFeatures.php?propertyId=${this.mapSettingsStore.get('propertyId')}&group=${this.mapSettingsStore.get('groupName')}&mapaids=*`).then((data) => {
        const filteredData = data.filter((item: any) => item.noClick != 1)
        useStoreApiFeatures().set(filteredData)
        this.numberArr = {}
        data.forEach((feature) => {
          if (!feature.noClick) {
            if (feature.openModal) {
              this.clickableIds.openModal[feature.mapId] = true
            } else {
              this.clickableIds.openPopup[feature.mapId] = true
            }
          }
        })
        console.log(this.clickableIds)
        data.forEach((feature) => {
          if (feature.number) {
            this.numberArr[feature.mapId] = feature.number
          }
        })
      }),
      this.callApi(`https://campsabout.com/mapAPI/poilabels.php?group=${this.mapSettingsStore.get('groupName')}`).then((data) => {
        this.poisLabelsStore.set(data)
        this.poiLabels = data
      }),
      this.callApi(`https://campsabout.com/mapAPI/poisgrouprev.php?id=${this.mapSettingsStore.get('propertyId')}&group=${this.mapSettingsStore.get('groupName')}`).then((data) => {
        this.poisGroups.set(data)
      }),
      this.callApi(`https://campsabout.com/mapAPI/params.php?id=${this.mapSettingsStore.get('propertyId')}&group=${this.mapSettingsStore.get('groupName')}`).then((data) => this.mapSettingsStore.setOldMapParameters(data)),
      this.callApi(`https://campsabout.com/mapAPI/revision/settings.php?id=${this.mapSettingsStore.get('propertyId')}&group=${this.mapSettingsStore.get('groupName')}`).then((data) => {
        this.mapSettingsStore.setOldMapSettings(data)
        document.title = this.mapSettingsStore.oldMapSettings.naziv
      })
      //this.callApi(`https://campsabout.com/cms/api/v2/translations?group=${this.mapSettingsStore.get('groupName')}`).then((data) => this.TranslationsStore.setTranslations(data))
    ]
    return Promise.all(apiCalls)
  }

  private async callApi(url: string) {
    if (!url) return null
    try {
      const response = await http.get(url)
      if (response.status === 200) {
        return response.data
      }
      console.error(`Error: Received status code ${response.status} from ${url}`)
      return null
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error)
      return null
    }
  }

  private setupInitialMapSettings() {
    this.initialMapSettings = {
      center: useStoreSettings().initialRecenter,
      zoom: 17,
      style: useStoreSettings().mapboxStyle,
      accessToken: useStoreSettings().mapboxAccessToken,
      is3d: false,
      mapContainerId: 'mapContainer'
    }
  }

  highlightFeatures(featureIds: [string]) {
    MapFunctions.highlightFeature(campsaboutObject, featureIds, false) //TODO Napraviti da se salju samo id-jevi
  }

  resetLayers() {
    MapFunctions.resetLayerOpacity(campsaboutObject)
  }

  reCenterMap(featureIds: [string] = ['0'], layer: string = 'fill') {
    if (featureIds[0] === '0') {
      MapFunctions.reCenterMap(campsaboutObject)
      return
    }
    const temp = Object.assign({}, campsaboutObject, { bbox: MapFunctions.createBoundBox(campsaboutObject, featureIds, layer) })
    if (featureIds.length === 1 && layer === 'poi') {
      MapFunctions.reCenterMap(temp, false, -2.5, false)
    } else {
      MapFunctions.reCenterMap(temp)
    }
  }

  private colorAvailability() {
    if (!useStoreLegend().availabilityAdded) {
      const features = Object.values(this.AvailabilityStore.featureColors)
      for (const colorItem of Object.values(useStoreColors().getAvailabilityConst) as ColorItem[]) {
        if (features.includes(colorItem.color)) {
          colorItem.title = $t(colorItem.title)
          useStoreLegend().appendColorItem(colorItem, true)
        }
      }
    }

    MapFunctions.repaintMap(Object.assign({}, campsaboutObject, { colors: this.AvailabilityStore.featureColors }))
  }

  private restoreColors() {
    useStoreLegend().clearCategoryAvailability()
    MapFunctions.repaintMap(campsaboutObject)
  }

  getDistance(fromFeatureId: string, toFeatureIdOrUser = 'location', layerType = 'fill', lookUnder = 'id'): string {
    try {
      let toLocation = useStoreLocation().getLocation

      if (toFeatureIdOrUser !== 'location') {
        const toInGJ = campsaboutObject.sortedCampGeojson[layerType].features.find((gj) => gj.properties[lookUnder] == toFeatureIdOrUser)

        if (toInGJ.geometry.type === 'MultiLineString') {
          const fromInGJ = campsaboutObject.sortedCampGeojson.fill.features.find((gj) => gj.properties.id == fromFeatureId)
          const fromObjectCentroid = turf.centroid(fromInGJ.geometry)
          const nearestPoint = turf.nearestPointOnLine(toInGJ.geometry, fromObjectCentroid)
          toLocation = { lat: nearestPoint.geometry.coordinates[1], lng: nearestPoint.geometry.coordinates[0] }
        } else {
          const toObjectCentroid = turf.centroid(toInGJ.geometry)
          toLocation = { lat: toObjectCentroid.geometry.coordinates[1], lng: toObjectCentroid.geometry.coordinates[0] }
        }
      }

      const fromInGJ = campsaboutObject.sortedCampGeojson.fill.features.find((gj) => gj.properties.id == fromFeatureId)
      if (!fromInGJ) {
        console.warn(`Distance not found: fromFeatureId ${fromFeatureId} does not exist.`)
        return $t('distanceNotFound')
      }
      const fromObjectCentroid = turf.centroid(fromInGJ.geometry)

      const fromPoint = turf.point([fromObjectCentroid.geometry.coordinates[0], fromObjectCentroid.geometry.coordinates[1]])
      const toPoint = turf.point([toLocation.lng, toLocation.lat])

      const distance = turf.distance(fromPoint, toPoint, { units: 'meters' })

      // Format the distance
      return distance >= 1000 ? `${(distance / 1000).toFixed(2)} km` : `${Math.round(distance)} meters`
    } catch (error) {
      console.warn('An error occurred while calculating distance. Coastline is missing from GeoJSON or invalid data provided.')
      return $t('coastlineMissing')
    }
  }

  setupLocationTracking() {
    window.localStorage.setItem('noGps', 'false') //TODO make it so that noGps can become true
    if (!this.loaded) return
    if (this.onlyOnceGeolocateFlag) {
      this.map.on('idle', () => {
        this.setupLocationFlag = false
        if (this.onlyOnceGeolocateFlag && !this.setupLocationFlag) {
          this.onlyOnceGeolocateFlag = false
          NavFunctions.getLocationRequest(campsaboutObject, this.handlePositionUpdate)
        }
      })
    }
  }

  requestLocationTracking() {
    this.setupLocationTracking()
    this.setupLocationFlag = false
    this.onlyOnceGeolocateFlag = false
    NavFunctions.getLocationRequest(campsaboutObject, this.handlePositionUpdate)
  }

  created() {
    this.AvailabilityStore.colorAvailability = this.colorAvailability
    this.AvailabilityStore.restoreColors = this.restoreColors
    this.locationStore.setSetupFunction(this.requestLocationTracking.bind(this))
  }
  //NAVIGATION START
  directionsOnRoute() {
    NavFunctions.subscribeToEventRoute(campsaboutObject)
  }

  geolocateTrigger() {
    NavFunctions.geolocateTrigger(campsaboutObject)
  }

  geolocateOn(handleGeolocate: any) {
    NavFunctions.geolocateOn(campsaboutObject, handleGeolocate)
  }

  geolocateOnStart(handleGeolocate: any) {
    NavFunctions.geolocateOnStart(campsaboutObject, handleGeolocate)
  }

  geolocateOnEnd(handleGeolocate: any) {
    NavFunctions.geolocateOnEnd(campsaboutObject, handleGeolocate)
  }

  geolocateOff(handleGeolocate: any) {
    NavFunctions.geolocateOff(campsaboutObject, handleGeolocate)
  }

  geolocateOffStart(handleGeolocate: any) {
    NavFunctions.geolocateOffStart(campsaboutObject, handleGeolocate)
  }

  geolocateOffEnd(handleGeolocate: any) {
    NavFunctions.geolocateOffEnd(campsaboutObject, handleGeolocate)
  }

  changeProfile(mapboxProfile: string) {
    NavFunctions.changeProfile(campsaboutObject, mapboxProfile)
  }

  setRoute(currentPosition: [], destinationFeature: { id: string }, waypoint?: []) {
    try {
      NavFunctions.setRoute(campsaboutObject, currentPosition, this.getFeatureCentroid(destinationFeature.id), waypoint)
      this.highlightFeatures([destinationFeature.id])
    } catch (error) {
      console.warn(error.message)
    }
    console.log(campsaboutObject)
  }

  clearRoute() {
    NavFunctions.clearRoute(campsaboutObject)
  }

  getRoute() {
    console.log('gettingRoute')
    return NavFunctions.getRoute(campsaboutObject)
  }

  changeNavLanguage(language: string) {
    NavFunctions.changeNavLanguage(this.initialMapSettings, campsaboutObject, language)
  }

  getFeatureCentroid(destinationFeatureId: string): number[] | null {
    try {
      let fromInGJ
      if (this.$router.currentRoute.value.name === 'poiNavigationPreview' || this.$router.currentRoute.value.name === 'poiNavigationRun') {
        fromInGJ = campsaboutObject.sortedCampGeojson.poi.features.find((gj) => gj.properties.id == destinationFeatureId)
        if (!fromInGJ) {
          fromInGJ = campsaboutObject.sortedCampGeojson.fill.features.find((gj) => gj.properties.id == destinationFeatureId)
        }
      } else {
        fromInGJ = campsaboutObject.sortedCampGeojson.fill.features.find((gj) => gj.properties.id == destinationFeatureId)
      }

      if (!fromInGJ) {
        throw new Error(`Feature ID: ${destinationFeatureId} not found.`)
      }

      if (fromInGJ.geometry.coordinates.length === 2) {
        return fromInGJ.geometry.coordinates
      }
      const fromObjectCentroid = turf.centroid(fromInGJ.geometry)
      if (!fromObjectCentroid) {
        throw new Error(`Feature ID: ${destinationFeatureId} not found.`)
      }
      return fromObjectCentroid.geometry.coordinates
    } catch (error) {
      console.warn(error.message)
    }
    return null
  }

  updateRouteDisplay(destinationFeatureId: string, e: any, snapped: any, line: any) {
    NavFunctions.updateRouteDisplay(campsaboutObject, this.getFeatureCentroid(destinationFeatureId), e, snapped, line)
  }

  toggleLayer(layerId: string) {
    MapFunctions.toggleLayer(campsaboutObject, layerId)
  }

  //NAVIGATION END
  async mounted() {
    this.setupInitialMapSettings()
    await this.fetchData()
    this.map = MapFunctions.createMap(this.initialMapSettings)
    await this.loadMap().then(() => {
      this.loaded = true
      NavFunctions.initGeolocate(campsaboutObject)
      if (this.setupLocationFlag && window.localStorage.getItem('noGps')?.toLocaleLowerCase() == 'false') this.setupLocationTracking() // In case setupLocationTracking was called before map was loaded
      this.mapFunctions.setFeatureHighlightFun(this.highlightFeatures.bind(this))
      this.mapFunctions.setResetLayerOpacityFun(this.resetLayers.bind(this))
      this.mapFunctions.setReCenterMapFun(this.reCenterMap.bind(this))
      this.mapFunctions.setDistanceFun(this.getDistance.bind(this))
      useStoreDirections().setDirectionsOnRouteDel(this.directionsOnRoute.bind(this))
      useStoreDirections().setGeolocateTriggerDel(this.geolocateTrigger.bind(this))
      useStoreDirections().setRouteDel(this.setRoute.bind(this))
      useStoreDirections().setClearRouteDel(this.clearRoute.bind(this))
      useStoreDirections().setGetRouteDel(this.getRoute.bind(this))
      useStoreDirections().setGeolocateOnDel(this.geolocateOn.bind(this))
      useStoreDirections().setGeolocateOnStartDel(this.geolocateOnStart.bind(this))
      useStoreDirections().setGeolocateOnEndDel(this.geolocateOnEnd.bind(this))
      useStoreDirections().setGeolocateOffDel(this.geolocateOff.bind(this))
      useStoreDirections().setGeolocateOffStartDel(this.geolocateOffStart.bind(this))
      useStoreDirections().setGeolocateOffEndDel(this.geolocateOffEnd.bind(this))
      useStoreDirections().setGetFeatureCentroidDel(this.getFeatureCentroid.bind(this))
      useStoreDirections().setUpdateRouteDisplayDel(this.updateRouteDisplay.bind(this))
      useStoreDirections().setChangeProfileDel(this.changeProfile.bind(this))
      useStoreDirections().setChangeNavLanguageDel(this.changeNavLanguage.bind(this))
      useStoreDirections().setRotateMapDel(this.rotateMap.bind(this))
      this.mapFunctions.setToggleLayerDel(this.toggleLayer.bind(this))
    })
    this.onMapIdChanged(this.$route.query.mapId?.toString(), undefined)
    NavFunctions.initDirections(this.initialMapSettings, campsaboutObject)
    if (import.meta.env.DEV || localStorage.getItem('dev')) {
      MapFunctions.initializePrint(this.initialMapSettings, campsaboutObject)
    }
    campsaboutObject.map.on('rotatestart', () => {
      this.isRotating = true
    })

    campsaboutObject.map.on('rotateend', () => {
      this.isRotating = false
    })
  }
}
</script>

<style>
#mapContainer {
  width: 100%;
  height: 100dvh;
}

.mapboxgl-popup-content {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 25px;
  padding-right: 30px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-weight: 700;
  font-size: 14px;
  border-radius: 20px;
  max-width: fit-content;
  width: fit-content;
  max-height: 450px;
  overflow: auto;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNjc0LjRweCIgaGVpZ2h0PSI1MjguM3B4IiB2aWV3Qm94PSIwIDAgNjc0LjQgNTI4LjMiIHN0eWxlPSJvdmVyZmxvdzp2aXNpYmxlO2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjc0LjQgNTI4LjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHBhdGggZmlsbD0iI2Y3ZjdmNyIgZD0iTTkyLjYsNDUyLjdjLTk0LjgtOTYuOS0xMzAtMjU2LjktNDIuMi0zNTZsMC41LTAuNmMwLjEtMC4yLDAuMy0wLjMsMC40LTAuNWMxOC4yLTIwLjMsNDEuNi0zOCw3MC44LTUyICBjODEuMi0zOSwyODYuMS04NC44LDQ0NC4yLDI0LjdjMTI4LjYsODkuMSwxMzMsMTg4LjQsNjIuMywyNzMuN2MwLDAsMCwwLDAsMEw2MTQuNCwzNThjLTI0LjUsMjUuNi01NS44LDQ5LjgtOTIuNSw3MS44ICBDMzQ5LDUzMy41LDIxMy41LDU3Ni40LDkyLjYsNDUyLjd6Ii8+Cjwvc3ZnPg==);
  background-size: cover;
  background-position: -100px 0px;
  background-repeat: no-repeat;
}

.mapboxgl-popup-content div {
  display: flex;
  flex-direction: column;
}

.mapboxgl-popup-close-button {
  border-radius: 50%;
  line-height: 13px;
  width: 22px;
  height: 22px;
  font-size: 30px;
  top: 8px;
  right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}

.mapboxgl-popup-close-button:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.mapboxgl-popup-close-button:hover {
  background: transparent;
}

.mapboxgl-popup-content #navigateTo {
  background: #007afc;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 25px;
  margin-bottom: 15px;
}

.mapboxgl-popup-content button#navigateTo img {
  width: 16px;
  margin-left: 15px;
}

.mapboxgl-popup-content h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 30px 0;
}

.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
  margin-top: -2px;
}

.mapboxgl-popup-content .navigation-denied {
  margin: 0 0 30px;
  padding: 0;
  display: block;
}

.mapboxgl-popup-content .navigation-denied + #navigateToPoi {
  opacity: 0.5;
  pointer-events: none;
}

.mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
  margin-top: -1px;
}

.mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
.mapboxgl-popup.mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip,
.mapboxgl-popup.mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
  margin-bottom: -1px;
}

.mapboxgl-popup-content span.availability {
  margin: 0 0 20px;
}

.poiPopupImage {
  max-width: 145px;
  max-height: 125px;
  object-fit: contain;
}

#navigateTo,
#navigateToObjekt {
  outline: none;
}

button#navigateTo span {
  line-height: 1.2;
}

button#navigateTo img {
  margin-left: 15px;
  width: 16px;
}
</style>
