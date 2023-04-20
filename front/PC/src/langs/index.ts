import ctsLang from '@constants/lang'

export interface Lang {
  [ctsLang.zh_cn]: string
  [ctsLang.en_us]: string
}


export * as homeLang from './home'
export * as headerLang from './header'
export * as footerLang from './footer'