<template>
  <div class="mb-3 row justify-content-md-center">
    <div class="col-lg"></div>
    <div class="col input-group">
      <label
        :title="tooltipCase()"
        class="input-group-text"
        :hidden="specialCase()"
      >
        {{ object.Stats[statTypeEnum.Label].Data }}
      </label>
      <div>
        <button @click="openUppyDashboard">Upload Files</button>
        <div id="uppyDashboard"></div>
      </div>
      <div class="form-control">
        <slot></slot>
      </div>
      <div class="invalid-feedback">
        {{
          object.Stats[statTypeEnum.ErrorMessage]
            ? object.Stats[statTypeEnum.ErrorMessage].Data
            : ''
        }}
      </div>
    </div>
    <div class="col-lg"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import Tus from '@uppy/tus'
import {
  ObjectTemplate,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType,
  RegionEnum,
  ObjectType
} from '@cybertale/interface'

@Options({
  props: {
    object: ObjectTemplate
  }
})
export default class UppyComponent extends Vue {
  object!: ObjectTemplate
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  private uppy: Uppy | null = null

  mounted () {
    this.uppy = new Uppy({
      autoProceed: false,
      restrictions: {
        maxFileSize: 1000000,
        maxNumberOfFiles: 5,
        allowedFileTypes: ['image/*', 'application/pdf']
      }
    })

    this.uppy.use(Dashboard, {
      inline: true,
      target: '#uppyDashboard',
      showProgressDetails: true,
      note: 'Images and PDFs only, 1–5 files, up to 1 MB'
    })

    this.uppy.use(Tus, { endpoint: '/upload' })
  }

  beforeDestroy () {
    if (this.uppy) {
      this.uppy.close()
    }
  }

  openUppyDashboard () {
    const dashboardPlugin = this.uppy?.getPlugin('Dashboard') as Dashboard | undefined
    if (dashboardPlugin) {
      dashboardPlugin.openModal()
    }
  }

  tooltipCase (): string | undefined {
    if (this.object !== undefined) {
      if (this.object.Stats[this.statTypeEnum.Tooltip] !== undefined) {
        return this.object.Stats[this.statTypeEnum.Tooltip].Data
      }
    }
  }

  specialCase (): boolean {
    if (this.object.Stats[this.statTypeEnum.ElementType] === undefined) {
      return false
    }
    return this.object.Stats[this.statTypeEnum.ElementType].Data === 'hidden'
  }
}
</script>

<style scoped>
</style>
