import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { SourceDaoReward } from '@api/reward'


type ExamedType = {
  index: number
  examedTypes: Record<number, string>
}

interface User {
  examedType: ExamedType
}

const initialState: User = {
  examedType: {
    index: 0,
    examedTypes: {},
  },
}

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setExamedType(state, { payload }: PayloadAction<SourceDaoReward[]>) {
      const index = state.examedType.index + payload.length
      const examedTypes = state.examedType.examedTypes
      payload.forEach((res) => examedTypes[res.qtype] = res.examId)

      state.examedType = Object.assign(state.examedType, {
        index,
        examedTypes: examedTypes,
      })
    },
  },
})
export const { setExamedType } = user.actions
export default user.reducer
