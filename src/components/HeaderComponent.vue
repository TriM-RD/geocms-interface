<template>
  <div class="position-relative" style="z-index: 9">
    <div class="header-container position-absolute top-0 start-50 translate-middle-x z-3">
      <nav class="header d-flex justify-content-around align-items-center mt-sm-3 p-2">
        <img class="d-flex justify-content-center" :src="propertyLogo" height="35px" />
        <p id="propertyName" class="mb-0 d-flex justify-content-center align-items-center mark-text">{{ propertyName }}</p>
        <div class="d-flex align-items-center" v-if="StoreSettings.accommodationTypes">
          <button class="btn btn-camp p-1 px-2 mark-text rounded-5 text-uppercase" @click="bookNowButton()" type="button">{{ $t('reserve') }}</button>
        </div>
        <div class="d-flex align-items-center justify-content-evenly justify-content-sm-center flex-column flex-sm-row" @click="visibility.weatherDialog = true" style="cursor: pointer">
          <img v-if="weatherData.icon" :src="weatherData.icon" width="30" />
          <p class="mark-text mb-0 ms-sm-1">{{ weatherData.temperature }}°C</p>
        </div>
      </nav>

      <BookNowComponent ref="bookNowRef" />

      <Dialog v-model:visible="visibility.weatherDialog" modal header="Weather" :dismissableMask="true" :style="{ width: '25rem', margin: '10px' }">
        <div class="d-flex justify-content-center gap-4">
          <h1 class="display-4 align-content-center mb-0">
            <strong> {{ weatherData.temperature }} </strong>°C
          </h1>
          <img v-if="weatherData.icon" :src="weatherData.icon" style="width: 100px" />
        </div>
        <Divider />
        <div class="d-flex flex-wrap align-items-center justify-content-around">
          <p class="my-1">{{ weatherData.lastUpdated }}</p>
          <p class="my-1">
            <strong> {{ weatherData.city }} </strong>, {{ weatherData.region }}
          </p>
        </div>
        <Divider />
        <div class="d-flex align-items-center justify-content-around">
          <p class="d-flex align-items-center flex-column mb-0"><i class="fa-solid fa-wind my-2"></i> {{ weatherData.wind }} km/h</p>
          <p class="d-flex align-items-center flex-column mb-0"><i class="fa-solid fa-droplet my-2"></i> {{ weatherData.humidity }} %</p>
          <p class="d-flex align-items-center flex-column mb-0"><i class="fa-solid fa-umbrella my-2"></i> {{ weatherData.rain }} %</p>
        </div>
        <Divider />
        <div class="d-flex align-items-center justify-content-around">
          <p v-for="(forecast, index) in weatherData.forecast" :key="index" class="d-flex align-items-center flex-column">
            {{ forecast.day.toUpperCase() }}
            <img v-if="forecast.icon" :src="forecast.icon" class="mt-1 mb-2" style="width: 30px" />
            {{ forecast.temperature }}°C
          </p>
        </div>
      </Dialog>
    </div>
    <button v-show="isMobile && !legendVisible" @click="toggleLegend" :class="{ 'top-0 end-0': !isMobile }" class="toggle-btn position-absolute" :disabled="showInfoToggle">
      <img :src="legendIcon" />
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import BookNowComponent from '@/components/BookNowComponent.vue'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
const weatherIcons = import.meta.glob('/src/assets/weather/**/*.svg', { eager: true })
import { useStoreSettings } from '@/stores/storeSettings'
import { $t } from '../stores/storeTranslations'
import { useStoreLegend } from '@/stores/storeLegend'
import legendIcon from '@/assets/icons/rgb-legend.svg'

@Component({
  methods: { $t },
  components: {
    BookNowComponent,
    Dialog,
    Divider
  }
})
export default class HeaderComponent extends Vue {
  StoreSettings = useStoreSettings()
  legendIcon = legendIcon
  toggleLegend() {
    useStoreLegend().toggleDisplayLegend()
  }

  get isMobile() {
    return useStoreLegend().getIsMobile
  }

  get legendVisible() {
    return useStoreLegend().getDisplayLegend
  }

  get showInfoToggle() {
    return useStoreLegend().disableLegend
  }

  visibility = {
    weatherDialog: false
  }
  $t = $t
  daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  weatherData: {
    temperature: string | null
    icon: string | null
    lastUpdated: any
    city: any
    region: any
    wind: any
    humidity: any
    rain: any
    forecast: {
      day: any
      temperature: string | null
      icon: string | null
    }[]
  } = {
    temperature: null,
    icon: null,
    lastUpdated: null,
    city: null,
    region: null,
    wind: null,
    humidity: null,
    rain: null,
    forecast: []
  }

  get propertyLogo() {
    return this.StoreSettings.oldMapSettings ? this.StoreSettings.oldMapSettings.logo : '@/assets/img/logo.svg'
  }

  get propertyName() {
    return this.StoreSettings.oldMapSettings ? this.StoreSettings.oldMapSettings.naziv : 'Naziv Kampa'
  }

  bookNowButton() {
    if (useStoreLegend().isMobile) {
      useStoreLegend().toggleDisplayLegend(false)
      useStoreLegend().toggleDisableLegend(true)
    }

    const bookNowComp = this.$refs.bookNowRef as BookNowComponent

    if (bookNowComp.visibility.bookSelect || bookNowComp.confirmedSteps.fourth) {
      bookNowComp.clear()
    }

    const { accommodationTypes, promoCode } = this.StoreSettings

    const step = accommodationTypes.length === 1 ? (promoCode ? 2 : 3) : 1
    console.log(step)
    bookNowComp.bookStep(step)
  }

  mounted() {
    this.fetchWeather()
  }

  async fetchWeather() {
    const apiKey = '36b9f41791c44268896103416242808'
    const lat = this.StoreSettings.initialRecenter[1] // 45.1914489323818 // uzeti od kampa
    const lon = this.StoreSettings.initialRecenter[0] // 13.599916501804065 // uzeti od kampa
    const days = 3
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&days=${days}&q=${lat},${lon}&aqi=no`

    try {
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error('Network response was not OK!')
      }

      const data = await response.json()

      this.weatherData.temperature = data.current.temp_c
      const iconPath = data.current.condition.icon.match(/\/(day|night)\/\d+/)[0].substring(1)
      this.weatherData.icon = weatherIcons[`/src/assets/weather/${iconPath}.svg`]?.default || null
      this.weatherData.lastUpdated = new Date(data.current.last_updated).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
      this.weatherData.city = data.location.name
      this.weatherData.region = data.location.region
      this.weatherData.wind = data.current.wind_kph
      this.weatherData.humidity = data.current.humidity
      this.weatherData.rain = data.forecast.forecastday[0].day.daily_chance_of_rain

      for (let i = 1; i <= 2; i++) {
        const iconPath = data.forecast.forecastday[i].day.condition.icon.match(/\/(day|night)\/\d+/)[0].substring(1)
        this.weatherData.forecast.push({
          day: new Date(data.forecast.forecastday[i].date).toLocaleDateString('en-GB', { weekday: 'short' }),
          temperature: data.forecast.forecastday[i].day.avgtemp_c,
          icon: weatherIcons[`/src/assets/weather/${iconPath}.svg`]?.default || null
        })
      }
    } catch (error) {
      console.error('Error fetching the weather data:', error)
    }
  }
}
</script>

<style>
.clear-button {
  width: fit-content;
}

.header-container {
  pointer-events: none;
  width: 100%;
  max-width: 600px; /* Adjust this value as needed */
}

.header {
  pointer-events: auto;
  box-shadow: 0 0px 10px rgb(0 0 0 / 30%);
  width: 100%;
  background-color: white; /* Add this to ensure the header is visible on the map */
  border-radius: var(--bs-border-radius-xxl) !important;
}

.header p {
  line-height: 1;
  font-weight: 600;
  font-size: 16px;
}

.fa-wind,
.fa-droplet,
.fa-umbrella {
  font-size: 20px;
  color: #56ba59;
}

.toggle-btn {
  pointer-events: auto;
  z-index: 3;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin: 1rem;
}

@media (max-width: 1010px) {
  .toggle-btn {
    box-shadow: 3px 5px 10px -3px rgb(0 0 0 / 30%);
    margin: 0px;
    top: var(--header-height, 83px);
    right: 10px;
  }
}

@media (max-width: 576px) {
  .toggle-btn {
    box-shadow: 3px 5px 10px -3px rgb(0 0 0 / 30%);
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    margin: 0px;
    top: var(--header-height, 83px);
    left: 0px;
  }

  .info-toggle-btn {
    z-index: 0;
    box-shadow: none !important;
    left: 40px !important;
  }
  #propertyName {
    width: min-content;
  }

  .header-container {
    width: 100%;
    max-width: none;
  }

  .header {
    box-shadow: 0 0px 10px rgb(0 0 0 / 30%);
    height: 85px;
    width: 100%;
    border-radius: 0px !important;
  }
}
</style>
