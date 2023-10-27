<template>
  <div class="row justify-content-md-center">
    <div class="col-lg"></div>
    <div class="col-lg-6">
      <fancybox-component ref="fancyboxImages">
        <a
          v-for="(src, index) in images"
          :key="index"
          :href="src"
          data-fancybox="images"
          class="gallery-link"
        ></a>
        <div class="row" v-if="images.length > 0">
          <div class="col px-0">
            <button @click.prevent="openGallery('image')" class="btn btn-outline-dark w-100 rounded-bottom">{{$t.viewImages}}</button>
          </div>
        </div>
      </fancybox-component>
      <fancybox-component ref="fancyboxPDFs">
        <a
          v-for="(src, index) in pdfs"
          :key="'pdf-' + index"
          :href="src"
          data-fancybox="pdfs"
          data-type="iframe"
          data-options='{"iframe": {"preload": false}}'
          class="gallery-link"
        >
        </a>
        <div class="row" v-if="pdfs.length > 0">
          <div class="col px-0">
            <button @click.prevent="openGallery('pdf')" class="btn btn-outline-dark w-100 rounded-bottom">{{$t.viewPDFs}}</button>
          </div>
        </div>
      </fancybox-component>
      <div id="uppyDashboard" style="width:100%;"></div>
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
import FancyboxComponent from '@/components/showComponents/FancyboxComponent.vue'
import { v4 as uuidv4 } from 'uuid'

interface FileNameWithData {
  [key: string]: any;
}
@Options({
  components: {
    FancyboxComponent
  },
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
  private imagesData: Record<string, string> = {} // Store the image data
  private pdfsData: Record<string, string> = {} // Store the PDF data

  get images (): string[] {
    return Object.values(this.imagesData)
  }

  get pdfs (): string[] {
    return Object.values(this.pdfsData)
  }

  openGallery (type: 'image' | 'pdf'): void {
    if (type === 'image') {
      const galleryElements = (this.$refs.fancyboxImages as Vue).$el.querySelectorAll(
        '[data-fancybox="images"]'
      )
      // eslint-disable-next-line no-unused-expressions
      galleryElements[0]?.click()
    } else {
      const galleryElements = (this.$refs.fancyboxPDFs as Vue).$el.querySelectorAll(
        '[data-fancybox="pdfs"]'
      )
      // eslint-disable-next-line no-unused-expressions
      galleryElements[0]?.click()
    }
  }

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
        alert('The file name contains an illegal character. Yay')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        console.log(file)
        const tempFileType = this.getMimeType(file.name)
        if (tempFileType.startsWith('image/')) {
          this.imagesData[file.name] = result
        } else if (tempFileType === 'application/pdf') {
          this.pdfsData[file.name] = result
        }
        this.onSubmit()
      }
      reader.readAsDataURL(file.data)
    })

    this.uppy.on('file-removed', (file: { name: any }) => {
      Reflect.deleteProperty(this.imagesData, file.name)
      Reflect.deleteProperty(this.pdfsData, file.name)
      this.onSubmit()
    })

    this.displayFilesOnDashboard()
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
    const tempImages: FileNameWithData = {}
    const tempPdfs: FileNameWithData = {}
    for (const filename in this.imagesData) {
      const uniqueFilename = this.generateUniqueFilename(filename)
      tempImages[uniqueFilename] = this.imagesData[filename]
    }
    for (const filename in this.pdfsData) {
      const uniqueFilename = this.generateUniqueFilename(filename)
      tempPdfs[uniqueFilename] = this.pdfsData[filename]
    }
    this.object.Stats[this.statTypeEnum.Value].Data = JSON.stringify({
      images: tempImages,
      pdfs: tempPdfs
    })
    console.log({
      images: tempImages,
      pdfs: tempPdfs
    })
  }

  generateUniqueFilename (originalFilename: string) : string {
    const uuid = uuidv4()
    const recordID = this.object.Stats[this.statTypeEnum.Id].Data
    return `${recordID}+${uuid}+${originalFilename}`
  }

  getOriginalFilename (filename: string): string {
    const parts = filename.split('+')
    return parts[parts.length - 1]
  }

  displayFilesOnDashboard () {
    const data = this.object.Stats[this.statTypeEnum.Value].Data
    if (!data) return

    const { images, pdfs } = JSON.parse(data)

    const addFilesToDashboard = (files: FileNameWithData, type: string) => {
      for (const uniqueFilename in files) {
        const base64Data = files[uniqueFilename]

        const contentType = this.getMimeType(uniqueFilename)
        const byteCharacters = atob(base64Data.split(',')[1]) // Remove the data URL prefix
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: contentType })

        const originalFilename = this.getOriginalFilename(uniqueFilename)

        // eslint-disable-next-line no-unused-expressions
        this.uppy?.addFile({
          source: 'Local',
          name: originalFilename,
          data: blob,
          meta: {
            fileType: contentType
          }
        })
      }
    }

    addFilesToDashboard(images, 'image')
    addFilesToDashboard(pdfs, 'pdf')
  }

  getMimeType (filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase() || ''
    switch (extension) {
      case 'png':
        return 'image/png'
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'gif':
        return 'image/gif'
      case 'pdf':
        return 'application/pdf'
      default:
        return 'application/octet-stream'
    }
  }
}
</script>

<style scoped>
</style>
