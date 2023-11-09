<template>
        <div class="mb-3 row justify-content-md-center" v-if="object ?.Stats[statTypeEnum.ElementType].Data === 'button'">
            <button data-bs-toggle="tooltip" data-bs-placement="top"
                    :class="`${object.Stats[statTypeEnum.Design].Data}`"
                    @click.prevent='regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, [JSON.parse(JSON.stringify(object)), ...entity])'>
                {{object.Stats[statTypeEnum.Label].Data}}
            </button>
        </div>
      <div class="mb-3 row justify-content-md-center" v-if="object ?.Stats[statTypeEnum.ElementType].Data !== 'button'">
        <div class="col-lg"></div>
          <div class="col">
            <div class="input-group">
              <label :title="specialCase()" for="exampleDataList" class="input-group-text">{{object.Stats[statTypeEnum.Label].Data }}</label>
              <component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`"  :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'></component>
            </div>
        </div>
        <div class="col-lg"></div>
      </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/mechanics/placeholderMechanic'
import {
  ActionTypeEnum,
  MechanicAbstract,
  ObjectTemplate,
  ObjectType,
  ObjectTypeEnum,
  RegionEnum,
  RegionType,
  StatType,
  StatTypeEnum,
  SubObjectTypeEnum
} from '@cybertale/interface'

@Options({
  props: {
    entity: Array,
    object: ObjectTemplate,
    index: Number,
    pageRefresh: {
      type: Boolean,
      default: true
    }
  }
})
export default class FormButtonComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.PlaceholderMechanic()
  objectTemplate = ObjectTemplate
  regionEnum = RegionEnum
  regionType = RegionType
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  object!: ObjectTemplate
  entity!: ObjectTemplate[]
  index!: number
  objectTemplates: ObjectTemplate[] = this.mechanic.InitSet(this.entity)
  renderComponent = false

  specialCase () {
    if (this.object !== undefined) {
      if (this.object.Stats[this.statTypeEnum.Tooltip] !== undefined) {
        return this.object.Stats[this.statTypeEnum.Tooltip].Data
      }
    }
  }

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
