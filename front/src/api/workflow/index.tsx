import Contracts from '@api/contract'

import { WORKFLOW_ADDRESS } from '@api/config'

class Workflow extends Contracts {
  address = WORKFLOW_ADDRESS

  readAbi = [
    {
      inputs: [
        {
          internalType: 'uint8',
          name: '_type',
          type: 'uint8',
        },
      ],
      name: 'getIntroduction',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ]

  writeAbi = [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_to',
          type: 'address',
        },
        {
          internalType: 'string',
          name: '_examId',
          type: 'string',
        },
        {
          internalType: 'uint8',
          name: '_type',
          type: 'uint8',
        },
        {
          internalType: 'uint8',
          name: '_level',
          type: 'uint8',
        },
      ],
      name: 'prepare',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_to',
          type: 'address',
        },
        {
          internalType: 'string',
          name: '_examId',
          type: 'string',
        },
        {
          internalType: 'uint8',
          name: '_score',
          type: 'uint8',
        },
        {
          internalType: 'uint8[]',
          name: '_answers',
          type: 'uint8[]',
        },
        {
          internalType: 'string',
          name: '_picContent',
          type: 'string',
        },
      ],
      name: 'submit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]

  async prepare(_to: string, examId: string, type: number, level: number) {
    return this.writeContract('prepare', _to, examId, type, level)
  }

  async getIntroduction(type: number) {
    return this.readContract<string>('getIntroduction', type)
  }

  async submit(_to: string, examId: string, score: number, answers: number[], picContent: string) {
    return this.writeContract('submit', _to, examId, score, answers, picContent)
  }
}

let instance

export default (() => {
  if (instance) return instance
  instance = new Workflow()
  return instance
})()
