
import { ethers } from 'ethers'

import * as MetaMask from './MetaMask'

interface WalletMethod {
  getEthereumWallet: () => Promise<boolean>
  connectWallet: () => Promise<string>
  getWalletNetwork: () => Promise<string>
  onWalletEvent: () => Promise<void>
  offWalletEvent: () => Promise<void>
  getProvider: () => Promise<ethers.providers.Web3Provider | undefined>
}

const wallets: Record<string, WalletMethod> = {
  MetaMask,
}

export const getEthereumWallet: (currentWallet: string) => Promise<boolean> = async (currentWallet) => await wallets[currentWallet].getEthereumWallet()

export const connectToWallet: (currentWallet: string) => Promise<string> = async (currentWallet) => await wallets[currentWallet].connectWallet()

export const getWalletNetwork: (currentWallet: string) => Promise<string> = async (currentWallet) => await wallets[currentWallet].getWalletNetwork()

export const onWalletEvent: (currentWallet: string) => Promise<void> = async (currentWallet) => await wallets[currentWallet].onWalletEvent()

export const offWalletEvent: (currentWallet: string) => Promise<void> = async (currentWallet) => await wallets[currentWallet].offWalletEvent()

export const getProvider: (currentWallet: string) => Promise<ethers.providers.Web3Provider | undefined> = async (currentWallet) => await wallets[currentWallet].getProvider()