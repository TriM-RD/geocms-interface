<template>
  <div class="col">
    <div class="input-group">
      <label class="input-group-text" for="button-addon2">{{object.Stats[statTypeEnum.Label].Data }}</label>
      <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click.prevent="edit">{{ $t.edit }}</button>
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
} from '@cybertale/interface'
import router from '@/router'
import { Definitions } from '@/definitions/appDefinitions'
import { $t } from '../locales'
@Options({
  computed: {
    $t () {
      return $t
    }
  },
  props: {
    object: ObjectTemplate,
    index: Number
  }
})
export default class ECabinetColumnComponent extends Vue {
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
      name: Definitions.Entity.Edit,
      params: { id: this.object.Stats[this.statTypeEnum.Id].Data }
    })
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
