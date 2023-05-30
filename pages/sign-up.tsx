import { Base } from '@/components/layouts/base'
import { useMutateAuth } from '@/hooks/useMutateAuth'
import { Box, Button, TextField } from '@mui/material'
import { NextPage } from 'next'
import { FormEvent } from 'react'
import style from '@/styles/pages/sign-up.module.scss'
import styleCommon from '@/styles/common/foundation/common.module.scss'
import { useRouter } from 'next/router'
import { useMutateUsers } from '@/hooks/useMutateUsers'

const SignUp: NextPage = () => {
  const { push } = useRouter()

  const { email, setEmail, password, setPassword, registerMutation } =
    useMutateAuth()

  const { createUserMutation } = useMutateUsers()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault() // ページ遷移を防ぐ
    registerMutation.mutate(undefined, {
      onSuccess: (data) => {
        if (!data.user?.id) return
        createUserMutation.mutate({
          handle_name: 'anonymous',
          user_id: data.user?.id,
        })
      },
    })
  }

  return (
    <Base title="新規登録">
      <h1 className={styleCommon['page-title']}>新規登録</h1>

      <div className={style['page-content']}>
        <Box className={style['form']} component="form" onSubmit={handleSubmit}>
          <div className={style['form-item']}>
            <label>メールアドレス</label>
            <TextField
              className={style['text-field']}
              type="text"
              required
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
          </div>

          <div className={style['form-item']}>
            <label>パスワード</label>
            <TextField
              className={style['text-field']}
              type="password"
              required
              variant="outlined"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </div>

          <Button
            className={style['button-submit']}
            type="submit"
            variant="outlined"
          >
            登録
          </Button>
        </Box>

        <Box className={style['register-wrap']}>
          <div className={style['register-title']}>
            登録がお済みの方はこちら
          </div>
          <Button
            className={style['button-register']}
            variant="outlined"
            onClick={() => push('/sign-in')}
          >
            ログイン
          </Button>
        </Box>
      </div>
    </Base>
  )
}

export default SignUp
