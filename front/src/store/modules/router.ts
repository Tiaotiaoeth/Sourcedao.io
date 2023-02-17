import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RouterMapItem } from '@routes/index'

const router = createSlice({
  name: 'router',
  initialState: {
    name: '',
    isConnect: false,
    isHeader: false,
    isSider: false,
  },
  reducers: {
    setRouter(state, { payload }: PayloadAction<RouterMapItem>) {
      state = Object.assign(state, payload)
    },
  },
})
export const { setRouter } = router.actions
export default router.reducer
