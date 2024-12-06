<template>
  <div class="d-none">{{ reRender }}</div>
  <div class="accordion" :id="'accordionExample' + object.Stats[statTypeEnum.Tag].Data" v-if="getStatData(statTypeEnum.ElementType) === 'accordion'">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button d-flex justify-content-center collapsed" type="button" :data-bs-toggle="'collapse'" :data-bs-target="'#collapse' + object.Stats[statTypeEnum.Tag].Data" :aria-expanded="false" :aria-controls="'collapse' + object.Stats[statTypeEnum.Tag].Data">
          {{ object.Stats[statTypeEnum.Value].Data }}
        </button>
      </h2>
      <div :id="'collapse' + object.Stats[statTypeEnum.Tag].Data" class="accordion-collapse collapse" :class="object.Stats[statTypeEnum.Design].Data" :data-bs-parent="'#accordionExample' + object.Stats[statTypeEnum.Tag].Data">
        <div class="accordion-body d-flex flex-wrap w-100" v-for="(group, index) in groupedObjectTemplates" :key="`${index}-${Math.random().toString(36).slice(2, 7)}`">
          <component v-for="(_objectTemplate, key) in group" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object="_objectTemplate" :key="`${key}-${Math.random().toString(36).slice(2, 7)}`"></component>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="d-flex flex-wrap w-100">
    <component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${key}-${index}-${Math.random().toString(36).slice(2, 7)}`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object="_objectTemplate"></component>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import { Manager } from '@/mechanics/placeholderMechanic'
import { ActionTypeEnum, MechanicAbstract, ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatType, StatTypeEnum, SubObjectTypeEnum } from '@cybertale/interface'
import { $t } from '../stores/storeTranslations'

@Component({
  methods: { $t }
})
export default class ContentPartGroupComponent extends Vue {
  @Prop() readonly entity!: ObjectTemplate[]
  @Prop() readonly object!: ObjectTemplate
  @Prop() readonly index!: number
  @Prop({ default: true }) readonly pageRefresh!: boolean
  mechanic: MechanicAbstract = new Manager.Mechanic.PlaceholderMechanic()
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  objectTemplates!: ObjectTemplate[]
  renderComponent = false
  isSmallScreen = false
  $t = $t

  created() {
    /*this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)*/
    this.objectTemplates = this.mechanic.InitSet(this.entityCopy(this.entity))
  }

  get reRender(): ObjectTemplate {
    this.objectTemplates = []
    this.objectTemplates = this.mechanic.InitSet(this.entityCopy(this.entity))
    return this.pageRefresh
  }

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

  beforeUnmount() {
    this.mechanic.UnsubscribeConditions()
    window.removeEventListener('resize', this.checkScreenSize)
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768
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
      if (entity.Stats[StatTypeEnum.Option] && this.isJSON(entity.Stats[StatTypeEnum.Option].Data)) {
        entity.Stats[StatTypeEnum.Option].Data = this.object.Stats[StatTypeEnum.Option].Data
      }
      arr.push(this.objectCopy(entity))
    }
    return arr
  }

  getStatData(statType: StatTypeEnum, returnType: 'boolean' | 'string' = 'string'): boolean | string {
    try {
      const data = this.object.Stats[statType]?.Data ?? ''
      return returnType === 'boolean' ? !!data : data
    } catch (error) {
      console.error(`Error accessing data for statType ${statType}:`, error)
      return returnType === 'boolean' ? false : ''
    }
  }

  isJSON(str: string): boolean {
    try {
      return Array.isArray(JSON.parse(str))
    } catch {
      return false
    }
  }

  getComponent(_regionEnum: number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
