<template>
  <div class="row" v-if="renderPage">
    <div class="col-12 col-sm-6 d-flex mt-1" v-for="(group, index) in groupedObjectTemplates" :key="`${index}-${Math.random().toString(36).slice(2, 7)}`">
      <component v-for="(_objectTemplate, key) in group" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object="_objectTemplate" :key="`${key}-${Math.random().toString(36).slice(2, 7)}`"></component>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { Manager } from '@/mechanics/modalHeaderMechanic'
import { ActionTypeEnum, MechanicAbstract, ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatType, StatTypeEnum, SubObjectTypeEnum } from '@cybertale/interface'

@Component
export default class ModalHeaderGroupComponent extends Vue {
  @Prop() readonly entity!: ObjectTemplate[]
  @Prop() readonly object!: ObjectTemplate
  @Prop({ default: true }) readonly pageRefresh!: boolean

  mechanic: MechanicAbstract = new Manager.Mechanic.ModalHeaderMechanic(this.localReRender.bind(this))
  objectTemplate = ObjectTemplate
  regionEnum = RegionEnum
  regionType = RegionType
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  subObjectTypeEnum = SubObjectTypeEnum
  actionTypeEnum = ActionTypeEnum
  objectType = ObjectType
  objectTemplates: ObjectTemplate[] = []
  renderPage = true

  get groupedObjectTemplates(): ObjectTemplate[][] {
    const groups: ObjectTemplate[][] = []
    let currentGroup: ObjectTemplate[] = []

    this.objectTemplates.forEach((_objectTemplate) => {
      currentGroup.push(_objectTemplate)

      if (_objectTemplate.Stats[StatTypeEnum.BreakLine]) {
        groups.push(currentGroup)
        currentGroup = []
      }
    })

    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }

  get reRender(): boolean {
    this.objectTemplates = this.mechanic.InitSet(this.entityCopy(this.entity))
    return this.pageRefresh
  }

  localReRender() {
    this.renderPage = !this.renderPage
  }

  returnIfExists(tag: number): string {
    return this.object.Stats[tag]?.Data || ''
  }

  mounted(): void {
    this.objectTemplates = this.mechanic.InitSet(this.entityCopy(this.entity))
  }

  objectCopy(_object: ObjectTemplate): ObjectTemplate {
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

  entityCopy(entities: ObjectTemplate[]): ObjectTemplate[] {
    const arr: ObjectTemplate[] = []
    entities = JSON.parse(JSON.stringify(entities))
    for (const entity of entities) {
      entity.Stats[StatTypeEnum.Tag].Data += this.object.Stats[StatTypeEnum.Tag].Data
      if (entity.Stats[StatTypeEnum.Option]) {
        entity.Stats[StatTypeEnum.Option].Data = this.object.Stats[StatTypeEnum.Option].Data
      }
      arr.push(this.objectCopy(entity))
    }
    return arr
  }

  beforeUnmount(): void {
    this.mechanic.UnsubscribeConditions()
  }

  getComponent(_regionEnum: number, _objectEnum: number): StatTypeEnum {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
