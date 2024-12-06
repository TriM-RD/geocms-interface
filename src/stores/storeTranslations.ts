import { defineStore } from 'pinia'

// Define an interface for type safety (if using TypeScript)
export interface Translation {
  text_string: string
  hr: string | null | undefined
  en: string | null | undefined
  it: string | null | undefined
  de: string | null | undefined
  nl: string | null | undefined
  ru: string | null | undefined
  si: string | null | undefined
  pl: string | null | undefined
  hr_m: string | null | undefined
  en_m: string | null | undefined
  it_m: string | null | undefined
  de_m: string | null | undefined
  nl_m: string | null | undefined
  ru_m: string | null | undefined
  si_m: string | null | undefined
  pl_m: string | null | undefined
} //TODO množine izbaciti kad se radi novi backend

//TODO Josip rješi ide warning: "Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Translation'"

export const useStoreTranslations = defineStore('translations', {
  state: () => ({
    translations: {} as { [key: string]: Translation },
    currentLanguage: window.localStorage.getItem('currentLanguage') || 'en'
  }),
  actions: {
    setTranslations(translations: { [key: string]: Translation }) {
      this.translations = translations
    }
  },
  getters: {
    getTranslations: (state) => state.translations,
    translate:
      (state) =>
      (text_string: string): Translation | undefined =>
        state.translations[text_string]
  }
})

export function $t(text_string: string): string {
  const store = useStoreTranslations()
  const translated = store.translate(text_string)

  if (translated?.[store.currentLanguage]) {
    return translated[store.currentLanguage]
  } else if (translated?.['en']) {
    return translated['en']
  } else {
    console.warn(`Translation not found for: "${text_string}"`)
    return text_string
  }
}
