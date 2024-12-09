<template>
  <div>test</div>
  <div class="d-flex flex-column vh-100">
    <div v-if="(storeMain.requiresAuth === 2 || storeMain.requiresAuth === 3)">
      <NavBarComponent />
    </div>
    <div v-if="(storeMain.requiresAuth === 2)">
      <NavComponent />
      <!-- Modal and other components -->
      <FooterComponent />
    </div>
    <router-view :key="route.fullPath" />
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-facing-decorator';
import NavBarComponent from '@/components/showComponents/NavBarComponent.vue';
import NavComponent from '@/components/showComponents/NavComponent.vue';
import FooterComponent from '@/components/showComponents/FooterComponent.vue';
import { $t } from '@geocms/localization';
import http, { updateHeaders } from '@/http-common';
import { Definitions } from '@/@geocms';
import { useStoreMain } from "@/stores/storeMain";
import { useRouter, useRoute } from "vue-router";

@Component({
  components: {
    NavBarComponent,
    NavComponent,
    FooterComponent
  }
})
export default class App extends Vue {
  @Provide() http = http;
  @Provide() Definitions = Definitions;
  @Provide() translation = $t;
  @Provide() router = useRouter();
  @Provide() route = useRoute();
  @Provide() updateHeaders = updateHeaders;

  storeMain = useStoreMain();

  created(): void {
    const temp = location.hash.substr(1);
    if (temp !== '' && localStorage.getItem('access_token') === '') {
      const value = JSON.parse(atob(temp));
      localStorage.setItem('access_token', value.access_token);
      history.pushState('', document.title, window.location.pathname + window.location.search);
      location.assign('/');
    } else {
      this.checkBearer();
    }
  }

  async checkBearer(): Promise<void> {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL;
    await http.get(baseUrl + 'user').then(response => {
      // Success
      this.storeMain.name = response.data.name;
      this.storeMain.email = response.data.email;
      const tempFirms = response.data.firms ? response.data.firms : [];
      const storedFirm = localStorage.getItem('firm');

      if (
          !storedFirm ||
          !tempFirms.includes(storedFirm)
      ) {
        this.storeMain.requiresAuth = 3;
      } else {
        this.storeMain.setFirmName(localStorage.getItem('firmName') || '');
        this.storeMain.requiresAuth = 2;
      }
    }).catch(error => {
      // Error
      this.storeMain.requiresAuth = 1;
      if (error.response && error.response.status === 401) {
        localStorage.setItem('access_token', '');
        this.router.push('/');
      }
    });
  }
}
</script>

<style scoped>
.iframeModal,
.iframeModalAcc {
  width: 100%;
  height: 50vh;
  overflow: hidden;
}

@media screen and (max-width: 768px) {
  .modal-dialog {
    max-width: 100%;
  }

  .iframeModal {
    height: 50vh;
  }
}
</style>