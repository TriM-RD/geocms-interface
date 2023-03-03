<template v-if="renderComponent">
  <button data-bs-toggle="tooltip" data-bs-placement="top" :data-bs-title="specialCase()" :class="`${object.Stats[statTypeEnum.Design].Data}`" @click.prevent='regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object)'>{{object.Stats[statTypeEnum.Label].Data}}</button>
  <slot></slot>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from 'cyber-interface'
@Options({
  props: {
    object: ObjectTemplate
  }
})
export default class SubmitButtonComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  object!: ObjectTemplate
  renderComponent= false

  specialCase () {
    if (this.object !== undefined) {
      if (this.object.Stats[this.statTypeEnum.Tooltip] !== undefined) {
        return this.object.Stats[this.statTypeEnum.Tooltip].Data
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
