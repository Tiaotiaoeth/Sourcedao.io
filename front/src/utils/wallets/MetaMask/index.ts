/* eslint-disable @typescript-eslint/no-explicit-any */
import detectEthereumProvider from '@metamask/detect-provider'

import { ethers } from 'ethers'

interface MetaMaskEthereumProvider {
  isMetaMask?: boolean
  once(eventName: string | symbol, listener: (...args: any[]) => void): this
  on(eventName: string | symbol, listener: (...args: any[]) => void): this
  off(eventName: string | symbol, listener: (...args: any[]) => void): this
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this
  removeAllListeners(event?: string | symbol): this
  request(param: { method: string }): any
}

export type Ethereum = MetaMaskEthereumProvider | null

const eventFunction = () => window.location.reload()

export const getEthereumWallet = async (): Promise<boolean> => {
  return !!(await detectEthereumProvider())
}

export const connectWallet: () => Promise<string> = async () => {
  let account = ''
  const ethereum: Ethereum = await detectEthereumProvider()
  if (ethereum) account = await ethereum.request({ method: 'eth_requestAccounts' })
  return account[0]
}

export const getWalletNetwork: () => Promise<string> = async () => {
  let network = ''
  const ethereum: Ethereum = await detectEthereumProvider()
  if (ethereum) network = ethereum.request({ method: 'eth_chainId' })
  return network
}

export const onWalletEvent: () => Promise<void> = async () => {
  const ethereum: Ethereum = await detectEthereumProvider()
  if (!ethereum) return
  ethereum.addListener('accountsChanged', eventFunction)
  ethereum.addListener('chainChanged', eventFunction)
}

export const offWalletEvent: () => Promise<void> = async () => {
  const ethereum: Ethereum = await detectEthereumProvider()
  if (!ethereum) return
  ethereum.removeListener('accountsChanged', eventFunction)
  ethereum.removeListener('chainChanged', eventFunction)
}

export const getProvider: () => Promise<ethers.providers.Web3Provider | undefined> = async () => {
  const ethereum = await detectEthereumProvider()
  if (ethereum) return new ethers.providers.Web3Provider(ethereum!)
}
