import { useEffect } from 'react'
import useUserStore from '@/stores/user'
import { useRouter } from 'next/router'

/**
 * ログイン状態を監視するカスタムフック
 * @returns userStore
 */
export const useAuthWatcher = () => {
  const router = useRouter()

  const userStore = useUserStore()

  const {
    data: user,
    isFetching: isFetchingUser,
    hasFetched: hasFetchedUser,
  } = userStore

  useEffect(() => {
    if (isFetchingUser || !hasFetchedUser) {
      return
    }
    if (!user) {
      router.push('/sign-in')
    }
  }, [user, isFetchingUser])

  return userStore
}
