import { Base } from '@/components/layouts/base'
import { useMutateAuth } from '@/hooks/useMutateAuth'
import { Post } from '@/types/types'
import { supabase } from '@/utils/supabase'
import { GetStaticProps, NextPage } from 'next'
import { FormEvent, useState } from 'react'

const Auth: NextPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  const {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation,
  } = useMutateAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault() // ページ遷移を防ぐ
    if (isLogin) {
      loginMutation.mutate()
    } else {
      registerMutation.mutate()
    }
  }

  return (
    <Base title="Auth">
      <form onSubmit={handleSubmit}>
        {/* Input */}
        <div className="">
          <input
            type="text"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </div>
        <div className="">
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>
        {/* ログインモード切り替え */}
        <div>
          <span onClick={() => setIsLogin(!isLogin)}>change mode ?</span>
        </div>

        {/* 送信ボタン */}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
    </Base>
  )
}

export default Auth
