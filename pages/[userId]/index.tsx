import Base from '@/components/layouts/Base'
import { GetServerSidePropsContext, NextPage } from 'next'
import { PostWithUsers } from '@/types/types'
import { supabase } from '@/utils/supabase'
import { calculatePaginationRange } from '@/utils/pagination'
import PostCardList from '@/components/elements/PostCardList'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (!ctx.params) return { props: {} }
  const userId = ctx.params.userId

  const page = ctx.query.page ? Number(ctx.query.page) : 1

  const { start, end } = calculatePaginationRange(page, 9)

  const { data: posts, count } = await supabase
    .from('posts')
    .select('*, users(handle_name,icon_path)', { count: 'estimated' })
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .range(start, end)

  return { props: { posts, count } }
}

type Props = {
  posts: PostWithUsers[]
  count: number
}

export const DetailPost: NextPage<Props> = ({ posts, count }) => {
  return (
    <Base title="ユーザー投稿一覧">
      <PostCardList posts={posts} count={count} />
    </Base>
  )
}

export default DetailPost
