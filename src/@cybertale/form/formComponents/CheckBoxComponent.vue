<template>
  <div :class="object?.Stats[StatTypeEnum.Design].Data">
    <input class="form-check-input mt-0" type="checkbox"
           :checked="getValue(StatTypeEnum.Value, StatTypeEnum.ValueIndices)"
           :id="object?.Stats[StatTypeEnum.Tag].Data"
           :required="attributeCheck(StatTypeEnum.Required)"
           :disabled="attributeCheck(StatTypeEnum.Disabled)"
           :class="validate()"
           @input="handleInput">
    <label v-if="returnIfExists(StatTypeEnum.Label) !== ''" class="form-check-label" :for="object?.Stats[StatTypeEnum.Tag].Data">
      {{ object.Stats[StatTypeEnum.Label].Data }}
    </label>
  </div>
  <div class="invalid-feedback">{{ returnIfExists(StatTypeEnum.ErrorMessage) }}</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-facing-decorator'
import { ObjectTemplate, ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@cybertale/interface'

@Component
export default class CheckBoxComponent extends Vue {
  @Prop() object!: ObjectTemplate

  readonly StatTypeEnum = StatTypeEnum
  readonly ObjectTypeEnum = ObjectTypeEnum
  readonly ObjectType = ObjectType
  readonly RegionType = RegionType
  readonly RegionEnum = RegionEnum

  returnIfExists(tag: number): string {
    return this.object.Stats[tag]?.Data ?? ''
  }

  getValue(statEnum: number, indexStatTypeEnum = StatTypeEnum.Option): string {
    if (this.object.Stats[statEnum]) {
      if (this.object.Stats[indexStatTypeEnum] && this.isJSON(this.object.Stats[statEnum].Data)) {
        const data = JSON.parse(this.object.Stats[statEnum].Data)
        return data[Number(this.object.Stats[indexStatTypeEnum].Data)]
      } else {
        return this.object.Stats[statEnum].Data
      }
    }
    return ''
  }

  isJSON(str: string): boolean {
    try {
      const temp = JSON.parse(str)
      return Array.isArray(temp)
    } catch {
      return false
    }
  }

  validate(): string {
    const isValid = this.object.Stats[this.StatTypeEnum.IsValid]
    if (isValid === undefined || isValid.Data === '') return ''
    if (isValid.Data) return 'is-valid'
    if (this.object.Stats[this.StatTypeEnum.ErrorMessage]?.Data !== '') return 'is-invalid'
    return ''
  }

  specialCase(): boolean {
    return this.object.Stats[this.StatTypeEnum.ElementType]?.Data === 'hidden'
  }

  attributeCheck(statType: number): boolean | string {
    const stat = this.object.Stats[statType]
    return stat === undefined || stat.Data === '' ? false : stat.Data
  }

  tooltipCase(): string | undefined {
    return this.object?.Stats[this.StatTypeEnum.Tooltip]?.Data
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement
    this.RegionType.RegionTypes[this.object?.Region].ObjectTypes[this.object?.ObjectEnum].ChooseSubType(this.object as ObjectTemplate, target.checked)
  }
}
</script>

<style scoped>
.form-check-input:checked {
  background-color: #606467;
  border-color: #606467;
}
</style>
