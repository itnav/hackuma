import { Post } from '@/types/types'
import { supabase } from '@/utils/supabase'
import { useQuery } from 'react-query'

export const useQueryPostsByUserId = (userId: string | null) => {
  const { data, isError, error, isLoading, isFetching } = useQuery<
    Post[],
    Error
  >(['postsByUserId', userId], async () => {
    if (!userId) return []

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
