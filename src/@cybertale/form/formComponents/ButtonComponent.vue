<template>
  <button :data-bs-toggle="tooltipToggleBy" data-bs-placement="top" :data-bs-title="tooltipText" :hidden="isHidden" :disabled="isDisabled" :class="buttonClass" @click.prevent="handleClick">
    <div class="d-flex flex-column order-2">
      <span>{{ buttonLabel }}</span>
      <span v-if="contentValue" :class="contentClass">{{ contentValue }}</span>
    </div>
    <i v-if="showIcon" :class="iconClass" :style="styleData"></i>
  </button>
  <slot></slot>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { ObjectTemplate, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum } from '@cybertale/interface'
import { useStoreMapFunctions } from '@/stores/storeMapFunctions'
import { $t } from '@/stores/storeTranslations'

interface LabelData {
  iconClass: string
  title: string
  styleData: string
  contentValue: string
  contentClass: string
  translate: string
}

interface TooltipData {
  toggleBy: string
  value: string
  translate: string
}
@Component
export default class ButtonComponent extends Vue {
  @Prop() object!: ObjectTemplate

  // Enums
  StatTypeEnum = StatTypeEnum
  ObjectTypeEnum = ObjectTypeEnum
  RegionEnum = RegionEnum

  renderComponent = false

  // Computed properties
  get tooltipToggleBy(): string {
    const tooltip = this.getValue(StatTypeEnum.Tooltip) as TooltipData | string

    if (typeof tooltip === 'string') {
      return 'tooltip'
    }

    return tooltip.toggleBy
  }

  get tooltipText(): string {
    const tooltip = this.getValue(StatTypeEnum.Tooltip) as TooltipData | string
    if (typeof tooltip === 'string') {
      return tooltip // Return the string directly if it's a string
    }
    if (tooltip.translate) {
      return $t(tooltip.value)
    }
    return tooltip.value
  }

  get isHidden(): boolean {
    return this.getStatData(StatTypeEnum.ElementType) === 'hidden'
  }

  get isDisabled(): boolean {
    return !!this.getStatData(StatTypeEnum.Disabled, 'boolean')
  }

  get buttonClass(): string {
    const temp = this.getValue(StatTypeEnum.Design) as string
    return temp
  }

  get buttonLabel(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return $t(value.title)
    }
    return this.getValue(StatTypeEnum.Label) as string
  }

  get contentValue(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return $t(value.contentValue)
    }
    return ''
  }

  get contentClass(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.contentClass
    }
    return ''
  }

  get showIcon(): boolean {
    return this.getStatData(StatTypeEnum.ElementType) === 'icon'
  }

  get iconClass(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.iconClass
    }
    return this.getValue(StatTypeEnum.Label)
  }

  get styleData(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.styleData
    }
    return this.getValue(StatTypeEnum.Label)
  }

  // Methods
  handleClick(): void {
    const { Region, ObjectEnum } = this.object
    RegionType.RegionTypes[Region].ObjectTypes[ObjectEnum].ChooseSubType(this.object)
  }

  getValue(statEnum: StatTypeEnum, indexStatTypeEnum = StatTypeEnum.Option): string | LabelData | TooltipData {
    const tempData: string = this.getStatData(statEnum) as string
    if (!tempData) return ''
    if (this.statIsDefined(indexStatTypeEnum) && this.isJSON(tempData)) {
      const data = JSON.parse(tempData)
      const optionData = this.getStatData(indexStatTypeEnum) as string
      if (this.isJSON(optionData)) {
        const parsedOptionData = JSON.parse(optionData)[Number(this.object.Stats[StatTypeEnum.OptionIndices].Data)]
        return data[Number(parsedOptionData)] || ''
      }
      return data[Number(this.getStatData(indexStatTypeEnum))] || ''
    }

    return tempData
  }

  statIsDefined(statType: StatTypeEnum): boolean {
    return !!this.object.Stats[statType]
  }

  getStatData(statType: StatTypeEnum, returnType: 'boolean' | 'string' = 'string'): boolean | string {
    try {
      const data = this.object.Stats[statType]?.Data ?? ''
      return returnType === 'boolean' ? !!data : data
    } catch (error) {
      console.error(`Error accessing data for statType ${statType}:`, error)
      return returnType === 'boolean' ? false : ''
    }
  }

  isJSONAlt(str: string): boolean {
    try {
      const parsed = JSON.parse(str)

      if (!Array.isArray(parsed)) {
        return false
      }

      if (parsed.length === 0) {
        return true // Empty array is valid
      }

      // Check if it's an array of objects or an array of numbers
      const firstItem = parsed[0]

      if (typeof firstItem === 'object' && firstItem !== null) {
        // Check if it matches the structure: [{"title": "", "iconClass": "..."}]
        return parsed.every((item) => typeof item === 'object' && item !== null && 'title' in item && 'iconClass' in item)
      } else if (typeof firstItem === 'number') {
        // Check if it's an array of numbers
        return parsed.every((item) => typeof item === 'number')
      }

      return false
    } catch (e) {
      return false
    }
  }

  isJSON(str: string): boolean {
    try {
      return Array.isArray(JSON.parse(str))
    } catch {
      return false
    }
  }
}
</script>

<style scoped></style>
