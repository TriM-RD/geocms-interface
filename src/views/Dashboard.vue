<template>
  <StatsComponent/>
  <GraphComponent/>
</template>

<script lang="ts">
import { Provide } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import { Definitions } from '@geocms/components/src'
import http, { updateHeaders } from '@/http-common'

import { $t } from '@geocms/localization'
import router from '@/router'
import StatsComponent from '@/components/dashboard/StatsComponent.vue'
import GraphComponent from '@/components/dashboard/GraphComponent.vue'

@Options({
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
