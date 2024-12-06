<template></template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator'
import { useStoreDirections } from '@/stores/storeDirections'
import { useStoreLocation } from '@/stores/storeLocation'
import { useStoreNavigation } from '@/stores/storeNavigation'
import { $t } from '@/stores/storeTranslations'
import { useRouter } from 'vue-router'
@Component
export default class NavigationPreview extends Vue {
  created() {
    if (!useStoreDirections().directionsOnRoute) {
      if (this.$router.currentRoute.value.name === 'poiNavigationPreview') {
        this.$router.push({ name: 'poiId' })
      } else {
        this.$router.push({ name: 'unitId' })
      }
    }
  }
  mounted() {
    if (useStoreDirections().directionsOnRoute) {
      //TODO Mapbox setRoute apparently needs to be given cooridantes in reverse order, if so remove TODO
      useStoreDirections().setRoute([useStoreLocation().lng, useStoreLocation().lat], { id: this.$route.params.id })
      useStoreNavigation().changeBannerInstruction($t('When ready press PLAY Button'))
    } else {
      if (this.$router.currentRoute.value.name === 'poiNavigationPreview') {
        this.$router.push({ name: 'poiId' })
      } else {
        this.$router.push({ name: 'unitId' })
      }
    }
  }

  handleNoRoute() {
    // Remove the route annotation
    //document.querySelectorAll('.annotation.route').forEach((el) => el.remove())
    // Add the 'message' class to the body
    //document.body.classList.add('message')
    // Get language from URL and check the active profile (car or walking)
    //const activeProfile = document.querySelector('.profile-switch.active')?.id
    //const lang = this.langFromURL // Assume this is set somewhere in your code
    //const messageType = activeProfile === 'car' ? 'Switch walking' : 'Switch driving'
    // Create the message HTML
    /*const message = `
    <div class="annotation">
      <h3>${this.translations['Important message'][0][lang]}</h3>
      <p>${this.translations['Routing not available'][0][lang]}
      ${this.translations[messageType][0][lang]}</p>
      <div class="annotation-buttons">
        <div class="confirm">${this.translations['Fine'][0][lang]}</div>
      </div>
    </div>
  `

    // Append the message to the body
    document.body.insertAdjacentHTML('beforeend', message)*/
    // Add event listener to the confirm button
    /*const confirmButton = document.querySelector('.confirm')
    if (confirmButton) {
      confirmButton.addEventListener('click', () => {
        // Remove the 'message' class and annotation when clicked
        document.body.classList.remove('message')
        document.querySelectorAll('.annotation').forEach((el) => el.remove())
      })
    }*/
  }

  updateUIForNewRoute() {
    // Remove route annotations
    /*document.querySelectorAll('.annotation.route').forEach((el) => el.remove())

    // Check if the geolocate control is visible and hide time-distance if true
    const geolocateBackground = document.querySelector('.mapboxgl-ctrl-geolocate-background')
    if (geolocateBackground && geolocateBackground.style.display !== 'none') {
      document.querySelectorAll('.time-distance').forEach((el) => (el.style.display = 'none'))
    }*/
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
</style>
