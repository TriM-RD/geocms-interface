<template>
  <div class="h-100" v-if="($store.state.requiresAuth === 2)">
    <MapComponent/>
  </div>
  <div v-if="($store.state.requiresAuth === 1)">
    <WelcomeComponent />
  </div>
  <div v-if="($store.state.requiresAuth === 3)">
    <FirmSelectionComponent />
  </div>
</template>

<script lang="ts">
import { Provide } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import WelcomeComponent from '@/components/WelcomeComponent.vue' // @ is an alias to /src
import { MapComponent } from '@geocms/components/src'
import FirmSelectionComponent from '@/components/showComponents/FirmSelectionComponent.vue'
import http from '@/http-common'
import { Definitions } from '@/definitions/appDefinitions'
import { $t } from '@/locales'
import router from '@/router'

@Options({
  components: {
    FirmSelectionComponent,
    MapComponent,
    WelcomeComponent
  }
})
export default class Home extends Vue {
  @Provide() http = http;
  @Provide() Definitions = Definitions;
  @Provide() translation = $t;
  @Provide() router = router;
  @Provide() selectedImage = require(`../assets/lang/${localStorage.getItem('lang') || 'en'}.svg`);
}
</script>
