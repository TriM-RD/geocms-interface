import { hrDictionary } from '@/locales/hr-HR'
import { enDictionary } from '@/locales/en-EN'

export type TranslationKeys = {
  login: string,
  register: string,
  discoverFuture: string,
  harnessPower: string,
  smartControl: string,
  tailoredIoTSolutions: string,
  dataAnalytics: string,
  useAppAnalytics: string,
  infrastructureManagement: string,
  manageIoTInfrastructure: string,
  smartCities: string,
  ourSolutionFacilitates: string,
  smartCamps: string,
  improveOrganization: string,
  smartInfrastructure: string,
  enhanceInfrastructureProjects: string,
  meetOurClients: string,
  efficientlyManagingCityLights: string,
  enjoyingFlawlessPowerControl: string,
  readyToGetStarted: string,
  formSubmissionSuccessful: string,
  toActivateThisForm: string,
  errorSendingMessage: string,
  about: string,
  contact: string,
  english: string,
  croatian: string
  language: string,
  search: string,
  profile: string,
  administration: string,
  firmSelection: string,
  openReport: string,
  logOut: string,
  report: string,
}

export type Translations = {
  en: TranslationKeys,
  hr: TranslationKeys
}

export type TranslationKeyStrings = keyof TranslationKeys

export const translations: Translations = {
  en: enDictionary,
  hr: hrDictionary
}

export const $t = translations[(localStorage.getItem('lang') || 'en') as keyof Translations]
