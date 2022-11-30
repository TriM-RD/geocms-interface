<template>
  <div v-if="($store.state.requiresAuth === true)">
    <NavBarComponent/>
    <NavComponent />
    <!-- Contect></Contect-->
    <FooterComponent />
  </div>
  <div v-if="($store.state.requiresAuth === false)">
    <WelcomeComponent />
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
import WelcomeComponent from '@/components/WelcomeComponent.vue'
import http from '@/http-common'
import createStore from '@/store/index'

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
      console.log(value.access_token)
      localStorage.setItem('access_token', value.access_token)
      history.pushState('', document.title, window.location.pathname + window.location.search)
      location.assign('/home')
      // alert('yes')
      // this.$router.replace('/home')
    } else {
      this.checkBearer()
    }
  }

  async checkBearer () : Promise<void> {
    await http.get('http://blog.test/api/user').then(response => {
      // success
      this.$store.state.name = response.data.name
      this.$store.state.email = response.data.email
      this.$store.state.requiresAuth = true
    }, response => {
      // error
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
