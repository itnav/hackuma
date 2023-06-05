import { Base } from '@/components/layouts/Base'
import { PostWithUsers } from '@/types/types'
import { supabase } from '@/utils/supabase'
import { NextPage, NextPageContext } from 'next'
import { calculatePaginationRange } from '@/utils/pagination'
import PostCardList from '@/components/elements/PostCardList'

export const getServerSideProps = async (ctx: NextPageContext) => {
  const page = ctx.query.page ? Number(ctx.query.page) : 1

  const { start, end } = calculatePaginationRange(page, 9)

  const { data: posts, count } = await supabase
    .from('posts')
    .select('*, users(handle_name,icon_path)', { count: 'estimated' })
    .order('created_at', { ascending: true })
    .range(start, end)

  return { props: { posts, count } }
}

type StaticProps = {
  posts: PostWithUsers[]
  count: number
}

const Sample: NextPage<StaticProps> = ({ posts, count }) => {
  return (
    <Base title="トップページ">
      <PostCardList posts={posts} count={count} />
    </Base>
  )
}

export default Sample
