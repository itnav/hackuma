import '@/styles/globals.scss'
import { supabase } from '@/utils/supabase'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import useUserStore from '@/stores/user'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

// テーマカラーの設定
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3e9f78',
      light: '#d0f0dc',
      dark: '#1d8455',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFF454',
      light: '#fffae0',
      contrastText: '#fff',
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { pathname, push } = router

  const {
    reset: resetUser,
    update: updateUser,
    updateIsFetching: updateIsFetchingUser,
    updateHasFetched: updateHasFetchedUser,
  } = useUserStore()

  // サインイン状態をチェックし、サインイン状態を更新する
  const validateSession = async () => {
    updateIsFetchingUser(true)

    const user = await supabase.auth.getUser()

    updateHasFetchedUser(true)
    updateIsFetchingUser(false)
    if (user.data.user) {
      updateUser(user.data.user)
    } else {
      resetUser()
    }
  }

  // サインイン状態が変更されたら、サインイン状態によってページ遷移を制御する
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' && pathname === '/sign-in') {
      push('/dashboard')
    }
    if (event === 'SIGNED_OUT') {
      push('/sign-in')
    }
  })

  // ページ遷移時にサインイン状態をチェックする
  useEffect(() => {
    validateSession()
  }, [router])

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
