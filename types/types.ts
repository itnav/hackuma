export type Post = {
  content: string | null
  created_at: string
  id: string
  title: string | null
  user_id: string | null
  thumbnail_path: string | null
}

export type CreatePost = {
  title: string
  content: string
  user_id: string
  thumbnail_path?: string | null
}

export type Comment = {
  id: string
  created_at: string
  content: string
  post_id: string
  user_id: string | null
}

export type EditPost = {
  id: string
  title: string
  content: string
  thumbnail_path?: string | null
}

export type EditComment = {
  id: string
  content: string
}

export type SignUpUser = {
  email: string
  password: string
}
