<template>
  <Loading v-model:active="renderComponent" />
  <form v-if="!reRenderToo" :key="componentKey" class="needs-validation" id="classic-form" novalidate>
    <component :rerender="changeRender" :page-refresh="renderComponent" v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${key}-${index}-${_objectTemplate.Stats[statTypeEnum.Tag].Data}`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :entity="resolveEntities(_objectTemplate)" :object="_objectTemplate"> </component>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import { Manager } from '@/mechanics/formMechanic'
import { ObjectTemplate, MechanicAbstract, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum, SubObjectTypeEnum, ActionTypeEnum, StatType } from '@cybertale/interface'
import LoadingComponent from '@/components/LoadingComponent.vue'
@Component({
  components: {
    Loading: LoadingComponent
  }
})
export default class FormComponent extends Vue {
  msg!: string
  mechanic: MechanicAbstract = new Manager.Mechanic.FormMechanic(this.reRender.bind(this))
  renderComponent = true
  objectTemplates!: ObjectTemplate[]
  statTypeEnum = StatTypeEnum
  belongsTo: { [key: string]: ObjectTemplate[] } = {}
  entity!: ObjectTemplate[]
  componentKey = 0

  beforeUnmount() {
    this.mechanic.UnsubscribeConditions()
  }

  created() {
    this.Init()
  }

  resolveEntities(_object: ObjectTemplate): ObjectTemplate[] {
    if (this.belongsTo) {
      for (const tag of Object.keys(this.belongsTo)) {
        if (_object.Stats[StatTypeEnum.Tag].Data.includes(tag)) {
          return this.belongsTo[tag]
        }
      }
    }

    return []
  }

  extractChildren(entities: ObjectTemplate[]): ObjectTemplate[] {
    const itemsToDelete = []

    for (let i = 0; i < entities.length; i++) {
      const item = entities[i]

      if (item.Stats[StatTypeEnum.BelongsTo] !== undefined) {
        const data = item.Stats[StatTypeEnum.BelongsTo].Data
        this.belongsTo[data] = this.belongsTo[data] || []
        if (
          !this.belongsTo[data].some(function (obj) {
            return obj.Stats[StatTypeEnum.Tag].Data === item.Stats[StatTypeEnum.Tag].Data
          })
        ) {
          this.belongsTo[data].push(item as ObjectTemplate)
        }

        // Add index to itemsToDelete array
        itemsToDelete.push(i)
      }
    }

    // Iterate in reverse to avoid issues with array modifications
    for (let i = itemsToDelete.length - 1; i >= 0; i--) {
      entities.splice(itemsToDelete[i], 1)
    }
    return entities
  }

  async Init(): Promise<void> {
    const temptemp = [
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.InputGroup, SubObjectTypeEnum.Middle, ActionTypeEnum.Click, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Dodaj'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData('[false,null]'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('addlist'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-outline-success mb-2'),
        [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('button'),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
        [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[1,13,14]')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.CheckBox, SubObjectTypeEnum.ParentObject, ActionTypeEnum.InsertClick, {
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('check|'),
        [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(''),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('input-group-text'),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('addlist'),
        [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[1,13,14]'),
        [StatTypeEnum.ValueIndices]: StatType.StatTypes[StatTypeEnum.ValueIndices]().CreateStat().InitData('0')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.InsertClick, {
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('ReplacedEntity'),
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('field|'),
        /* [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData('testing'), */
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
        [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('text'),
        [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData(''),
        [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData('id'),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('addlist'),
        [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[1,13,14]'),
        [StatTypeEnum.ValueIndices]: StatType.StatTypes[StatTypeEnum.ValueIndices]().CreateStat().InitData('1')
      }),
      new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Button, SubObjectTypeEnum.Down, ActionTypeEnum.Click, {
        [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('delete|'),
        [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData('Izbrisati'),
        [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('btn btn-danger'),
        [StatTypeEnum.BelongsTo]: StatType.StatTypes[StatTypeEnum.BelongsTo]().CreateStat().InitData('addlist'),
        [StatTypeEnum.Inherit]: StatType.StatTypes[StatTypeEnum.Inherit]().CreateStat().InitData('[1,13,14]')
      })
    ]
    this.entity = temptemp
    this.objectTemplates = this.mechanic.InitSet(this.extractChildren(temptemp))
    this.renderComponent = false
  }

  get reRenderToo(): boolean {
    if (this.objectTemplates !== undefined) {
      this.objectTemplates = this.extractChildren(this.objectTemplates)
    }
    this.componentKey++
    return this.renderComponent
  }

  reRender(): void {
    this.renderComponent = !this.renderComponent
  }

  changeRender(): void {
    this.renderComponent = !this.renderComponent
    this.mechanic.UnsubscribeConditions()
    this.objectTemplates = []
    this.mechanic = new Manager.Mechanic.FormMechanic(this.reRender.bind(this))
    this.Init()
  }

  getComponent(_regionEnum: number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
