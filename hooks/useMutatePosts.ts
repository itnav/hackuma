import { supabase } from '../utils/supabase'
import { useMutation } from 'react-query'
import usePostStore from '@/stores/post'
import { EditPost } from '@/types/types'
import { revalidateList, revalidateSingle } from '@/utils/revalidation'

export const useMutatePosts = () => {
  const reset = usePostStore((state) => state.reset)

  const createPostMutation = useMutation(
    async (post: { title: string; content: string; user_id: string }) => {
      const { data, error } = await supabase.from('posts').insert(post).select()

      if (error) throw new Error(error.message)

      return data
    },
    {
      onSuccess: () => {
        console.log('success')
        revalidateList()
        reset()
      },
      onError: (err: TypeError) => {
        alert(err.message)
        reset()
      },
    }
  )

  const updatePostMutation = useMutation(
    async (post: EditPost) => {
      const { data, error } = await supabase
        .from('posts')
        .update({ title: post.title, content: post.content })
        .eq('id', post.id)
        .select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        revalidateList()
        revalidateSingle(res[0].id)
        reset()
      },
      onError: (err: TypeError) => {
        alert(err.message)
        reset()
      },
    }
  )

  const deletePostMutation = useMutation(
    async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw new Error(error.message)
    },
    {
      onSuccess: () => {
        // revalidateList()
        reset()
      },
      onError: (err: TypeError) => {
        alert(err.message)
        reset()
      },
    }
  )

  return {
    createPostMutation,
    updatePostMutation,
    deletePostMutation,
  }
}
