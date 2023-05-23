import { create } from 'zustand'
import { EditPost } from '@/types/types'

type State = {
  data: EditPost
  update: (payload: EditPost) => void
  reset: () => void
}

const usePostStore = create<State>((set, _) => ({
  data: { id: '', title: '', content: '' },
  update: (payload) => {
    set({ data: payload })
  },
  reset: () => set({ data: { id: '', title: '', content: '' } }),
}))

export default usePostStore
