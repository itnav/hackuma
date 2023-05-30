import React, { FC } from 'react'
import { PostWithUsers } from '@/types/types'
import Image from 'next/image'
import { getImgPath } from '@/utils/img'
import { format } from 'date-fns'
import style from '@/styles/common/component/element/card-of-post.module.scss'
import { Avatar } from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets'

interface Props {
  post: PostWithUsers
  href?: string
}
export const CardOfPost: FC<Props> = ({ post, href }) => {
  return (
    <a className={style.card} href={href}>
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
      <div className={style.writer}>
        {post.users.icon_path ? (
          <Image
            className={style['writer-icon']}
            src={getImgPath(post.thumbnail_path)}
            alt=""
            width={30}
            height={30}
          />
        ) : (
          <Avatar sx={{ width: 30, height: 30 }}>
            <PetsIcon fontSize="small" />
          </Avatar>
        )}
        <div className={style['writer-name']}>{post.users.handle_name}</div>
      </div>
    </a>
  )
}

export default CardOfPost
