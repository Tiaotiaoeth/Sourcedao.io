import { useAppSelector } from '@store/index'
// import ctsLang from '@constants/lang'
import { Lang } from '@langs/index'

export default (): (obj: Lang) => string => {
  const { lang } = useAppSelector((state) => state.langReducers)
  return (obj: Lang) => obj[lang]
}