import { createContext } from 'react'
import { LANG } from '@constants/lang'

interface LangContextProps {
  lang: LANG
  setLang: (lang: LANG) => void
}

const contextInit: LangContextProps = {
  lang: LANG.en_us,
  setLang: () => null,
}

export const LangContext = createContext<LangContextProps>(contextInit)

