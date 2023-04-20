import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import {
  getEthereumWallet,
  connectToWallet,
  getWalletNetwork,
  onWalletEvent,
  offWalletEvent,
} from '@utils/wallets'


import { RootState } from '..'


export interface WalletState {
  initWallet: boolean
  dialogOpen: boolean
  connecting: boolean
  currentWallet: string
  walletNetwork: string
  accountAddress: string
}

export const initState: WalletState = {
  initWallet: false,
  dialogOpen: false,
  connecting: false,
  currentWallet: '',
  accountAddress: '',
  walletNetwork: '',
}

export const initWallet = createAsyncThunk(
  'wallet/initWallet',
  async (_, { getState }) => {
    const { currentWallet } = (getState() as RootState).wallet
    if (!currentWallet) return {}
    const isConnected = await getEthereumWallet(currentWallet)
    if (!isConnected) return {}
    try {
      const [
        accountAddress,
        walletNetwork,
      ] = await Promise.all([
        connectToWallet(currentWallet),
        getWalletNetwork(currentWallet),
      ])

      return {
        accountAddress,
        walletNetwork,
      }
    } catch (error) {
      return {}
    }
  }
)

export const connectWallet = createAsyncThunk(
  'wallet/connectWallet',
  async (currentWallet: string) => {
    const failRes = {
      connecting: false,
    }
    const isConnected = await getEthereumWallet(currentWallet)
    if (isConnected) {
      try {
        const [
          accountAddress,
          walletNetwork,
        ] = await Promise.all([
          connectToWallet(currentWallet),
          getWalletNetwork(currentWallet),
        ])

        return {
          dialogOpen: false,
          connecting: false,
          currentWallet,
          accountAddress,
          walletNetwork,
        }
      } catch (error) {
        return failRes
      }
    } else {
      return failRes
    }
  }
)


const wallet = createSlice({
  name: 'wallet',
  initialState: initState,
  reducers: {
    setDialogOpen(state, { payload }: PayloadAction<boolean>) {
      state.dialogOpen = payload
    },
    setConnecting(state, { payload }: PayloadAction<boolean>) {
      state.connecting = payload
    },
    disconnectWallet(state) {
      offWalletEvent(state.currentWallet)
      state = Object.assign(state, initState, { initWallet: true })
    }
  },
  extraReducers(builder) {

    builder.addCase(initWallet.pending, (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = Object.assign(state, initState, { currentWallet: state.currentWallet })
    })

    builder.addCase(initWallet.fulfilled, (state, { payload }) => {
      if (payload) {
        state = Object.assign(state, payload, { initWallet: true })
        if (state.walletNetwork) onWalletEvent(state.currentWallet)
      }
    })

    builder.addCase(connectWallet.pending, (state) => {
      if (state.currentWallet) offWalletEvent(state.currentWallet)
    })

    builder.addCase(connectWallet.fulfilled, (state, { payload }) => {
      if (payload) state = Object.assign(state, payload)
    })
  },
})

export const { setDialogOpen, setConnecting, disconnectWallet } = wallet.actions
export default wallet.reducer