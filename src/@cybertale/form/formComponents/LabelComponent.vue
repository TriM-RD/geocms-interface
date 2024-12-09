<template>
  <label :title="tooltipCase()" :class="buttonClass" :hidden="specialCase()">
    <div class="d-flex flex-column order-2">
      <span>{{ label }}</span>
      <span v-if="contentValue" :class="contentClass">{{ contentValue }}</span>
      <mark v-if="markValue" :class="markClass" :style="styleData">{{ markValue }}</mark>
    </div>
    <i v-if="showIcon" :class="iconClass" :style="styleData"></i>
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum } from '@cybertale/interface'
//import { useStoreMapFunctions } from '@/stores/storeMapFunctions'
//import { $t } from '@/stores/storeTranslations'

interface LabelData {
  styleData: string
  iconClass: string
  title: string
  markValue: string
  markClass: string
  contentValue: string
  contentClass: string
  distanceFromSea: string
  translate: string
  number: string
}
@Component
export default class LabelComponent extends Vue {
  @Prop() object!: ObjectTemplate

  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum

  get showIcon(): boolean {
    return this.getStatData(StatTypeEnum.ElementType) === 'icon'
  }

  get buttonClass(): string {
    return this.getValue(StatTypeEnum.Design) as string
  }

  get label(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      /*if (value.translate) {
        return $t(value.title) + ' ' + (value.number || '')
      }*/
      return value.title
    }
    return this.getValue(StatTypeEnum.Label) as string
  }

  get iconClass(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.iconClass
    }
    return ''
  }

  get markValue(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.markValue
    }
    return ''
  }

  isDarkBackground(color: string): boolean {
    return this.calculateBrightness(color)
  }

  hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null
  }

  // Calculate relative luminance
  getLuminance(rgb: any) {
    const a = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
  }

  // Calculate contrast ratio
  getContrastRatio(luminance1: any, luminance2: any) {
    const lightest = Math.max(luminance1, luminance2)
    const darkest = Math.min(luminance1, luminance2)
    return (lightest + 0.05) / (darkest + 0.05)
  }

  // Determine best text color
  calculateBrightness(bgHex: string, reverse = false) {
    const bgRgb = this.hexToRgb(bgHex)
    const bgLuminance = this.getLuminance(bgRgb)
    const whiteLuminance = this.getLuminance({ r: 255, g: 255, b: 255 })
    const blackLuminance = this.getLuminance({ r: 0, g: 0, b: 0 })

    const whiteContrast = this.getContrastRatio(bgLuminance, whiteLuminance)
    const blackContrast = this.getContrastRatio(bgLuminance, blackLuminance)

    return whiteContrast > blackContrast
  }

  extractHexColor(styleData: string): string {
    const match = styleData.match(/background-color:\s*(#[0-9a-fA-F]{3,6})/)
    return match ? match[1] : ''
  }

  get markClass(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      const backgroundColor = value.styleData // Assuming styleData is a hex color string
      if (this.isDarkBackground(this.extractHexColor(backgroundColor))) {
        return value.markClass + ' text-white'
      }
      return value.markClass
    }
    return ''
  }

  get styleData(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.styleData
    }
    return ''
  }

  get contentValue(): string {
    /*if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      if (value.distanceFromSea) {
        return useStoreMapFunctions().getDistance(value.distanceFromSea, 'coastline', 'line', 'class')
      }
      return $t(value.contentValue)
    }*/
    return ''
  }

  get contentClass(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.contentClass
    }
    return ''
  }

  getValue(statEnum: StatTypeEnum, indexStatTypeEnum = StatTypeEnum.Option): string | LabelData {
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

  getStatData(statType: StatTypeEnum, returnType: 'boolean' | 'string' = 'string'): boolean | string {
    try {
      const data = this.object.Stats[statType]?.Data ?? ''
      return returnType === 'boolean' ? !!data : data
    } catch (error) {
      console.error(`Error accessing data for statType ${statType}:`, error)
      return returnType === 'boolean' ? false : ''
    }
  }

  statIsDefined(statType: StatTypeEnum): boolean {
    return !!this.object.Stats[statType]
  }

  specialCase(): boolean {
    return this.getValue(this.statTypeEnum.ElementType) === 'hidden'
  }

  isJSON(str: string): boolean {
    let temp = null
    try {
      temp = JSON.parse(str)
    } catch (e) {
      return false
    }
    return Array.isArray(temp)
  }

  tooltipCase(): string | undefined {
    if (this.object !== undefined) {
      if (this.object.Stats[this.statTypeEnum.Tooltip] !== undefined) {
        return this.object.Stats[this.statTypeEnum.Tooltip].Data
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
