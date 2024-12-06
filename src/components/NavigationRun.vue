<template>
  <span v-if="devMode">
    <div class="table-container">
      <table class="coords-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Heading</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(coord, index) in lastCoordinates" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ coord.latitude.toFixed(6) }}°</td>
            <td>{{ coord.longitude.toFixed(6) }}°</td>
            <td>{{ coord.heading?.toFixed(1) || 'N/A' }}°</td>
          </tr>
        </tbody>
      </table>
    </div>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import * as turf from '@turf/turf'
import { useStoreNavigation } from '@/stores/storeNavigation'
import { useStoreDirections } from '@/stores/storeDirections'
import { $t } from '@/stores/storeTranslations'
import { useStoreMessageBox } from '@/stores/storeMessageBox'
interface Coordinates {
  latitude: number
  longitude: number
}
interface GeoPosition {
  latitude: number
  longitude: number
  heading: number | null
}
@Component
export default class NavigationRun extends Vue {
  envMode = import.meta.env.DEV
  DISTANCE_THRESHOLD = 100
  BEARING_THRESHOLD = 90
  lastCoordinates: GeoPosition[] = []
  // Other properties
  private prviprikaz = true
  private trackActive = true
  private isSetOrigin = false
  private odradjeno = false
  private travelDone = false
  private waypointReached = false
  private legCount = 0
  private tockeIteracija = 0
  private poly: any
  private lastRun = 0
  private handleGeolocateDel!: (handleGeolocate: any) => void
  private resumeTrackingDel!: (handleGeolocate: any) => void
  private pauseTrackingDel!: (handleGeolocate: any) => void
  private temporarilyIgnoreTrackingEvents = false
  lastCoords: Coordinates = { latitude: 0, longitude: 0 }
  bearing!: number
  //private speed = 0 TODO can be used in a later date

  get devMode() {
    return localStorage.getItem('dev')
  }

  created() {
    this.backToInit() //Just in case, can be removed at later date after testing
    if (!useStoreDirections().directionsOnRoute) {
      if (this.$router.currentRoute.value.name === 'poiNavigationRun') {
        this.$router.push({ name: 'poiId' })
      } else {
        this.$router.push({ name: 'unitId' })
      }
    }
  }

  get bearingNumber() {
    if (this.bearing) {
      return this.bearing.toString()
    }
    return ' no_bearing'
  }

  mounted() {
    if (!useStoreDirections().directionsOnRoute) {
      if (this.$router.currentRoute.value.name === 'poiNavigationRun') {
        this.$router.push({ name: 'poiId' })
      } else {
        this.$router.push({ name: 'unitId' })
      }
    } else {
      this.poly = useStoreDirections().getRoute()
      this.navigateTo()
    }
  }

  beforeUnmount() {
    if (useStoreDirections().geolocateOff) useStoreDirections().geolocateOff(this.handleGeolocateDel)
    if (useStoreDirections().geolocateOffStart) useStoreDirections().geolocateOffStart(this.resumeTrackingDel)
    if (useStoreDirections().geolocateOffEnd) useStoreDirections().geolocateOffEnd(this.pauseTrackingDel)
  }

  backToInit() {
    this.prviprikaz = true
    this.trackActive = true
    this.isSetOrigin = false
    this.odradjeno = false
    this.travelDone = false
    this.waypointReached = false
    this.legCount = 0
    this.tockeIteracija = 0
    this.lastRun = 0
  }

  resumeTracking() {
    /*this.trackActive = true
    useStoreNavigation().toggleNavigation(!this.trackActive, true)*/
  }

  pauseTracking() {
    if (this.temporarilyIgnoreTrackingEvents) return
    /*this.trackActive = false
    useStoreNavigation().toggleNavigation(!this.trackActive)*/
  }

  navigateTo() {
    document.body.classList.add('gps-active');
    this.handleGeolocateDel = this.handleGeolocate.bind(this)
    this.resumeTrackingDel = this.resumeTracking.bind(this)
    this.pauseTrackingDel = this.pauseTracking.bind(this)
    useStoreDirections().geolocateOn(this.handleGeolocateDel)
    useStoreDirections().geolocateOnStart(this.resumeTrackingDel)
    useStoreDirections().geolocateOnEnd(this.pauseTrackingDel)
  }

  private calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (degrees: number) => (degrees * Math.PI) / 180
    const toDeg = (radians: number) => (radians * 180) / Math.PI

    const dLon = toRad(lon2 - lon1)
    const y = Math.sin(dLon) * Math.cos(toRad(lat2))
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon)
    // Convert to 0-360 degrees
    return (toDeg(Math.atan2(y, x)) + 360) % 360
  }

  private updateLastCoordinates(position: GeoPosition) {
    this.lastCoordinates.unshift(position) // Add new position to the beginning
    if (this.lastCoordinates.length > 10) {
      this.lastCoordinates.pop() // Remove oldest position if more than 10
    }
  }

  private handleGeolocate(e: any) {
    this.poly = useStoreDirections().getRoute()

    /*if (this.lastCoords.latitude !== 0 && this.lastCoords.longitude !== 0) {
      // Calculate bearing between last and current coordinates
      this.bearing = this.calculateBearing(this.lastCoords.latitude, this.lastCoords.longitude, e.coords.latitude, e.coords.longitude)
    } else {
      // Use the heading provided by the geolocation API, if available
      this.bearing = e.coords.heading || this.bearing // Fallback if heading is unavailable
    }*/
    const newPosition: GeoPosition = {
      latitude: e.coords.latitude,
      longitude: e.coords.longitude,
      heading: e.coords.heading || null
    }
    this.updateLastCoordinates(newPosition)
    if (newPosition.heading) {
      this.bearing = newPosition.heading
      useStoreDirections().rotateMap(newPosition.heading, e)
    }

    if (this.prviprikaz) {
      this.handleFirstCommand()
    } else if (!this.odradjeno) {
      this.handleInitialSetup()
    }

    if (this.poly.route[0].geometry.coordinates != undefined && this.odradjeno) {
      this.handleLineStringProcessing(e)
    }

    this.handleRouteSetup(e)

    // Update the last known coordinates
    this.lastCoords.latitude = e.coords.latitude
    this.lastCoords.longitude = e.coords.longitude
    return [e.coords.longitude, e.coords.latitude]
  }

  private handleFirstCommand() {
    this.prviprikaz = false
    useStoreNavigation().changeBannerInstruction(this.poly.route[0].legs[this.legCount].steps[0].maneuver.instruction)
    useStoreNavigation().playVoiceInstruction(this.poly.route[0].legs[this.legCount].steps[0].maneuver.instruction)
  }

  private handleInitialSetup() {
    this.odradjeno = true
  }

  private handleLineStringProcessing(e: any) {
    const line = turf.lineString([...this.poly.route[0].geometry.coordinates])
    const pt = turf.point([e.coords.longitude, e.coords.latitude])
    const snapped = turf.nearestPointOnLine(line, pt, { units: 'meters' })
    const gpsLok = [snapped.geometry.coordinates[0], snapped.geometry.coordinates[1]]

    this.processCurrentSegment(gpsLok)
    useStoreDirections().updateRouteDisplay(this.$route.params.id, e, snapped, line)
    this.handleWaypointNavigation(gpsLok)
  }

  private processCurrentSegment(gpsLok: number[]) {
    let segmentCisti = this.poly.route[0].legs[this.legCount].steps[this.tockeIteracija].geometry
    let snappedNovo = turf.nearestPointOnLine(segmentCisti, gpsLok, { units: 'meters' })
    snappedNovo = [snappedNovo.geometry.coordinates[0], snappedNovo.geometry.coordinates[1]]

    this.checkNextSegment(snappedNovo, segmentCisti)
  }

  private checkNextSegment(snappedNovo: number[], segmentCisti: any, tolerance = 10) {
    if (this.poly.route[0].legs[this.legCount].steps.length > this.tockeIteracija + 1) {
      let segmentSlijedeci = this.poly.route[0].legs[this.legCount].steps[this.tockeIteracija + 1].geometry.coordinates
      if (segmentSlijedeci.length > 1) {
        let segmentLineString = turf.lineString([...segmentSlijedeci])
        let bufferedSegment = turf.buffer(segmentLineString, tolerance, { units: 'meters' })

        if (turf.booleanPointInPolygon(snappedNovo, bufferedSegment)) {
          this.tockeIteracija++
        }
      }
    }
  }

  private handleWaypointNavigation(gpsLok: number[]) {
    let qwer = { units: 'meters' }
    let arrivedMostLikely = false

    let prvaTocka = this.poly.route[0].legs[this.legCount].steps[this.tockeIteracija].maneuver.location
    let slijedecaTocka = this.poly.route[0].legs[this.legCount].steps.length > this.tockeIteracija + 1 ? this.poly.route[0].legs[this.legCount].steps[this.tockeIteracija + 1].maneuver.location : null

    if (!slijedecaTocka) {
      console.log('No next waypoint', this.legCount)
      arrivedMostLikely = true
    }

    if (this.tockeIteracija < 1 && this.legCount === 1) {
      let d2 = Math.trunc(turf.distance(gpsLok, this.poly.route[0].legs[this.legCount].steps[this.tockeIteracija + 1].maneuver.location, qwer))
      this.handleNextWaypoint(d2, this.poly.route[0].legs[this.legCount].steps[this.tockeIteracija + 1])
    } else if (!arrivedMostLikely) {
      let d = Math.trunc(turf.distance(prvaTocka, slijedecaTocka, qwer))
      let d1 = Math.trunc(turf.distance(gpsLok, prvaTocka, qwer))
      let d2 = Math.trunc(turf.distance(gpsLok, slijedecaTocka, qwer))

      if (d1 > d) {
        ;[prvaTocka, slijedecaTocka] = [this.poly.route[0].legs[this.legCount].steps[this.tockeIteracija].maneuver.location, this.poly.route[0].legs[this.legCount].steps[this.tockeIteracija + 1].maneuver.location]
        d = Math.trunc(turf.distance(prvaTocka, slijedecaTocka, qwer))
        d1 = Math.trunc(turf.distance(gpsLok, prvaTocka, qwer))
        d2 = Math.trunc(turf.distance(gpsLok, slijedecaTocka, qwer))
      }
      if (d2 <= d && d1 < d) {
        this.handleNextWaypoint(d2)
      }
    } else if (arrivedMostLikely && !this.travelDone) {
      this.handleArrival()
    }
  }

  private handleNextWaypoint(distance: number, nextWaypoint = this.poly.route[0].legs[this.legCount].steps[this.tockeIteracija + 1]) {
    console.log(nextWaypoint)
    let modifier = nextWaypoint.maneuver.modifier
    let type = nextWaypoint.maneuver.type

    if (type === 'arrive' && distance < 8 && !this.travelDone) {
      this.handleArrival(distance)
    }

    if (this.legCount === 0 && this.poly.route[0].legs.length > 1 && type === 'arrive') {
      nextWaypoint.maneuver.instruction = this.poly.route[0].legs[1].steps[1].maneuver.instruction
    }

    this.updateBannerText(modifier, type, nextWaypoint.maneuver.instruction, distance)

    if (nextWaypoint.voice_done !== 1) {
      useStoreNavigation().playVoiceInstruction(nextWaypoint.maneuver.instruction)
      nextWaypoint.voice_done = 1
    }
  }

  private updateBannerText(modifier: string, type: string, instructions: string, distance: number) {
    if (modifier) {
      useStoreNavigation().changeBannerInstruction(`${instructions}`, modifier, this.formatGPSDistance(distance))
    } else if (type) {
      useStoreNavigation().changeBannerInstruction(instructions, type)
    }
  }

  formatGPSDistance(m: number) {
    if (m >= 100000) return (m / 1000).toFixed(0) + 'km'
    if (m >= 10000) return (m / 1000).toFixed(1) + 'km'
    if (m >= 1000) return (m / 1000).toFixed(2) + 'km'
    if (m >= 100) return m + 'm'
    return m.toFixed(0) + 'm'
  }
  //{13.602231433418694,45.1867425502337}
  private handleArrival(distance = 0) {
    if (this.waypointReached) {
      return
    }
    if (this.poly.route[0].legs.length > 1 && this.legCount === 0 && !this.waypointReached) {
      this.waypointReached = true
      this.legCount = 1
      //this.speed = (route.distance / route.duration) * 3.6
      this.tockeIteracija = 0
      //this.duzinaLegs = this.tockeLegs.length
      return
    } else if ((this.poly.route[0].legs.length > 1 && this.legCount === 1 && this.tockeIteracija > 0) || (this.poly.route[0].legs.length < 2 && this.legCount === 0)) {
      this.travelDone = true
      useStoreMessageBox().setData({
        title: $t('Travel done'),
        message: `${$t('Destination reached')}  ${distance ? this.formatGPSDistance(Math.floor(distance)) + '.' : ''}`,
        acceptButtonText: $t('OK'),
        onAccept: () => {
          if (this.$router.currentRoute.value.name === 'poiNavigationPreview') {
            this.$router.push({ name: 'poiId' })
          } else {
            this.$router.push({ name: 'unitId' })
          }
        }
      })
    }
  }

  handleRouteSetup(e: any) {
    if (this.waypointReached) {
      this.waypointReached = false
    } else if (!this.isSetOrigin) {
      this.settingUpNewRoute()
    } else if (this.checkPosition(e) && Date.now() - this.lastRun >= 10000) {
      useStoreNavigation().changeBannerInstruction($t('Rerouting...'))
      useStoreNavigation().playVoiceInstruction($t('Rerouting...'))

      // Using turf.js to calculate a destination point
      const userPosition = turf.point([e.coords.longitude, e.coords.latitude])
      const waypoint1 = turf.destination(userPosition, 15, this.bearing, { units: 'meters' })
      this.temporarilyIgnoreTrackingEvents = true
      useStoreDirections().setRoute([e.coords.longitude, e.coords.latitude], this.$route.params.id, [waypoint1.geometry.coordinates[0], waypoint1.geometry.coordinates[1]])
      useStoreDirections().geolocateTrigger()
      this.temporarilyIgnoreTrackingEvents = false
      this.settingUpNewRoute()
      this.lastRun = Date.now()
    }
  }

  settingUpNewRoute() {
    this.tockeIteracija = 0
    this.legCount = 0
    this.isSetOrigin = true
  }

  checkPosition(e: any) {
    const { longitude, latitude } = e.coords
    const userPosition = turf.point([longitude, latitude])
    // Get the current step in the route
    const step = this.poly.route[0].legs[this.legCount].steps[this.tockeIteracija]
    const stepLine = turf.lineString(step.geometry.coordinates)
    const distanceToStep = turf.pointToLineDistance(userPosition, stepLine, { units: 'meters' })

    // Check if user is off course based on distance
    if (distanceToStep >= this.DISTANCE_THRESHOLD) {
      return true
    }

    // Check if user is off course based on bearing
    const [start, end] = stepLine.geometry.coordinates
    const stepBearing = this.calculateBearingStep(start, end)
    const bearingDifference = this.calculateBearingDifference(this.bearing, stepBearing)

    if (bearingDifference >= this.BEARING_THRESHOLD) {
      return true
    }

    return false
  }

  calculateBearingStep(start, end) {
    return turf.bearing(turf.point(start), turf.point(end))
  }

  calculateBearingDifference(userBearing, stepBearing) {
    let difference = Math.abs(userBearing - stepBearing)
    return difference > 180 ? 360 - difference : difference
  }
}
</script>

<style scoped>
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

.table-container {
  height: 200px; /* Fixed height container [[1]] */
  overflow-y: auto; /* Enable vertical scrolling [[7]] */
  margin-top: 5rem;
}

.coords-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem; /* Reduced font size [[6]] */
}

.coords-table th,
.coords-table td {
  padding: 4px 8px;
  text-align: left;
  border: 1px solid #ddd;
}

.coords-table thead {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.coords-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
