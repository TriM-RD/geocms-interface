<template>
  <div @click.prevent="redirectToUnit" class="mx-3 card card-body mb-4">
    <div class="filtered-entities-content">
      <div class="entity-wrapper">
        <h2>{{ itemData.name }} {{ itemData.featureType === 'unit' ? itemData.number : '' }}</h2>
        <span v-if="itemData.featureType === 'unit'" class="small-bg rounded-5 py-0" :style="{ background: itemData.color }">
          {{ itemData.name }}
        </span>
        <span v-if="itemData.distance">
          <i class="fa-solid fa-route"></i> <strong>{{ itemData.distance }}</strong>
        </span>
      </div>
      <i :class="'result-icon fas ' + itemData.icon"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { ObjectTemplate, StatTypeEnum, ObjectTypeEnum, RegionEnum, RegionType } from '@cybertale/interface'
import { useStoreMapFunctions } from '@/stores/storeMapFunctions'

interface LabelData {
  iconClass: string
  title: string
}

@Component
export default class ListItemComponent extends Vue {
  @Prop() object!: ObjectTemplate

  StatTypeEnum = StatTypeEnum
  ObjectTypeEnum = ObjectTypeEnum
  RegionEnum = RegionEnum

  itemData: any = {}

  get isHidden(): boolean {
    return this.getStatData(StatTypeEnum.ElementType) === 'hidden'
  }

  get isDisabled(): boolean {
    return !!this.getStatData(StatTypeEnum.Disabled, 'boolean')
  }

  get buttonClass(): string {
    return this.getValue(StatTypeEnum.Design) as string
  }

  get buttonLabel(): string {
    if (this.showIcon) {
      const value = this.getValue(StatTypeEnum.Label) as LabelData
      return value.title
    }
    return this.getValue(StatTypeEnum.Label) as string
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

  mounted() {
    this.itemData = JSON.parse(this.object.Stats[StatTypeEnum.ItemList].Data)
    if (window.localStorage.getItem('noGps')?.toLowerCase() !== 'true') {
      this.itemData.distance = useStoreMapFunctions().getDistance(this.itemData.mapId)
    }
  }

  redirectToUnit() {
    this.$router.push({ name: 'map', query: { mapId: this.itemData.mapId } })
  }

  handleClick(): void {
    const { Region, ObjectEnum } = this.object
    RegionType.RegionTypes[Region].ObjectTypes[ObjectEnum].ChooseSubType(this.object)
  }

  getValue(statEnum: StatTypeEnum, indexStatTypeEnum = StatTypeEnum.Option): string | LabelData {
    const tempData = this.getStatData(statEnum) as string
    if (!tempData) return ''

    if (this.statIsDefined(indexStatTypeEnum) && this.isJSON(tempData)) {
      const data = JSON.parse(tempData)
      const optionData = this.getStatData(indexStatTypeEnum) as string
      if (this.isJSON(optionData)) {
        const parsedOptionData = JSON.parse(optionData)[Number(this.object.Stats[StatTypeEnum.OptionIndices].Data)]
        return data[parsedOptionData] || ''
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

  isJSON(str: string): boolean {
    try {
      return Array.isArray(JSON.parse(str))
    } catch {
      return false
    }
  }
}
</script>

<style scoped>
.card-body {
  flex: none;
}

.filtered-entities {
  border: none;
}

.card {
  display: flex;
  padding: 10px;
  background: #efefef;
  border-radius: 25px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: none;
}

.result-icon {
  position: absolute;
  right: 0;
  font-size: 32px;
  color: var(--bs-camp-disabled);
  z-index: 0;
  margin-right: 20px;
}

.card:before {
  content: '';
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNjc0LjRweCIgaGVpZ2h0PSI1MjguM3B4IiB2aWV3Qm94PSIwIDAgNjc0LjQgNTI4LjMiIHN0eWxlPSJvdmVyZmxvdzp2aXNpYmxlO2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjc0LjQgNTI4LjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHBhdGggZmlsbD0iI2Y3ZjdmNyIgZD0iTTkyLjYsNDUyLjdjLTk0LjgtOTYuOS0xMzAtMjU2LjktNDIuMi0zNTZsMC41LTAuNmMwLjEtMC4yLDAuMy0wLjMsMC40LTAuNWMxOC4yLTIwLjMsNDEuNi0zOCw3MC44LTUyICBjODEuMi0zOSwyODYuMS04NC44LDQ0NC4yLDI0LjdjMTI4LjYsODkuMSwxMzMsMTg4LjQsNjIuMywyNzMuN2MwLDAsMCwwLDAsMEw2MTQuNCwzNThjLTI0LjUsMjUuNi01NS44LDQ5LjgtOTIuNSw3MS44ICBDMzQ5LDUzMy41LDIxMy41LDU3Ni40LDkyLjYsNDUyLjd6Ii8+Cjwvc3ZnPg==);
  background-size: cover;
  background-position: 0;
  background-repeat: no-repeat;
  position: absolute;
  width: 100px;
  height: 180px;
  right: 0;
  top: -20px;
}

.filtered-entities-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  z-index: 1;
}

.filtered-entities-content h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  color: #4e4e4e;
}

.card-body {
  cursor: pointer;
  transition: all 0.22s;
}

.card-body:hover {
  background: #e5e5e5;
}

.small-bg {
  padding: 4px;
  border-radius: 5px;
  color: rgb(255, 255, 255);
  font-size: 12px;
}

.entity-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
}

.entity-container {
  padding: 10px 0 20px;
  margin: 0;
  background: white;
  border-radius: 0 0 20px 20px;
}
</style>
