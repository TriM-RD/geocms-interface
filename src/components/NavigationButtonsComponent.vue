<template>
  <div class="top-navigation d-none d-sm-flex flex-column position-absolute top-0 start-0 mt-3 m-3 gap-2">
    <!-- TODO needs to be implemented button type="button" class="btn btn-light" @click="reCenterMap"><i class="camp-other" style="color: #383939"></i></button-->
    <div class="dropdown dropend">
      <button class="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false" @click.prevent="toggleVehicleTypeDropdown()"><i :class="selectedVehicleType.icon"></i></button>
      <ul v-if="vehicleTypeDropdown" class="dropdown-menu rounded-5 custom-drop px-3" style="width: fit-content; position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(52px, 0px)">
        <li v-for="vehicleType in vehicleTypes" :key="vehicleType.value" :class="{ 'selected-language': selectedVehicleType.value === vehicleType.value }" @click.prevent="toggleVehicleType(vehicleType)"><i :class="vehicleType.icon"></i></li>
      </ul>
    </div>
    <!-- NE UKLANJATI -->
    <button v-if="soundOn" type="button" class="btn btn-light" @click="toggleAudio"><i class="fa-solid fa-volume-high"></i></button>
    <button v-else type="button" class="btn btn-light" @click="toggleAudio"><i class="fa-solid fa-volume-xmark"></i></button>
    <button v-if="navigationPaused" type="button" class="btn btn-light" @click="toggleNavigation(false)"><i class="fa-solid fa-play"></i></button>
    <button v-else type="button" class="btn btn-light" @click="toggleNavigation(true, true)"><i class="fa-solid fa-pause"></i></button>
    <button type="button" class="btn btn-light" @click="endNavigation"><i class="camp-xmark"></i></button>
  </div>

  <div class="bottom-navigation d-sm-none d-flex flex-row justify-content-between position-absolute bottom-0 start-0 py-1 px-4">
    <div class="dropdown">
      <button class="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i :class="selectedVehicleType.icon"></i></button>
      <ul class="dropdown-menu px-3 mt-1 mini-custom-drop text-center" style="width: fit-content">
        <li v-for="vehicleType in vehicleTypes" :key="vehicleType.value" :class="{ 'selected-language': selectedVehicleType.value === vehicleType.value }" @click.prevent="toggleVehicleType(vehicleType)"><i :class="vehicleType.icon"></i></li>
      </ul>
    </div>
    <button v-if="soundOn" type="button" class="btn btn-light" @click.prevent="toggleAudio"><i class="fa-solid fa-volume-high"></i></button>
    <button v-else type="button" class="btn btn-light" @click.prevent="toggleAudio"><i class="fa-solid fa-volume-xmark"></i></button>
    <button type="button" class="btn btn-navigation" @click="reCenterMap"><i class="camp-other"></i></button>
    <!-- Ako je u url-u unit, prikazati home-button koji će zoomirati/voditi do te jedinice -->
    <button v-if="navigationPaused" type="button" class="btn btn-light" @click="toggleNavigation(false)"><i class="fa-solid fa-play"></i></button>
    <button v-else type="button" class="btn btn-light" @click="toggleNavigation(true, true)"><i class="fa-solid fa-pause"></i></button>
    <button type="button" class="btn btn-light" @click.prevent="endNavigation"><i class="camp-xmark"></i></button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import { useStoreMapFunctions } from '@/stores/storeMapFunctions'
import { useStoreSelectedFeatures } from '@/stores/storeSelectedFeatures'
import { $t } from '@/stores/storeTranslations'
import { useStoreMessageBox } from '@/stores/storeMessageBox'
import { useStoreNavigation } from '@/stores/storeNavigation'
import { useStoreDirections } from '@/stores/storeDirections'

@Component
export default class NavigationButtonsComponent extends Vue {
  private audioContext: AudioContext | null = null
  private audioContextUnlocked = false
  private mapFunctions = useStoreMapFunctions()
  envMode = import.meta.env.DEV // TODO vidjeti zašto baca grešku
  private storeSelectedFeatures = useStoreSelectedFeatures()
  private MessageBox = useStoreMessageBox()
  soundOn = true
  navigationPaused = true
  vehicleTypeDropdown = false
  vehicleTypes = [
    { icon: 'fa-solid fa-car', value: 'car', mapboxProfile: 'mapbox/driving' },
    { icon: 'fa-solid fa-walking', value: 'foot', mapboxProfile: 'mapbox/walking' }
  ]
  selectedVehicleType = { icon: 'fa-solid fa-car', value: 'car', mapboxProfile: 'mapbox/driving' }

  created() {
    useStoreNavigation().setPlayVoiceInstructionDel(this.playInstruction.bind(this))
    useStoreNavigation().setToggleNavigationDel(this.toggleNavigation.bind(this))
  }

  toggleNavigation(pauseNavigation: boolean, manual = false) {
    console.log(pauseNavigation, manual)
    this.navigationPaused = pauseNavigation
    if (this.navigationPaused && manual) {
      useStoreDirections().geolocateTrigger()
    } else if (this.navigationPaused) {
      useStoreNavigation().changeBannerInstruction($t('Navigation Paused.'))
    } else if (!manual) {
      useStoreDirections().geolocateTrigger()
      if (this.$router.currentRoute.value.name === 'navigationPreview') {
        this.$router.push({ name: 'navigationRun' })
        useStoreNavigation().playVoiceInstruction($t('Commencing navigation.'))
        useStoreNavigation().changeBannerInstruction($t('Commencing navigation.'))
      } else if (this.$router.currentRoute.value.name === 'poiNavigationPreview') {
        this.$router.push({ name: 'poiNavigationRun' })
        useStoreNavigation().playVoiceInstruction($t('Commencing navigation.'))
        useStoreNavigation().changeBannerInstruction($t('Commencing navigation.'))
      } else {
        useStoreNavigation().playVoiceInstruction($t('Resuming navigation...'))
        useStoreNavigation().changeBannerInstruction($t('Resuming navigation...'))
      }
    } else {
      //useStoreNavigation().changeBannerInstruction($t('Rerouting...')) TODO check if it is needed
    }
  }

  reCenterMap() {
    this.mapFunctions.getReCenterMapFun()
  }

  toggleAudio(playAudio: boolean = true) {
    this.soundOn = !this.soundOn
    if (this.soundOn) {
      if (playAudio) this.playInstruction($t('sound'))
    }
  }

  playInstruction(instruction: string) {
    if (!this.audioContextUnlocked) {
      this.unlockAudio()
    }
    if (this.soundOn) {
      const utterance = new SpeechSynthesisUtterance(instruction)
      window.speechSynthesis.speak(utterance)
      console.log(instruction)
    } else {
      console.log('Sound is muted.')
    }
  }

  private unlockAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const buffer = this.audioContext.createBuffer(1, 1, 22050)
    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(this.audioContext.destination)
    source.start(0)

    source.onended = () => {
      this.audioContextUnlocked = true
      const silentSound = new Audio()
      silentSound.src = ''
      silentSound
        .play()
        .then(() => {
          silentSound.pause()
          silentSound.currentTime = 0
        })
        .catch((error) => console.error(error))
    }
  }

  endNavigation() {
    useStoreDirections().clearRoute()
    if (this.$router.currentRoute.value.name === 'poiNavigationPreview' || this.$router.currentRoute.value.name === 'poiNavigationRun') {
      this.$router.push({ name: 'poiId' })
    } else {
      this.$router.push({ name: 'unitId' })
    }
  }

  toggleVehicleType(vehicleType: any) {
    this.selectedVehicleType = vehicleType
    this.vehicleTypeDropdown = false
    this.toggleNavigation(true)
    useStoreDirections().changeProfile(this.selectedVehicleType.mapboxProfile)
    if (this.$router.currentRoute.value.name !== 'navigationPreview') {
      this.$router.push({ name: 'navigationPreview' })
    }
  }

  toggleVehicleTypeDropdown() {
    this.vehicleTypeDropdown = !this.vehicleTypeDropdown
  }
}
</script>

<style scoped>
.custom-drop {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly; /* Distribute space evenly between items */
  padding: 0;
}

.custom-drop ul {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly; /* Ensure even spacing between list items */
  align-items: center; /* Vertically align the items */
  padding: 0;
  margin: 0;
  list-style-type: none; /* Remove default list styles */
}

.custom-drop li {
  margin: 0 12px; /* Provide spacing between the icons */
  cursor: pointer; /* Make the list item clickable */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 12px; /* Add padding for better click target */
  border-radius: 8px; /* Rounded edges for better design */
  transition: background-color 0.3s ease-in-out; /* Smooth background transition */
}

.custom-drop li:hover {
  background-color: #f0f0f0; /* Add hover effect */
}

.custom-drop li.selected-language {
  background-color: #e9e8e8;
  pointer-events: none; /* Disable click for the selected item */
}

.custom-drop i {
  font-size: 18px; /* Set icon size */
}

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

.btn-navigation {
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

.dropdown-menu {
  --bs-dropdown-min-width: 0px;
}

.dropdown-menu li {
  cursor: pointer;
  margin-top: 8px;
  margin-bottom: 8px;
}

.mini-custom-drop li.selected-language {
  background-color: #e9e8e8;
  margin-left: -10px;
  padding: 5px 10px;
  margin-right: -10px;
  border-radius: 5px;
  pointer-events: none;
}

.mini-custom-drop li:hover {
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

.bottom-navigation .bi-x-circle-fill {
  font-size: 20px;
  margin-left: -5px;
  margin-top: -5px;
  cursor: pointer;
  z-index: 10;
}
</style>
