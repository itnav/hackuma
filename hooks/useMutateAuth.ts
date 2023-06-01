import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { useMutation } from 'react-query'
import useUserStore from '@/stores/user'

// ログイン・登録のカスタムフック
export const useMutateAuth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const userStore = useUserStore()

  // inputの初期化関数
  const reset = () => {
    setEmail('')
    setPassword('')
  }

  const loginMutation = useMutation(
    async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw new Error(error.message)
    },
    {
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  const registerMutation = useMutation(
    async () => {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw new Error(error.message)
      return data
    },
    {
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
    const { reset: resetUser } = userStore
    resetUser()
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation,
    signOut,
  }
}
