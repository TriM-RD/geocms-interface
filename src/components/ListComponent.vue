<template>
  <table class="table" v-if="renderComponent">
    <thead class="table-light">
    <tr>
      <th scope="col">Name</th>
    </tr>
    </thead>
    <tbody>
    <component  v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate' :index='key'></component>
    </tbody>
  </table>
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
    title: String
  }
})
export default class ListComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.ListMechanic()
  renderComponent= false
  objectTemplates!: ObjectTemplate[]
  title!: string
  timeout!: number
  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
  }

  @Watch('title')
  onDataChanged (value: any, oldValue: string) {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(() => {
      this.Init()
    }, 800)
  }

  async Init () {
    this.objectTemplates = this.mechanic.InitSet(await this.mechanic.InitGet('-1', 'search/' + this.title))
    this.renderComponent = true
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
