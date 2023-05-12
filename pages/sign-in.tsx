import { Base } from '@/components/layouts/base'
import { useMutateAuth } from '@/hooks/useMutateAuth'
import { Box, Button, TextField } from '@mui/material'
import { NextPage } from 'next'
import { FormEvent } from 'react'
import style from '@/styles/pages/sign-in.module.scss'
import styleCommon from '@/styles/common/foundation/common.module.scss'
import { useRouter } from 'next/router'

const SignIn: NextPage = () => {
  const { push } = useRouter()

  const { email, setEmail, password, setPassword, loginMutation } =
    useMutateAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault() // ページ遷移を防ぐ

    loginMutation.mutate()
  }

  return (
    <Base title="ログイン">
      <h1 className={styleCommon['page-title']}>ログイン</h1>

      <div className={style['page-content']}>
        <Box className={style['form']} component="form" onSubmit={handleSubmit}>
          {/* Input */}
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
            ログイン
          </Button>
        </Box>

        <Box className={style['register-wrap']}>
          <div className={style['register-title']}>初めてご利用の方</div>
          <Button
            className={style['button-register']}
            variant="outlined"
            onClick={() => push('/sign-up')}
          >
            新規登録
          </Button>
        </Box>
      </div>
    </Base>
  )
}

export default SignIn
