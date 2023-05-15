import { SignUpUser } from '@/types/types'

function randomNumber(digit: number) {
  const randomNum = () => Math.floor(Math.random() * 11)
  let generatedNum = ''
  for (let index = 0; index < digit; index++) {
    generatedNum = generatedNum + randomNum()
  }
  return generatedNum
}

/**
 * ランダムユーザー生成
 * @return email ランダムなメールアドレス
 * @return password ランダムなパスワード
 */
export function createRNDMSignUpUser(): SignUpUser {
  const email = `user${randomNumber(5)}@e.com`
  const password = `pass${randomNumber(3)}`

  return {
    email,
    password,
  }
}
