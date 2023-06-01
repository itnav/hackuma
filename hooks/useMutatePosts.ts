import { supabase } from '../utils/supabase'
import { useMutation } from 'react-query'
import { CreatePost, EditPost } from '@/types/types'
import { revalidateList, revalidateSingle } from '@/utils/revalidation'

export const useCreatePostMutation = () => {
  return useMutation(
    async (post: CreatePost) => {
      const { data, error } = await supabase.from('posts').insert(post).select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: () => {
        revalidateList()
      },
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )
}

export const useUpdatePostMutation = () => {
  return useMutation(
    async (post: EditPost) => {
      const { data, error } = await supabase
        .from('posts')
        .update(post)
        .eq('id', post.id)
        .select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        revalidateList()
        revalidateSingle(res[0].id)
      },
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )
}

export const useDeletePostMutation = () => {
  return useMutation(
    async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw new Error(error.message)
    },
    {
      onSuccess: () => {
        revalidateList()
      },
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )
}
