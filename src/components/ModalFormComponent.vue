<template>
  <div>
    <Loading v-model:active="renderComponent"
             :can-cancel="false"
             :is-full-page="false"/>
    <button type="button" style="display: none" data-bs-toggle="modal" data-bs-target="#formModal" id="formModalOpen"></button>
    <form v-if="!renderComponent">
      <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="btn-close" id="formModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <component  v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ _objectTemplate.Stats[statTypeEnum.Tag].Data }`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'> </component>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { Manager } from '@/interface/manager/mechanics/modalFormMechanic'
import { MechanicAbstract } from '@/interface/manager/mechanics/mechanicAbstract'
import {
  ActionTypeEnum,
  ObjectTypeEnum,
  RegionEnum,
  RegionType, StatType, StatTypeEnum,
  SubObjectTypeEnum
} from '@/interface/manager/events/types'
import Loading from 'vue-loading-overlay'
import router from '@/router'
@Options({
  components: {
    Loading
  }
})
export default class ModalFormComponent extends Vue {
  msg!: string
  mechanic: MechanicAbstract = new Manager.Mechanic.ModalFormMechanic(this.reRender.bind(this))
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
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'entity'))
        this.objectTemplates = this.mechanic.Append([
          new ObjectTemplate(RegionEnum.ModalForm, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Belongs'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('belongs'),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.$route.params.id.toString()),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
            [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('hidden'),
            [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.objectTemplates[0].Stats[StatTypeEnum.Id].Data)
          }),
          new ObjectTemplate(RegionEnum.ModalForm, ObjectTypeEnum.Button, SubObjectTypeEnum.Left, ActionTypeEnum.Click, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Submit'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('submit'),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 btn btn-success'),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.objectTemplates[0].Stats[StatTypeEnum.Id].Data)
          })
        ])
        break
      case 'GroupAdd':
      case 'GroupEdit':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(this.$route.params.id === undefined ? '-1' : String(this.$route.params.id), 'group'))
        break
      case 'DivisionAdd':
      case 'DivisionEdit':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(this.$route.params.id === undefined ? '-1' : String(this.$route.params.id), 'division'))
        break
      case 'AttributeAdd':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(this.$route.params.id === undefined ? '-1' : String(this.$route.params.id), 'attribute'))
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
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(this.$route.params.id === undefined ? '-1' : String(this.$route.params.id), 'attribute'))
        break
      case 'AdministrationEdit':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet(this.$route.params.id === undefined ? '-1' : String(this.$route.params.id), 'user'))
        break
    }
    this.renderComponent = false
  }

  reRender (test = false) {
    this.renderComponent = !this.renderComponent
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetVueComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
