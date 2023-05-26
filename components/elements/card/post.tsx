import React, { FC } from 'react'
import { Post } from '@/types/types'
import Image from 'next/image'
import { getImgPath } from '@/utils/img'
import { format } from 'date-fns'
import style from '@/styles/common/component/element/card-of-post.module.scss'

interface Props {
  post: Post
}
export const CardOfPost: FC<Props> = ({ post }) => {
  return (
    <a className={style.card} href={`/posts/${post.id}`}>
      <Image
        className={style.thumbnail}
        src={getImgPath(post.thumbnail_path)}
        alt=""
        width={300}
        height={200}
      />
      <div className={style.info}>
        <div className={style.cat}>CATEGORY</div>
        <time dateTime={post.created_at} itemProp="datePublished">
          {format(new Date(post.created_at), 'yyyy.MM.dd')}
        </time>
      </div>
      <div className={style.title}>{post.title}</div>
    </a>
  )
}

export default CardOfPost
