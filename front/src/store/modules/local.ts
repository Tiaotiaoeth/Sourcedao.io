import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import LOCAL from '@constants/local'

const local = createSlice({
  name: 'local',
  initialState: {
    local: LOCAL.en_us,
  },
  reducers: {
    setLocal(state, { payload }: PayloadAction<LOCAL>) {
      state.local = payload
    },
  },
})
export const { setLocal } = local.actions
export default local.reducer
