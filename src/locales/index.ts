import { hrDictionary } from '@/locales/hr-HR'
import { enDictionary } from '@/locales/en-EN'
import { TranslationKeys } from '@/locales/keys'

export type Translations = {
  en: TranslationKeys,
  hr: TranslationKeys
}

export const translations: Translations = {
  en: enDictionary,
  hr: hrDictionary
}

export const $t = translations[(localStorage.getItem('lang') || 'en') as keyof Translations]
