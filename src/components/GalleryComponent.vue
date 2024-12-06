<template v-if="renderComponent">
  <div class="mb-sm-3 mb-0">
    <div v-if="showFade" class="fade-overlay"></div>
    <div class="position-relative image-container custom-rounded-top">
      <div v-if="images.length > 1 && settings.get(SettingsKeys.UseArrows)">
        <button @click="previousImage" class="btn btn-dark opacity-75 position-absolute top-50 start-0">&lt;</button>
        <button @click="nextImage" class="btn btn-dark opacity-75 position-absolute top-50 end-0">&gt;</button>
      </div>
      <img v-if="has360 && settings.show360onModal" class="position-absolute top-0 start-0 m-2 me-5" src="@/assets/icons/expand.svg" data-bs-dismiss="modal" aria-label="Close" alt="" @click="open360Image" style="z-index: 11; width: 30px; height: 30px; cursor: pointer" />
      <img class="position-absolute top-0 end-0 m-2 me-5" src="@/assets/icons/share.svg" data-bs-dismiss="modal" aria-label="Close" alt="" @click="shareButton" style="z-index: 11; width: 30px; height: 30px; cursor: pointer" />
      <img class="position-absolute top-0 end-0 m-2" src="@/assets/icons/x-circle-fill-white.svg" data-bs-dismiss="modal" aria-label="Close" alt="" @click="$router.push({ name: 'map' })" style="z-index: 11; width: 30px; height: 30px; cursor: pointer" />
      <div class="dynamic-header">
        <template v-if="settings.show360onModal && has360">
          <button style="z-index: 10" type="button" class="panom btn position-absolute bottom-0 start-0 d-flex align-items-center m-1 m-sm-2 p-2" @click="open360Image">
            <span>Gallery</span>
          </button>
        </template>
        <template v-else>
          <button style="z-index: 11" v-if="has360" type="button" class="panom btn position-absolute bottom-0 start-0 d-flex align-items-center m-1 m-sm-2 p-2" @click="open360Image">
            <span>360°</span>
          </button>
        </template>

        <button style="z-index: 11" v-if="noGps" type="button" class="navigateButton btn position-absolute bottom-0 end-0 d-flex align-items-center m-1 m-sm-2 p-2" @click="$router.push({ name: 'navigationPreview' })">
          <span>{{ $t('Navigation') }}</span>
          <img src="@/assets/icons/gps-arrow.svg" class="ms-2" alt="" />
        </button>
      </div>

      <template v-if="has360">
        <img v-if="!iframe360" src="@/assets/img/loader-bg.jpg" v-show="loadingText && settings.show360onModal" class="img-fluid custom-rounded-top pulse-animation" :alt="'Placeholder for image ' + (currentIndex + 1)" />
        <div v-if="iframe360" v-show="fullscreen" class="fullscreen-container">
          <iframe :src="panomImage.full" title="Campsabout 360" class="fullscreen-iframe"> </iframe>
        </div>

        <a-scene v-else :embedded="!fullscreen" :class="getZIndex" id="aframe-container" v-show="(fullscreen && !settings.show360onModal) || settings.show360onModal">
          <a-entity v-if="loadingText" id="loadingText" position="0 1.6 -1" text="value: Loading 360° image...; color: black; align: center; width: 2;"></a-entity>
          <a-assets>
            <a-asset-item id="skyTexture" :src="aframeSky" crossorigin="anonymous"></a-asset-item>
          </a-assets>
          <a-sky src="#skyTexture" crossorigin="anonymous" animation="property: rotation; to: 0 360 0; loop: true; dur: 500000; easing: linear"> </a-sky>
          <a-entity camera look-controls="reverseMouseDrag: true; touchEnabled: true; magicWindowTrackingEnabled: false" position="0 1.6 0"></a-entity>
        </a-scene>

        <div v-if="fullscreen">
          <img class="position-fixed top-0 end-0 m-2" src="@/assets/icons/x-circle-fill-black.svg" @click.prevent="close360Image" aria-label="Close" alt="" style="z-index: 20; width: 40px; height: 40px; cursor: pointer" />
          <div v-if="!iframe360" class="position-fixed top-0 start-0 m-2" style="z-index: 20">
            <mark class="fs-4" :style="'background-color: ' + styleData">{{ label }}</mark>
          </div>
        </div>
      </template>
      <template v-if="!settings.show360onModal || !has360">
        <a :href="images[currentIndex].full" data-fancybox="gallery" @click.prevent="openFancybox(currentIndex)">
          <!-- Placeholder Image with Pulse Animation -->
          <img src="@/assets/img/loader-bg.jpg" v-show="!isImageLoaded" class="img-fluid custom-rounded-top pulse-animation" :alt="'Placeholder for image ' + (currentIndex + 1)" />

          <!-- Actual Image that is shown once loaded -->
          <img :src="images[currentIndex].full" v-show="isImageLoaded" class="img-fluid custom-rounded-top" :alt="'Image ' + (currentIndex + 1)" @load="onImageLoad" ref="mainImage" />
        </a>
      </template>

      <!-- Navigation Dots -->
      <div class="position-absolute start-50 translate-middle-x" style="top: 90%" v-if="images.length > 1 && settings.get(SettingsKeys.UseDots)">
        <span v-for="(image, index) in images" :key="index" :class="{ 'bg-white border border-secondary': index === currentIndex, 'bg-secondary opacity-75': index !== currentIndex }" @click="setCurrentImage(index)" class="d-inline-block rounded-circle me-1" style="width: 10px; height: 10px; cursor: pointer"></span>
      </div>
    </div>

    <!-- Thumbnails -->
    <div class="d-flex justify-content-center mt-2 gap-2" v-if="images.length > 1 && settings.get(SettingsKeys.UseThumbnail)">
      <a v-for="(image, index) in images" :key="index" :href="image.full" @click.prevent="setCurrentImage(index)" class="me-2">
        <img :src="image.thumbnail" :alt="'Thumbnail ' + (index + 1)" :class="{ 'border border-dark': index === currentIndex }" class="rounded thumbnail-img" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { useStoreSettings, SettingsKeys } from '@/stores/storeSettings'
import 'aframe'
import '/node_modules/bootstrap-icons/font/bootstrap-icons.css'
import { ObjectTemplate, ObjectType, ObjectTypeEnum, RegionEnum, RegionType, StatTypeEnum } from '@cybertale/interface'
import { $t } from '@/stores/storeTranslations'

AFRAME.components['look-controls'].Component.prototype.onTouchMove = function (t) {
  console.log('on touch move event!')
  if (this.touchStarted && this.data.touchEnabled) {
    this.pitchObject.rotation.x += (0.6 * Math.PI * (t.touches[0].pageY - this.touchStart.y)) / this.el.sceneEl.canvas.clientHeight
    this.yawObject.rotation.y += /*  */ (Math.PI * (t.touches[0].pageX - this.touchStart.x)) / this.el.sceneEl.canvas.clientWidth
    this.pitchObject.rotation.x = Math.max(Math.PI / -2, Math.min(Math.PI / 2, this.pitchObject.rotation.x))
    this.touchStart = {
      x: t.touches[0].pageX,
      y: t.touches[0].pageY
    }
  }
}

interface LabelData {
  styleData: string
  iconClass: string
  title: string
  markValue: string
  markClass: string
  contentValue: string
  contentClass: string
  translate: string
  number: string
}

@Component({
  methods: { $t }
})
export default class GalleryComponent extends Vue {
  $t!: (key: string) => string
  @Prop({ default: null }) modalFunction!: any
  @Prop() object!: ObjectTemplate
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  renderComponent = false
  currentIndex = 0
  settings = useStoreSettings()
  images = [{ thumbnail: '/src/assets/img/loader-bg.jpg', full: '/src/assets/img/loader-bg.jpg', panom: false }]
  aframeSky = '/src/assets/img/Premium Sea_873_1712824284031.jpg'
  aframeSkyFull = '/src/assets/img/Premium Sea_873_1712824284031.jpg'
  has360 = false
  iframe360 = false
  isImageLoaded = false
  loadingText = true
  fullscreen = false
  panomImage = { thumbnail: '', full: '', panom: true, iframe: true }
  showFade = false

  created() {
    const parsedImages = JSON.parse(this.object.Stats[StatTypeEnum.ItemList].Data)
    this.images = []

    for (const img of parsedImages) {
      if (!img.panom) {
        this.images.push(img)
      } else if (img.panom) {
        this.panomImage = img
        this.has360 = true
      }
      if (img.iframe) {
        this.iframe360 = true
      }
    }
    console.log(this.images)
  }

  mounted() {
    if (this.has360 && !this.iframe360) {
      this.loadingText = true
      this.aframeSky = this.panomImage.full
      this.preload360Image(this.aframeSky)
    }
    this.$nextTick(() => {
      this.setupImageLoadHandling()
    })
  }

  preload360Image(imageSrc: string) {
    const img = new Image()
    img.src = imageSrc
    img.decode().then(() => {
      this.onAssetLoaded()
    })
  }

  onAssetLoaded() {
    this.loadingText = false
    console.log('360-degree image preloaded')
  }

  get getZIndex() {
    if (this.fullscreen) {
      return 'on-button-360'
    }
    return 'in-modal-360'
  }

  beforeUnmount() {
    // Dispose of Fancybox instances
    Fancybox.close(true)
    Fancybox.destroy()

    // Remove A-Frame scene and dispose of WebGL context
    const aframeContainer = document.getElementById('aframe-container')
    this.cleanWebGL(aframeContainer)

    // Force garbage collection (if supported)
    if (window.gc) {
      window.gc()
    }
  }

  cleanWebGL(aframeContainer: any) {
    if (aframeContainer) {
      const aScene = aframeContainer
      if (aScene) {
        // Get the Three.js scene and renderer
        const threeScene = aScene.object3D
        const renderer = aScene.renderer

        if (threeScene && renderer) {
          // Dispose of all objects in the scene
          threeScene.traverse((object) => {
            if (object.geometry) {
              object.geometry.dispose()
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose())
              } else {
                object.material.dispose()
              }
            }
          })

          // Dispose of the renderer
          renderer.dispose()

          // Force context loss
          const gl = renderer.getContext()
          if (gl.getExtension('WEBGL_lose_context')) {
            gl.getExtension('WEBGL_lose_context').loseContext()
          }

          // Clear references
          renderer.forceContextLoss()
          renderer.context = null
          renderer.domElement = null
        }

        // Remove A-Frame scene
        aScene.parentNode?.removeChild(aScene)
      }

      // Clear the container
      aframeContainer.innerHTML = ''
    }
  }

  get noGps() {
    return window.localStorage.getItem('noGps')?.toLowerCase() !== 'true'
  }

  get label(): string {
    const value = this.getValue(StatTypeEnum.Label) as LabelData
    if (value.translate) {
      return $t(value.title) + ' ' + (value.number || '')
    }
    return value.title
  }

  get styleData(): string {
    const value = this.getValue(StatTypeEnum.Label) as LabelData
    return value.styleData
  }

  setupImageLoadHandling() {
    const img = this.$refs.mainImage as HTMLImageElement
    if (img) {
      // Always set up the onload handler
      img.onload = this.onImageLoad
      // Check if the image is already complete (might be cached)
      if (img.complete) {
        this.onImageLoad()
      }
    }
  }

  onImageLoad() {
    this.isImageLoaded = true // Set to true once the image is loaded
  }

  get SettingsKeys() {
    return SettingsKeys
  }

  setCurrentImage(index: number) {
    this.currentIndex = index
    this.$nextTick(() => {
      this.setupImageLoadHandling()
    })
  }

  previousImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length
  }

  openFancybox(index: number) {
    this.modalFunction!.close()

    Fancybox.show(
      this.images.map((image) => ({
        src: image.full,
        thumb: image.thumbnail
      })),
      {
        startIndex: index,
        backdropClick: false,
        on: {
          closing: (fancybox) => {
            this.closeFancybox()
          },
          change: (fancybox, slide) => {
            this.currentIndex = slide.index
          }
        }
      }
    )

    setTimeout(() => {
      const closeButton = document.querySelector('.f-button[data-fancybox-close]')
      if (closeButton) {
        closeButton.addEventListener('click', this.closeFancybox.bind(this))
      }
    }, 100)
  }

  closeFancybox() {
    if (this.modalFunction) {
      try {
        this.modalFunction.open()
      } catch (error) {
        console.error('Error showing modal:', error)
      }
    }
  }

  open360Image() {
    this.showFade = true // Show the fade overlay

    setTimeout(() => {
      const fadeOverlay = document.querySelector('.fade-overlay')
      if (fadeOverlay) {
        fadeOverlay.classList.add('fade-in')
      }

      setTimeout(() => {
        this.fullscreen = true
        this.showFade = false

        // Show loading text when opening 360 image
        const loadingText = document.getElementById('loadingText')
        if (loadingText) {
          loadingText.setAttribute('visible', 'true')
        }

        this.$nextTick(() => {
          document.querySelector('a-scene')?.resize()
        })
      }, 300)
    }, 10)
  }

  close360Image() {
    this.showFade = true

    // Double the speed when closing (fade-out quickly)
    setTimeout(() => {
      const loadingText = document.getElementById('loadingText')
      if (loadingText) {
        loadingText.setAttribute('visible', 'true')
      }
      this.fullscreen = false
      this.showFade = false
      this.$nextTick(() => {
        document.querySelector('a-scene')?.resize()
      })
    }, 100)
  }

  statIsDefined(statType: StatTypeEnum): boolean {
    return !!this.object.Stats[statType]
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

  isJSON(str: string): boolean {
    let temp = null
    try {
      temp = JSON.parse(str)
    } catch (e) {
      return false
    }
    return Array.isArray(temp)
  }

  shareButton() {
    if (typeof navigator.share === 'function' && this.isMobileDevice()) {
      this.openNativeShare()
    } else {
      this.openShareWindow()
    }
  }

  openNativeShare(): void {
    navigator
      .share({
        //TODO move it to mechanic (buttons action too)
        title: 'Your Personal Accommodation Link.',
        url: window.location.href
      })
      .then(() => console.log('Content shared successfully'))
      .catch((error) => console.log('Sharing failed', error))
  }

  isMobileDevice(): boolean {
    return /Mobi|Android|iPhone/i.test(navigator.userAgent)
  }

  openShareWindow(): void {
    const windowURL = this.$router.resolve({
      name: 'share'
    }).href

    window.open(windowURL, '', 'width=400,height=700')
  }
}
</script>

<style scoped>
.fade-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0); /* Start with no darkness */
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    background-color 0.6s ease-in-out,
    transform 0.4s ease-in-out; /* Faster transitions */
  opacity: 1;
  transform: scale(1); /* Default scale */
}

.fade-overlay.fade-in {
  background-color: rgba(0, 0, 0, 0.8); /* Gradually darkens */
  transform: scale(1.05); /* Slight zoom-in effect */
}

.fade-overlay.fade-out {
  opacity: 0; /* Still fade out smoothly at the end */
  transform: scale(1.2); /* Zoom out with blur for exit */
  filter: blur(3px);
  transition:
    opacity 0.375s ease-in-out,
    transform 0.375s ease-in-out,
    filter 0.375s ease-in-out; /* Double speed for closing */
}

.fullscreen-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* Full width of the viewport */
  height: 100dvh; /* Full height of the viewport */
  z-index: 19; /* Ensure it's on top of other elements */
  background-color: rgba(0, 0, 0, 0.8); /* Optional, for a backdrop effect */
}

.fullscreen-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

#iframePanom {
  /*height: calc(100vh - 30px);*/
  width: 100%;
  z-index: 999999 !important;
  height: 640px;
}

.image-container {
  height: 35vh; /* Set height to 35% of the viewport height */
  max-height: 600px; /* Maximum height */
  min-height: 20vh; /* Minimum height */
  overflow: hidden; /* Hide overflow from the image */
}

.image-container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.thumbnail-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
}

.on-button-360 {
  z-index: 19;
}

.in-modal-360 {
  z-index: 9;
}

.navigateButton {
  background-color: #007afc; /* Use Bootstrap primary color */
  border-radius: 25px 5px; /* Shared border radius */
  color: white;
}

.panom {
  background-color: var(--bs-white);
  color: black;
  border-radius: 5px 25px; /* Unique border radius for panom button */
}

.dynamic-header {
  display: flex;
  align-items: center;
}

.dynamic-header span {
  font-weight: 700;
  text-transform: uppercase;
  font-size: clamp(0.85rem, 0.6645rem + 0.3647vw, 1rem);
}

.dynamic-header img {
  width: clamp(0.75rem, 0.6645rem + 0.3647vw, 10rem);
  height: auto;
  vertical-align: middle;
}

.pulse-animation {
  border-radius: 25px !important;
  animation: pulse 1.5s infinite; /* Pulse animation */
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
    border-radius: inherit;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
    border-radius: inherit;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
    border-radius: inherit;
  }
}

.fade-in-animation {
  opacity: 0; /* Start with 0 opacity */
  transition: opacity 0.5s ease-in-out; /* Fade-in effect */
}

.fade-in-animation-loaded {
  opacity: 1; /* Fully opaque once loaded */
}

@media (max-width: 600px) {
  .image-container {
    height: 25vh; /* Smaller height on mobile devices */
    min-height: 20vh;
  }

  .thumbnail-img {
    width: 40px;
    height: 40px;
  }

  .navigateButton {
    background-color: #007afc; /* Use Bootstrap primary color */
    border-radius: 15px 5px; /* Shared border radius */
    color: white;
  }

  .panom {
    background-color: var(--bs-white);
    color: black;
    border-radius: 5px 15px; /* Unique border radius for panom button */
  }

  .pulse-animation {
    border-radius: 10px !important; /* Adjust the radius for smaller screens */
  }
}

@media (max-height: 700px) {
  .image-container {
    height: 30vh; /* Adjust height for short screens */
  }

  .d-flex.justify-content-center.mt-2.gap-2 {
    display: none !important; /* Hide elements on shorter screens */
  }
}
</style>
