import { hrDictionary } from '@/locales/hr-HR'
import { enDictionary } from '@/locales/en-EN'

export type TranslationKeys = {
  greeting: string
  welcome: string
  // Add more translation keys as needed
}

export type Translations = {
  [key: string]: TranslationKeys
}

export type TranslationKeyStrings = keyof TranslationKeys

export const translations: Translations = {
  en: enDictionary,
  hr: hrDictionary
}
