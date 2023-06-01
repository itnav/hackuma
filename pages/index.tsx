import { Base } from '@/components/layouts/base'
import { PostWithUsers } from '@/types/types'
import { supabase } from '@/utils/supabase'
import { NextPage, NextPageContext } from 'next'
import CardOfPost from '@/components/elements/card/post'
import style from '../styles/pages/top.module.scss'
import { Pagination } from '@mui/material'
import { useRouter } from 'next/router'
import { calculatePaginationRange } from '@/utils/pagination'

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
  const router = useRouter()

  // 現在表示中のページ番号
  const currentPage = Number(router.query.page) || 1

  // ページネーションの変更
  const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
    const { pathname, query } = router
    query.page = `${page}`
    router.push({
      pathname,
      query,
    })
  }

  return (
    <Base title="トップページ">
      <ul className={style.cards}>
        {posts ? (
          posts.map((post) => (
            <li key={post.id}>
              <CardOfPost post={post} href={`${post.user_id}/${post.id}`} />
            </li>
          ))
        ) : (
          <div style={{ margin: '0 auto' }}>投稿がありません</div>
        )}
      </ul>
      <Pagination
        page={currentPage} //現在のページ番号
        count={Math.ceil(count / 9)} // 総ページ数を計算
        color="primary" //ページネーションの色
        onChange={handlePageChange}
        sx={{ display: 'flex', justifyContent: 'center', margin: '60px 0' }}
      />
    </Base>
  )
}

export default Sample
