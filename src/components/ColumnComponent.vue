<template>
    <td class="text-truncate" style="max-width: 80px;">{{specialTruncate(object.Stats[statTypeEnum.Value].Data)}}</td>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator';
import {
  ObjectTemplate,
  ObjectType,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType
} from '@cybertale/interface'
@Component
export default class ColumnComponent extends Vue {
  @Prop() object!: ObjectTemplate
  @Prop() index!: number
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType

  specialTruncate (data: string) {
    const regex = /^(http|https):\/\/[a-z0-9\-.]+\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/i
    if (regex.test(data)) {
      if (data.includes('?')) {
        const parts = data.split('?')
        return parts[1]
      }
    }
    return data
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
