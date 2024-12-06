<template>
  <div v-if="returnIfExists(statTypeEnum.ElementType) === 'gallery'">
    <GalleryComponent :modalFunction="modalFunction" :object="object"></GalleryComponent>
  </div>
  <div v-if="returnIfExists(statTypeEnum.ElementType) === 'header'">
    <ModalHeaderGroupComponent :page-refresh="pageRefresh" :object="object" :entity="entity"></ModalHeaderGroupComponent>
  </div>
  <div class="d-flex flex-column flex-grow-1 overflow-hidden rounded-bottom-3" v-if="returnIfExists(statTypeEnum.ElementType) === 'content'">
    <ModalContentGroupComponent :page-refresh="pageRefresh" :object="object" :entity="entity"></ModalContentGroupComponent>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { Manager } from '@/mechanics/placeholderMechanic'
import { ActionTypeEnum, MechanicAbstract, ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatType, StatTypeEnum, SubObjectTypeEnum } from '@cybertale/interface'
import GalleryComponent from '@/components/GalleryComponent.vue'
import ModalHeaderGroupComponent from '@/components/ModalHeaderGroupComponent.vue'
import ModalContentGroupComponent from '@/components/ModalContentGroupComponent.vue'

@Component({
  components: { ModalHeaderGroupComponent, ModalContentGroupComponent, GalleryComponent }
})
export default class MultiMediaComponent extends Vue {
  @Prop({ default: null }) modalFunction!: any
  @Prop() readonly entity!: ObjectTemplate[]
  @Prop() readonly object!: ObjectTemplate
  @Prop() readonly index!: number
  @Prop({ default: true }) readonly pageRefresh!: boolean

  mechanic: MechanicAbstract = new Manager.Mechanic.PlaceholderMechanic()
  objectTemplate = ObjectTemplate
  regionEnum = RegionEnum
  regionType = RegionType
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  subObjectTypeEnum = SubObjectTypeEnum
  actionTypeEnum = ActionTypeEnum
  objectType = ObjectType
  objectTemplates: ObjectTemplate[] = []

  returnIfExists(tag: number): string {
    return this.object.Stats[tag]?.Data || ''
  }

  beforeUnmount(): void {
    this.mechanic.UnsubscribeConditions()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
