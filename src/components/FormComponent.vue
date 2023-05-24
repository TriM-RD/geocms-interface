<template>
  <Loading v-model:active="renderComponent"
           :can-cancel="false"
           :is-full-page="false"/>
  <form v-if="!renderComponent" class="needs-validation" novalidate>
    <component :page-refresh="renderComponent" :rerender="changeRender"  v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ _objectTemplate.Stats[statTypeEnum.Tag].Data }`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'> </component>
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

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  created () {
    this.Init()
  }

  async Init () {
    switch (router.currentRoute.value.name) {
      case 'DeviceEdit':
      case 'DeviceAdd':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(router.currentRoute.value.params.id === undefined ? '-1' : String(router.currentRoute.value.params.id), 'entity'))
        break
      case 'DeviceReplace':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'replace/entity/' + this.$route.params.parentId.toString()))
        this.objectTemplates = this.mechanic.Append([
          new ObjectTemplate(RegionEnum.Form, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('ReplacedDevice'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('replacedDevice'),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.$route.params.parentId.toString()),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
            [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('hidden'),
            [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.objectTemplates[0].Stats[StatTypeEnum.Id].Data)
          })
        ])
        break
      case 'GroupAdd':
      case 'GroupEdit':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(router.currentRoute.value.params.id === undefined ? '-1' : String(router.currentRoute.value.params.id), 'group'))
        break
      case 'DivisionAdd':
      case 'DivisionEdit':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(router.currentRoute.value.params.id === undefined ? '-1' : String(router.currentRoute.value.params.id), 'division'))
        break
      case 'AttributeAdd':
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
      case 'AttributeEdit':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(router.currentRoute.value.params.id === undefined ? '-1' : String(router.currentRoute.value.params.id), 'attribute'))
        break
      case 'AdministrationEdit':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(router.currentRoute.value.params.id === undefined ? '-1' : String(router.currentRoute.value.params.id), 'user'))
        break
    }
    this.renderComponent = false
    console.log(this.objectTemplates)
  }

  reRender () {
    this.renderComponent = !this.renderComponent
  }

  changeRender () {
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
