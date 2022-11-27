<template>
    <div class="container" style="margin:5%; text-align: center; ">
      <h1>Cyber Tale</h1>
    <div class="row justify-content-around" style="margin-top:3%">
        <div class="col-lg-5 col-md-5 align-self-center">
        <img src="../assets/logo.png" alt="Logo" width="120">
      </div>
    <div class="col-lg-7 col-md-7">
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc.</p>
        <p>Mauris eget neque at sem venenatis eleifend. Donec hendrerit, felis et imperdiet euismod, purus ipsum pretium metus, in lacinia nulla nisl eget sapien. Donec ut est in lectus consequat consequat.</p>
    </div>
  </div>
</div>
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
export default class WelcomeComponent extends Vue {
        statTypeEnum = StatTypeEnum
        objectTypeEnum = ObjectTypeEnum
        objectType = ObjectType
        regionType = RegionType
        regionEnum = RegionEnum
        object!: ObjectTemplate
}
</script>
