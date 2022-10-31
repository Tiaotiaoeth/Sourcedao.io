import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { combineReducers } from 'redux'
import thunk from 'redux-thunk'

import langReducers from './modules/lang'

const reducers = combineReducers({
  langReducers,
})

const persistConfig = {
  key: 'SourceDAO',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})

export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
