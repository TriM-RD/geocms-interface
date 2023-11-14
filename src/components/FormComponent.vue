<template>
  <Loading v-model:active="renderComponent"
           :can-cancel="false"
           :is-full-page="false"/>
  <form v-if="!renderComponent" class="needs-validation" id="classic-form" novalidate>
    <component :page-refresh="renderComponent"  v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ _objectTemplate.Stats[statTypeEnum.Tag].Data }`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :entity='resolveEntities(_objectTemplate)' :object='_objectTemplate'> </component>
  </form>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/mechanics/formMechanic'
import {
  ObjectTemplate,
  MechanicAbstract,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType,
  RegionEnum,
  SubObjectTypeEnum, ActionTypeEnum, StatType
} from '@cybertale/interface'
import Loading from 'vue-loading-overlay'
import router from '@/router'
import { Definitions } from '@/definitions/appDefinitions'
@Options({
  components: {
    Loading
  }
})
export default class FormComponent extends Vue {
  msg!: string
  mechanic: MechanicAbstract = new Manager.Mechanic.FormMechanic(this.reRender.bind(this))
  renderComponent= true
  objectTemplates!: ObjectTemplate[]
  statTypeEnum = StatTypeEnum
  belongsTo!: { [key: string]: ObjectTemplate[] }
  entity!: ObjectTemplate[]

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  created () {
    this.Init()
  }

  resolveEntities (_object: ObjectTemplate) : ObjectTemplate[] {
    if (this.belongsTo) {
      for (const tag of Object.keys(this.belongsTo)) {
        if (_object.Stats[StatTypeEnum.Tag].Data.includes(tag)) {
          return this.belongsTo[tag]
        }
      }
    }

    return []
  }

  extractChildren () : ObjectTemplate[] {
    this.belongsTo = {}

    // Use a separate array to store indices of items to be deleted
    // eslint-disable-next-line no-case-declarations
    const itemsToDelete = []

    for (let i = 0; i < this.entity.length; i++) {
      const item = this.entity[i]

      if (item.Stats[StatTypeEnum.BelongsTo] !== undefined) {
        const data = item.Stats[StatTypeEnum.BelongsTo].Data
        this.belongsTo[data] = this.belongsTo[data] || []
        this.belongsTo[data].push(item)

        // Add index to itemsToDelete array
        itemsToDelete.push(i)
      }
    }

    // Iterate in reverse to avoid issues with array modifications
    for (let i = itemsToDelete.length - 1; i >= 0; i--) {
      this.entity.splice(itemsToDelete[i], 1)
    }
    return this.entity
  }

  async Init () : Promise<void> {
    switch (router.currentRoute.value.name) {
      case Definitions.Entity.Add:
      case Definitions.Entity.Edit:
        this.entity = await this.mechanic.InitGet(router.currentRoute.value.params.id === undefined ? '-1' : String(router.currentRoute.value.params.id), 'entity')
        this.objectTemplates = this.mechanic.InitSet(this.extractChildren())
        break
      case Definitions.Entity.Replace:
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'replace/entity/' + this.$route.params.parentId.toString()))
        this.objectTemplates = this.mechanic.Append([
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('ReplacedEntity'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('replacedEntity'),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.$route.params.parentId.toString()),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
            [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('hidden'),
            [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.objectTemplates[0].Stats[StatTypeEnum.Id].Data)
          })
        ])
        break
      case Definitions.Group.Edit:
      case Definitions.Group.Add:
        this.entity = this.mechanic.InitSet(await this.mechanic.InitGet(router.currentRoute.value.params.id === undefined ? '-1' : String(router.currentRoute.value.params.id), 'group'))
        this.objectTemplates = this.mechanic.InitSet(this.extractChildren())
        break
      case Definitions.Division.Edit:
      case Definitions.Division.Add:
        this.entity = this.mechanic.InitSet(await this.mechanic.InitGet(router.currentRoute.value.params.id === undefined ? '-1' : String(router.currentRoute.value.params.id), 'division'))
        this.objectTemplates = this.mechanic.InitSet(this.extractChildren())
        break
      case Definitions.Attribute.Add:
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(router.currentRoute.value.params.id === undefined ? '-1' : String(router.currentRoute.value.params.id), 'attribute'))
        this.objectTemplates = this.mechanic.Append([
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Group'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('group'),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.$route.params.parentId.toString()),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
            [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('hidden'),
            [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.objectTemplates[0].Stats[StatTypeEnum.Id].Data)
          })
        ])
        break
      case Definitions.Attribute.Edit:
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(router.currentRoute.value.params.id === undefined ? '-1' : String(router.currentRoute.value.params.id), 'attribute'))
        break
      case Definitions.Administration.Add:
      case Definitions.Administration.Edit:
        this.entity = this.mechanic.InitSet(await this.mechanic.InitGet(router.currentRoute.value.params.id === undefined ? '-1' : String(router.currentRoute.value.params.id), 'user'))
        this.objectTemplates = this.mechanic.InitSet(this.extractChildren())
        break
    }
    this.renderComponent = false
  }

  reRender (): void {
    this.renderComponent = !this.renderComponent
  }

  changeRender (): void {
    this.renderComponent = !this.renderComponent
    this.mechanic.UnsubscribeConditions()
    this.objectTemplates = []
    this.mechanic = new Manager.Mechanic.FormMechanic(this.reRender.bind(this))
    this.Init()
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
