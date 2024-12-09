<template>
  <div class="h-100" v-if="mainStore.requiresAuth === 2">
    <MapComponent />
  </div>
  <div v-if="mainStore.requiresAuth === 1">
    <WelcomeComponent />
  </div>
  <div v-if="mainStore.requiresAuth === 3">
    <FirmSelectionComponent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Provide } from 'vue-facing-decorator';
import { MapComponent, WelcomeComponent, FirmSelectionComponent, Definitions } from '@/@geocms';
import http, { updateHeaders } from '@/http-common';
import { $t } from '@geocms/localization';
import router from '@/router';
import { useStoreMain } from '@/stores/storeMain';

@Component({
  components: {
    MapComponent,
    WelcomeComponent,
    FirmSelectionComponent,
  },
})
export default class Home extends Vue {
  @Provide() http = http;
  @Provide() Definitions = Definitions;
  @Provide() translation = $t;
  @Provide() router = router;
  @Provide() updateHeaders = updateHeaders;
  mainStore = useStoreMain();
}
</script>