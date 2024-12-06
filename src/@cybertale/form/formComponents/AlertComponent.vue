<template>
  <div class="alert" :class="object?.Stats[statTypeEnum.Design].Data">
    {{object.Stats[statTypeEnum.Label].Data}}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@cybertale/interface'

@Component
export default class AlertComponent extends Vue {
  @Prop() object!: ObjectTemplate

  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
}
</script>

<style scoped>
</style>
