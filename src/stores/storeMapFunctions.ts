import { defineStore } from 'pinia'

export const useStoreMapFunctions = defineStore('useMapFunctions', {
  state: () => ({
    featureHighlightFun: (features: any[], isIcon = false) => {},
    resetLayerOpacityFun: () => {},
    reCenterMapFun: () => {},
    getDistanceFun: (): string => {},
    toggleLayerDel: (): string => {}
  }),
  actions: {
    setFeatureHighlightFun(data: any) {
      this.featureHighlightFun = data
    },
    setResetLayerOpacityFun(data: any) {
      this.resetLayerOpacityFun = data
    },
    setReCenterMapFun(data: any) {
      this.reCenterMapFun = data
    },
    setDistanceFun(data: any) {
      this.getDistanceFun = data
    },
    setToggleLayerDel(data: any) {
      this.toggleLayerDel = data
    }
  },
  getters: {
    getFeatureHighlightFun: (state) => state.featureHighlightFun,
    getResetLayerOpacityFun: (state) => state.resetLayerOpacityFun, // Renamed to avoid conflict
    getReCenterMapFun: (state) => state.reCenterMapFun,
    getDistance: (state) => state.getDistanceFun,
    toggleLayer: (state) => state.toggleLayerDel
  }
})
