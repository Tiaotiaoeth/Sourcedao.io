import { ethers } from 'ethers'

import store from '@store/index'

import { getProvider } from '@utils/wallets'

interface WriteContractResult {
  wait: () => Promise<void>
}

export default class Contracts {
  protected address = ''
  protected writeAbi: ethers.ContractInterface = []
  protected readAbi: ethers.ContractInterface = []

  private _writeContract: ethers.Contract | undefined
  private _readContract: ethers.Contract | undefined

  constructor() {
    (async () => {
      const { currentWallet } = store.getState().wallet

      const provider = await getProvider(currentWallet)

      if (provider) {
        const signer = provider.getSigner()

        this._writeContract = new ethers.Contract(
          this.address,
          this.writeAbi,
          signer
        )

        this._readContract = new ethers.Contract(
          this.address,
          this.readAbi,
          provider
        )
      }
    })()
  }

  protected writeContract(
    api: string,
    ...arg: unknown[]
  ): Promise<WriteContractResult> {
    if (!this._writeContract) throw Error('wallet unconnet')
    return this._writeContract[api](...arg)
  }

  protected readContract<T>(api: string, ...arg: unknown[]): T {
    if (!this._readContract) throw Error('wallet unconnet')
    return this._readContract[api](...arg)
  }
}
