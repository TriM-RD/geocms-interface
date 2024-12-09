<template>
  <div class="col">
    <div class="input-group">
      <label class="input-group-text" for="button-addon2">{{object.Stats[statTypeEnum.Label].Data }}</label>
      <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click.prevent="edit">{{ $t.edit }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import {
  ObjectTemplate,
  ObjectType,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType
} from '@cybertale/interface'
import router from '@/router'
import { Definitions } from '@/@geocms'
import { $t } from '@geocms/localization'
import {Prop} from "vue-facing-decorator";
@Component({
  computed: {
    $t () {
      return $t
    }
  }
})
export default class ECabinetColumnComponent extends Vue {
  @Prop() index!: number
  @Prop() object!: ObjectTemplate
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  $t = $t

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
