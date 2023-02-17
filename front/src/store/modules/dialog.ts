import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Dialog {
  examDetails: boolean
}

const initialState: Dialog = {
  examDetails: false,
}

const dialog = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    setExamDetails(state, { payload }: PayloadAction<boolean>) {
      state.examDetails = payload
    },
  },
})
export const { setExamDetails } = dialog.actions
export default dialog.reducer
