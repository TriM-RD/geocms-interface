<template>
  <div v-if="!reRender">
    <div v-if="returnIfExists(statTypeEnum.ElementType) === 'button'" class="mb-3 row justify-content-md-center">
      <button data-bs-toggle="tooltip" data-bs-placement="top"
              :class="object.Stats[statTypeEnum.Design].Data"
              @click.prevent='regionType.RegionTypes[object.Region].ObjectTypes[objectTypeEnum.Button].ChooseSubType(JSON.parse(JSON.stringify(objectCopy(object as ObjectTemplate))) as ObjectTemplate)'>
        {{object.Stats[statTypeEnum.Label].Data}}
      </button>
    </div>
    <div v-else class="mb-3 row justify-content-md-center">
      <div class="col-lg"></div>
      <div class="col">
        <div class="input-group" v-for="(group, index) in groupedObjectTemplates" :key="`${ index }-${ Math.random().toString(36).slice(2, 7) }`">
          <component v-for="(_objectTemplate, key) in group" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate' :key="`${ key }-${ Math.random().toString(36).slice(2, 7) }`"></component>
        </div>
      </div>
      <div class="col-lg"></div>
    </div>
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
  computed: {
    ObjectTemplate () {
      return ObjectTemplate
    }
  },
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
  pageRefresh!: boolean

  get groupedObjectTemplates () : ObjectTemplate[][] {
    const groups = []
    let currentGroup: ObjectTemplate[] = []

    this.objectTemplates.forEach(_objectTemplate => {
      currentGroup.push(_objectTemplate)

      if (_objectTemplate.Stats[StatTypeEnum.BreakLine]) {
        groups.push(currentGroup)
        currentGroup = []
      }
    })

    // Push the last group if it's not empty
    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }

  returnIfExists (tag: number): string {
    if (this.object.Stats[tag]) {
      return this.object.Stats[tag].Data
    }
    return ''
  }

  mounted () : void {
    this.objectTemplates = this.mechanic.InitSet(this.entityCopy(this.entity))
  }

  get reRender () : boolean {
    this.objectTemplates = this.mechanic.InitSet(this.entityCopy(this.entity))
    return this.pageRefresh
  }

  objectCopy (_object : ObjectTemplate) : ObjectTemplate {
    if (_object.Stats[StatTypeEnum.Inherit]) {
      for (const stat of JSON.parse(_object.Stats[StatTypeEnum.Inherit].Data)) {
        if (_object.Stats[stat]) {
          _object.Stats[stat].Data = this.object.Stats[stat].Data
        } else if (this.object.Stats[stat]) {
          _object.Stats[stat] = StatType.StatTypes[stat]()
          _object.Stats[stat].Data = this.object.Stats[stat].Data
        }
      }
    }
    return new ObjectTemplate(_object.Region, _object.ObjectEnum, _object.SubObjectEnum, _object.ActionEnum, _object.Stats)
  }

  entityCopy (entities: ObjectTemplate[]) : ObjectTemplate[] {
    const arr = []
    entities = JSON.parse(JSON.stringify(entities))
    for (const entity of entities) {
      entity.Stats[StatTypeEnum.Tag].Data = entity.Stats[StatTypeEnum.Tag].Data + this.object.Stats[StatTypeEnum.Tag].Data
      if (entity.Stats[StatTypeEnum.Option]) {
        entity.Stats[StatTypeEnum.Option].Data = this.object.Stats[StatTypeEnum.Option].Data
      }
      arr.push(this.objectCopy(entity))
    }
    return arr
  }

  beforeUnmount () : void {
    this.mechanic.UnsubscribeConditions()
  }

  getComponent (_regionEnum : number, _objectEnum: number): StatTypeEnum {
    // _object.Stats[StatTypeEnum.Tag].Data = uuidv4()
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
