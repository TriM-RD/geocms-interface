<template>
  <div v-if="renderComponent" class="mt-4">
    <div v-for="(header, key) in headers" :key="`${ key }-${ header }-${ Math.random().toString(36).slice(2, 7) }`">
      <h5 class="mt-4">{{ header }}</h5>
      <div class="list-group">
        <component  v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }`"
                    :is="checkIfGetComponent(header===_objectTemplate.Stats[statTypeEnum.Label].Data, _objectTemplate.Region, _objectTemplate.ObjectEnum)"
                    :object='_objectTemplate' :index='key'></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { Manager } from '@/interface/manager/mechanics/listMechanic'
import { MechanicAbstract } from '@/interface/manager/mechanics/mechanicAbstract'
import { RegionEnum, ObjectTypeEnum, SubObjectTypeEnum, ActionTypeEnum, StatTypeEnum, StatType, ObjectType, RegionType } from '@/interface/manager/events/types/index'
import { Watch } from 'vue-property-decorator'

@Options({
  props: {
    title: String,
    useRoutes: Boolean
  }
})
export default class ListComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.ListMechanic()
  renderComponent = false
  objectTemplates!: ObjectTemplate[]
  statTypeEnum = StatTypeEnum
  title!: string
  count = 0
  countDevice = 0
  useRoutes = false
  headers!: string[]

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  created () {
    this.Init()
  }

  async Init () {
    this.count = (this.title.match(/group:/g) || []).length
    if (this.count >= 2) {
      window.alert('Groups can only be listed once in a search!')
      this.renderComponent = false
      return
    }
    this.countDevice = (this.title.match(/device:/g) || []).length
    if (this.countDevice >= 2) {
      window.alert('Groups can only be listed once in a search!')
      this.renderComponent = false
    }
    this.renderComponent = false
    if (!this.useRoutes) {
      this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'search/' + this.title))
      console.log(this.objectTemplates)
    } else {
      this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'permissions/user'))
      console.log(this.objectTemplates)
    }
    this.getHeaders()
    this.renderComponent = true
  }

  checkIfGetComponent (check : boolean, _regionEnum : number, _objectEnum: number) {
    if (!check) { return null }
    return this.getComponent(_regionEnum, _objectEnum)
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetVueComponent()
  }

  getHeaders () : void { // TODO Needs to be reworked. @JosoMarich
    this.headers = []
    for (const header of this.objectTemplates) {
      if (this.headers.indexOf(header.Stats[StatTypeEnum.Label].Data) === -1) {
        this.headers[this.headers.length] = header.Stats[StatTypeEnum.Label].Data
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table{
  margin-bottom: 5%;
}
</style>
