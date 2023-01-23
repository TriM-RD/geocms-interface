<template>
  <div class="col">
    <div class="input-group">
      <label class="input-group-text" for="button-addon2">Osig_3</label>
      <button class="btn btn-outline-secondary" type="button" id="button-addon2">Edit</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { MechanicAbstract } from '@/interface/manager/mechanics/mechanicAbstract'
import { Manager } from '@/interface/manager/mechanics/formMechanic'
import { RegionEnum, ObjectTypeEnum, SubObjectTypeEnum, ActionTypeEnum, StatTypeEnum, StatType, ObjectType, RegionType } from '@/interface/manager/events/types/index'
@Options({
  props: {
    object: ObjectTemplate,
    index: Number
  }
})
export default class ColumnComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.FormMechanic()
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  object!: ObjectTemplate
  index!: number

  beforeUnmount () {
    // this.mechanic.UnsubscribeConditions()
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetVueComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
