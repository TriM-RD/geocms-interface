<template>
  <div class="container">
    <component :rerender="changeRender"  v-for="(entity, key, index) in entities" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`" :is="getComponent(regionEnum.Table, objectTypeEnum.Row)" :entity='entity' :index='key'></component>
  </div>
</template>

<script lang="ts">
import Loading from 'vue-loading-overlay'
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { Manager } from '@/interface/manager/mechanics/tableMechanic'
import { MechanicAbstract } from '@/interface/manager/mechanics/mechanicAbstract'
import { RegionEnum, ObjectTypeEnum, SubObjectTypeEnum, ActionTypeEnum, StatTypeEnum, StatType, ObjectType, RegionType } from '@/interface/manager/events/types'
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
      case 'DeviceEdit':
        this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'entity'))
        break
    }
    if (Object.keys(this.objectTemplates).length === 0) {
      this.renderComponent = false
      return
    }
    let tempTag = null
    let tempObjectTemplates = []
    for (const element of this.objectTemplates) {
      if (element.Stats[StatTypeEnum.Tag].Data === tempTag) {
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
      tempTag = element.Stats[StatTypeEnum.Tag].Data
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
