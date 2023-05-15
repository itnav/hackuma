import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

type State = {
  data: User | null
  update: (payload: User | null) => void
  reset: () => void
  isFetching: boolean
  updateIsFetching: (payload: boolean) => void
  hasFetched: boolean
  updateHasFetched: (payload: boolean) => void
}

const useUserStore = create<State>((set) => ({
  data: null,
  update: (payload) => {
    set({ data: payload })
  },
  reset: () => set({ data: null }),
  isFetching: false,
  updateIsFetching: (payload) => {
    set({ isFetching: payload })
  },
  hasFetched: false,
  updateHasFetched: (payload) => {
    set({ isFetching: payload })
  },
}))

export default useUserStore
