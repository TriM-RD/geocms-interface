<template>
    <input
      class="form-control"
      :id="getStatData(StatTypeEnum.Tag)"
      :required="getStatData(StatTypeEnum.Required)"
      :disabled="disabled"
      :autocomplete="getStatData(StatTypeEnum.AutoComplete)"
      :class="bootstrapClass"
      :type="getInputType()"
      :value="computedValue"
      :placeholder="getStatData(StatTypeEnum.Placeholder)"
      @input="handleInput"
    />
    <div v-if="showErrorMessage" class="invalid-feedback">
      {{ getStatData(StatTypeEnum.ErrorMessage) }}
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-facing-decorator'
import { ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum } from '@cybertale/interface'
interface LabelData {
  iconClass: string;
  title: string;
}

@Component
export default class FieldComponent extends Vue {
  @Prop() object!: ObjectTemplate

  // Enums
  StatTypeEnum = StatTypeEnum
  ObjectTypeEnum = ObjectTypeEnum
  RegionEnum = RegionEnum

  mounted () {
    alert('test')
  }

  // Computed properties
  get computedValue(): string {
    if (this.isLabelDisabled) {
      return this.getStatData(StatTypeEnum.Label)
    }
    return this.getValue(StatTypeEnum.Value, StatTypeEnum.ValueIndices)
  }

  get isLabelDisabled(): boolean {
    return this.getStatData(StatTypeEnum.Tag).includes('label') &&
      this.getStatData(StatTypeEnum.Disabled, 'boolean')
  }

  get bootstrapClass(): string {

    const temp = this.getValue(StatTypeEnum.Design) as string
    return temp
  }

  get disabled(): boolean {
    const temp = !!this.getValue(StatTypeEnum.Disabled)
    return temp
  }

  get validationClass(): string {
    const isValid = this.getStatData(StatTypeEnum.IsValid, 'boolean')
    const errorMessage = this.getStatData(StatTypeEnum.ErrorMessage)

    if (isValid === undefined || isValid === '') return ''
    if (isValid) return 'is-valid'
    if (errorMessage) return 'is-invalid'
    return ''
  }

  get showErrorMessage(): boolean {
    return this.validationClass === 'is-invalid'
  }

  // Methods
  getInputType(): string {
    return this.getValue(StatTypeEnum.ElementType)
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement
    const { Region, ObjectEnum } = this.object
    RegionType.RegionTypes[Region].ObjectTypes[ObjectEnum].ChooseSubType(this.object, target.value)
  }

  getValue( statEnum: StatTypeEnum, indexStatTypeEnum = StatTypeEnum.Option): string | LabelData {
    const tempData:string = this.getStatData(statEnum) as string
    if (!tempData) return '';
    if (this.statIsDefined(indexStatTypeEnum) && this.isJSON(tempData)) {
      const data = JSON.parse(tempData);
      const optionData = this.getStatData(indexStatTypeEnum) as string
      if(this.isJSON(optionData)){
        const parsedOptionData = JSON.parse(optionData)[Number(this.object.Stats[StatTypeEnum.OptionIndices].Data)]
        return data[Number(parsedOptionData)] || '';
      }
      return data[Number(this.getStatData(indexStatTypeEnum))] || '';
    }

    return tempData;
  }

  statIsDefined (statType: StatTypeEnum): boolean {
    return !!this.object.Stats[statType]
  }

  getStatData(statType: StatTypeEnum, returnType: 'boolean' | 'string' = 'string'): boolean | string {
    try {
      const data = this.object.Stats[statType]?.Data ?? ''
      return returnType === 'boolean' ? !!data : data
    } catch (error) {
      return returnType === 'boolean' ? false : ''
    }
  }

  isJSON(str: string): boolean {
    try {
      return Array.isArray(JSON.parse(str))
    } catch {
      return false
    }
  }

  tooltipCase(): string | undefined {
    return this.object?.Stats[StatTypeEnum.Tooltip]?.Data
  }
}
</script>
