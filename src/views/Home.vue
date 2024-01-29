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
import { MapComponent, WelcomeComponent, FirmSelectionComponent, Definitions } from '@geocms/components/src'
import http, { updateHeaders } from '@/http-common'

import { $t } from '@geocms/localization'
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
  @Provide() updateHeaders = updateHeaders;
}
</script>
