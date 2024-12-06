<template>
  <input
    class="form-control"
    :list="object.Stats[statTypeEnum.BelongsTo].Data"
    :class="returnIfExists(statTypeEnum.Design) + ' ' + validate()"
    :required="attributeCheck(statTypeEnum.Required)"
    :disabled="disabledCheck(statTypeEnum.Disabled)"
    :type="returnIfExists(statTypeEnum.ElementType)"
    :value="`${object?.Stats[statTypeEnum.Value].Data !== null ? (object.Stats[statTypeEnum.Value].Data.name === undefined ? valueName : object.Stats[statTypeEnum.Value].Data.name) : ''}`"
    :placeholder="returnIfExists(statTypeEnum.Placeholder)"
    @input="inputEvent(object as ObjectTemplate, $event.target.value)"
  />
  <datalist :id="object.Stats[statTypeEnum.BelongsTo].Data" v-if="displayOptions">
    <option v-for="(option, index) in options" :key="index" :value="option.name">{{ option.name }}</option>
  </datalist>
  <div class="invalid-feedback order-1">{{ returnIfExists(statTypeEnum.ErrorMessage) }}</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum } from '@cybertale/interface'
import http from '@/http-common'

interface Option {
  id: number
  name: string
}

const MIN_SEARCH_LENGTH = 3

@Component
export default class DataListComponent extends Vue {
  @Prop() object!: ObjectTemplate

  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  displayOptions = false
  options: Option[] = []
  loading = true

  get ObjectTemplate() {
    return ObjectTemplate
  }

  returnIfExists(tag: number): string {
    if (this.object.Stats[tag]) {
      return this.object.Stats[tag].Data
    }
    return ''
  }

  async created() {
    await this.fetchOptions()
    this.loading = false
  }

  async fetchOptions() {
    try {
      const parsedObject: { link?: string } = JSON.parse(this.object.Stats[this.statTypeEnum.ItemList].Data)[0]
      if (parsedObject.link) {
        const response = await http.get(parsedObject.link + '/' + this.object.Stats[this.statTypeEnum.Name].Data)
        this.options = response.data
        this.object.Stats[this.statTypeEnum.ItemList].Data = JSON.stringify(response.data)
      } else {
        this.options = JSON.parse(this.object.Stats[this.statTypeEnum.ItemList].Data)
      }
    } catch (error: any) {
      console.error('Error fetching data:', error.message)
    }
  }

  getValue(statEnum: number, indexStatTypeEnum = StatTypeEnum.Option): string {
    if (this.object.Stats[statEnum]) {
      if (this.object.Stats[indexStatTypeEnum] && this.object.Stats[statEnum] && this.isJSON(this.object.Stats[statEnum].Data)) {
        const data = JSON.parse(this.object.Stats[statEnum].Data)
        return data[Number(this.object.Stats[indexStatTypeEnum].Data)]
      } else {
        return this.object.Stats[statEnum].Data
      }
    }
    return ''
  }

  get valueName(): string {
    const temp = this.options.find((option: any) => option.id === this.getValue(StatTypeEnum.Value, StatTypeEnum.ValueIndices))
    if (!temp) {
      return this.getValue(StatTypeEnum.Value, StatTypeEnum.ValueIndices)
    }
    return temp?.name
  }

  attributeCheck(statType: number): boolean | string {
    if (this.object.Stats[statType] === undefined) {
      return false
    }
    if (this.object.Stats[statType].Data === '') {
      return false
    }
    return this.object.Stats[statType].Data
  }

  disabledCheck(statType: number): boolean | string {
    if (this.object.Stats[statType] === undefined) {
      return false || this.loading
    }
    if (this.object.Stats[statType].Data === '') {
      return false || this.loading
    }
    return this.object.Stats[statType].Data
  }

  validate(): string {
    if (this.object.Stats[this.statTypeEnum.IsValid] === undefined) {
      return ''
    }
    if (this.object.Stats[this.statTypeEnum.IsValid].Data === '') {
      return ''
    }
    if (this.object.Stats[this.statTypeEnum.IsValid].Data) {
      return 'is-valid'
    }
    if (this.object.Stats[this.statTypeEnum.ErrorMessage].Data === null) {
      return ''
    }
    if (this.object.Stats[this.statTypeEnum.ErrorMessage].Data !== '') {
      return 'is-invalid'
    }
    return ''
  }

  inputEvent(object: ObjectTemplate, value: string): void {
    this.displayOptions = value.length >= MIN_SEARCH_LENGTH
    this.regionType.RegionTypes[object.Region].ObjectTypes[object.ObjectEnum].ChooseSubType(object, value)
  }

  check(id: string): boolean {
    if (this.object.Stats[this.statTypeEnum.Value] === undefined || id === undefined) {
      return false
    }
    return this.object.Stats[this.statTypeEnum.Value].Data === id.toString()
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
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
