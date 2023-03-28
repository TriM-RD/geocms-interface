<template>
  <div>
    <button @click="startMechanic()" type="button" style="display: none" data-bs-toggle="modal" :data-bs-target="`${'#formModal'+object.Stats[statTypeEnum.Tag].Data}`" :id="`${'formModalOpen'+object.Stats[statTypeEnum.Tag].Data}`"></button>
    <form>
      <div @click="test($event.target)" class="modal fade" :id="`${'formModal'+object.Stats[statTypeEnum.Tag].Data}`" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="btn-close" :id="`${'formModalClose'+object.Stats[statTypeEnum.Tag].Data}`" data-bs-dismiss="modal" aria-label="Close"></button>
              <button type="button" hidden class="btn-close" :id="`${'formModalSubmit'+object.Stats[statTypeEnum.Tag].Data}`" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body container-fluid">
              <Loading v-model:active="renderComponent"
                       :can-cancel="false"
                       :is-full-page="false"/>
              <div v-if="!renderComponent">
              <component  v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ _objectTemplate.Stats[statTypeEnum.Tag].Data }`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'> </component>
              </div>
            </div>
            <div class="modal-footer">
              <component :is="getSubmitButtonComponent()" :object='submitButton'> </component>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/mechanics/modalFormMechanic'
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
  props: {
    object: ObjectTemplate
  },
  components: {
    Loading
  }
})
export default class ModalFormComponent extends Vue {
  msg!: string
  mechanic!: MechanicAbstract
  renderComponent= true
  objectTemplates!: ObjectTemplate[]
  statTypeEnum = StatTypeEnum
  object!: ObjectTemplate
  regionEnum = RegionEnum
  objectTypeEnum = ObjectTypeEnum
  actionTypeEnum = ActionTypeEnum
  subObjectTypeEnum = SubObjectTypeEnum
  regionType = RegionType
  conditionsUnsubed = false
  submitButton = new ObjectTemplate(this.regionEnum.ModalForm, this.objectTypeEnum.Button, this.subObjectTypeEnum.Left, this.actionTypeEnum.Click, {
    [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Submit'),
    [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('submitFormButton'),
    [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 btn btn-success'),
    [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.object.Stats[this.statTypeEnum.Tag].Data)
  })

  beforeUnmount () {
    if (this.mechanic !== undefined) {
      this.mechanic.UnsubscribeConditions()
    }
  }

  startMechanic () {
    this.mechanic = new Manager.Mechanic.ModalFormMechanic(this.reRender.bind(this))
    this.Init()
  }

  test (target : any) {
    if (target.id === 'formModal' + this.object.Stats[StatTypeEnum.Tag].Data || target.id === 'formModalClose' + this.object.Stats[StatTypeEnum.Tag].Data) {
      console.log('unsubed')
      this.mechanic.UnsubscribeConditions()
      this.conditionsUnsubed = true
      this.objectTemplates = []
      this.renderComponent = !this.renderComponent
    } else if (target.id === 'formModalSubmit' + this.object.Stats[StatTypeEnum.Tag].Data) {
      this.mechanic.UnsubscribeConditions()
      this.regionType.RegionTypes[this.object.Region].ObjectTypes[this.object.ObjectEnum].ChooseSubType(this.object)
    }
  }

  async Init () {
    switch (router.currentRoute.value.name) {
      case 'DeviceEdit':
      case 'DeviceAdd':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'entity_modal'))
        this.objectTemplates = this.mechanic.Append([
          new ObjectTemplate(RegionEnum.ModalForm, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Row'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('ecabinetRowChild'),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Tag].Data),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
            [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('hidden'),
            [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.objectTemplates[0].Stats[StatTypeEnum.Id].Data)
          }),
          new ObjectTemplate(RegionEnum.ModalForm, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Column'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('ecabinetColumnChild'),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.object.Stats[StatTypeEnum.Tag].Data),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
            [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('hidden'),
            [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData(''),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.objectTemplates[0].Stats[StatTypeEnum.Id].Data)
          }),
          new ObjectTemplate(RegionEnum.ModalForm, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
            [StatTypeEnum.Label]: StatType.StatTypes[StatTypeEnum.Label]().CreateStat().InitData('Belongs'),
            [StatTypeEnum.Value]: StatType.StatTypes[StatTypeEnum.Value]().CreateStat().InitData(this.$route.params.id.toString()),
            [StatTypeEnum.Design]: StatType.StatTypes[StatTypeEnum.Design]().CreateStat().InitData('me-2 readonly'),
            [StatTypeEnum.Tag]: StatType.StatTypes[StatTypeEnum.Tag]().CreateStat().InitData('belongs'),
            [StatTypeEnum.Id]: StatType.StatTypes[StatTypeEnum.Id]().CreateStat().InitData(this.objectTemplates[0].Stats[StatTypeEnum.Id].Data),
            [StatTypeEnum.ElementType]: StatType.StatTypes[StatTypeEnum.ElementType]().CreateStat().InitData('hidden'),
            [StatTypeEnum.Placeholder]: StatType.StatTypes[StatTypeEnum.Placeholder]().CreateStat().InitData('')
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
          new ObjectTemplate(RegionEnum.ModalForm, ObjectTypeEnum.Field, SubObjectTypeEnum.ParentObject, ActionTypeEnum.None, {
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
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }

  getSubmitButtonComponent () {
    return RegionType.RegionTypes[RegionEnum.ModalForm].ObjectTypes[ObjectTypeEnum.Button].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
