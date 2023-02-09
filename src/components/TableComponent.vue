<template>
  <Loading v-model:active="renderComponent"
           :can-cancel="false"
           :is-full-page="false"/>
  <table class="table table-hover" v-if="!renderComponent">
  <thead class="table-light">
    <tr>
      <th></th>
      <th v-for="(header, key) in headers" :key="`${ key }-${ header }-${ Math.random().toString(36).slice(2, 7) }`" scope="col">
        {{ header }}</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <component :rerender="changeRender"  v-for="(entity, key, index) in entities" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`" :is="getComponent(regionEnum.Table, objectTypeEnum.Row)" :entity='entity' :index='key'></component>
  </tbody>
</table>
  <!--button class="btn btn-outline-secondary" @click.prevent="scroll()">Load</button-->
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
export default class TableComponent extends Vue {
  headers: string[] = []
  regionEnum = RegionEnum
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  mechanic: MechanicAbstract = new Manager.Mechanic.TableMechanic(this.reRender.bind(this))
  renderComponent= true
  loadingComponents = true
  objectTemplates!: ObjectTemplate[]
  entities!: ObjectTemplate[][]
  currentPage = 1

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  created () {
    this.Init()
  }

  mounted () {
    window.onscroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        await this.scroll()
      }
    }
  }

  reRender () {
    if (this.loadingComponents) {
      this.entities = []
      this.objectTemplates = []
      this.headers = []
      this.Init()
    } else {
      this.loadingComponents = true
    }
  }

  changeRender () {
    if (this.renderComponent) {
      this.entities = []
      this.objectTemplates = []
      this.headers = []
      this.mechanic = new Manager.Mechanic.TableMechanic(this.reRender.bind(this))
      this.Init()
    } else {
      this.renderComponent = true
    }
  }

  async scroll () {
    await this.Init()
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
    this.getHeaders()
    this.renderComponent = false
    this.loadingComponents = false
    console.log(performance.now())
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table{
  margin-bottom: 5%;
}
</style>
