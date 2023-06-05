import { PostWithUsers } from '@/types/types'
import React, { FC } from 'react'
import style from '@/styles/common/component/element/post-card-list.module.scss'
import CardOfPost from './card/Post'
import { Pagination } from '@mui/material'
import { useRouter } from 'next/router'

type Props = {
  posts: PostWithUsers[]
  count: number
}

const PostCardList: FC<Props> = ({ posts, count }) => {
  const router = useRouter()

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
    <>
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
    </>
  )
}

export default PostCardList
