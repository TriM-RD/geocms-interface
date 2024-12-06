<template>
  <td>
    <div class="btn-group d-none d-md-flex justify-content-center" v-if="!isSmallScreen">
      <component v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${key}-${index}-${Math.random().toString(36).slice(2, 7)}`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object="_objectTemplate"></component>
    </div>
    <div class="dropdown d-md-none" v-if="isSmallScreen">
      <button type="button" class="btn btn-outline-secondary" data-bs-toggle="dropdown" aria-expanded="false">
        <span class="bi-chevron-down"></span>
      </button>
      <ul class="dropdown-menu">
        <li v-for="(_objectTemplate, key, index) in objectTemplates" :key="`${key}-${index}-${Math.random().toString(36).slice(2, 7)}-'li'`" class="dropdown-item btn-group justify-content-center">
          <component :key="`${key}-${index}-${Math.random().toString(36).slice(2, 7)}`" :is="getComponent(_objectTemplate.Region, _objectTemplate.ObjectEnum)" :object="_objectTemplate"></component>
        </li>
      </ul>
    </div>
  </td>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Manager } from '@/mechanics/placeholderMechanic'
import { ActionTypeEnum, MechanicAbstract, ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatType, StatTypeEnum, SubObjectTypeEnum } from '@cybertale/interface'

@Options({
  props: {
    entity: Array,
    object: ObjectTemplate,
    index: Number
  }
})
export default class ColumnGroupComponent extends Vue {
  mechanic: MechanicAbstract = new Manager.Mechanic.PlaceholderMechanic()
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  object!: ObjectTemplate
  entity!: ObjectTemplate[]
  index!: number
  objectTemplates: ObjectTemplate[] = this.mechanic.InitSet(this.entity)
  renderComponent = false
  isSmallScreen = false

  mounted() {
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)
  }

  beforeUnmount() {
    this.mechanic.UnsubscribeConditions()
    window.removeEventListener('resize', this.checkScreenSize)
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768
  }

  getComponent(_regionEnum: number, _objectEnum: number) {
    return RegionType.RegionTypes[_regionEnum].ObjectTypes[_objectEnum].GetComponent()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
