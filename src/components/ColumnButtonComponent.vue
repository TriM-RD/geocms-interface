<template>
  <td>
    <div class="btn-group d-none d-md-flex justify-content-center" v-if="!isSmallScreen">
      <component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`"  :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'></component>
    </div>
    <div class="dropdown d-md-none" v-if="isSmallScreen">
      <button type="button" class="btn btn-outline-secondary" data-bs-toggle="dropdown" aria-expanded="false">
        <span class="bi-chevron-down"></span>
      </button>
      <ul class="dropdown-menu">
        <li v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }-'li'`"
            class="dropdown-item btn-group justify-content-center">
          <component :key="`${ key }-${ index }-${ Math.random().toString(36).slice(2, 7) }`"  :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object='_objectTemplate'></component>
        </li>
      </ul>
    </div>
  </td>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator';
import { Manager } from '@/mechanics/placeholderMechanic'
import {
  MechanicAbstract,
  ObjectTemplate,
  ObjectType,
  ObjectTypeEnum,
  RegionType,
  StatTypeEnum,
} from '@cybertale/interface'

@Component
export default class ColumnButtonComponent extends Vue {
  @Prop() object!: ObjectTemplate
  @Prop() index!: number
  @Prop() entity!: ObjectTemplate[]
  mechanic: MechanicAbstract = new Manager.Mechanic.PlaceholderMechanic()
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  objectTemplates: ObjectTemplate[] = this.mechanic.InitSet(this.entity)
  renderComponent = false
  isSmallScreen = false

  mounted () {
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)
  }

  beforeUnmount () {
    this.mechanic.UnsubscribeConditions()
    window.removeEventListener('resize', this.checkScreenSize)
  }

  checkScreenSize () {
    this.isSmallScreen = window.innerWidth < 768
  }

  getComponent (_regionEnum : number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
