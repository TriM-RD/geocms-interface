<template>
  <div :class="`${object.Stats[statTypeEnum.Design].Data}`">
    {{object.Stats[statTypeEnum.Value].Data}}
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
export default class AlertComponent extends Vue {
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

</style>
