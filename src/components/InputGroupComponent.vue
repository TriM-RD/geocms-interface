<template>
        <div class="mb-3 row justify-content-md-center" v-if="object ?.Stats[statTypeEnum.ElementType].Data === 'button'">
            <button data-bs-toggle="tooltip" data-bs-placement="top"
                    :class="`${object.Stats[statTypeEnum.Design].Data}`"
                    @click.prevent='regionType.RegionTypes[object.Region].ObjectTypes[objectTypeEnum.Button].ChooseSubType(JSON.parse(JSON.stringify(objectCopy(object))))'>
                {{object.Stats[statTypeEnum.Label].Data}}
            </button>
        </div>
      <div class="mb-3 row justify-content-md-center" v-if="object ?.Stats[statTypeEnum.ElementType].Data !== 'button'">
        <div class="col-lg"></div>
          <div class="col">
            <div class="input-group">
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
export default class InputGroupComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.PlaceholderMechanic()
  objectTemplate = ObjectTemplate
  regionEnum = RegionEnum
  regionType = RegionType
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  subObjectTypeEnum = SubObjectTypeEnum
  actionTypeEnum = ActionTypeEnum
  objectType = ObjectType
  object!: ObjectTemplate
  entity!: ObjectTemplate[]
  index!: number
  objectTemplates: ObjectTemplate[] = []
  renderComponent = false

  mounted () {
    this.objectTemplates = this.mechanic.InitSet(this.entityCopy(this.entity))
  }

  specialCase () {
    if (this.object !== undefined) {
      if (this.object.Stats[this.statTypeEnum.Tooltip] !== undefined) {
        return this.object.Stats[this.statTypeEnum.Tooltip].Data
      }
    }
  }

  objectCopy (_object : ObjectTemplate) : ObjectTemplate {
    if (_object.Stats[StatTypeEnum.Value]) { _object.Stats[StatTypeEnum.Value].Data = this.object.Stats[StatTypeEnum.Value].Data }
    if (_object.Stats[StatTypeEnum.ErrorMessage]) { _object.Stats[StatTypeEnum.ErrorMessage].Data = this.object.Stats[StatTypeEnum.ErrorMessage].Data }
    if (_object.Stats[StatTypeEnum.IsValid]) { _object.Stats[StatTypeEnum.IsValid].Data = this.object.Stats[StatTypeEnum.IsValid].Data } else if (this.object.Stats[StatTypeEnum.IsValid]) {
      _object.Stats[StatTypeEnum.IsValid] = StatType.StatTypes[StatTypeEnum.IsValid]()
      _object.Stats[StatTypeEnum.IsValid].Data = this.object.Stats[StatTypeEnum.IsValid].Data
    }
    return new ObjectTemplate(_object.Region, _object.ObjectEnum, _object.SubObjectEnum, _object.ActionEnum, _object.Stats)
  }

  entityCopy (entities: ObjectTemplate[]) : ObjectTemplate[] {
    const arr = []
    entities = JSON.parse(JSON.stringify(entities))
    for (const entity of entities) {
      entity.Stats[StatTypeEnum.Tag].Data = entity.Stats[StatTypeEnum.Tag].Data + this.object.Stats[StatTypeEnum.Tag].Data
      arr.push(this.objectCopy(entity))
    }
    return arr
  }

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    // _object.Stats[StatTypeEnum.Tag].Data = uuidv4()
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
