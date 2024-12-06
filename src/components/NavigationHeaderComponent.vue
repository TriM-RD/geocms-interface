<template>
  <div class="header-container position-absolute top-0 start-50 translate-middle-x z-3">
    <nav class="header d-flex align-items-center justify-content-between mt-sm-3 p-2 fw-bold w-100">
      <div v-if="icon" class="icon-container mt-1 ps-5 d-flex align-items-center justify-content-center me-3">
        <i :class="['icon', icon]" />
      </div>
      <!-- Text container with responsive alignment -->
      <div :class="!icon ? 'text-smaller' : ''" class="text-container d-flex flex-column justify-content-center w-100 text-lg-center text-start">
        <h5 class="fw-bold text-wrap instructionText">{{ instruction }}</h5>
        <h6 v-if="distance" class="fw-bold text-wrap distanceText">{{ distance }}</h6>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import { useStoreNavigation } from '@/stores/storeNavigation'

@Component
export default class HeaderComponent extends Vue {
  instruction = 'Finding the best route in progress...'
  icon: string | null = null
  distance: string | null = null

  created() {
    useStoreNavigation().setChangeBannerInstructionDel(this.changeInstruction.bind(this))
  }

  changeInstruction(instruction: string, iconPath: string, distance: string | null, nonNavigationIcon = false) {
    if (nonNavigationIcon) {
      this.icon = iconPath
    } else {
      const cleanedIconPath = iconPath?.replace(/\s+/g, '') || null
      if (cleanedIconPath) {
        this.icon = 'navigation-' + cleanedIconPath || null
      }
    }

    this.distance = distance || null
    this.instruction = instruction
  }
}
</script>

<style scoped>
.header-container {
  width: 100%;
  max-width: 600px;
}

.header {
  box-shadow: 0 0px 10px rgb(0 0 0 / 30%);
  width: 100%;
  color: whitesmoke;
  background-color: var(--bs-navigation);
  border-radius: var(--bs-border-radius-xxl) !important;
  padding: 10px 15px;
}

.icon-container {
  width: 55px;
  height: 100%;
}

.icon {
  font-size: 1.75rem;
  color: whitesmoke;
  margin-right: 10px;
}

.instructionText {
  font-size: clamp(1.1rem, 1rem + 0.8vw, 1.9rem);
  margin: 0;
}

.distanceText {
  font-size: clamp(0.875rem, 0.6837rem + 0.5102vw, 1.25rem);
  margin: 0;
}

.header {
  padding: 12px 20px;
}

/* Smaller text size when no icon, but only on larger devices */
@media (min-width: 577px) {
  .text-smaller .instructionText {
    font-size: clamp(0.9rem, 0.8rem + 0.6vw, 1.4rem);
  }

  .text-smaller .distanceText {
    font-size: clamp(0.75rem, 0.6rem + 0.4vw, 1.1rem);
  }
}

@media (max-width: 576px) {
  .header-container {
    width: 100%;
    max-width: none;
  }

  .header {
    height: auto;
    width: 100%;
    border-radius: 0px !important;
  }

  /* Keep the banner size consistent on small screens */
  .text-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header {
    min-height: 70px; /* Ensures banner height stays consistent */
  }
}
</style>
