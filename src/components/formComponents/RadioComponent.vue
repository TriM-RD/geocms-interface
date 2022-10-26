<template>
  <div class="mb-3 row justify-content-md-center">
        <div class="col"></div>
        <div class="col">
      <div class="form-check">
        <label for="exampleDataList" class="form-label">{{object.Stats[statTypeEnum.Label].Data }}</label>
        <div class="form-check" v-for="(item, key, index) in JSON.parse(object.Stats[statTypeEnum.ItemList].Data)" :key="`${ key }-${ index }`">
          <input class="form-check-input" type="radio" :value="item" name="flexRadioDefault" id="flexRadioDefault1">
          <label class="form-check-label" for="flexRadioDefault1">
            {{item}}
          </label>
        </div>

      </div>
      </div>
      <div class="col"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate } from '@/interface/manager/containerClasses/objectTemplate'
import { ObjectType, StatTypeEnum, ObjectTypeEnum, RegionType, RegionEnum } from '@/interface/manager/events/types'
@Options({
  props: {
    object: ObjectTemplate
  }
})
export default class RadioComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  object!: ObjectTemplate
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
