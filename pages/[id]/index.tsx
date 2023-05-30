import Base from '@/components/layouts/base'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { PostWithUsers } from '@/types/types'
import { supabase } from '@/utils/supabase'
import CardOfPost from '@/components/elements/card/post'
import style from '@/styles/pages/user.module.scss'

const getAllUserIds = async () => {
  const { data: ids } = await supabase.from('users').select('user_id')
  if (!ids) throw new Error('User not found')

  return ids.map((id) => {
    return {
      params: {
        id: String(id.user_id),
      },
    }
  })
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllUserIds()
  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx.params) return { props: {} }
  const userId = ctx.params.id
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)

  return {
    props: {
      posts,
    },
  }
}

type StaticProps = {
  posts: PostWithUsers[]
}

export const DetailPost: NextPage<StaticProps> = ({ posts }) => {
  return (
    <Base title="ユーザー">
      <div className="profile">{/* プロフィール情報 */}</div>
      <ul className={style.cards}>
        {posts &&
          posts.map((post) => (
            <li key={post.id}>
              <CardOfPost post={post} href={`${post.user_id}/${post.id}`} />
            </li>
          ))}
      </ul>
    </Base>
  )
}

export default DetailPost
