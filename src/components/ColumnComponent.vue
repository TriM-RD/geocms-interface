<template>
  <!--th scope="row"><img alt="arrow" width="27" src="../assets/arrow.png"></th-->
  {{ object.Stats[statTypeEnum.Value].Data }}
  <!--td class="text-truncate" style="max-width: 80px">{{ specialTruncate(object.Stats[statTypeEnum.Value].Data) }}</td-->
</template>

<script lang="ts">
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType } from '@cybertale/interface'
import { Component, Prop, Vue } from 'vue-facing-decorator'
@Component
export default class ColumnComponent extends Vue {
  @Prop() readonly entity!: ObjectTemplate[]
  @Prop() readonly object!: ObjectTemplate
  @Prop() readonly index!: number
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType

  beforeUnmount() {
    // this.mechanic.UnsubscribeConditions()
  }

  specialTruncate(data: string) {
    const regex = /^(http|https):\/\/[a-z0-9\-.]+\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/i
    if (regex.test(data)) {
      if (data.includes('?')) {
        const parts = data.split('?')
        return parts[1]
      }
    }
    return data
  }

  getComponent(_regionEnum: number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
