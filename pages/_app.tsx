import '@/styles/globals.scss'
import { supabase } from '@/utils/supabase'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  const { push, pathname } = useRouter()

  // ここでサインイン状態をチェックして、サインイン状態によってページ遷移を制御する
  const validateSession = async () => {
    const user = await supabase.auth.getUser()
    if (user && pathname === '/auth') {
      push('/sample')
    } else if (!user && pathname !== '/auth') {
      push('/auth')
    }
  }

  // サインイン状態が変更されたら、サインイン状態によってページ遷移を制御する
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' && pathname === '/auth') {
      push('/sample')
    }
    if (event === 'SIGNED_OUT') {
      push('/auth')
    }
  })

  // 初回レンダリング時にサインイン状態をチェックする
  useEffect(() => {
    validateSession()
  }, [])

  return (
    // React QueryのProviderを設定する
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
