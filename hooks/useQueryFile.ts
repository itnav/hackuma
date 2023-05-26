import { supabase } from '@/utils/supabase'
import { useQuery } from 'react-query'

/**
 * 指定されたファイルパスのファイルを取得します。
 * @param {string} thumbnailURL - 取得するファイルパス
 */
export const useQueryFile = (thumbnailURL: string) => {
  const { data, isError, error, isLoading, isFetching } = useQuery<
    { publicUrl: string },
    Error
  >('postsByUserId', () => {
    const { data } = supabase.storage.from('files').getPublicUrl(thumbnailURL)
    return data
  })

  return { data, isError, error, isLoading, isFetching }
}
