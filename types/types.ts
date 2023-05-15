export type Post = {
  id: string
  created_at: string
  title: string
  content: string
  user_id: string | undefined
}

export type SignUpUser = {
  email: string
  password: string
}
