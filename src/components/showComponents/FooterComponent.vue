<template>
    <footer class="fixed-bottom" id="footer">
      <router-link to="/" class="nav1-link">Scan <img alt="QR" width="25" src="../../assets/QRcode.png"></router-link>
      <router-link to="/" class="nav1-link">Add<img alt="plus" width="25" src="../../assets/plus.png"></router-link>
    </footer>
    <router-view/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@/interface/manager/events/types'
@Options({
  props: {
    object: ObjectTemplate
  }
})
export default class FooterComponent extends Vue {
    statTypeEnum = StatTypeEnum
    objectTypeEnum = ObjectTypeEnum
    objectType = ObjectType
    regionType = RegionType
    regionEnum = RegionEnum
    object!: ObjectTemplate
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav1-link {
  display: inline-block;
  text-decoration: none;
  color: #2c3e50;
  border-style: solid;
  border-width: thin;
  border-color: #d4d7d9;
  border-radius: 2px;
  padding: 15px;
  width: 49%;
}
.nav1-link:hover{
  background-color:#97999c;
  color: white;
}
#footer {
  position: absolute;
  bottom: 1.5%;
  width: 100%;
}
</style>
