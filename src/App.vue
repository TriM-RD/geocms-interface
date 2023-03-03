<template>
  <div v-if="($store.state.requiresAuth === 2)">
    <NavBarComponent/>
    <NavComponent />
    <FooterComponent />
  </div>
  <router-view :key="$route.fullPath"/>
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
import WelcomeComponent from '@/components/WelcomeComponent.vue'
import http from '@/http-common'

@Options({
  components: {
    NavBarComponent,
    NavComponent,
    FooterComponent,
    WelcomeComponent
  }
})
export default class App extends Vue {
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
      this.$store.state.requiresAuth = 2
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
