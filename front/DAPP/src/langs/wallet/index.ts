import LOCAL from '@constants/local'
import { Lang } from '..'

const wallet: Lang = {
  [LOCAL.zh_cn]: '请选择您的钱包',
  [LOCAL.en_us]: 'Please select your wallet',
}

const connect: Lang = {
  [LOCAL.zh_cn]: '连接',
  [LOCAL.en_us]: 'connect',
}

const connecting: Lang = {
  [LOCAL.zh_cn]: '连接中...',
  [LOCAL.en_us]: 'connecting...',
}

const connected: Lang = {
  [LOCAL.zh_cn]: '已连接',
  [LOCAL.en_us]: 'connected',
}

export { wallet, connect, connecting, connected }
