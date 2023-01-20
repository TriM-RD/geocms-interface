<template>
  <div class="container">
    <div class="d-flex flex-wrap overflow-auto w-auto">
      <div class="row d-flex flex-nowrap row-cols-auto">
        <div class="col">
          <div class="input-group">
            <label class="input-group-text" for="button-addon2">Osig_3</label>
            <button class="btn btn-outline-secondary" type="button" id="button-addon2">Edit</button>
          </div>
        </div>
      </div>
    </div>
    <hr>
  </div>
</template>

<script lang="ts">
import Loading from 'vue-loading-overlay'
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { Manager } from '@/interface/manager/mechanics/tableMechanic'
import { MechanicAbstract } from '@/interface/manager/mechanics/mechanicAbstract'
import { RegionEnum, ObjectTypeEnum, SubObjectTypeEnum, ActionTypeEnum, StatTypeEnum, StatType, ObjectType, RegionType } from '@/interface/manager/events/types/index'
@Options({
  components: {
    Loading
  }
})
export default class ECabinetComponent extends Vue {
  headers: string[] = []
  regionEnum = RegionEnum
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  mechanic: MechanicAbstract = new Manager.Mechanic.TableMechanic()
  renderComponent= true
  objectTemplates!: ObjectTemplate[]
  entities!: ObjectTemplate[][]

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  created () {
    this.Init()
  }

  changeRender () {
    if (this.renderComponent) {
      this.entities = []
      this.objectTemplates = []
      this.headers = []
      this.mechanic = new Manager.Mechanic.TableMechanic()
      this.Init()
    } else {
      this.renderComponent = true
    }
  }

  async Init () {
    switch (this.$route.name) {
      case 'Device':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'entity'))
        break
      case 'Group':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'group'))
        break
      case 'Division':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'division'))
        break
      case 'GroupEdit':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'filter/attribute/' + this.$route.params.id))
        break
      case 'GroupAdd':
        this.renderComponent = false
        return
      case 'AccountProfile':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'permissions/user'))
        break
      case 'Administration':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'users'))
        break
    }
    console.log(this.objectTemplates)
    if (Object.keys(this.objectTemplates).length === 0) {
      this.renderComponent = false
      return
    }
    let tempId = null
    let tempObjectTemplates = []
    for (const element of this.objectTemplates) {
      if (element.Stats[StatTypeEnum.Id].Data === tempId) {
        tempObjectTemplates.push(JSON.parse(JSON.stringify(element)))
      } else {
        console.log(tempObjectTemplates.length > 0)
        if ((this.entities === undefined || this.entities.length < 1) && tempObjectTemplates.length > 0) {
          this.entities = [tempObjectTemplates]
        } else if (this.entities !== undefined && tempObjectTemplates.length > 0) {
          this.entities.push(JSON.parse(JSON.stringify(tempObjectTemplates)))
        }
        tempObjectTemplates = []
        tempObjectTemplates.push(JSON.parse(JSON.stringify(element)))
      }
      tempId = element.Stats[StatTypeEnum.Id].Data
    }
    if (this.entities === undefined) {
      this.entities = [tempObjectTemplates]
    } else {
      this.entities[this.entities.length] = tempObjectTemplates
    }
    console.log(this.entities)
    this.getHeaders()
    this.renderComponent = false
  }

  getHeaders () : void { // TODO Needs to be reworked. @JosoMarich
    this.headers = []
    for (const header of this.objectTemplates) {
      if (this.headers.indexOf(header.Stats[StatTypeEnum.Label].Data) === -1) {
        this.headers[this.headers.length] = header.Stats[StatTypeEnum.Label].Data
      }
    }
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetVueComponent()
  }
}
</script>

<style scoped>

</style>
