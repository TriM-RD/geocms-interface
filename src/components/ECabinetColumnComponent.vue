<template>
  <div class="col">
    <div class="input-group">
      <label class="input-group-text" for="button-addon2">{{object.Stats[statTypeEnum.Label].Data }}</label>
      <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click.prevent="edit">Edit</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import {
  ObjectTemplate,
  ObjectType,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType
} from 'cyber-interface'
import router from '@/router'
@Options({
  props: {
    object: ObjectTemplate,
    index: Number
  }
})
export default class ColumnComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  object!: ObjectTemplate
  index!: number

  beforeUnmount () {
    // this.mechanic.UnsubscribeConditions()
  }

  edit () {
    router.push({
      name: 'DeviceEdit',
      params: { id: this.object.Stats[this.statTypeEnum.Id].Data }
    })
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetVueComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
