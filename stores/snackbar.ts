import { AlertColor } from '@mui/material'
import { create } from 'zustand'

type State = {
  data: {
    message: string
    isOpen: boolean
    severity: AlertColor | undefined
    isLoading?: boolean
  }
  update: (payload: {
    message: string
    isOpen: boolean
    severity: AlertColor | undefined
    isLoading?: boolean
  }) => void
  reset: () => void
}

const useSnackbarStore = create<State>((set) => ({
  data: {
    message: '',
    isOpen: false,
    severity: undefined,
    isLoading: false,
  },
  update: (payload) => {
    set({ data: payload })
  },
  reset: () =>
    set({
      data: {
        message: '',
        isOpen: false,
        severity: undefined,
        isLoading: false,
      },
    }),
}))

export default useSnackbarStore
