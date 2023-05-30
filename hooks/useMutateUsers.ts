import { supabase } from '../utils/supabase'
import { useMutation } from 'react-query'
import { revalidateList, revalidateSingle } from '@/utils/revalidation'

export const useMutateUsers = () => {
  const createUserMutation = useMutation(
    async (profile: { handle_name: string; user_id: string }) => {
      const { data, error } = await supabase
        .from('users')
        .insert(profile)
        .select()

      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: () => {
        // console.log('success')
      },
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )

  const updateUserMutation = useMutation(
    async ({
      editProfile,
      id,
    }: {
      editProfile: { handle_name?: string }
      id: string
    }) => {
      const { data, error } = await supabase
        .from('users')
        .update(editProfile)
        .eq('id', id)
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

  const deleteUserMutation = useMutation(
    async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw new Error(error.message)
    },
    {
      onSuccess: () => {
        console.log('success')
      },
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )

  return {
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  }
}
