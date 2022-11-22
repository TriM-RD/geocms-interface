<template v-if="renderComponent">
  <button :class="`${object.Stats[statTypeEnum.Design].Data}`" @Click.prevent='regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object)'>{{object.Stats[statTypeEnum.Label].Data}}</button>
  <slot></slot>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@/interface/manager/events/types/index'
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

  generateHtml (start = true, value : string) {
    if ((start && value.includes('/')) || (!start && !value.includes('/'))) {
      return ''
    } else {
      this.renderComponent = true
      return '<td>Test</td>'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
