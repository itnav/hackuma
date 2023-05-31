import { supabase } from '../utils/supabase'
import { useMutation } from 'react-query'

export const useCreateUserMutation = () => {
  return useMutation(
    async (profile: { handle_name: string; user_id: string }) => {
      const { data, error } = await supabase
        .from('users')
        .insert(profile)
        .select()

      if (error) throw new Error(error.message)
      return data
    },
    {
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )
}

export const useUpdateUserMutation = () => {
  return useMutation(
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
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )
}

export const useDeleteUserMutation = () => {
  return useMutation(
    async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw new Error(error.message)
    },
    {
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )
}
