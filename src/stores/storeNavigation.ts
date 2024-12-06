import { defineStore } from 'pinia'

export const useStoreNavigation = defineStore('navigation', {
  state: () => ({
    changeBannerInstructionDel: null as ((instruction: string, iconPath: string, distance: string) => void) | null,
    playVoiceInstructionDel: null as ((instruction: string) => void) | null,
    toggleNavigationDel: null as ((pauseNavigation: boolean, manual: boolean) => void) | null
  }),
  actions: {
    setChangeBannerInstructionDel(fn: (instruction: string, iconPath: string, distance: string) => void) {
      this.changeBannerInstructionDel = fn
    },
    setPlayVoiceInstructionDel(fn: (instruction: string) => void) {
      this.playVoiceInstructionDel = fn
    },
    setToggleNavigationDel(fn: (pauseNavigation: boolean, manual: boolean) => void) {
      this.toggleNavigationDel = fn
    }
  },
  getters: {
    changeBannerInstruction: (state) => state.changeBannerInstructionDel,
    playVoiceInstruction: (state) => state.playVoiceInstructionDel,
    toggleNavigation: (state) => state.toggleNavigationDel
  }
})
