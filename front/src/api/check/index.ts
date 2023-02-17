import Contracts from '@api/contract'

import { CHECK_ADDRESS } from '@api/config'

class Check extends Contracts {
  address = CHECK_ADDRESS

  readAbi = [
    {
      inputs: [
        {
          internalType: 'string',
          name: '_examId',
          type: 'string',
        },
      ],
      name: 'getAnswers',
      outputs: [
        {
          internalType: 'uint8[]',
          name: '',
          type: 'uint8[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ]

  async getAnswers(examId: string) {
    return this.readContract<number[]>('getAnswers', examId)
  }
}

let instance

export default (() => {
  if (instance) return instance
  instance = new Check()
  return instance
})()
