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
  public_user_id: string
  user_id: string
  thumbnail_path?: string | null
}

export type PostWithUsers = Post & {
  users: {
    handle_name: string | null
    icon_path: string | null
  }
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

export type PublicUser = {
  created_at: string | null
  handle_name: string | null
  icon_path: string | null
  id: string
  user_id: string
}
