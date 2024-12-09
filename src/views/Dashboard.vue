<template>
  <StatsComponent/>
  <GraphComponent/>
</template>

<script lang="ts">
import {Component, Provide, Vue} from 'vue-facing-decorator'
import { Definitions } from '@/@geocms'
import http, { updateHeaders } from '@/http-common'

import { $t } from '@geocms/localization'
import router from '@/router'
import StatsComponent from '@/components/dashboard/StatsComponent.vue'
import GraphComponent from '@/components/dashboard/GraphComponent.vue'

@Component({
  components: {
    GraphComponent,
    StatsComponent
  }
})
export default class Dashboard extends Vue {
  @Provide() http = http;
  @Provide() Definitions = Definitions;
  @Provide() translation = $t;
  @Provide() router = router;
  @Provide() updateHeaders = updateHeaders;
}
</script>
