import { LANG } from '@constants/lang'

export interface Lang {
  [LANG.zh_cn]: string
  [LANG.en_us]: string
}


export * as homeLang from './home'
export * as headerLang from './header'