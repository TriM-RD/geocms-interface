<template>
    <div class="ratio ratio-4x3">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13273.804734261268!2d-73.97103194633222!3d40.780925390178616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sManhattan%2C%20New%20York%2C%20Sjedinjene%20Ameri%C4%8Dke%20Dr%C5%BEave!5e0!3m2!1shr!2shr!4v1668073453650!5m2!1shr!2shr" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
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
export default class MapComponent extends Vue {
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
