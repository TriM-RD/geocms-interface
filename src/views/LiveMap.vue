<template>
  <MapComponent :runMapInit="runMapInit"></MapComponent>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import MapComponent from '@/components/MapComponent.vue'
import { useStoreColors } from '@/stores/storeColors'
import { useStoreMapObjects } from '@/stores/storeMapObjects'
import SearchComponent from '@/components/SearchComponent.vue'
import { useStoreSettings } from '@/stores/storeSettings'

@Component({
  components: { SearchComponent, MapComponent }
})
export default class LiveMap extends Vue {
  renderComponent = false
  runMapInit = this.Init.bind(this)

  private classColors = {
    obala: '#f3f2e7',
    zemlja: '#dedfc4',
    cesta: '#e2e6e8',
    vegetacija: '#98b87c',
    parking_podloga: '#e2e6e8',
    'objekt wc roof1': '#f28586',
    'objekt wc roof2': '#f28586',
    'objekt podloga': '#f28586',
    bazen_podloga: '#e4e9e8',
    bazen: '#8decfe',
    billboard: '#ffffff',

    // new classes
    periphery: '#A7DD88',
    campground: '#f3f2e7',
    road: '#e2e6e8',
    parking: '#e0e0e0',
    pool: '#8decfe',
    patio: '#dedfc4',
    line: '#ffffff', // for removal
    line_white: '#ffffff',
    line_black: '#000000',
    grass: '#B4D894',
    vegetation: '#709F50',
    unit_base_gray: '#e2e6e8',
    unit_base_green: '#95D07B',
    fence: '#000000',
    hedge: '#e2e6e8', // for removal
    treetop_light: '#8FBE72',
    treetop_dark: '#709F50',
    coastline: 'transparent',
    object_roof_light: '#f28586',
    object_roof_dark: '#CF7273',
    object_roof_light_gray: '#e0e0e0',
    object_roof_dark_gray: '#bbbbbb',
    object_base: '#F2F2F2',
    playground: '#68b29e',
    tennis: '#d2836f',
    barrier: '#ffffff',
    barrier_red: '#D20808',

    // Jadranka
    zone_Cikat: '#f3614f',
    zone_Slatina: '#D24E3D',
    zone_Bijar1: '#D24E3D',
    zone_Bijar2: '#4CB8BE',

    // Atea
    gaia_green_villas: '#bbbbbb',

    // Oliva
    mhPremium: '#a6846b',
    mhComfort: '#da4456',
    mhStandard: '#d6915b',
    pitchZone1: '#371758',
    pitchZone2: '#427d9c',
    pitchZone3: '#989543'
  }

  async Init() {
    await fetch(`https://campsabout.com/mapAPI/typeSJColors.php?id=${useStoreSettings().get('propertyId')}&group=${useStoreSettings().get('groupName')}`).then(async (response) => {
      if (!response.ok) return
      const data = await response.json()
      let result: { [index: string]: string } = {}
      Object.keys(data).forEach((element: string) => {
        result[element] = data[element][0].color
      })
      useStoreColors().set(Object.assign(this.classColors, result))
    })
    await fetch(`https://campsabout.com/mapAPI/gjobjekti.php?id=${useStoreSettings().get('propertyId')}&group=${useStoreSettings().get('groupName')}`).then(async (response) => {
      if (!response.ok) return

      const data = await response.json()

      // Filter out objects where noClick is 1
      const filteredData = data.filter((item: any) => item.noClick != 1)

      // Set the filtered data to the store
      useStoreMapObjects().set(filteredData)
    })
  }
}
</script>

<style scoped></style>
