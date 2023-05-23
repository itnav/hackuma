import Base from '@/components/layouts/base'
import { useMutatePosts } from '@/hooks/useMutatePosts'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Post } from '@/types/types'
import { supabase } from '@/utils/supabase'
import EditorBase from '@/components/layouts/editor-base'

const getAllPostIds = async () => {
  const { data: ids } = await supabase.from('posts').select('id')
  if (!ids) throw new Error('Post not found')
  return ids.map((id) => {
    return {
      params: {
        id: String(id.id),
      },
    }
  })
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllPostIds()
  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx.params) return { props: {} }
  const id = ctx.params.id
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()
  return {
    props: {
      post,
    },
  }
}

type StaticProps = {
  post: Post
}

export const DetailPost: NextPage<StaticProps> = ({ post }) => {
  const router = useRouter()

  const { id } = router.query

  const { updatePostMutation, deletePostMutation } = useMutatePosts()

  const handleUpdateButtonClick = async (title: string, content: string) => {
    if (!id) return
    updatePostMutation.mutate({
      id: id as string,
      title: title,
      content: content,
    })
  }

  const handleDeleteButtonClick = async () => {
    deletePostMutation.mutate(id as string)
    router.push('/post')
  }

  return (
    <Base title="新規投稿">
      <EditorBase post={post} saveFunction={handleUpdateButtonClick} />
    </Base>
  )
}

export default DetailPost
