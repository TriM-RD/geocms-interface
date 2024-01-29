<template>
  <div class="d-flex flex-column vh-100">
  <div v-if="($store.state.requiresAuth === 2 || $store.state.requiresAuth === 3)">
    <NavBarComponent/>
  </div>
  <div v-if="($store.state.requiresAuth === 2)">
    <NavComponent />
    <!-- TODO MAKE MODAL INTO A COMPONENT -->
    <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body">
            <iframe class="iframeModal" id="yourIframeId" src="https://tri-m.app/ormari/modal.php"></iframe>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
  <router-view :key="$route.fullPath"/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import NavBarComponent from '@/components/showComponents/NavBarComponent.vue'
import NavComponent from '@/components/showComponents/NavComponent.vue'
import FooterComponent from '@/components/showComponents/FooterComponent.vue'
import { Provide } from 'vue-property-decorator'
import { $t } from '@geocms/localization'
import http, { updateHeaders } from '@/http-common'
import { Definitions } from '@geocms/components'
import router from '@/router'

@Options({
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
  @Provide() router = router;
  @Provide() updateHeaders = updateHeaders;
  created (): void {
    const temp = location.hash.substr(1)
    if (temp !== '' && localStorage.getItem('access_token') === '') {
      const value = JSON.parse(atob(temp))
      localStorage.setItem('access_token', value.access_token)
      history.pushState('', document.title, window.location.pathname + window.location.search)
      location.assign('/')
    } else {
      this.checkBearer()
    }
  }

  async checkBearer () : Promise<void> {
    await http.get(process.env.VUE_APP_BASE_URL + 'user').then(response => {
      // success
      this.$store.state.name = response.data.name
      this.$store.state.email = response.data.email
      const tempFirms = response.data.firms ? response.data.firms : []
      if (localStorage.getItem('firm') === '' || localStorage.getItem('firm') == null || !tempFirms.includes(localStorage.getItem('firm'))) {
        this.$store.state.requiresAuth = 3
      } else {
        this.$store.commit('setFirmName', localStorage.getItem('firmName'))
        this.$store.state.requiresAuth = 2
      }
    }, response => {
      // error
      this.$store.state.requiresAuth = 1
      const temp = String(response)
      if (temp.includes('code 401')) {
        localStorage.setItem('access_token', '')
        this.$router.push('/')
        // window.location.href = 'http://blog.test/oauth/redirect'
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iframeModal {
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
