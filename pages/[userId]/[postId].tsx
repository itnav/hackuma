import Base from '@/components/layouts/Base'
import { GetStaticProps, NextPage } from 'next'
import { Post } from '@/types/types'
import { supabase } from '@/utils/supabase'
import { convertFromRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { format } from 'date-fns'
import Image from 'next/image'
import { getImgPath } from '@/utils/img'

// 静的生成するパスのリストを定義する関数
export async function getStaticPaths() {
  // ユーザーID一覧取得
  const { data: posts } = await supabase.from('posts').select('id,user_id')
  // ユーザーIDと投稿IDの組み合わせからパスを生成する
  const paths = posts?.map((post) => {
    return {
      params: {
        userId: post.user_id,
        postId: post.id,
      },
    }
  })

  return {
    paths: paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx.params) return { props: {} }
  const id = ctx.params.postId

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  return {
    props: { post },
  }
}

type StaticProps = {
  post: Post
}

export const DetailPost: NextPage<StaticProps> = ({ post }) => {
  const contentHtml = () => {
    if (!post?.content) return ''

    const rawContentState = JSON.parse(post?.content)

    const contentState = convertFromRaw(rawContentState)
    return stateToHTML(contentState)
  }

  return (
    <Base title={post.title ?? '投稿詳細'}>
      <h1>{post.title}</h1>
      <div
        style={{
          marginTop: '1rem',
        }}
      >
        <time dateTime={post.created_at} itemProp="datePublished">
          {format(new Date(post.created_at), 'yyyy.MM.dd')}
        </time>
      </div>
      <Image
        src={getImgPath(post.thumbnail_path)}
        alt=""
        width={300}
        height={200}
        style={{
          marginTop: '1rem',
        }}
      />
      <div
        style={{
          marginTop: '1rem',
        }}
        dangerouslySetInnerHTML={{ __html: contentHtml() }}
      />
    </Base>
  )
}

export default DetailPost
