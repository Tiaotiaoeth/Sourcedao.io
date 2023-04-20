import Contracts from '@api/contract'

import { REWARD_ADDRESS } from '@api/config'

import { CSTLEVEL } from '@constants/exam'

export interface SourceDaoReward {
  // 基础信息
  org: string // 颁发机构
  time: number // 颁发时间，使用区块时间
  // 区块链信息
  chain: string // 区块链
  protocol: string // 协议
  contractAddr: string // 合约地址
  id: number // SBT id
  qlevel: keyof typeof CSTLEVEL // 考试的难度
  qtype: number // 考试的类型
  qsize: number // 试题数量
  qduration: number // 考试时长，分钟
  lowCost: number // 考试门槛，10E-6
  costUnit: string // 考试费用单位
  address: string // 考试人
  picContent: string // 图片内容，例如IPFS hash
  score: number // 考试分数
  examId: string // 试卷ID
}

class Reward extends Contracts {
  address = REWARD_ADDRESS

  writeAbi = [
    {
      inputs: [
        {
          internalType: 'string',
          name: '_examId',
          type: 'string',
        },
        {
          internalType: 'uint8[]',
          name: '_answers',
          type: 'uint8[]',
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
      name: 'checkAndTryReward',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]

  readAbi = [
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_tokenId',
          type: 'uint256',
        },
      ],
      name: 'getSBTMeta',
      outputs: [
        {
          components: [
            {
              internalType: 'string',
              name: 'org',
              type: 'string',
            },
            {
              internalType: 'uint256',
              name: 'time',
              type: 'uint256',
            },
            {
              internalType: 'string',
              name: 'chain',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'protocol',
              type: 'string',
            },
            {
              internalType: 'address',
              name: 'contractAddr',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'qlevel',
              type: 'uint8',
            },
            {
              internalType: 'uint8',
              name: 'qtype',
              type: 'uint8',
            },
            {
              internalType: 'uint256',
              name: 'qsize',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'qduration',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'lowCost',
              type: 'uint256',
            },
            {
              internalType: 'string',
              name: 'costUnit',
              type: 'string',
            },
            {
              internalType: 'uint16',
              name: 'score',
              type: 'uint16',
            },
            {
              internalType: 'string',
              name: 'ability',
              type: 'string',
            },
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'string',
              name: 'examId',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'picContent',
              type: 'string',
            },
          ],
          internalType: 'struct Reward.SourceDaoReward',
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
          internalType: 'string',
          name: '_examId',
          type: 'string',
        },
      ],
      name: 'getSBTMetaByExam',
      outputs: [
        {
          components: [
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'qlevel',
              type: 'uint8',
            },
            {
              internalType: 'uint8',
              name: 'qtype',
              type: 'uint8',
            },
            {
              internalType: 'uint16',
              name: 'score',
              type: 'uint16',
            },
            {
              internalType: 'uint256',
              name: 'time',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'string',
              name: 'examId',
              type: 'string',
            },
          ],
          internalType: 'struct Reward.SourceDaoReward',
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
          internalType: 'address',
          name: 'user',
          type: 'address',
        },
      ],
      name: 'getTokensByUser',
      outputs: [
        {
          internalType: 'uint256[]',
          name: '',
          type: 'uint256[]',
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
      name: 'getPreSBTMetaByExam',
      outputs: [
        {
          components: [
            {
              internalType: 'string',
              name: 'org',
              type: 'string',
            },
            {
              internalType: 'uint256',
              name: 'time',
              type: 'uint256',
            },
            {
              internalType: 'string',
              name: 'chain',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'protocol',
              type: 'string',
            },
            {
              internalType: 'address',
              name: 'contractAddr',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256',
            },
            {
              internalType: 'uint8',
              name: 'qlevel',
              type: 'uint8',
            },
            {
              internalType: 'uint8',
              name: 'qtype',
              type: 'uint8',
            },
            {
              internalType: 'uint256',
              name: 'qsize',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'qduration',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'lowCost',
              type: 'uint256',
            },
            {
              internalType: 'string',
              name: 'costUnit',
              type: 'string',
            },
            {
              internalType: 'uint16',
              name: 'score',
              type: 'uint16',
            },
            {
              internalType: 'string',
              name: 'ability',
              type: 'string',
            },
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'string',
              name: 'examId',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'picContent',
              type: 'string',
            },
          ],
          internalType: 'struct Reward.SourceDaoReward',
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
        {
          internalType: 'uint8',
          name: '_level',
          type: 'uint8',
        },
      ],
      name: 'getPreExamSBTMeta',
      outputs: [
        {
          internalType: 'string[6]',
          name: '',
          type: 'string[6]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ]

  async checkAndTryReward(
    examId: string,
    answers: number[],
    type: number,
    level: number
  ) {
    return this.writeContract('checkAndTryReward', examId, answers, type, level)
  }

  async getSBTMetaByExam(examId: string) {
    return this.readContract('getSBTMetaByExam', examId)
  }

  async getPreExamSBTMeta(type: number, level: number) {
    return this.readContract<string[]>('getPreExamSBTMeta', type, level)
  }

  async getTokensByUser(address: string) {
    return this.readContract<string[]>('getTokensByUser', address)
  }

  async getSBTMeta(tokenId: number) {
    return this.readContract<SourceDaoReward>('getSBTMeta', tokenId)
  }

  async getPreSBTMetaByExam(examId: string) {
    return this.readContract<SourceDaoReward>('getPreSBTMetaByExam', examId)
  }
}

let instance

export default (() => {
  if (instance) return instance
  instance = new Reward()
  return instance
})()
