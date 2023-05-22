import useUserStore from '@/stores/user'
import { Post } from '@/types/types'
import { supabase } from '@/utils/supabase'
import { useQuery } from 'react-query'

export const useQueryPostsByUserId = () => {
  const { data: user } = useUserStore()

  const { data, isError, error, isLoading, isFetching } = useQuery<
    Post[],
    Error
  >(['postsByUserId'], async () => {
    let userId = user?.id
    if (!userId) {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw new Error(error.message)
      userId = data.user.id
    }
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return data
  })

  return { data, isError, error, isLoading, isFetching }
}
