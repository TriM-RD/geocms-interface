<template>
  <div class="mb-3 row justify-content-md-center">
    <div class="col-lg"></div>
    <div class="col">
      <div id="uppyDashboard"></div>
    </div>
    <div class="col-lg"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import { ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum } from '@cybertale/interface'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import { v4 as uuidv4 } from 'uuid'
interface FileNameWithData {
  [key: string]: any;
}
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
  private filesData: Record<string, string> = {} // Store the file data

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
      hideUploadButton: true,
      note: 'Images and PDFs only, 1–5 files, up to 1 MB. File-name must not contain "+"'
    })

    this.uppy.on('file-added', (file: { id: string; name: any; data: Blob }) => {
      if (file.name.includes('+')) {
        if (this.uppy) {
          this.uppy.removeFile(file.id)
        }
        alert('The file name contains an illegal character.')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        this.filesData[file.name] = reader.result as string
        this.onSubmit()
      }
      reader.readAsDataURL(file.data)
    })

    this.uppy.on('file-removed', (file: { name: any }) => {
      Reflect.deleteProperty(this.filesData, file.name)
      this.onSubmit()
    })
  }

  beforeDestroy () {
    if (this.uppy) {
      this.uppy.close()
    }
  }

  openUppyDashboard () : void {
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

  // This method should be called when the form is submitted
  onSubmit (): void {
    const temp : FileNameWithData = {}
    for (const filename in this.filesData) {
      const uniqueFilename = this.generateUniqueFilename(filename)
      const fileData = this.filesData[filename]
      const base64Data = btoa(fileData)
      temp[uniqueFilename] = base64Data
    }
    this.object.Stats[this.statTypeEnum.Value].Data = JSON.stringify(temp)
    console.log(temp)
  }

  generateUniqueFilename (originalFilename: string) : string {
    const uuid = uuidv4()
    const recordID = this.object.Stats[this.statTypeEnum.Id].Data
    return `${recordID}+${uuid}+${originalFilename}`
  }
}
</script>

<style scoped></style>
