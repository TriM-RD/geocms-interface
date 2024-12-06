<template>
  <div>
    <router-view name="header" />
    <router-view />
    <LiveMap></LiveMap>
    <MapFooter />
    <router-view name="navigationButtons" />
    <router-view name="legend" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import MapFooter from '@/components/footer/MapFooter.vue'
import LiveMap from '@/views/LiveMap.vue'
import { useStoreMessageBox } from '@/stores/storeMessageBox'
import { useRouter } from 'vue-router'
import { useStoreLocation } from '@/stores/storeLocation'
import { useStoreMapFunctions } from '@/stores/storeMapFunctions'
import { $t } from '@/stores/storeTranslations'

@Component({
  components: {
    LiveMap,
    MapFooter
  }
})
export default class Main extends Vue {
  private MessageBox = useStoreMessageBox()
  private router = useRouter()
  private LocationStore = useStoreLocation()

  mounted() {
    if (['true', 'false'].includes(String(window.localStorage.getItem('noGps')?.toLocaleLowerCase()))) return
    this.MessageBox.setData({
      message: $t('Load message'),
      acceptButtonText: $t('OK'),
      showDeclineButton: true,
      onAccept: () => this.LocationStore.setupLocationTracking(), //TODO cover case when user accepts but declines afterwards
      onDecline: () => {
        window.localStorage.setItem('noGps', 'true')
        useStoreMapFunctions().reCenterMapFun()
      }
    })
    this.router.push({ name: 'dialog' })
  }
}
</script>
