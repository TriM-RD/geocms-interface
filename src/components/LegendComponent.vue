<template>
  <div id="legend-block" @mouseleave="onLegendMouseLeave">
    <div v-if="legendVisible" class="legend-window position-absolute bg-light shadow p-sm-3 pe-sm-0 p-0 ps-3 pt-3" :style="{ minWidth: minWidth }" :class="{ 'legend-hidden': !legendVisible, 'legend-mobile': isMobile }">
      <button @click="toggleLegend" class="btn close-btn position-absolute top-0 end-0 me-2 mt-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <h5 @click="handleLegendClick" class="mb-3 cursor-pointer d-flex align-items-center">
        <span class="me-2">{{ $t('Legend') }}</span>
        <i v-if="!isMobile" :class="['bi', legendContentVisible ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
      </h5>
      <div v-if="legendContentVisible || isMobile">
        <div v-for="(item, index) in legendItems" :key="index" class="legend-item mb-2 me-3">
          <div class="d-flex align-items-center flex-wrap">
            <div class="icon-wrapper me-2">
              <button class="btn header-btn m-0 p-0 fs-5" data-bs-toggle="legend-tooltip" :title="item.title" @mouseover="onHeaderHover(item)" @mouseout="onOut" @click="onHeaderClick(item)">
                <i :class="item.icon"></i>
              </button>
            </div>
            <div class="legend-buttons d-flex flex-wrap">
              <button
                v-for="(colorObj, colorIndex) in item.colors"
                :key="colorIndex"
                @mouseout="onOut"
                @mouseover="onHover(colorObj)"
                @click="onClick(colorObj)"
                class="btn btn-sm legend-btn m-1"
                :style="{
                  backgroundColor: colorObj.color,
                  opacity: getButtonOpacity(colorObj)
                }"
                data-bs-toggle="legend-tooltip"
                :title="colorObj.title"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import { $t } from '@/stores/storeTranslations'
import { useStoreMapFunctions } from '@/stores/storeMapFunctions'
import { useStoreApiFeatures } from '@/stores/storeApiFeatures'
import { Tooltip } from 'bootstrap'
import { useStoreSelectedFeatures } from '@/stores/storeSelectedFeatures'
import { type ColorItem, type LegendItem, useStoreLegend, Category } from '@/stores/storeLegend'
import { useStoreAvailability } from '@/stores/storeAvailability'
@Component({
  methods: { $t }
})
export default class LegendComponent extends Vue {
  //TODO tooltip needs to be somehow completly ignored on hover
  //TODO check how big of a problem is when legend is clicked and screen size changes from a tocuh to a cursor
  legendContentVisible = true
  minWidth = 'auto'
  hovering = false
  isTouchDevice = false
  $t = $t

  created() {
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='legend-tooltip']",
      trigger: 'hover'
    })
  }

  get legendVisible() {
    return useStoreLegend().getDisplayLegend
  }

  get isMobile() {
    useStoreSelectedFeatures().removeAllTooltips()
    return useStoreLegend().getIsMobile
  }

  getButtonOpacity(colorObj: ColorItem): number {
    const selectedFeatures = useStoreSelectedFeatures().getData
    if (selectedFeatures.length === 0) {
      return 0.9 // Full opacity when no features are selected
    }
    return selectedFeatures.some((feature) => feature === colorObj.label) ? 0.9 : 0.075
  }

  onLegendMouseLeave(event: MouseEvent) {
    if (useStoreSelectedFeatures().getData.length) return
    const relatedTarget = event.relatedTarget as HTMLElement
    const legendBlock = document.getElementById('legend-block') as HTMLElement

    // Check if the relatedTarget is part of the legend block or has the classes tooltip-arrow or tooltip-inner
    const isIgnoringRelatedTarget = relatedTarget && (relatedTarget.classList.contains('tooltip-arrow') || relatedTarget.classList.contains('tooltip-inner'))

    // If relatedTarget is not part of the legend block and is not to be ignored, execute the desired action
    if (!legendBlock.contains(relatedTarget) && !isIgnoringRelatedTarget) {
      useStoreMapFunctions().resetLayerOpacityFun()
    }
  }

  onOut() {
    this.hovering = false
    if (useStoreSelectedFeatures().getData.length) return
    setTimeout(() => {
      if (!this.hovering) useStoreMapFunctions().resetLayerOpacityFun()
    }, 1000)
  }

  convertToLegendItems(data: ColorItem): LegendItem[] {
    const groupedItems: { [key: string]: LegendItem } = {
      P: { icon: 'fa-solid camp-pitch', title: $t('Pitch'), colors: [] },
      M: { icon: 'fa-solid fa-house', title: $t('Mobile Home'), colors: [] },
      G: { icon: 'fa-solid fa-tent', title: $t('Glamping'), colors: [] },
      A: { icon: 'fa-solid fa-building', title: $t('Apartment'), colors: [] },
      K: { icon: 'fa-solid fa-caravan', title: $t('Caravan'), colors: [] },
      S: { icon: 'fa-solid fa-traffic-light', title: $t('Availability'), colors: [] }
    }

    for (const item of data) {
      const groupKey = item.category // Use category from item
      if (groupedItems[groupKey]) {
        groupedItems[groupKey].colors.push(item)
      }
    }
    // Filter out categories with no colors
    return Object.values(groupedItems).filter((item) => item.colors.length > 0)
  }

  get legendItems() {
    this.$nextTick(() => {
      this.resizeWindow()
    })
    return this.convertToLegendItems(useStoreLegend().getLegendData)
  }

  resizeWindow() {
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)
    this.$nextTick(() => {
      this.calculateMinWidth() // Calculate the min-width after rendering
    })
  }

  beforeUnmount() {
    this.checkIfTouchDevice()
    window.addEventListener('resize', this.checkIfTouchDevice)
    window.removeEventListener('resize', this.checkScreenSize)
  }

  checkIfTouchDevice() {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  onHover(colorObj: ColorItem) {
    if (useStoreSelectedFeatures().getData.length) return
    if (!this.isTouchDevice) {
      this.highlightFeatures([colorObj])
    }
  }

  onHeaderHover(item: LegendItem) {
    if (useStoreSelectedFeatures().getData.length) return
    if (!this.isTouchDevice) {
      this.highlightFeatures(item.colors)
    }
  }

  onClick(colorObj: ColorItem) {
    if (this.isTouchDevice) {
      this.highlightFeatures([colorObj])
    }
  }

  onHeaderClick(item: LegendItem) {
    if (this.isTouchDevice) {
      this.highlightFeatures(item.colors)
    }
  }

  highlightFeatures(colorObjs: ColorItem[]) {
    let mapIds = []
    if (colorObjs[0].category === Category.S) {
      const features = useStoreAvailability().featureColors

      // Extract mapIds based on matching color
      mapIds = colorObjs.flatMap((obj) => {
        return Object.entries(features) // Iterate over entries (mapId, color)
          .filter(([mapId, color]) => color === obj.color) // Filter by matching color
          .map(([mapId, color]) => mapId) // Extract the mapId
      })
    } else {
      const features = useStoreApiFeatures().getFeatures
      mapIds = colorObjs.flatMap((obj) => {
        return features.filter((f: { label: string; mapId: string }) => f.label === obj.label).map((f: { mapId: string }) => f.mapId)
      })
    }

    if (mapIds.length > 0) {
      useStoreMapFunctions().featureHighlightFun(mapIds)
    }

    this.hovering = true
  }

  checkScreenSize() {
    useStoreLegend().toggleIsMobile(window.innerWidth <= 1010)
    if (this.isMobile) {
      useStoreLegend().toggleDisplayLegend(false)
      this.legendContentVisible = true
    } else {
      useStoreLegend().toggleDisplayLegend(true)
    }
  }

  calculateMinWidth() {
    // Get the legend element
    const legendWindow = this.$el.querySelector('.legend-window') as HTMLElement
    if (legendWindow) {
      // Make sure the element is visible to measure it
      legendWindow.style.display = 'block'
      legendWindow.style.visibility = 'hidden'
      // Calculate the width based on its content
      const contentWidth = legendWindow.offsetWidth
      // Set the minWidth value
      this.minWidth = `${contentWidth}px`
      // Reset the visibility
      legendWindow.style.display = ''
      legendWindow.style.visibility = ''
    }
  }

  toggleLegend() {
    if (useStoreLegend().getDisableLegend) return
    useStoreLegend().toggleDisplayLegend()
  }

  handleLegendClick() {
    if (this.isMobile) {
      this.toggleLegend()
    } else {
      this.toggleLegendContent()
    }
  }

  toggleLegendContent() {
    this.legendContentVisible = !this.legendContentVisible
  }
}
</script>

<style scoped>
.legend-btn {
  transition: opacity 0.3s ease; /* Smooth transition for opacity changes */
}

.legend-btn:hover {
  opacity: 1 !important; /* Full opacity when hovered */
}

.legend-window {
  max-width: 90vw;
  width: fit-content;
  transition: all 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
  border-bottom-left-radius: 1rem;
  top: 0;
  right: 0;
}

.legend-hidden {
  transform: translateX(100%);
}

.legend-item:not(:last-child) {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

.icon-wrapper {
  flex: 0 0 auto;
  margin-right: 0.5rem;
}

.icon-wrapper i {
  font-size: 1.25rem;
}

.header-btn {
  width: 3rem !important;
}

.header-btn i {
  font-size: 1.5rem !important;
}

.legend-buttons {
  display: flex;
  flex-wrap: wrap;
  max-width: 155px;
}

.legend-btn {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  margin: 2px;
  flex: 0 0 auto;
}

.cursor-pointer {
  cursor: pointer;
}

.toggle-btn {
  z-index: 3;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin: 1rem;
}

:deep(.tooltip-inner) {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.875rem;
}

:deep(.tooltip-arrow::before) {
  border-color: rgba(0, 0, 0, 0.8);
}

@media (max-width: 1200px) {
  .header-btn {
    width: 2rem !important;
  }
  .legend-btn {
    width: 25px;
    height: 25px;
    border-radius: 5px;
    margin: 2px;
    flex: 0 0 auto;
  }
  .legend-buttons {
    max-width: 150px;
  }
}

@media (max-width: 1010px) {
  .legend-window {
    top: var(--header-height, 80px);
  }
  .toggle-btn {
    box-shadow: 3px 5px 10px -3px rgb(0 0 0 / 30%);
    margin: 0px;
    top: var(--header-height, 83px);
    right: 10px;
  }
}

@media (max-width: 576px) {
  .legend-window {
    width: fit-content;
    height: auto;
    max-width: 100%;
    border-radius: 0;
    position: fixed;
    top: var(--header-height, 80px);
    /*bottom: var(--bottom-nav-height, 60px);*/
    left: 0;
    right: 0;
  }

  .legend-mobile {
    border-bottom-right-radius: 1rem;
    display: flex;
    flex-direction: column;
  }

  .legend-mobile > div {
    flex-grow: 1;
    overflow-y: auto;
  }

  .toggle-btn {
    box-shadow: 3px 5px 10px -3px rgb(0 0 0 / 30%);
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    margin: 0px;
    top: var(--header-height, 83px);
    left: 0px;
  }

  .info-toggle-btn {
    z-index: 0;
    box-shadow: none !important;
    left: 40px !important;
  }
}
</style>
