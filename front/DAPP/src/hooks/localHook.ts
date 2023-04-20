import { useAppSelector } from '@store/index'
import { Lang } from '@langs/index'

export default (): (obj: Lang) => string => {
  const { local } = useAppSelector((state) => state.local)
  return (obj: Lang) => obj[local]
}