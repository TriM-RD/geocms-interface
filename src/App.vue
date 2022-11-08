<template>
  <div id="nav">
    <router-link to="/">Dodaj Novi</router-link> |
    <router-link to="/show">Prikaži Sve</router-link> |
    <a href="http://blog.test/oauth/redirect">Auth</a>
  </div>
  <router-view/>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class Home extends Vue {
  mounted () {
    const temp = location.hash.substr(1)
    if (temp !== '') {
      const value = JSON.parse(atob(temp))
      console.log(value.access_token)
      localStorage.setItem('access_token', value.access_token)
      history.pushState('', document.title, window.location.pathname)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
