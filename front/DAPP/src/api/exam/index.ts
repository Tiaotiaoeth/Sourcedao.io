import Contracts from '@api/contract'

import { EXAM_ADDRESS } from '@api/config'

export interface ExamType {
  typeId: number
  name: string
}

export interface ExamLevel {
  levelId: number
  name: string
}

export interface ExaminationMeta {
  _examId: string
  _level: number
  _type: number
  _time: number
  _questions: string[]
}

class Exam extends Contracts {
  address = EXAM_ADDRESS

  writeAbi = [
    {
      inputs: [
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
      name: 'genExam',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]

  readAbi = [
    {
      inputs: [
        {
          internalType: 'string',
          name: '_examId',
          type: 'string',
        },
      ],
      name: 'getExam',
      outputs: [
        {
          internalType: 'string[]',
          name: '',
          type: 'string[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint8',
          name: 'qtype',
          type: 'uint8',
        },
        {
          internalType: 'uint8',
          name: 'qlevel',
          type: 'uint8',
        },
      ],
      name: 'getExaminationDuration',
      outputs: [
        {
          internalType: 'uint16',
          name: '',
          type: 'uint16',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'listTypes',
      outputs: [
        {
          components: [
            {
              internalType: 'uint8',
              name: 'typeId',
              type: 'uint8',
            },
            {
              internalType: 'string',
              name: 'name',
              type: 'string',
            },
          ],
          internalType: 'struct IExamination.ExamType[]',
          name: '',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'listLevels',
      outputs: [
        {
          components: [
            {
              internalType: 'uint8',
              name: 'levelId',
              type: 'uint8',
            },
            {
              internalType: 'string',
              name: 'name',
              type: 'string',
            },
          ],
          internalType: 'struct IExamination.ExamLevel[]',
          name: '',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_user',
          type: 'address',
        },
      ],
      name: 'getExamsByUser',
      outputs: [
        {
          internalType: 'string[]',
          name: '',
          type: 'string[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_examId',
          type: 'string',
        },
      ],
      name: 'getExaminationMeta',
      outputs: [
        {
          components: [
            {
              internalType: 'uint256',
              name: '_time',
              type: 'uint256',
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
            {
              internalType: 'string',
              name: '_examId',
              type: 'string',
            },
            {
              internalType: 'string[]',
              name: '_questions',
              type: 'string[]',
            },
          ],
          internalType: 'struct IExamination.UserExamination',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint8',
          name: '_type',
          type: 'uint8',
        },
      ],
      name: 'getTypeName',
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

  async genExam(examId: string, type: number, level: number) {
    return this.writeContract('genExam', examId, type, level)
  }

  async getExam(examId: string) {
    return this.readContract<string[]>('getExam', examId)
  }

  async listTypes() {
    return this.readContract<ExamType[]>('listTypes')
  }

  async listLevels() {
    return this.readContract<ExamLevel[]>('listLevels')
  }

  async getExaminationDuration(type: number, level: number) {
    return this.readContract<number>('getExaminationDuration', type, level)
  }

  async getExamsByUser(address: string) {
    return this.readContract<string[]>('getExamsByUser', address)
  }

  async getExaminationMeta(examId: string) {
    return this.readContract<ExaminationMeta>('getExaminationMeta', examId)
  }

  async getTypeName(type: number) {
    return this.readContract<string>('getTypeName', type)
  }
}

let instance

export default (() => {
  if (instance) return instance
  instance = new Exam()
  return instance
})()
