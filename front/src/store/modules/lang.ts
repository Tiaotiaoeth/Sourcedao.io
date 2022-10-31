import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import ctsLang from '@constants/lang'

const lang = createSlice({
  name: 'lang',
  initialState: {
    lang: ctsLang.en_us,
  },
  reducers: {
    setLang(state, action: PayloadAction<ctsLang>) {
      state.lang = action.payload
    },
  },
})
export const { setLang } = lang.actions
export default lang.reducer
