import { create } from 'zustand'
import { PublicUser } from '@/types/types'

type State = {
  data: PublicUser | null
  update: (payload: PublicUser | null) => void
  reset: () => void
}

const usePublicUserStore = create<State>((set) => ({
  data: null,
  update: (payload) => {
    set({ data: payload })
  },
  reset: () => set({ data: null }),
}))

export default usePublicUserStore
