<template>
  <table class="table" v-if="renderComponent">
  <thead class="table-light">
    <tr>
      <th v-for="(header, key) in headers" :key="`${ key }-${ header }-${ Math.random().toString(36).slice(2, 7) }`" scope="col">
        {{ header }}</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <!--component  v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate' :index='key'></component-->
    <component  v-for="(entity, key, index) in entities" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`" :is="getComponent(regionEnum.Table, objectTypeEnum.Row)" :entity='entity' :index='key'></component>
  </tbody>
</table>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { Manager } from '@/interface/manager/mechanics/tableMechanic'
import { MechanicAbstract } from '@/interface/manager/mechanics/mechanicAbstract'
import { RegionEnum, ObjectTypeEnum, SubObjectTypeEnum, ActionTypeEnum, StatTypeEnum, StatType, ObjectType, RegionType } from '@/interface/manager/events/types/index'
export default class TableComponent extends Vue {
  headers!: string[]
  regionEnum = RegionEnum
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  mechanic: MechanicAbstract = new Manager.Mechanic.TableMechanic()
  renderComponent= false
  objectTemplates!: ObjectTemplate[]
  entities!: ObjectTemplate[][]

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  created () {
    this.Init()
  }

  async Init () {
    this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1'))
    if (Object.keys(this.objectTemplates).length === 0) {
      return
    }
    let tempId = null
    let tempObjectTemplates = []
    for (const element of this.objectTemplates) {
      if (element.Stats[StatTypeEnum.Id].Data === tempId) {
        tempObjectTemplates.push(JSON.parse(JSON.stringify(element)))
      } else {
        if (this.entities === undefined && tempObjectTemplates.length > 0) {
          this.entities = [tempObjectTemplates]
        } else if (this.entities !== undefined) {
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
    this.getHeaders()
    this.renderComponent = true
  }

  getHeaders () : void { // TODO Needs to be reworked. @JosoMarich
    this.headers = []
    for (const header of this.objectTemplates) {
      console.log(header.Stats[StatTypeEnum.Label].Data)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table{
  margin-bottom: 5%;
}
</style>
