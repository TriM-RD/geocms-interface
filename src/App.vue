<template>
  <div class="position-fixed toast-container p-3" style="z-index: 99999999; width: fit-content">
    <div id="liveToastMain" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" style="width: fit-content">
      <div class="toast-body" id="toastMessageMain"></div>
    </div>
  </div>
  <!-- Loading spinner -->
  <Loading v-model:active="loading" />
  <!-- Main content when ready -->
  <div v-if="verifiedUser && translationsLoaded && !loading">
    <router-view></router-view>
  </div>

  <CaptchaComponent v-else ref="captcha" @verified="onUserVerified" />
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator'
import MapFooter from './components/footer/MapFooter.vue'
import CaptchaComponent from './components/CaptchaComponent.vue'
import NavigationButtonsComponent from './components/MainButtonsComponent.vue'
import LiveMap from '@/views/LiveMap.vue'
import Header from '@/views/Header.vue'
import http from '@/http-common'
import { type StoreSettingsState, useStoreSettings } from '@/stores/storeSettings'
import { useStoreTranslations } from '@/stores/storeTranslations'
import '@fortawesome/fontawesome-free/css/all.css'
import { Tooltip } from 'bootstrap'
import LoadingComponent from '@/components/LoadingComponent.vue'

@Component({
  components: {
    LiveMap,
    MapFooter,
    CaptchaComponent,
    Header,
    NavigationButtonsComponent,
    Loading: LoadingComponent
  }
})
export default class App extends Vue {
  verifiedUser = false
  userIp: string = 'unknown'
  envMode = import.meta.env.DEV
  translationsLoaded = false
  campSettingsData!: StoreSettingsState
  loading = true
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

  @Watch('$route.params.propertyCode', { immediate: true })
  onPropertyId(newGroupName: string | undefined, groupName: string | undefined) {
    if (newGroupName) {
      this.Init()
    }
  }

  private async getPropertyFromUrl() {
    // For dynamic routes, extract the propertyCode from route params or fallback to 'cikat'
    const propertyCode = this.$route.params.propertyCode

    // Fetch data from API using the extracted propertyCode
    await this.callApi(`https://campsabout.com/mapAPI/properties.php?property=${propertyCode}`).then((data) => (this.campSettingsData = data))

    if (this.campSettingsData) {
      useStoreSettings().set(this.campSettingsData)
    }
  }

  async Init() {
    this.userIp = await this.getUserIp()
    this.checkRefreshCount()
    await this.getPropertyFromUrl()
    await this.callApi(`https://campsabout.com/cms/api/v2/translations?group=${useStoreSettings().get('groupName')}`).then((data) => useStoreTranslations().setTranslations(data))
    this.translationsLoaded = true
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
      trigger: 'hover'
    })
    if (!this.checkIfTouchDevice())
      new Tooltip(document.body, {
        selector: "[data-bs-toggle='cursor-tooltip']",
        trigger: 'hover'
      })

    this.loading = false // Set loading to false once data is ready
  }

  checkIfTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  async getUserIp(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error('Error fetching the IP address:', error)
      return 'unknown'
    }
  }

  checkRefreshCount() {
    const refreshKey = `refreshCount`
    const refreshCountValue = localStorage.getItem(refreshKey)

    let refreshCount = 0 // Default value for refresh count
    if (refreshCountValue) {
      const parsedValue = JSON.parse(refreshCountValue)
      refreshCount = parsedValue?.count ? parseInt(parsedValue.count) : 0
    }

    if (refreshCount >= 3 && !this.envMode) {
      this.$nextTick(() => {
        (this.$refs.captcha as InstanceType<typeof CaptchaComponent>).openCaptcha()
      })
    } else {
      this.verifiedUser = true
      localStorage.setItem('refreshCount', JSON.stringify({ ip: this.userIp, count: refreshCount + 1 }))
    }
  }

  onUserVerified() {
    localStorage.setItem('refreshCount', JSON.stringify({ ip: this.userIp, count: 1 }))
    this.verifiedUser = true
  }
}
</script>

<style>
.gps-active .mapboxgl-user-location-show-heading .mapboxgl-user-location-heading:after {
  display: none;
}

.mapboxgl-user-location-show-heading .mapboxgl-user-location-heading:after,
.mapboxgl-user-location-show-heading .mapboxgl-user-location-heading:before {
  border: none;
}

.mapboxgl-user-location-dot:after {
  z-index: 1
}

.mapboxgl-user-location-dot {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-items: center;
}

.mapboxgl-user-location-dot:before {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mapboxgl-user-location.mapboxgl-marker.mapboxgl-marker-anchor-center.mapboxgl-user-location-show-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mapboxgl-user-location-show-heading .mapboxgl-user-location-heading:after {
  background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwLXBhdGgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYxLjM1IC0yNy41NSkiPjxwYXRoIGQ9Ik0yNDUuODMxMSw1MC4yNUExMzguOTc2OCwxMzguOTc2OCwwLDAsMCwxNy4xNTQ2LDcxLjk5NDFMMTEzLjA1LDIyNy41NWg0OS42TDI2MC4zMTY4LDcxLjQwNjRBMTM5LjE5NTUsMTM5LjE5NTUsMCwwLDAsMjQ1LjgzMTEsNTAuMjVaIiBmaWxsPSJub25lIi8+PC9jbGlwUGF0aD48cmFkaWFsR3JhZGllbnQgaWQ9InJhZGlhbC1ncmFkaWVudCIgY3g9IjEzOC42NSIgY3k9IjUyLjQ1IiByPSIyMDAiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgLTEsIDYxLjM1LCAyNTIuNDUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNTY5ZmQ2Ii8+PHN0b3Agb2Zmc2V0PSIwLjE1MzEiIHN0b3AtY29sb3I9IiM1YmEwZDciIHN0b3Atb3BhY2l0eT0iMC44NDY5Ii8+PHN0b3Agb2Zmc2V0PSIwLjMxMDMiIHN0b3AtY29sb3I9IiM2OGE2ZGEiIHN0b3Atb3BhY2l0eT0iMC42ODk3Ii8+PHN0b3Agb2Zmc2V0PSIwLjQ2OTYiIHN0b3AtY29sb3I9IiM3ZGIwZGUiIHN0b3Atb3BhY2l0eT0iMC41MzA0Ii8+PHN0b3Agb2Zmc2V0PSIwLjYzMDMiIHN0b3AtY29sb3I9IiM5OWJmZTUiIHN0b3Atb3BhY2l0eT0iMC4zNjk3Ii8+PHN0b3Agb2Zmc2V0PSIwLjc5MiIgc3RvcC1jb2xvcj0iI2JlZDRlZSIgc3RvcC1vcGFjaXR5PSIwLjIwOCIvPjxzdG9wIG9mZnNldD0iMC45NTI1IiBzdG9wLWNvbG9yPSIjZWNmMWZhIiBzdG9wLW9wYWNpdHk9IjAuMDQ3NSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMjAwIiBmaWxsPSJ1cmwoI3JhZGlhbC1ncmFkaWVudCkiLz48L2c+PC9zdmc+);
  width: 128px;
  height: 70px;
  background-size: cover;
  background-position: top;
  z-index: -1;
  transform: skew(0deg);
  margin-left: -64px;
  margin-top: -66px;
}

.gps-active .mapboxgl-user-location-dot,
.gps-active .mapboxgl-user-location-dot:before {
  background-color: #fff;
}

.gps-active .mapboxgl-user-location-dot:after {
  width: 44px;
  height: 44px;
  background: white;
}

.gps-active .mapboxgl-user-location-dot,
.gps-active .mapboxgl-user-location-dot:before {
  width: 40px;
  height: 40px;
}

.gps-active .mapboxgl-user-location-heading:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/icons/navigation/gps-arrow-blue.svg');
  background-repeat: no-repeat;
  background-size: contain;
  border-bottom-color: white;
  border: 0;
  transform-origin: center;
}

.gps-active .mapboxgl-user-location-heading:before,
.gps-active .mapboxgl-user-loaction-heading:after {
  transform: scale(0.7) translateY(0px) skewY(0deg) !important;
}

.gps-active .mapboxgl-user-location-heading {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0;
  z-index: 1;
}

.gps-active .mapboxgl-ctrl-top-right .mapboxgl-ctrl {
  display: none
}

.gps-active .mapboxgl-ctrl-group button {
  /* display: none; */
  position: absolute;
  z-index: 102;
  margin: 0% auto 2.5% 2%;
  width: 55%;
  height: 50px;
  left: 0;
  bottom: 0;
  color: white;
  font-family: 'Lato', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 2;
  border-radius: 30px;
  background-color: #007afc;
  letter-spacing: 0.5px;
  outline: none;
}

.gps-active .mapboxgl-ctrl-top-right .mapboxgl-ctrl {
  /* position: relative */
  /* float: none; */
  position: absolute;
  bottom: 0;
  width: 100%;
}

.gps-active .mapboxgl-ctrl-top-right {
  bottom: 0;
  left: 0;
  height: 100%;
  top: unset;
}

.gps-active .mapboxgl-control-container {
  height: 100%;
}

/*.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right {
  display: none;
}*/

.gps-active .mapboxgl-ctrl-group button img {
  height: 40%;
  margin-left: 10px;
}

.gps-active button.mapboxgl-ctrl-geolocate.mapboxgl-ctrl-geolocate-background {
  display: flex;
  flex-direction: row;
  align-content: space-between;
  align-items: center;
  justify-content: space-evenly;
  width: auto;
  padding: 0 20px;
  white-space: nowrap;
}

.gps-active .mapboxgl-ctrl-directions.mapboxgl-ctrl {
  display: none;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes modalFadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

.modal-content {
  animation: modalFadeIn 0.1s ease-out;
}

/*.modal.show .modal-content {
  animation: modalFadeOut 0.3s ease-in;
}*/

.modal-backdrop {
  animation: fadeBackdropIn 0.3s ease-out;
}

.modal-backdrop.fade-out {
  animation: fadeBackdropOut 0.3s ease-in forwards;
  opacity: 0; /* Fades out completely */
}

@keyframes fadeBackdropIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.5;
  }
}

@keyframes fadeBackdropOut {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 0;
  }
}

.modal {
  backdrop-filter: blur(3px) !important; /* Increase blur and saturation for a stronger effect */
}
.modal-content {
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
}

.dvh-100 {
  height: 100dvh;
}
.grecaptcha-badge {
  visibility: hidden;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  color: var(--bs-camp);
}
.tooltip {
  pointer-events: none; /* TODO ako bude treba select na tooltip-u promjeniti  da je none samo na tooltipu od legende */
}
.toast-container {
  top: 0;
  right: 0;
  left: auto;

  /* Mobile: Align left on screens less than 576px */
  @media (max-width: 575.98px) {
    right: auto;
    left: 0;
  }
}

.text-camp {
  color: var(--bs-camp) !important;
}

mark {
  border-radius: 25px;
  padding: 3px 10px;
}

.custom-rounded {
  border-radius: 20px !important;
}

.custom-rounded-top {
  border-radius: 20px 20px 0px 0px !important;
}

.note-box {
  cursor: grab !important;
  flex: 1 0 calc(100% - 1rem) !important;
  max-width: calc(100% - 1rem) !important;
  white-space: pre-line;
}

.custom-box:not(.btn-outline-secondary):not(.btn-camp-outline-secondary) {
  cursor: grab;
}

.custom-box {
  cursor: inherit;
  color: #1a1d20 !important;
  flex: 1 0 calc(50% - 1rem);
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  max-width: calc(50% - 1rem);
  justify-content: space-between;
}

.headerText {
  font-size: clamp(1rem, -0.25rem + 4vw, 1.75rem) !important;
}

.filter-text-heading {
  color: #1a7946;
  font-size: 18px;
  font-weight: 700;
}

.main-heading-search {
  font-size: 25px !important;
  font-weight: 500 !important;
  opacity: 100 !important;
}

.close-modal-btn {
  color: var(--bs-camp) !important;
}

.close-modal-btn:hover {
  background: none !important;
}

.close-modal-btn i {
  transition: all 0.22s;
}

.close-modal-btn:hover i {
  color: #0bae81;
}

.search-input:focus {
  caret-color: var(--bs-camp-active) !important;
  border-color: var(--bs-camp-active) !important;
  box-shadow: none !important;
}

.row {
  margin: 0 !important;
}

.filter-square {
  flex-shrink: 0;
  width: 15px; /* Adjust the size as needed */
  height: 15px; /* Adjust the size as needed */
}

.dimension-icon {
  background-color: #99d6a3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3em;
  height: 3em;
  clip-path: polygon(
    50% 5%,
    50% 5%,
    39.992% 5.288%,
    31.496% 6.224%,
    24.404% 7.916%,
    18.608% 10.472%,
    14% 14%,
    10.472% 18.608%,
    7.916% 24.404%,
    6.224% 31.496%,
    5.288% 39.992%,
    5% 50%,
    5% 50%,
    5.288% 60.008%,
    6.224% 68.504%,
    7.916% 75.596%,
    10.472% 81.392%,
    14% 86%,
    18.608% 89.528%,
    24.404% 92.084%,
    31.496% 93.776%,
    39.992% 94.712%,
    50% 95%,
    50% 95%,
    60.008% 94.712%,
    68.504% 93.776%,
    75.596% 92.084%,
    81.392% 89.528%,
    86% 86%,
    89.528% 81.392%,
    92.084% 75.596%,
    93.776% 68.504%,
    94.712% 60.008%,
    95% 50%,
    95% 50%,
    94.712% 39.992%,
    93.776% 31.496%,
    92.084% 24.404%,
    89.528% 18.608%,
    86% 14%,
    81.392% 10.472%,
    75.596% 7.916%,
    68.504% 6.224%,
    60.008% 5.288%,
    50% 5%,
    50% 5%
  );
}

/* Custom font sizes */
.fs-7 {
  font-size: 0.8rem !important; /* 12px */
}

.mark-text {
  font-size: 0.9rem !important;
}

.fs-8 {
  font-size: 0.625rem; /* 10px */
}

.w-10 {
  width: 10% !important;
}

.btn-md {
  padding: 0.5rem 1rem !important; /* Slightly larger than the default .btn */
  font-size: 1.1rem !important; /* Between .btn and .btn-lg */
}

.btn-responsive-sm {
  aspect-ratio: 1 / 1;
  height: fit-content;
  /*padding: 0.3rem 0.6rem!important;
  font-size: 0.9rem!important; */
}

.a-enter-vr.fullscreen,
.a-enter-vr-button {
  display: none !important;
}

@media (max-width: 600px) {
  .mark-text {
    font-size: 0.8rem !important; /* 12px */
  }
  .custom-rounded {
    border-radius: 10px !important;
  }

  .custom-rounded-top {
    border-radius: 10px 10px 0px 0px !important;
  }

  .custom-box {
    flex: 1 0 calc(100% - 1rem);
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    max-width: calc(100% - 1rem);
    justify-content: start;
  }
  .headerText {
    font-size: 1.3rem !important; /* Adding !important to override fs-4 */
  }

  .btn-responsive-sm {
    padding: 0.4rem 0.9rem !important;
    font-size: 1rem !important;
  }
}

@media (max-width: 576px) {
  .btn-camp {
    --bs-btn-padding-y: 0.25rem !important;
    --bs-btn-padding-x: 0.5rem !important;
    --bs-btn-font-size: 0.875rem !important;
    --bs-btn-border-radius: var(--bs-border-radius-sm) !important;
  }
}
</style>
