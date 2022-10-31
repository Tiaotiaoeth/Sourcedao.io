import { useContext } from 'react'
import { LangContext } from '@views/Home/langContext'
import { Lang } from '@langs/index'

export default (): (obj: Lang) => string => {
  const { lang } = useContext(LangContext)
  return (obj: Lang) => obj[lang]
}