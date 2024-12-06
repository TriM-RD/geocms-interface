<template>
  <div class="mb-3">
    <div class="p-3">
      <label :title="`${object.Stats[statTypeEnum.Tooltip].Data}`" class="form-label h3">{{object.Stats[statTypeEnum.Label].Data }}</label>
      <textarea class="form-control" v-model="object.Stats[statTypeEnum.Value].Data" rows="9"  placeholder="edit me"></textarea>
    </div>
    <div class="border mb-3">
      <h3 class="text-start p-3">Prikaz</h3>
      <div v-html="object.Stats[statTypeEnum.Value].Data"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum } from '@cybertale/interface'
@Component
export default class InputComponent extends Vue {
  @Prop() object!: ObjectTemplate

  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
