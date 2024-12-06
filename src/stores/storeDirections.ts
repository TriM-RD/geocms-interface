import { defineStore } from 'pinia'

export const useStoreDirections = defineStore('directions', {
  state: () => ({
    directionsOnRouteDel: null as ((handleRouteChange: any) => void) | null,
    geolocateTriggerDel: null as (() => void) | null,
    routeDel: null as ((currentPosition: any[], destination: { id: string; type: string }, waypoint?: any[]) => void) | null,
    clearRouteDel: null as (() => void) | null,
    getRouteDel: null as (() => any) | null,
    geolocateOnDel: null as ((handleGeolocate: any) => void) | null,
    geolocateOnStartDel: null as ((handleGeolocate: any) => void) | null,
    geolocateOnEndDel: null as ((handleGeolocate: any) => void) | null,
    geolocateOffDel: null as ((handleGeolocate: any) => void) | null,
    geolocateOffStartDel: null as ((handleGeolocate: any) => void) | null,
    geolocateOffEndDel: null as ((handleGeolocate: any) => void) | null,
    getFeatureCentroidDel: null as (() => any) | null,
    updateRouteDisplayDel: null as (() => any) | null,
    changeProfileDel: null as ((mapboxProfile: string) => void) | null,
    changeNavLanguageDel: null as ((language: string) => void) | null,
    rotateMapDel: null as ((bearing, point) => void) | null
  }),
  actions: {
    setDirectionsOnRouteDel(fn: () => void) {
      this.directionsOnRouteDel = fn
    },
    setGeolocateTriggerDel(fn: () => void) {
      this.geolocateTriggerDel = fn
    },
    setRouteDel(fn: (currentPosition: [], destination: { id: string; type: string }, waypoint?: []) => void) {
      this.routeDel = fn
    },
    setClearRouteDel(fn: () => void) {
      this.clearRouteDel = fn
    },
    setGetRouteDel(fn: () => void): any {
      this.getRouteDel = fn
    },
    setGeolocateOnDel(fn: (handleGeolocate: any) => void) {
      this.geolocateOnDel = fn
    },
    setGeolocateOnStartDel(fn: (handleGeolocate: any) => void): any {
      this.geolocateOnStartDel = fn
    },
    setGeolocateOnEndDel(fn: (handleGeolocate: any) => void): any {
      this.geolocateOnEndDel = fn
    },
    setGeolocateOffDel(fn: (handleGeolocate: any) => void) {
      this.geolocateOffDel = fn
    },
    setGeolocateOffStartDel(fn: (handleGeolocate: any) => void): any {
      this.geolocateOffStartDel = fn
    },
    setGeolocateOffEndDel(fn: (handleGeolocate: any) => void): any {
      this.geolocateOffEndDel = fn
    },
    setGetFeatureCentroidDel(fn: () => void): any {
      this.getFeatureCentroidDel = fn
    },
    setUpdateRouteDisplayDel(fn: () => void): any {
      this.updateRouteDisplayDel = fn
    },
    setChangeProfileDel(fn: (mapboxProfile: string) => void): any {
      this.changeProfileDel = fn
    },
    setChangeNavLanguageDel(fn: (mapboxProfile: string) => void): any {
      this.changeNavLanguageDel = fn
    },
    setRotateMapDel(fn: (bearing, point) => void): any {
      this.rotateMapDel = fn
    }
  },
  getters: {
    directionsOnRoute: (state) => state.directionsOnRouteDel,
    geolocateTrigger: (state) => state.geolocateTriggerDel,
    setRoute: (state) => state.routeDel,
    clearRoute: (state) => state.clearRouteDel,
    getRoute: (state) => state.getRouteDel,
    geolocateOn: (state) => state.geolocateOnDel,
    geolocateOnStart: (state) => state.geolocateOnStartDel,
    geolocateOnEnd: (state) => state.geolocateOnEndDel,
    geolocateOff: (state) => state.geolocateOffDel,
    geolocateOffStart: (state) => state.geolocateOffStartDel,
    geolocateOffEnd: (state) => state.geolocateOffEndDel,
    getFeatureCentroid: (state) => state.getFeatureCentroidDel,
    updateRouteDisplay: (state) => state.updateRouteDisplayDel,
    changeProfile: (state) => state.changeProfileDel,
    changeNavLanguage: (state) => state.changeNavLanguageDel,
    rotateMap: (state) => state.rotateMapDel
  }
})
