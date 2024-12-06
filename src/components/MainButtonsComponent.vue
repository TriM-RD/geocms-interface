<template>
  <div class="top-navigation d-none d-sm-flex flex-column position-absolute top-0 start-0 mt-3 m-3 gap-2">
    <button data-bs-placement="right" data-bs-toggle="cursor-tooltip" :title="$t('reCenter')" type="button" class="btn btn-light" @click="reCenterMap"><i class="camp-other" style="color: #383939"></i></button>
    <!--button type="button" class="btn btn-light" @click="reCenterMap"><i class="bi camp-recenter" style="color: #383939"></i></button-->
    <button data-bs-placement="right" data-bs-toggle="cursor-tooltip" :title="$t('search')" type="button" class="btn btn-light" @click="$router.push({ name: 'search' })"><i class="bi bi-search"></i></button>
    <div class="d-flex">
      <button data-bs-placement="right" data-bs-toggle="cursor-tooltip" :title="$t('filter')" type="button" class="btn btn-light" @click="$router.push({ name: 'filter' })"><i class="bi bi-funnel"></i></button>
      <i data-bs-placement="right" data-bs-toggle="cursor-tooltip" :title="$t('clear')" v-if="showReset" @click="clearFilter()" class="bi bi-x-circle-fill"></i>
    </div>
    <div data-bs-toggle="cursor-tooltip" data-bs-placement="right" :title="$t('language')" class="dropdown">
      <button class="btn btn-light" type="button" @click="initLanguages" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-translate"></i>
      </button>
      <ul class="dropdown-menu px-3 mt-1" style="width: fit-content">
        <li v-for="(flag, code) in storeFlags" :key="code" :class="{ 'selected-language': selectedLanguage === code }" @click="changeLanguage(code)"><img :src="flag" :alt="code" class="flag-icon me-1" />{{ languageNames[code] }}</li>
      </ul>
    </div>
    <!-- NE UKLANJATI -->
    <button v-if="envMode" type="button" class="btn btn-light" @click="$router.push({ name: 'unit' })">U</button>
    <div v-if="envMode || devMode" class="d-flex">
      <button type="button" class="btn btn-light" @click="highlightRemaining360"><i class="bi bi-camera"></i></button>
      <i v-if="reset360highlight" @click="clearFilter()" class="bi bi-x-circle-fill"></i>
    </div>
    <button v-if="envMode" type="button" class="btn btn-light" @click="$router.push({ name: 'payment', params: { id: '93' } })">P</button>
    <button v-if="envMode || devMode" type="button" class="btn btn-light" @click="toggleLayerNum()">HN</button>
    <button v-if="envMode || devMode" type="button" class="btn btn-light" @click="toggleLayerPoi()">HP</button>
    <button v-if="envMode || devMode" type="button" class="btn btn-light" @click="toggleLayerLabel()">HL</button>
  </div>

  <div class="bottom-navigation d-sm-none d-flex flex-row justify-content-between position-absolute bottom-0 start-0 py-1 px-4">
    <button type="button" class="btn" @click="reCenterMap"><i class="camp-recenter" style="color: #383939"></i></button>
    <div class="position-relative d-flex justify-content-center">
      <button v-if="showReset" class="btn clear-filter position-absolute d-flex justify-content-center align-items-center h-75 w-75">
        <i @click="clearFilter()" class="bi bi-x-circle-fill d-flex"></i>
      </button>
      <button type="button" class="btn" @click="$router.push({ name: 'filter' })"><i class="bi bi-funnel"></i></button>
    </div>
    <button type="button" class="btn btn-camp" @click="reCenterMap"><i class="camp-other"></i></button>
    <button type="button" class="btn" @click="$router.push({ name: 'search' })"><i class="bi bi-search"></i></button>
    <div class="dropdown">
      <button type="button" class="btn" @click="initLanguages" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-translate"></i>
      </button>
      <ul class="dropdown-menu px-3 mt-1" style="width: fit-content">
        <li v-for="(flag, code) in storeFlags" :key="code" :class="{ 'selected-language': selectedLanguage === code }" @click="changeLanguage(code)"><img :src="flag" :alt="code" class="flag-icon me-1" />{{ languageNames[code] }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import { computed } from 'vue'
import { useStoreMapFunctions } from '@/stores/storeMapFunctions'
import { useStoreSelectedFeatures } from '@/stores/storeSelectedFeatures'
import { useStoreTranslations, $t } from '@/stores/storeTranslations'
import { useStoreMessageBox } from '@/stores/storeMessageBox'
import { useStoreApiFeatures } from '@/stores/storeApiFeatures'
import { useStoreDirections } from '@/stores/storeDirections'
import { useStoreSettings } from '@/stores/storeSettings'

import flagDE from '@/assets/flags/de.svg'
import flagEN from '@/assets/flags/en.svg'
import flagHR from '@/assets/flags/hr.svg'
import flagIT from '@/assets/flags/it.svg'
import flagNL from '@/assets/flags/nl.svg'
import flagPL from '@/assets/flags/pl.svg'
import flagSI from '@/assets/flags/si.svg'

@Component({
  methods: { $t }
})
export default class MainButtonsComponent extends Vue {
  private mapFunctions = useStoreMapFunctions()
  envMode = import.meta.env.DEV
  private storeSelectedFeatures = useStoreSelectedFeatures()
  private TranslationsStore = useStoreTranslations()
  private MessageBox = useStoreMessageBox()
  private storeApiFeatures = useStoreApiFeatures()
  storeSettings = useStoreSettings()
  $t = $t
  flags = {
    de: flagDE,
    en: flagEN,
    hr: flagHR,
    it: flagIT,
    nl: flagNL,
    pl: flagPL,
    si: flagSI
  }

  languageNames = {
    de: 'Deutsch',
    en: 'English',
    hr: 'Hrvatski',
    it: 'Italiano',
    nl: 'Dutch',
    pl: 'Polski',
    si: 'Slovenščina'
  }

  storeFlags = {}

  initLanguages() {
    this.storeFlags = Object.fromEntries(Object.entries(this.flags).filter(([key]) => this.storeSettings.oldMapSettings[key]))
  }

  private selectedLanguage = computed(() => this.TranslationsStore.currentLanguage)

  reset360highlight = false

  get showReset() {
    return this.storeSelectedFeatures.getData.length > 0
  }

  get devMode() {
    return localStorage.getItem('dev')
  }

  reCenterMap() {
    this.mapFunctions.getReCenterMapFun()
  }

  toggleLayerNum() {
    this.mapFunctions.toggleLayer('camp-fill-numbers-layer')
  }

  toggleLayerPoi() {
    this.mapFunctions.toggleLayer('poi-layer')
  }

  toggleLayerLabel() {
    this.mapFunctions.toggleLayer('label-layer')
  }

  changeLanguage(code: string) {
    this.TranslationsStore.currentLanguage = code
    useStoreDirections().changeNavLanguage(code)
    window.localStorage.setItem('currentLanguage', code)
    this.MessageBox.setData({
      title: $t('Language changed'),
      message: $t('Language changed to'),
      acceptButtonText: $t('OK')
    })
    this.$router.push({ name: 'dialog' })
  }

  clearFilter() {
    this.reset360highlight = false
    console.log('Filter cleared!')
    this.storeSelectedFeatures.clear()
    this.mapFunctions.getReCenterMapFun()
    useStoreMapFunctions().resetLayerOpacityFun()
    this.$router.push({ name: 'map' })
  }

  highlightRemaining360() {
    const features = this.storeApiFeatures.features
    const filteredFeatures = features.filter((feature) => feature.has360 === false && feature.category === 'P' && feature.mapId)
    const featureIDs = filteredFeatures.map((feature) => feature.mapId)
    this.mapFunctions.featureHighlightFun(featureIDs, false)
    this.reset360highlight = true
  }
}
</script>

<style scoped>
.top-navigation,
.bottom-navigation {
  z-index: 1000;
}

.top-navigation .btn {
  width: 50px;
  height: 50px;
  font-size: 20px;
  border-radius: 50%;
  box-shadow:
    0 1px 3px rgb(0 0 0 / 50%),
    0 3px 10px rgb(0 0 0 / 30%);
}

@media (max-width: 740px) {
  .top-navigation {
    margin-top: 80px !important;
  }
}

.bottom-navigation {
  background: white;
  width: 100%;
  box-shadow: 0 0px 10px rgb(0 0 0 / 30%);
  max-height: 10%;
}

.bottom-navigation .btn {
  width: 50px;
  height: 50px;
  font-size: 22px;
}

.btn-camp {
  width: 60px !important;
  height: 60px !important;
  font-size: 25px;
  border-radius: 50%;
  margin-top: -20px;
  margin-left: -8px;
  margin-right: -8px;
  border-width: 4px !important;
  border-color: white !important;
}

.flag-icon {
  width: 20px;
  height: auto;
}

.dropdown-menu li {
  cursor: pointer;
  margin-top: 8px;
  margin-bottom: 8px;
}

.dropdown-menu li.selected-language {
  background-color: #e9e8e8;
  margin-left: -10px;
  padding-left: 10px;
  margin-right: -10px;
  padding-right: 10px;
  border-radius: 5px;
  pointer-events: none;
}

.dropdown-menu li:hover {
  background-color: #f5f5f5;
  margin-left: -10px;
  padding-left: 10px;
  margin-right: -10px;
  padding-right: 10px;
  border-radius: 5px;
}

.top-navigation .bi-x-circle-fill {
  font-size: 25px;
  margin-left: -10px;
  margin-top: -10px;
  cursor: pointer;
}

.top-navigation .clear-filter {
  font-size: 30px;
  background-color: white;
  margin-top: -35px;
  border-radius: 50% 50% 0 0;
}

.bottom-navigation .clear-filter {
  font-size: 30px;
  background-color: white;
  margin-top: -35px;
  border-radius: 50% 50% 0 0;
}

.bi-x-circle-fill {
  width: 30px;
  height: 30px;
}
</style>
